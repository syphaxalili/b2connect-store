const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  register,
  login,
  getCurrentUser,
  updateCurrentUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  createUser,
} = require("../controllers/usersController");

router.get("/", auth, getAllUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:id", auth, getUserById);
router.post("/", auth, createUser);
router.put("/:id", auth, updateUserById);
router.delete("/:id", auth, deleteUserById);

module.exports = router;
