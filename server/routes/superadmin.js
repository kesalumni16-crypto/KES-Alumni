const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserDetails,
  deleteUser,
  getSuperadminStats,
  toggleMaintenanceMode,
  getMaintenanceMode,
} = require('../controllers/superadmin');
const { authenticate, authorize } = require('../middlewares/auth');

const router = express.Router();

// Apply authentication and superadmin authorization to all routes
router.use(authenticate);
router.use(authorize(['SUPERADMIN']));

// User management routes
router.get('/users', getAllUsers);
router.get('/users/:userId', getUserById);
router.put('/users/:userId/role', updateUserRole);
router.put('/users/:userId', updateUserDetails);
router.delete('/users/:userId', deleteUser);

// Dashboard stats
router.get('/stats', getSuperadminStats);

// Maintenance mode routes
router.post('/maintenance', toggleMaintenanceMode);
router.get('/maintenance', getMaintenanceMode);

module.exports = router;