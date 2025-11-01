const { User, Address } = require("../models/mysql");
const crypto = require("crypto");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Address,
          as: "address",
          attributes: ["id", "street", "postal_code", "city", "country"]
        }
      ]
    });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Address,
          as: "address",
          attributes: ["id", "street", "postal_code", "city", "country"]
        }
      ]
    });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, first_name, last_name, address, phone_number, gender } =
      req.body;
    
    // Créer l'adresse si fournie
    let addressId = null;
    if (address && typeof address === 'object' && address.street && address.postal_code && address.city) {
      const newAddress = await Address.create({
        street: address.street,
        postal_code: address.postal_code,
        city: address.city,
        country: address.country || "France"
      });
      addressId = newAddress.id;
    }
    
    const user = await User.create({
      email,
      password: null, // null jusqu'à ce que l'utilisateur définisse son mot de passe
      first_name,
      last_name,
      address_id: addressId,
      phone_number,
      gender,
    });

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

    // Envoyer mail: votre compte vient d'etre créé, veuillez activer votre compte en cliquant sur le lien suivant:
    // const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    // console.log(`[PASSWORD RESET] Lien de réinitialisation: ${resetLink}`);

    res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      address,
      phone_number,
      gender,
      role,
    } = req.body;

    const userId = parseInt(req.params.id);
    const currentUserId = req.user.user_id;
    const isAdmin = req.user.role === "admin";

    // Vérifier que l'utilisateur modifie son propre profil ou est admin
    if (userId !== currentUserId && !isAdmin) {
      return res.status(403).json({
        error: "Vous n'êtes pas autorisé à modifier ce profil",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Gérer l'adresse
    let addressId = user.address_id;
    if (address && typeof address === 'object' && address.street && address.postal_code && address.city) {
      if (addressId) {
        // Mettre à jour l'adresse existante
        await Address.update(
          {
            street: address.street,
            postal_code: address.postal_code,
            city: address.city,
            country: address.country || "France"
          },
          { where: { id: addressId } }
        );
      } else {
        // Créer une nouvelle adresse
        const newAddress = await Address.create({
          street: address.street,
          postal_code: address.postal_code,
          city: address.city,
          country: address.country || "France"
        });
        addressId = newAddress.id;
      }
    }
    
    // Préparer les données à mettre à jour
    const updateData = {
      email,
      first_name,
      last_name,
      address_id: addressId,
      phone_number,
      gender,
    };

    // Seul un admin peut modifier le rôle
    if (isAdmin && role) {
      updateData.role = role;
    }

    await user.update(updateData);

    // Retourner l'utilisateur sans le mot de passe
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Address,
          as: "address",
          attributes: ["id", "street", "postal_code", "city", "country"]
        }
      ]
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};
