const express = require("express");
const router = express.Router();
const { protect, requireAdmin } = require("../middleware/auth");
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/ordersController");

// Protected routes (User)
router.use(protect);

router.get("/my-orders", getUserOrders);
router.post("/", createOrder);

// Protected routes (Admin only)
router.use(requireAdmin);

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

module.exports = router;
