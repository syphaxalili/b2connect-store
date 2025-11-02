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
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/login", login);
router.post("/register", register);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token", verifyResetToken);
router.post("/refresh", refresh);
router.post("/logout", logout);

// protected routes
router.get("/me", protect, me);

module.exports = router;
