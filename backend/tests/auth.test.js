const request = require('supertest');
const app = require('../server');
const { setupDatabase, cleanDatabase, closeDatabase } = require('./helpers/dbHelper');
const TestDataFactory = require('./helpers/testDataFactory');
const jwt = require('jsonwebtoken');
const { User } = require('../models/mysql');

describe('Authentication Integration Tests', () => {
  // Setup et teardown
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel utilisateur avec des données valides', async () => {
      const userData = TestDataFactory.generateUserData();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('user_id');
      expect(response.body).toHaveProperty('email', userData.email);

      // Vérifier que l'utilisateur existe en BDD
      const user = await User.findOne({ where: { email: userData.email } });
      expect(user).toBeTruthy();
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.role).toBe('client');
    });

    it('devrait rejeter une inscription sans email', async () => {
      const userData = TestDataFactory.generateUserData();
      delete userData.email;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email');
    });

    it('devrait rejeter une inscription sans mot de passe', async () => {
      const userData = TestDataFactory.generateUserData();
      delete userData.password;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('mot de passe');
    });

    it('devrait rejeter une inscription sans nom', async () => {
      const userData = TestDataFactory.generateUserData();
      delete userData.first_name;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('nom');
    });

    it('devrait rejeter une inscription sans adresse complète', async () => {
      const userData = TestDataFactory.generateUserData();
      delete userData.address.street;

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('adresse');
    });

    it('devrait rejeter une inscription avec un email déjà existant', async () => {
      const userData = TestDataFactory.generateUserData();
      
      // Créer un premier utilisateur
      await TestDataFactory.createUser({ email: userData.email });

      // Tenter de créer un second utilisateur avec le même email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('existe déjà');
    });

    it('devrait hasher le mot de passe lors de l\'inscription', async () => {
      const userData = TestDataFactory.generateUserData();

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findOne({ where: { email: userData.email } });
      expect(user.password).not.toBe(userData.password);
      expect(user.password).toMatch(/^\$2[aby]\$/); // Format bcrypt
    });

    it('devrait créer une adresse associée à l\'utilisateur', async () => {
      const userData = TestDataFactory.generateUserData();

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await User.findByPk(response.body.user_id, {
        include: ['address'],
      });

      expect(user.address).toBeTruthy();
      expect(user.address.street).toBe(userData.address.street);
      expect(user.address.city).toBe(userData.address.city);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('role', user.role);
      expect(response.body).toHaveProperty('name');

      // Vérifier les cookies
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      
      const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
      const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='));
      
      expect(accessTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toBeDefined();
    });

    it('devrait rejeter une connexion avec un email invalide', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Identifiants invalides');
    });

    it('devrait rejeter une connexion avec un mot de passe invalide', async () => {
      const { user } = await TestDataFactory.createUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Identifiants invalides');
    });

    it('devrait stocker le refresh token en base de données', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.refresh_token).toBeTruthy();
      expect(updatedUser.refresh_token_expires_at).toBeTruthy();
    });

    it('devrait générer un access token JWT valide', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
      const accessToken = accessTokenCookie.split(';')[0].split('=')[1];

      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      expect(decoded).toHaveProperty('user_id', user.id);
      expect(decoded).toHaveProperty('role', user.role);
    });

    it('devrait gérer l\'option "Remember Me" (30 jours)', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
          rememberMe: true,
        })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      const expiryDate = new Date(updatedUser.refresh_token_expires_at);
      const now = new Date();
      const daysDiff = (expiryDate - now) / (1000 * 60 * 60 * 24);

      expect(daysDiff).toBeGreaterThan(29);
      expect(daysDiff).toBeLessThan(31);
    });

    it('devrait définir une expiration de 1 jour sans "Remember Me"', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
          rememberMe: false,
        })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      const expiryDate = new Date(updatedUser.refresh_token_expires_at);
      const now = new Date();
      const daysDiff = (expiryDate - now) / (1000 * 60 * 60 * 24);

      expect(daysDiff).toBeGreaterThan(0.9);
      expect(daysDiff).toBeLessThan(1.1);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('devrait rafraîchir l\'access token avec un refresh token valide', async () => {
      const { user, refreshToken } = await TestDataFactory.createUserWithRefreshToken();

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('message');
      
      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
      expect(accessTokenCookie).toBeDefined();
    });

    it('devrait rejeter une requête sans refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('manquant');
    });

    it('devrait rejeter un refresh token invalide', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refresh_token=invalidtoken123'])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('invalide');
    });

    it('devrait rejeter un refresh token expiré', async () => {
      const { refreshToken } = await TestDataFactory.createUserWithExpiredRefreshToken();

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('expiré');
    });

    it('devrait supprimer le refresh token expiré de la BDD', async () => {
      const { user, refreshToken } = await TestDataFactory.createUserWithExpiredRefreshToken();

      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(401);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.refresh_token).toBeNull();
      expect(updatedUser.refresh_token_expires_at).toBeNull();
    });
  });

  describe('POST /api/auth/logout', () => {
    it('devrait déconnecter un utilisateur et supprimer les tokens', async () => {
      const { refreshToken } = await TestDataFactory.createUserWithRefreshToken();

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Déconnexion réussie');

      // Vérifier que les cookies sont supprimés
      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(c => c.startsWith('access_token='));
      const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='));

      expect(accessTokenCookie).toContain('Max-Age=0');
      expect(refreshTokenCookie).toContain('Max-Age=0');
    });

    it('devrait supprimer le refresh token de la BDD', async () => {
      const { user, refreshToken } = await TestDataFactory.createUserWithRefreshToken();

      await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [`refresh_token=${refreshToken}`])
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.refresh_token).toBeNull();
      expect(updatedUser.refresh_token_expires_at).toBeNull();
    });

    it('devrait fonctionner même sans refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/auth/me', () => {
    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // Se connecter pour obtenir un access token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        });

      const cookies = loginResponse.headers['set-cookie'];

      // Récupérer les informations de l'utilisateur
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('first_name', user.first_name);
      expect(response.body).toHaveProperty('last_name', user.last_name);
      expect(response.body).toHaveProperty('role', user.role);
      expect(response.body).toHaveProperty('address');
      
      // Ne devrait pas retourner les données sensibles
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('refresh_token');
      expect(response.body).not.toHaveProperty('reset_token');
    });

    it('devrait rejeter une requête sans access token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token manquant');
    });

    it('devrait rejeter un access token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['access_token=invalidtoken'])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('invalide');
    });

    it('devrait rejeter un access token expiré', async () => {
      const { user } = await TestDataFactory.createUser();

      // Créer un token expiré
      const expiredToken = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Attendre un peu pour s'assurer que le token est expiré
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${expiredToken}`])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('expiré');
    });
  });

  describe('Scénarios d\'intégration complets', () => {
    it('devrait gérer un flux complet: inscription -> connexion -> accès protégé -> déconnexion', async () => {
      const userData = TestDataFactory.generateUserData();

      // 1. Inscription
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('user_id');

      // 2. Connexion
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // 3. Accès à une route protégée
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(meResponse.body).toHaveProperty('email', userData.email);

      // 4. Déconnexion
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      // Récupérer les cookies après déconnexion (qui sont vides/expirés)
      const logoutCookies = logoutResponse.headers['set-cookie'];

      // 5. Vérifier que l'accès est refusé après déconnexion
      await request(app)
        .get('/api/auth/me')
        .set('Cookie', logoutCookies)
        .expect(401);
    });

    it('devrait gérer le rafraîchissement du token dans un flux complet', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // 1. Connexion
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];
      const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='));

      // 2. Rafraîchir le token
      const refreshResponse = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [refreshTokenCookie])
        .expect(200);

      const newCookies = refreshResponse.headers['set-cookie'];
      const newAccessTokenCookie = newCookies.find(c => c.startsWith('access_token='));

      // 3. Utiliser le nouveau token pour accéder à une route protégée
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [newAccessTokenCookie, refreshTokenCookie])
        .expect(200);

      expect(meResponse.body).toHaveProperty('email', user.email);
    });
  });
});
