const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
} = require("../controllers/usersController");

// Protected routes (admin only)
router.get("/", protect, requireAdmin, getAllUsers);
router.get("/:id", protect, requireAdmin, getUserById);
router.post("/", protect, requireAdmin, createUser);
router.put("/:id", protect, updateUserById); // User peut modifier son propre profil
router.delete("/:id", protect, requireAdmin, deleteUserById);

module.exports = router;
