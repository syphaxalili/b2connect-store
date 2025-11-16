const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      return res
        .status(401)
        .json({ error: "Accès non autorisé, token manquant" });
    }
    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erreur d'authentification:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expiré" });
    }

    return res.status(401).json({ error: "Token invalide" });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Accès interdit: rôle admin requis" });
  }
  next();
};

/**
 * Middleware d'authentification optionnelle
 * Attache req.user s'il existe, sinon continue sans erreur
 * Utilisé pour les routes qui acceptent à la fois les utilisateurs connectés et les invités
 */
const optionalAuth = (req, res, next) => {
  try {
    const { access_token } = req.cookies;

    if (!access_token) {
      // Pas de token, l'utilisateur est un invité
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(access_token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Token invalide ou expiré, traiter comme un invité
    console.log("Token invalide ou expiré, traitement en tant qu'invité");
    req.user = null;
    next();
  }
};

module.exports = { protect, requireAdmin, optionalAuth };
