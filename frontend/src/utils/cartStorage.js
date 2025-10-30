const CART_STORAGE_KEY = "b2connect_guest_cart";

/**
 * Charger le panier invité depuis localStorage
 */
export const loadGuestCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Erreur lors du chargement du panier invité:", error);
  }
  return { items: [], total: 0 };
};

/**
 * Sauvegarder le panier invité dans localStorage
 */
export const saveGuestCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du panier invité:", error);
  }
};

/**
 * Supprimer le panier invité du localStorage
 */
export const clearGuestCartStorage = () => {
  try {
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Erreur lors de la suppression du panier invité:", error);
  }
};

/**
 * Calculer le total du panier
 */
export const calculateTotal = (items) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
