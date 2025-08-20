const express = require('express');
const { sendOTP, register, login } = require('../controllers/auth');

const router = express.Router();

// Routes
router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/login', login);

module.exports = router;