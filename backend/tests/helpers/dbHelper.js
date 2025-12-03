const { sequelize } = require('../../config/db');
const { User, Address } = require('../../models/mysql');
const mongoose = require('mongoose');

/**
 * Initialise les connexions aux bases de données pour les tests
 */
const setupDatabase = async () => {
  try {
    // Connexion MySQL
    await sequelize.authenticate();
    
    // Connexion MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
    
    // Initialiser les modèles
    const { initModels } = require('../../models/mysql');
    await initModels();
    
    console.log('✓ Bases de données connectées pour les tests');
  } catch (error) {
    console.error('Erreur lors de la connexion aux bases de données:', error);
    throw error;
  }
};

/**
 * Nettoie les données de test dans les bases de données
 */
const cleanDatabase = async () => {
  try {
    // Nettoyer MySQL - désactiver les contraintes de clés étrangères temporairement
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await User.destroy({ where: {}, force: true });
    await Address.destroy({ where: {}, force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    
    // Nettoyer MongoDB
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage de la base de données:', error);
    throw error;
  }
};

/**
 * Ferme les connexions aux bases de données
 */
const closeDatabase = async () => {
  try {
    // Fermer Sequelize (MySQL) avec force pour éviter les connexions pendantes
    if (sequelize) {
      await sequelize.connectionManager.close();
    }
    
    // Fermer Mongoose (MongoDB) proprement
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close(true); // force = true
    }
    
    console.log('✓ Connexions aux bases de données fermées');
  } catch (error) {
    console.error('Erreur lors de la fermeture des connexions:', error);
    // Ne pas throw pour éviter de bloquer la fermeture des tests
  }
};

/**
 * Réinitialise complètement les bases de données (drop et recréer les tables)
 */
const resetDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('✓ Base de données MySQL réinitialisée');
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données:', error);
    throw error;
  }
};

module.exports = {
  setupDatabase,
  cleanDatabase,
  closeDatabase,
  resetDatabase,
};
