// ============================================================================
// AUTHENTIFICATION
// ============================================================================
export {
  getCurrentUser,
  login,
  logout,
  refreshToken,
  register,
  requestPasswordReset,
  resetPassword,
  verifyResetToken
} from "./modules/auth";

// ============================================================================
// UTILISATEURS (Admin)
// ============================================================================
export {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser
} from "./modules/users";

// ============================================================================
// PRODUITS
// ============================================================================
export {
  createProduct,
  deleteProduct,
  getDistinctBrands,
  getProductById,
  getProducts,
  updateProduct
} from "./modules/products";

// ============================================================================
// CATÉGORIES
// ============================================================================
export {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoriesForFilters,
  getCategoryById,
  updateCategory
} from "./modules/categories";

// ============================================================================
// COMMANDES
// ============================================================================
export {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderStatus
} from "./modules/orders";

// ============================================================================
// PANIER
// ============================================================================
export {
  addToCart,
  clearCart,
  getCart,
  mergeCart,
  removeFromCart,
  updateCartItem
} from "./modules/cart";

// ============================================================================
// INSTANCES AXIOS (si besoin direct)
// ============================================================================
export { default as axiosPrivate } from "./config/axiosPrivate";
export { default as axiosPublic } from "./config/axiosPublic";
