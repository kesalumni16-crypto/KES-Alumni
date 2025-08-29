const express = require('express');
const { getProfile, updateProfile, getDashboardStats } = require('../controllers/profile');
const { upload, uploadPhoto, deletePhoto } = require('../controllers/photoUpload');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication middleware to all profile routes
router.use(authenticate);

// Routes
router.get('/', getProfile);
router.put('/', updateProfile);
router.get('/stats', getDashboardStats);
router.post('/upload-photo', upload.single('photo'), uploadPhoto);
router.delete('/photo', deletePhoto);

module.exports = router;