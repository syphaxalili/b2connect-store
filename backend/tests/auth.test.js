const request = require('supertest');
const app = require('../server');
const { sequelize } = require('../config/db');
const { User, Address } = require('../models/mysql');

// --- Configuration des Mocks ---
// On simule le service d'envoi d'email pour ne pas envoyer de vrais emails
jest.mock('../utils/mailService', () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

let server;

// Données de test réutilisables
const validUserData = {
  email: 'test@example.com',
  password: 'Password123!',
  first_name: 'Test',
  last_name: 'User',
  gender: 'male',
  phone_number: '0102030405',
  address: {
    street: "123 rue de test",
    postal_code: "75001",
    city: "Paris"
  }
};


beforeAll(async () => {

  // Démarrer le serveur sur un port de test
  server = app.listen(3002); // Port de test (différent de 3000 ou 3001)

  try {
    await sequelize.authenticate();
    // 'sync({ force: true })' va SUPPRIMER et recréer vos tables
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Impossible de se connecter à la BDD de test:', error);
    process.exit(1);
  }
});

// Après chaque test, on nettoie les tables
beforeEach(async () => {
  await User.destroy({ where: {} });
  await Address.destroy({ where: {} });
});

// À la toute fin, on ferme la connexion BDD et le serveur
afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });

  await sequelize.close();
});


// --- Les Tests ---
describe('POST /api/auth/register', () => {
  it('devrait créer un nouvel utilisateur ET une adresse (avec transaction)', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(validUserData);

    // 1. Vérifier la réponse de l'API
    expect(response.statusCode).toBe(201);
    expect(response.body.email).toBe(validUserData.email);

    // 2. Vérifier que l'utilisateur a bien été créé en BDD
    const userInDb = await User.findOne({ where: { email: validUserData.email } });
    expect(userInDb).toBeDefined();
    expect(userInDb.first_name).toBe(validUserData.first_name);
    expect(userInDb.address_id).toBeDefined();
  });

  it('devrait renvoyer 400 si l\'email est déjà pris', async () => {
    // 1. Créer un premier utilisateur
    await request(app).post('/api/auth/register').send(validUserData);

    // 2. Tenter de le recréer
    const response = await request(app).post('/api/auth/register').send(validUserData);

    // 3. Vérifier que le serveur renvoie la bonne erreur
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Un utilisateur avec cet email existe déjà');
  });

  it('devrait renvoyer 400 si l\'adresse est manquante', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test2@example.com',
        password: 'Password123!',
        first_name: 'Test2',
        last_name: 'User2',
        // PAS D'ADRESSE
      });

    // 3. Vérifier que le serveur renvoie la bonne erreur
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Une adresse complète est requise pour l'inscription");
  });
});

describe('POST /api/auth/login', () => {
  // On crée un utilisateur valide avant chaque test de login
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send(validUserData);
  });

  it('devrait connecter un utilisateur et renvoyer des cookies', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.email,
        password: validUserData.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(validUserData.email);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('devrait renvoyer 401 pour un mot de passe incorrect', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: validUserData.email,
        password: 'MauvaisMotDePasse',
      });

    expect(response.statusCode).toBe(401);
  });
});