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

// Protected routes
router.use(protect);

router.put("/:id", updateUserById); // User peut modifier son propre profil

// Protected routes (admin only)
router.use(requireAdmin);

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.delete("/:id", deleteUserById);

module.exports = router;
