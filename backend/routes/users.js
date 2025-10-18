const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  getCurrentUser,
  updateCurrentUser
} = require('../controllers/usersController');

router.get('/me', auth, getCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.put('/me', auth, updateCurrentUser);

module.exports = router;