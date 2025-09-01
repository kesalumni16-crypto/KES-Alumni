const { verifyToken } = require('../utils/auth');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Add user data to request
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Role-based authorization middleware
 * @param {Array} allowedRoles - Array of roles that can access the route
 */
const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Get user from database to check current role
      const user = await prisma.alumni.findUnique({
        where: { id: req.user.id },
        select: { role: true, isVerified: true },
      });

      if (!user || !user.isVerified) {
        return res.status(401).json({ message: 'User not found or not verified' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      // Add role to request object
      req.user.role = user.role;
      next();
    } catch (error) {
      console.error('Authorization middleware error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

/**
 * Maintenance mode middleware
 * Checks if system is in maintenance mode and blocks access for non-admin users
 */
const checkMaintenanceMode = async (req, res, next) => {
  try {
    // Skip maintenance check for maintenance mode endpoints
    if (req.path.includes('/maintenance')) {
      return next();
    }

    // Skip maintenance check for auth endpoints during registration/login
    if (req.path.includes('/auth/')) {
      return next();
    }
    const maintenanceMode = await prisma.maintenanceMode.findFirst({
      orderBy: { id: 'desc' },
    });

    if (maintenanceMode && maintenanceMode.isEnabled) {
      // Allow superadmin and admin to access during maintenance
      if (req.user && (req.user.role === 'SUPERADMIN' || req.user.role === 'ADMIN')) {
        return next();
      }

      return res.status(503).json({
        message: 'System is under maintenance',
        maintenanceMessage: maintenanceMode.message,
        isMaintenanceMode: true,
      });
    }

    next();
  } catch (error) {
    console.error('Maintenance mode middleware error:', error);
    next(); // Continue on error to avoid blocking the system
  }
};

module.exports = { authenticate, authorize, checkMaintenanceMode };