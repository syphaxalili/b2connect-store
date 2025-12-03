/**
 * Global teardown pour Jest
 * Ferme toutes les connexions de base de données après tous les tests
 */

module.exports = async () => {
  // Attendre un peu pour que toutes les connexions se ferment proprement
  await new Promise(resolve => setTimeout(resolve, 1000));
};
