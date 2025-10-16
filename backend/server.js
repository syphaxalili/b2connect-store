const dotenv = require('dotenv');
dotenv.config({quiet: true});

const express = require('express');
const { connectMongoDB, connectMySQL } = require('./config/db');
const { initModels } = require('./models/mysql');

const app = express();
app.use(express.json());

// Initialiser les bases de données
const initDB = async () => {
  await connectMongoDB();
  await connectMySQL();
  await initModels();
};

// Initialiser les routes
app.use('/api', require('./routes'));

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

initDB()
.then(() => {
  app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));
}).catch((error) => {
  console.error('Erreur lors de l’initialisation des bases de données:', error);
  process.exit(1);
});