import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "../store/slices/authSlice";
import {
  addToCartAsync,
  addToGuestCart,
  clearCartAsync,
  clearGuestCart,
  removeFromCartAsync,
  removeFromGuestCart,
  selectCartError,
  selectCartIsGuest,
  selectCartIsLoading,
  selectCartItemCount,
  selectCartItems,
  selectCartItemsCount,
  selectCartTotal,
  updateCartItemAsync,
  updateGuestCartItem
} from "../store/slices/cartSlice";

/**
 * Hook personnalisé pour gérer le panier
 * Gère automatiquement la différence entre panier invité (localStorage) et panier utilisateur (API)
 */
export const useCart = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isGuest = useSelector(selectCartIsGuest);
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount); // Nombre total d'unités
  const itemsCount = useSelector(selectCartItemsCount); // Nombre d'articles distincts
  const isLoading = useSelector(selectCartIsLoading);
  const error = useSelector(selectCartError);

  /**
   * Ajouter un article au panier
   * Utilise localStorage pour invités, API pour utilisateurs connectés
   */
  const addItem = useCallback(
    (product, quantity = 1) => {
      if (isAuthenticated && !isGuest) {
        // Utilisateur connecté - utiliser l'API
        return dispatch(
          addToCartAsync({
            product_id: product._id,
            quantity
          })
        );
      } else {
        // Invité - utiliser localStorage
        dispatch(addToGuestCart({ product, quantity }));
        return Promise.resolve();
      }
    },
    [dispatch, isAuthenticated, isGuest]
  );

  /**
   * Mettre à jour la quantité d'un article
   */
  const updateItem = useCallback(
    (itemOrProductId, quantity) => {
      if (isAuthenticated && !isGuest) {
        // Utilisateur connecté - itemOrProductId est l'ID de CartItem
        return dispatch(
          updateCartItemAsync({
            itemId: itemOrProductId,
            quantity
          })
        );
      } else {
        // Invité - itemOrProductId est le product_id
        dispatch(
          updateGuestCartItem({ product_id: itemOrProductId, quantity })
        );
        return Promise.resolve();
      }
    },
    [dispatch, isAuthenticated, isGuest]
  );

  /**
   * Supprimer un article du panier
   */
  const removeItem = useCallback(
    (itemOrProductId) => {
      if (isAuthenticated && !isGuest) {
        // Utilisateur connecté - itemOrProductId est l'ID de CartItem
        return dispatch(removeFromCartAsync(itemOrProductId));
      } else {
        // Invité - itemOrProductId est le product_id
        dispatch(removeFromGuestCart(itemOrProductId));
        return Promise.resolve();
      }
    },
    [dispatch, isAuthenticated, isGuest]
  );

  /**
   * Vider le panier
   */
  const clearItems = useCallback(() => {
    if (isAuthenticated && !isGuest) {
      // Utilisateur connecté - utiliser l'API
      return dispatch(clearCartAsync());
    } else {
      // Invité - utiliser localStorage
      dispatch(clearGuestCart());
      return Promise.resolve();
    }
  }, [dispatch, isAuthenticated, isGuest]);

  return {
    items,
    total,
    itemCount,
    itemsCount,
    isLoading,
    error,
    isGuest,
    addItem,
    updateItem,
    removeItem,
    clearItems
  };
};

export default useCart;
