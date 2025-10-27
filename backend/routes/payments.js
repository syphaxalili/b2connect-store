const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createPayment
} = require('../controllers/paymentsController');

// Protected routes (user)
router.post('/', auth, createPayment);

module.exports = router;