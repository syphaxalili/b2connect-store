const { Router } = require("express");
const router = Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoriesForFilters,
} = require("../controllers/categoriesController");

// Public routes
router.get("/filters/list", getCategoriesForFilters);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);

// Protected routes (admin only)
router.use(protect);
router.use(requireAdmin);

router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
