const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
} = require("../controllers/stripeController");
const { protect } = require("../middleware/auth");

// Route pour créer une session de paiement (protégée)
router.post("/create-checkout-session", protect, createCheckoutSession);

// Note: Le webhook est géré directement dans server.js
// car il nécessite express.raw() avant express.json()
// Utilisez Stripe CLI pour tester en local: stripe listen --forward-to localhost:5000/api/stripe/webhook

module.exports = router;
