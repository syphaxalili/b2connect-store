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
  getCategoryById,
  updateCategory
} from "./modules/categories";

// ============================================================================
// COMMANDES
// ============================================================================
export {
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrderStatus
} from "./modules/orders";

// ============================================================================
// INSTANCES AXIOS (si besoin direct)
// ============================================================================
export { default as axiosPrivate } from "./config/axiosPrivate";
export { default as axiosPublic } from "./config/axiosPublic";
