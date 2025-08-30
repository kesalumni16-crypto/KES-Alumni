const express = require('express');
const { getMaintenanceMode } = require('../controllers/superadmin');

const router = express.Router();

// Public route to check maintenance mode status
router.get('/status', getMaintenanceMode);

module.exports = router;