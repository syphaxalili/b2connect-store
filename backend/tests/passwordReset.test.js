const request = require('supertest');
const app = require('../server');
const { setupDatabase, cleanDatabase, closeDatabase } = require('./helpers/dbHelper');
const TestDataFactory = require('./helpers/testDataFactory');
const crypto = require('crypto');
const { User } = require('../models/mysql');

// Mock du service d'email
jest.mock('../utils/mailService');
const { sendEmail } = require('../utils/mailService');

describe('Password Reset Integration Tests', () => {
  beforeAll(async () => {
    await setupDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await cleanDatabase();
    jest.clearAllMocks();
    // Mock sendEmail pour retourner un succès
    sendEmail.mockResolvedValue({ success: true, messageId: 'test-message-id' });
  });

  describe('POST /api/auth/request-password-reset', () => {
    it('devrait envoyer un email de réinitialisation pour un email valide', async () => {
      const { user } = await TestDataFactory.createUser();

      const response = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: user.email })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('lien de réinitialisation');

      // Vérifier que l'email a été envoyé (mock)
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: user.email,
          subject: expect.any(String),
        })
      );
    });

    it('devrait créer un reset token hashé en base de données', async () => {
      const { user } = await TestDataFactory.createUser();

      await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: user.email })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.reset_token).toBeTruthy();
      expect(updatedUser.reset_token_expires_at).toBeTruthy();
      expect(updatedUser.reset_token).toHaveLength(64); // SHA256 hex = 64 chars
    });

    it('devrait définir une expiration de 15 minutes pour le token', async () => {
      const { user } = await TestDataFactory.createUser();

      await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: user.email })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      const expiryDate = new Date(updatedUser.reset_token_expires_at);
      const now = new Date();
      const minutesDiff = (expiryDate - now) / (1000 * 60);

      expect(minutesDiff).toBeGreaterThan(14);
      expect(minutesDiff).toBeLessThan(16);
    });

    it('devrait retourner un message générique pour un email inexistant (sécurité)', async () => {
      const response = await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: 'nonexistent@example.com' })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Si cet email existe');

      // Ne devrait pas envoyer d'email
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('devrait rejeter une requête sans email', async () => {
      const response = await request(app)
        .post('/api/auth/request-password-reset')
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Email requis');
    });

    it('devrait remplacer un ancien token de réinitialisation', async () => {
      const { user } = await TestDataFactory.createUserWithResetToken();
      const oldToken = user.reset_token;

      await request(app)
        .post('/api/auth/request-password-reset')
        .send({ email: user.email })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.reset_token).not.toBe(oldToken);
    });
  });

  describe('GET /api/auth/verify-reset-token', () => {
    it('devrait valider un token de réinitialisation valide', async () => {
      const { user, resetToken } = await TestDataFactory.createUserWithResetToken();

      const response = await request(app)
        .get('/api/auth/verify-reset-token')
        .query({ token: resetToken })
        .expect(200);

      expect(response.body).toHaveProperty('valid', true);
    });

    it('devrait rejeter un token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/verify-reset-token')
        .query({ token: 'invalidtoken123' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token invalide');
    });

    it('devrait rejeter un token expiré', async () => {
      const { user } = await TestDataFactory.createUser();

      // Créer un token expiré
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHashed = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await user.update({
        reset_token: resetTokenHashed,
        reset_token_expires_at: new Date(Date.now() - 1000), // Expiré
      });

      const response = await request(app)
        .get('/api/auth/verify-reset-token')
        .query({ token: resetToken })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token expiré');
    });

    it('devrait supprimer le token expiré de la BDD', async () => {
      const { user } = await TestDataFactory.createUser();

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHashed = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await user.update({
        reset_token: resetTokenHashed,
        reset_token_expires_at: new Date(Date.now() - 1000),
      });

      await request(app)
        .get('/api/auth/verify-reset-token')
        .query({ token: resetToken })
        .expect(400);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.reset_token).toBeNull();
      expect(updatedUser.reset_token_expires_at).toBeNull();
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .get('/api/auth/verify-reset-token')
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token requis');
    });
  });

  describe('POST /api/auth/reset-password', () => {
    it('devrait réinitialiser le mot de passe avec un token valide', async () => {
      const { user, resetToken, plainPassword } = await TestDataFactory.createUserWithResetToken();
      const newPassword = 'NewPassword123!@#';

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: newPassword,
        })
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('réinitialisé avec succès');

      // Vérifier que le mot de passe a été changé
      const updatedUser = await User.findByPk(user.id);
      const bcrypt = require('bcrypt');
      const isNewPasswordValid = await bcrypt.compare(newPassword, updatedUser.password);
      const isOldPasswordValid = await bcrypt.compare(plainPassword, updatedUser.password);

      expect(isNewPasswordValid).toBe(true);
      expect(isOldPasswordValid).toBe(false);
    });

    it('devrait supprimer le reset token après réinitialisation', async () => {
      const { user, resetToken } = await TestDataFactory.createUserWithResetToken();

      await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword123!@#',
        })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.reset_token).toBeNull();
      expect(updatedUser.reset_token_expires_at).toBeNull();
    });

    it('devrait rejeter une réinitialisation avec un token invalide', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalidtoken123',
          newPassword: 'NewPassword123!@#',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token invalide');
    });

    it('devrait rejeter une réinitialisation avec un token expiré', async () => {
      const { user } = await TestDataFactory.createUser();

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHashed = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

      await user.update({
        reset_token: resetTokenHashed,
        reset_token_expires_at: new Date(Date.now() - 1000),
      });

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword123!@#',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token expiré');
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          newPassword: 'NewPassword123!@#',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token');
    });

    it('devrait rejeter une requête sans nouveau mot de passe', async () => {
      const { resetToken } = await TestDataFactory.createUserWithResetToken();

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('mot de passe');
    });

    it('devrait hasher le nouveau mot de passe', async () => {
      const { user, resetToken } = await TestDataFactory.createUserWithResetToken();
      const newPassword = 'NewPassword123!@#';

      await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: newPassword,
        })
        .expect(200);

      const updatedUser = await User.findByPk(user.id);
      expect(updatedUser.password).not.toBe(newPassword);
      expect(updatedUser.password).toMatch(/^\$2[aby]\$/); // Format bcrypt
    });
  });

  describe('Scénario complet de réinitialisation de mot de passe', () => {
    it('devrait gérer un flux complet de réinitialisation', async () => {
      // Créer un utilisateur avec un token de reset déjà configuré
      const { user, plainPassword, resetToken } = await TestDataFactory.createUserWithResetToken();
      const newPassword = 'NewSecurePassword123!@#';

      // 1. Vérifier le token
      await request(app)
        .get('/api/auth/verify-reset-token')
        .query({ token: resetToken })
        .expect(200);

      // 2. Réinitialiser le mot de passe
      await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: newPassword,
        })
        .expect(200);

      // 3. Vérifier que l'ancien mot de passe ne fonctionne plus
      await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: plainPassword,
        })
        .expect(401);

      // 4. Vérifier que le nouveau mot de passe fonctionne
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: user.email,
          password: newPassword,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty('email', user.email);
    });

    it('devrait empêcher la réutilisation d\'un token après réinitialisation', async () => {
      const { user, resetToken } = await TestDataFactory.createUserWithResetToken();

      // 1. Première réinitialisation
      await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'NewPassword1!@#',
        })
        .expect(200);

      // 2. Tenter de réutiliser le même token
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword: 'AnotherPassword2!@#',
        })
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Token invalide');
    });
  });
});
