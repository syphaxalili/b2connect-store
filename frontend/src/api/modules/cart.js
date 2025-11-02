import axiosPrivate from "../config/axiosPrivate";

/**
 * Récupérer le panier de l'utilisateur connecté
 */
export const getCart = async () => {
  const response = await axiosPrivate.get("/cart");
  return response.data;
};

/**
 * Ajouter un article au panier
 */
export const addToCart = async (data) => {
  const response = await axiosPrivate.post("/cart", data);
  return response.data;
};

/**
 * Mettre à jour la quantité d'un article
 */
export const updateCartItem = async (itemId, data) => {
  const response = await axiosPrivate.put(`/cart/${itemId}`, data);
  return response.data;
};

/**
 * Supprimer un article du panier
 */
export const removeFromCart = async (itemId) => {
  const response = await axiosPrivate.delete(`/cart/${itemId}`);
  return response.data;
};

/**
 * Vider le panier
 */
export const clearCart = async () => {
  const response = await axiosPrivate.delete("/cart");
  return response.data;
};

/**
 * Fusionner le panier invité avec le panier utilisateur
 */
export const mergeCart = async (guestCartItems) => {
  const response = await axiosPrivate.post("/cart/merge", {
    items: guestCartItems
  });
  return response.data;
};
