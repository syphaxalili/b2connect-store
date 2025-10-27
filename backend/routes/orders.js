const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOrder,
  getUserOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/ordersController');

// Protected routes - User
router.get('/my-orders', auth, getUserOrders);
router.post('/', auth, createOrder);

// Protected routes - Admin
router.get('/', auth, getAllOrders);
router.get('/:id', auth, getOrderById);
router.patch('/:id/status', auth, updateOrderStatus);
router.delete('/:id', auth, deleteOrder);

module.exports = router;