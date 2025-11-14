const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongoDB, connectMySQL } = require("./config/db");
const { initModels } = require("./models/mysql");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// IMPORTANT: Le webhook Stripe doit être AVANT express.json()
// car il a besoin du body brut (raw) pour vérifier la signature
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  require("./controllers/stripeController").handleWebhook
);

app.use(express.json());
app.use(cookieParser());

// Initialiser les bases de données
const initDB = async () => {
  await connectMongoDB();
  await connectMySQL();
  await initModels();
};

// Initialiser les routes
app.use("/api", require("./routes"));

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
  })
  .catch((error) => {
    console.error(
      "Erreur lors de l’initialisation des bases de données:",
      error
    );
    process.exit(1);
  });

module.exports = app;
