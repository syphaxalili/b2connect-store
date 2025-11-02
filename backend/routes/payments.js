const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createPayment
} = require('../controllers/paymentsController');

// Protected routes (user)
router.post('/', protect, createPayment);

module.exports = router;