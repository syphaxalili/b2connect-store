const rateLimit = require('express-rate-limit');

/**
 * Désactiver le rate limiting en mode test
 * Les tests lancent beaucoup de requêtes rapidement et seraient bloqués
 */
const isTestEnvironment = process.env.NODE_ENV === 'test';

/**
 * Rate limiter pour l'endpoint de connexion
 * Protège contre les attaques par force brute
 * 
 * Configuration:
 * - Maximum 5 tentatives par IP
 * - Fenêtre de 15 minutes
 * - Bloque l'IP pendant 15 minutes après dépassement
 */
const loginLimiter = isTestEnvironment ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limite de 5 requêtes par fenêtre
  standardHeaders: true, // Retourne les infos de rate limit dans les headers `RateLimit-*`
  legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  
  // Handler personnalisé pour les requêtes bloquées
  handler: (req, res) => {
    console.warn(`Rate limit dépassé pour l'IP: ${req.ip}`);
    res.status(429).json({
      error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000), // Temps en secondes
    });
  },
});

/**
 * Rate limiter plus strict pour les tentatives de réinitialisation de mot de passe
 * Protège contre l'énumération d'emails et le spam
 */
const passwordResetLimiter = isTestEnvironment ? (req, res, next) => next() : rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 tentatives par heure
  standardHeaders: true,
  legacyHeaders: false,
  
  handler: (req, res) => {
    console.warn(`Rate limit de réinitialisation de mot de passe dépassé pour l'IP: ${req.ip}`);
    res.status(429).json({
      error: 'Trop de demandes de réinitialisation. Veuillez réessayer dans 1 heure.',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

/**
 * Rate limiter général pour l'API d'authentification
 * Protège contre les abus généraux
 */
const authLimiter = isTestEnvironment ? (req, res, next) => next() : rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes par fenêtre
  message: {
    error: 'Trop de requêtes. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  passwordResetLimiter,
  authLimiter,
};
