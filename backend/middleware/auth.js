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

module.exports = { protect, requireAdmin };
