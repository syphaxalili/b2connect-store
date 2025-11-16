const express = require("express");
const router = express.Router();
const {
  createCheckoutSession,
  simulateWebhook,
} = require("../controllers/stripeController");
const { optionalAuth } = require("../middleware/auth");

// Route pour créer une session de paiement (accepte utilisateurs connectés et invités)
router.post("/create-checkout-session", optionalAuth, createCheckoutSession);

/**
 * Route de test pour simuler le webhook en développement
 * ⚠️ À SUPPRIMER EN PRODUCTION
 *
 * En production, le webhook réel sera appelé par Stripe directement
 * et géré dans server.js (voir handleWebhook)
 */
router.post("/simulate-webhook", simulateWebhook);

// Note: Le webhook réel est géré directement dans server.js
// car il nécessite express.raw() avant express.json()

module.exports = router;
