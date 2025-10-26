const { User } = require("../models/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, address, gender } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      address,
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
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    // Bloquer les comptes sans mot de passe défini (créés par admin)
    if (!user || !user.password) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({
      token,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
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

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
};
