const express = require('express');
const {
  getAlumniLocations,
  updateUserLocation,
  getLocationStats,
} = require('../controllers/alumniGlobe');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Public route for getting alumni locations
router.get('/locations', getAlumniLocations);
router.get('/stats', getLocationStats);

// Protected routes
router.use(authenticate);
router.put('/location', updateUserLocation);

module.exports = router;