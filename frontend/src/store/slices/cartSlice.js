import { createSlice } from "@reduxjs/toolkit";
import {
  calculateTotal,
  clearGuestCartStorage,
  loadGuestCart,
  saveGuestCart
} from "../../utils/cartStorage";
import {
  addToCartAsync,
  clearCartAsync,
  fetchCart,
  mergeCartAsync,
  removeFromCartAsync,
  updateCartItemAsync
} from "../thunks/cartThunks";

const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
  isGuest: true
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    /**
     * Ajouter un article au panier invité (localStorage)
     */
    addToGuestCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;

      // Chercher si le produit existe déjà
      const existingItem = state.items.find(
        (item) => item.product_id === product._id
      );

      if (existingItem) {
        // Augmenter la quantité
        existingItem.quantity += quantity;
      } else {
        // Ajouter un nouvel item
        state.items.push({
          product_id: product._id,
          quantity,
          price: product.price,
          product: {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            stock: product.stock,
            images: product.images
          }
        });
      }

      // Recalculer le total
      state.total = calculateTotal(state.items);

      // Sauvegarder dans localStorage
      saveGuestCart({ items: state.items, total: state.total });
    },

    /**
     * Mettre à jour la quantité d'un article invité
     */
    updateGuestCartItem: (state, action) => {
      const { product_id, quantity } = action.payload;

      const item = state.items.find((item) => item.product_id === product_id);
      if (item) {
        item.quantity = quantity;
        state.total = calculateTotal(state.items);
        saveGuestCart({ items: state.items, total: state.total });
      }
    },

    /**
     * Supprimer un article du panier invité
     */
    removeFromGuestCart: (state, action) => {
      const product_id = action.payload;

      state.items = state.items.filter(
        (item) => item.product_id !== product_id
      );
      state.total = calculateTotal(state.items);
      saveGuestCart({ items: state.items, total: state.total });
    },

    /**
     * Vider le panier invité
     */
    clearGuestCart: (state) => {
      state.items = [];
      state.total = 0;
      clearGuestCartStorage();
    },

    /**
     * Charger le panier invité depuis localStorage
     */
    loadGuestCartFromStorage: (state) => {
      const guestCart = loadGuestCart();
      state.items = guestCart.items;
      state.total = guestCart.total;
      state.isGuest = true;
    },

    /**
     * Marquer le panier comme panier utilisateur (non invité)
     */
    setCartAsUser: (state) => {
      state.isGuest = false;
    },

    /**
     * Réinitialiser le panier (lors de la déconnexion)
     */
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.isLoading = false;
      state.error = null;
      state.isGuest = true;
      clearGuestCartStorage();
    }
  },
  extraReducers: (builder) => {
    // fetchCart
    builder.addCase(fetchCart.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.isGuest = false;
    });
    builder.addCase(fetchCart.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // addToCartAsync
    builder.addCase(addToCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
    });
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // updateCartItemAsync
    builder.addCase(updateCartItemAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateCartItemAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
    });
    builder.addCase(updateCartItemAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // removeFromCartAsync
    builder.addCase(removeFromCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(removeFromCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
    });
    builder.addCase(removeFromCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // clearCartAsync
    builder.addCase(clearCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(clearCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
    });
    builder.addCase(clearCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // mergeCartAsync
    builder.addCase(mergeCartAsync.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(mergeCartAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.items = action.payload.items;
      state.total = action.payload.total;
      state.isGuest = false;
    });
    builder.addCase(mergeCartAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  }
});

// ============================================================================
// ACTIONS
// ============================================================================

export const {
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  loadGuestCartFromStorage,
  setCartAsUser,
  resetCart
} = cartSlice.actions;

export {
  addToCartAsync,
  clearCartAsync,
  fetchCart,
  mergeCartAsync,
  removeFromCartAsync,
  updateCartItemAsync
};

export {
  selectCartError,
  selectCartIsGuest,
  selectCartIsLoading,
  selectCartItemCount,
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal
} from "../selectors/cartSelectors";

export default cartSlice.reducer;
