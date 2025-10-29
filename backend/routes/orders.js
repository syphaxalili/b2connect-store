const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/ordersController');

// Protected routes - User
router.get('/my-orders', protect, getUserOrders);
router.post('/', protect, createOrder);

// Protected routes - Admin
router.get('/', protect, requireAdmin, getAllOrders);
router.get('/:id', protect, requireAdmin, getOrderById);
router.patch('/:id/status', protect, requireAdmin, updateOrderStatus);
router.delete('/:id', protect, requireAdmin, deleteOrder);

module.exports = router;