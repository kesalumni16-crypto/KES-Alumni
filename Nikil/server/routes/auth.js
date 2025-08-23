const express = require('express');
const { sendOTP, register, sendLoginOTP, verifyLoginOTP } = require('../controllers/auth');

const router = express.Router();

// Routes
router.post('/send-otp', sendOTP);
router.post('/register', register);
router.post('/send-login-otp', sendLoginOTP);
router.post('/verify-login-otp', verifyLoginOTP);

module.exports = router;