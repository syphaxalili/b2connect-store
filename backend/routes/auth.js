const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refresh,
  logout,
  me,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  deleteAccount,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  loginLimiter,
  passwordResetLimiter,
  authLimiter,
} = require("../middleware/rateLimiter");

// Endpoints avec rate limiting strict
router.post("/login", loginLimiter, login);
router.post("/register", authLimiter, register);
router.post("/request-password-reset", passwordResetLimiter, requestPasswordReset);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.get("/verify-reset-token", authLimiter, verifyResetToken);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", logout);

// protected routes
router.get("/me", protect, me);
router.delete("/account", protect, deleteAccount);

module.exports = router;
