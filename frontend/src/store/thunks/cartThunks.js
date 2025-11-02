import { createAsyncThunk } from "@reduxjs/toolkit";
import * as cartAPI from "../../api/modules/cart";
import { clearGuestCartStorage, loadGuestCart } from "../../utils/cartStorage";

/**
 * Récupérer le panier depuis le backend (utilisateur connecté)
 */
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartAPI.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Erreur lors de la récupération du panier"
      );
    }
  }
);

/**
 * Ajouter un article au panier (utilisateur connecté)
 */
export const addToCartAsync = createAsyncThunk(
  "cart/addToCart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      await cartAPI.addToCart({ product_id, quantity });
      const data = await cartAPI.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de l'ajout au panier"
      );
    }
  }
);

/**
 * Mettre à jour la quantité d'un article (utilisateur connecté)
 */
export const updateCartItemAsync = createAsyncThunk(
  "cart/updateCartItem",
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      await cartAPI.updateCartItem(itemId, { quantity });
      const data = await cartAPI.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    }
  }
);

/**
 * Supprimer un article du panier (utilisateur connecté)
 */
export const removeFromCartAsync = createAsyncThunk(
  "cart/removeFromCart",
  async (itemId, { rejectWithValue }) => {
    try {
      await cartAPI.removeFromCart(itemId);
      const data = await cartAPI.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la suppression"
      );
    }
  }
);

/**
 * Vider le panier (utilisateur connecté)
 */
export const clearCartAsync = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      await cartAPI.clearCart();
      return { items: [], total: 0 };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors du vidage du panier"
      );
    }
  }
);

/**
 * Fusionner le panier invité avec le panier utilisateur (lors de la connexion)
 */
export const mergeCartAsync = createAsyncThunk(
  "cart/mergeCart",
  async (_, { rejectWithValue }) => {
    try {
      const guestCart = loadGuestCart();

      if (guestCart.items.length === 0) {
        const data = await cartAPI.getCart();
        return data;
      }

      const data = await cartAPI.mergeCart(guestCart.items);
      clearGuestCartStorage();

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Erreur lors de la fusion du panier"
      );
    }
  }
);
