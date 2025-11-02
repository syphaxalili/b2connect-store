const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getDistinctBrands,
} = require("../controllers/productsController");

// Public routes
router.get("/filters/brands", getDistinctBrands);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes (admin only)
router.use(protect);
router.use(requireAdmin);

router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
