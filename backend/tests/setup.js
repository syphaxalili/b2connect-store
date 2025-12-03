const path = require('path');
const dotenv = require('dotenv');

// Charger les variables d'environnement de test
dotenv.config({ path: path.resolve(__dirname, '../../.env.test'), quiet: true });

// Si .env.test n'existe pas, charger .env par défaut
if (!process.env.JWT_SECRET) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });
}

// S'assurer que NODE_ENV est défini à 'test'
process.env.NODE_ENV = 'test';

// Augmenter le timeout pour les tests d'intégration
jest.setTimeout(30000);

// Mock du service d'email pour éviter d'envoyer de vrais emails pendant les tests
jest.mock('../utils/mailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));
