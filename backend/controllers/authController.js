const { User, Address } = require("../models/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      address,
      phone_number,
      gender,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'adresse si fournie
    let addressId = null;
    if (
      address &&
      typeof address === "object" &&
      address.street &&
      address.postal_code &&
      address.city
    ) {
      const newAddress = await Address.create({
        street: address.street,
        postal_code: address.postal_code,
        city: address.city,
        country: address.country || "France",
      });
      addressId = newAddress.id;
    }

    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      address_id: addressId,
      phone_number,
      gender,
    });
    res.status(201).json({ user_id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !user.password) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    const accessToken = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = crypto.randomBytes(64).toString("hex");

    let refreshTokenExpiry;
    const refreshTokenCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/api/auth/refresh",
    };

    if (rememberMe) {
      refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      refreshTokenCookieOptions.maxAge = 30 * 24 * 60 * 60 * 1000;
    } else {
      refreshTokenExpiry = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
    }

    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires_at: refreshTokenExpiry,
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

    res.status(200).json({
      id: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(200).json({
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHashed = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await user.update({
      reset_token: resetTokenHashed,
      reset_token_expires_at: expiresAt,
    });

    // // Construire le lien de réinitialisation
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // console.log(`[PASSWORD RESET] Lien de réinitialisation: ${resetLink}`);

    res.status(200).json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: "Token et mot de passe requis" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: {
        reset_token: hashedToken,
      },
    });

    if (!user) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (Date.now() > new Date(user.reset_token_expires_at).getTime()) {
      await user.update({
        reset_token: null,
        reset_token_expires_at: null,
      });
      return res.status(400).json({ error: "Token expiré" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await user.update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expires_at: null,
    });

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token requis" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      where: { reset_token: hashedToken },
    });

    if (!user) {
      return res.status(400).json({ error: "Token invalide" });
    }

    if (Date.now() > new Date(user.reset_token_expires_at).getTime()) {
      await user.update({
        reset_token: null,
        reset_token_expires_at: null,
      });
      return res.status(400).json({ error: "Token expiré" });
    }

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Endpoint pour rafraîchir l'access token
const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (!refresh_token) {
      return res.status(401).json({ error: "Refresh token manquant" });
    }

    // Vérifier que le refresh token existe en BDD et n'est pas expiré
    const user = await User.findOne({
      where: { refresh_token },
    });

    if (!user) {
      return res.status(401).json({ error: "Refresh token invalide" });
    }

    // Vérifier l'expiration
    if (Date.now() > new Date(user.refresh_token_expires_at).getTime()) {
      // Token expiré, le supprimer de la BDD
      await user.update({
        refresh_token: null,
        refresh_token_expires_at: null,
      });
      return res.status(401).json({ error: "Refresh token expiré" });
    }

    // Générer un nouvel access token
    const newAccessToken = jwt.sign(
      { user_id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.status(200).json({ message: "Access token rafraîchi" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refresh_token } = req.cookies;

    if (refresh_token) {
      await User.update(
        {
          refresh_token: null,
          refresh_token_expires_at: null,
        },
        { where: { refresh_token } }
      );
    }

    res.cookie("access_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    res.cookie("refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      exclude: [
        "password",
        "reset_token",
        "reset_token_expires_at",
        "refresh_token",
        "refresh_token_expires_at",
      ],
      include: [
        {
          model: Address,
          as: "address",
          attributes: ["id", "street", "postal_code", "city", "country"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      phone_number: user.phone_number,
      address: user.address,
      gender: user.gender,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
};
