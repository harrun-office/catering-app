const express = require('express');
const { register, login, getCurrentUser, updateProfile } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getCurrentUser);
router.put('/profile', authenticateUser, updateProfile);

module.exports = router;
