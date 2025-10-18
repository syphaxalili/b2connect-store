const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createOrder,
  getUserOrders
} = require('../controllers/ordersController');

router.get('/', auth, getUserOrders);
router.post('/', auth, createOrder);

module.exports = router;