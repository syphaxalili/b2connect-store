export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;

// Nombre total d'unités (somme des quantités)
export const selectCartItemCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0);

// Nombre d'articles distincts (nombre de lignes)
export const selectCartItemsCount = (state) => state.cart.items.length;

export const selectCartIsLoading = (state) => state.cart.isLoading;
export const selectCartError = (state) => state.cart.error;
export const selectCartIsGuest = (state) => state.cart.isGuest;
