const bcrypt = require('bcrypt');
const { User, Address } = require('../../models/mysql');
const crypto = require('crypto');

/**
 * Factory pour créer des données de test utilisateur
 */
class TestDataFactory {
  /**
   * Génère des données utilisateur valides
   */
  static generateUserData(overrides = {}) {
    const timestamp = Date.now();
    return {
      email: `test${timestamp}@example.com`,
      password: 'Test123!@#',
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '+33612345678',
      gender: 'male',
      address: {
        street: '123 Test Street',
        postal_code: '75001',
        city: 'Paris',
        country: 'France',
      },
      ...overrides,
    };
  }

  /**
   * Crée un utilisateur en base de données
   */
  static async createUser(overrides = {}) {
    const userData = this.generateUserData(overrides);
    
    // Créer l'adresse
    const address = await Address.create({
      street: userData.address.street,
      postal_code: userData.address.postal_code,
      city: userData.address.city,
      country: userData.address.country,
    });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      email: userData.email,
      password: hashedPassword,
      first_name: userData.first_name,
      last_name: userData.last_name,
      address_id: address.id,
      phone_number: userData.phone_number,
      gender: userData.gender,
      role: userData.role || 'client',
    });

    // Retourner l'utilisateur avec le mot de passe en clair (pour les tests)
    return {
      user,
      plainPassword: userData.password,
      address,
    };
  }

  /**
   * Crée un utilisateur admin
   */
  static async createAdminUser(overrides = {}) {
    return this.createUser({ ...overrides, role: 'admin' });
  }

  /**
   * Crée un utilisateur avec un token de réinitialisation
   */
  static async createUserWithResetToken(overrides = {}) {
    const { user, plainPassword, address } = await this.createUser(overrides);
    
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHashed = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    
    await user.update({
      reset_token: resetTokenHashed,
      reset_token_expires_at: expiresAt,
    });

    return {
      user,
      plainPassword,
      address,
      resetToken, // Token non hashé pour les tests
      resetTokenHashed,
    };
  }

  /**
   * Crée un utilisateur avec un refresh token
   */
  static async createUserWithRefreshToken(overrides = {}) {
    const { user, plainPassword, address } = await this.createUser(overrides);
    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
    
    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires_at: refreshTokenExpiry,
    });

    return {
      user,
      plainPassword,
      address,
      refreshToken,
    };
  }

  /**
   * Crée un utilisateur avec un refresh token expiré
   */
  static async createUserWithExpiredRefreshToken(overrides = {}) {
    const { user, plainPassword, address } = await this.createUser(overrides);
    
    const refreshToken = crypto.randomBytes(64).toString('hex');
    const refreshTokenExpiry = new Date(Date.now() - 1000); // Expiré
    
    await user.update({
      refresh_token: refreshToken,
      refresh_token_expires_at: refreshTokenExpiry,
    });

    return {
      user,
      plainPassword,
      address,
      refreshToken,
    };
  }

  /**
   * Génère des données d'adresse valides
   */
  static generateAddressData(overrides = {}) {
    return {
      street: '123 Test Street',
      postal_code: '75001',
      city: 'Paris',
      country: 'France',
      ...overrides,
    };
  }
}

module.exports = TestDataFactory;
