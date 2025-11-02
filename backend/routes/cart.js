const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/auth");

// Protected routes (User)
router.use(protect);

router.get("/", getCart);
router.post("/", addToCart);
router.post("/merge", mergeCart);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", removeFromCart);
router.delete("/", clearCart);

module.exports = router;
