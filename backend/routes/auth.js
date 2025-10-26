const express = require("express");
const router = express.Router();
const {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.get("/verify-reset-token", verifyResetToken);

module.exports = router;
