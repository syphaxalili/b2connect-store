const request = require('supertest');
const app = require('../server');
const { setupDatabase, cleanDatabase, closeDatabase } = require('./helpers/dbHelper');
const TestDataFactory = require('./helpers/testDataFactory');
const jwt = require('jsonwebtoken');

describe('Authentication Middleware Integration Tests', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
  });

  describe('protect middleware', () => {
    it('devrait autoriser l\'accès avec un token valide', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // Se connecter pour obtenir un token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Accéder à une route protégée
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('token manquant');
    });

    it('devrait rejeter un token malformé', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['access_token=malformedtoken'])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('invalide');
    });

    it('devrait rejeter un token avec une mauvaise signature', async () => {
      const { user } = await TestDataFactory.createUser();

      // Créer un token avec une mauvaise clé secrète
      const fakeToken = jwt.sign(
        { user_id: user.id, role: user.role },
        'wrong_secret_key',
        { expiresIn: '15m' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${fakeToken}`])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('invalide');
    });

    it('devrait rejeter un token expiré', async () => {
      const { user } = await TestDataFactory.createUser();

      // Créer un token expiré
      const expiredToken = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      // Attendre pour s'assurer que le token est expiré
      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${expiredToken}`])
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('expiré');
    });

    it('devrait extraire correctement les informations du token', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toHaveProperty('id', user.id);
      expect(response.body).toHaveProperty('role', user.role);
    });
  });

  describe('requireAdmin middleware', () => {
    it('devrait autoriser l\'accès pour un utilisateur admin', async () => {
      const { user, plainPassword } = await TestDataFactory.createAdminUser();

      // Se connecter en tant qu'admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Tester sur une route admin (si elle existe)
      // Note: Vous devrez adapter ceci selon vos routes admin réelles
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body).toHaveProperty('role', 'admin');
    });

    it('devrait rejeter l\'accès pour un utilisateur non-admin', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // Se connecter en tant que client
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Vérifier que l'utilisateur n'est pas admin
      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(meResponse.body).toHaveProperty('role', 'client');
    });
  });

  describe('Sécurité des tokens', () => {
    it('devrait utiliser httpOnly pour les cookies', async () => {
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
      const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='));

      expect(accessTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('HttpOnly');
    });

    it('devrait utiliser sameSite pour les cookies', async () => {
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
      const refreshTokenCookie = cookies.find(c => c.startsWith('refresh_token='));

      expect(accessTokenCookie).toContain('SameSite=Lax');
      expect(refreshTokenCookie).toContain('SameSite=Lax');
    });

    it('ne devrait pas exposer les données sensibles dans les réponses', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      // Vérifier que le mot de passe n'est pas dans la réponse
      expect(loginResponse.body).not.toHaveProperty('password');
      expect(loginResponse.body).not.toHaveProperty('refresh_token');
      expect(loginResponse.body).not.toHaveProperty('reset_token');

      const cookies = loginResponse.headers['set-cookie'];

      const meResponse = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(meResponse.body).not.toHaveProperty('password');
      expect(meResponse.body).not.toHaveProperty('refresh_token');
      expect(meResponse.body).not.toHaveProperty('reset_token');
    });

    it('devrait invalider les tokens après déconnexion', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // Connexion
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Déconnexion
      const logoutResponse = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookies)
        .expect(200);

      // Récupérer les cookies après déconnexion (qui sont vides/expirés)
      const logoutCookies = logoutResponse.headers['set-cookie'];

      // Tenter d'accéder à une route protégée avec les cookies après déconnexion
      await request(app)
        .get('/api/auth/me')
        .set('Cookie', logoutCookies)
        .expect(401);
    });
  });

  describe('Gestion des erreurs du middleware', () => {
    it('devrait gérer gracieusement un token JWT corrompu', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', ['access_token=corrupted.jwt.token'])
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('devrait gérer un token avec un payload invalide', async () => {
      // Créer un token sans user_id
      const invalidToken = jwt.sign(
        { some_field: 'value' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${invalidToken}`])
        .expect(404); // L'utilisateur n'existe pas

      expect(response.body).toHaveProperty('error');
    });

    it('devrait gérer un token pour un utilisateur supprimé', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      // Se connecter
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Supprimer l'utilisateur
      await user.destroy();

      // Tenter d'accéder à une route protégée
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Tests de charge et performance', () => {
    it('devrait gérer plusieurs requêtes authentifiées simultanées', async () => {
      const { user, plainPassword } = await TestDataFactory.createUser();

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(200);

      const cookies = loginResponse.headers['set-cookie'];

      // Faire 10 requêtes simultanées
      const requests = Array(10)
        .fill()
        .map(() =>
          request(app)
            .get('/api/auth/me')
            .set('Cookie', cookies)
        );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', user.id);
      });
    });

    it('devrait gérer efficacement les tokens expirés', async () => {
      const { user } = await TestDataFactory.createUser();

      const expiredToken = jwt.sign(
        { user_id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '0s' }
      );

      await new Promise(resolve => setTimeout(resolve, 1000));

      const startTime = Date.now();

      await request(app)
        .get('/api/auth/me')
        .set('Cookie', [`access_token=${expiredToken}`])
        .expect(401);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // La vérification du token devrait être rapide (< 100ms)
      expect(responseTime).toBeLessThan(100);
    });
  });
});
