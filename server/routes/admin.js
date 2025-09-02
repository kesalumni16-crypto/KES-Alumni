const express = require('express');
const {
  getAllUsers,
  getUserById,
  getAdminStats,
  exportUsers,
} = require('../controllers/admin');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and admin authorization to all routes
router.use(authenticate);
router.use(authorize(['ADMIN', 'SUPERADMIN']));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);

// Dashboard stats
router.get('/stats', getAdminStats);

// Export functionality
router.get('/export', exportUsers);

module.exports = router;