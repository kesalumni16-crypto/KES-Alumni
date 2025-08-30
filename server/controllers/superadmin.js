const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all users for superadmin dashboard
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      isVerified: true,
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
        ],
      }),
      ...(role && { role }),
    };

    // Get users with pagination
    const users = await prisma.alumni.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        department: true,
        college: true,
        passingYear: true,
        isVerified: true,
        createdAt: true,
        profilePhoto: true,
        currentJobTitle: true,
        currentCompany: true,
      },
    });

    // Get total count for pagination
    const totalUsers = await prisma.alumni.count({ where });

    res.status(200).json({
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers,
        hasNext: skip + users.length < totalUsers,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get user details by ID
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.alumni.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user role
 */
const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['SUPERADMIN', 'ADMIN', 'ALUMNI'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const user = await prisma.alumni.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user role
    const updatedUser = await prisma.alumni.update({
      where: { id: parseInt(userId) },
      data: { role },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json({
      message: 'User role updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user details
 */
const updateUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData.password;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Check if user exists
    const user = await prisma.alumni.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    const updatedUser = await prisma.alumni.update({
      where: { id: parseInt(userId) },
      data: {
        ...updateData,
        ...(updateData.dateOfBirth && { dateOfBirth: new Date(updateData.dateOfBirth) }),
      },
    });

    res.status(200).json({
      message: 'User details updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Update user details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await prisma.alumni.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deletion of superadmin by non-superadmin
    if (user.role === 'SUPERADMIN' && req.user.role !== 'SUPERADMIN') {
      return res.status(403).json({ message: 'Cannot delete superadmin user' });
    }

    // Delete user
    await prisma.alumni.delete({
      where: { id: parseInt(userId) },
    });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get dashboard statistics for superadmin
 */
const getSuperadminStats = async (req, res) => {
  try {
    // Get total counts by role
    const totalUsers = await prisma.alumni.count({ where: { isVerified: true } });
    const superadminCount = await prisma.alumni.count({ where: { role: 'SUPERADMIN', isVerified: true } });
    const adminCount = await prisma.alumni.count({ where: { role: 'ADMIN', isVerified: true } });
    const alumniCount = await prisma.alumni.count({ where: { role: 'ALUMNI', isVerified: true } });

    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentRegistrations = await prisma.alumni.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        isVerified: true,
      },
    });

    // Get users by department
    const departmentStats = await prisma.alumni.groupBy({
      by: ['department'],
      where: { isVerified: true },
      _count: { department: true },
      orderBy: { _count: { department: 'desc' } },
      take: 5,
    });

    // Get users by graduation year
    const yearStats = await prisma.alumni.groupBy({
      by: ['passingYear'],
      where: { isVerified: true },
      _count: { passingYear: true },
      orderBy: { passingYear: 'desc' },
      take: 5,
    });

    res.status(200).json({
      stats: {
        totalUsers,
        superadminCount,
        adminCount,
        alumniCount,
        recentRegistrations,
        departmentStats: departmentStats.map(d => ({
          department: d.department,
          count: d._count.department,
        })),
        yearStats: yearStats.map(y => ({
          year: y.passingYear,
          count: y._count.passingYear,
        })),
      },
    });
  } catch (error) {
    console.error('Get superadmin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Toggle maintenance mode
 */
const toggleMaintenanceMode = async (req, res) => {
  try {
    const { isEnabled, message } = req.body;
    const { id } = req.user;

    // Get current maintenance mode
    let maintenanceMode = await prisma.maintenanceMode.findFirst({
      orderBy: { id: 'desc' },
    });

    if (!maintenanceMode) {
      // Create initial maintenance mode record
      maintenanceMode = await prisma.maintenanceMode.create({
        data: {
          isEnabled: false,
          message: 'System is under maintenance. Please check back later.',
        },
      });
    }

    // Update maintenance mode
    const updatedMaintenanceMode = await prisma.maintenanceMode.update({
      where: { id: maintenanceMode.id },
      data: {
        isEnabled,
        message: message || maintenanceMode.message,
        enabledBy: isEnabled ? id : null,
        enabledAt: isEnabled ? new Date() : maintenanceMode.enabledAt,
        disabledAt: !isEnabled ? new Date() : null,
      },
    });

    res.status(200).json({
      message: `Maintenance mode ${isEnabled ? 'enabled' : 'disabled'} successfully`,
      maintenanceMode: updatedMaintenanceMode,
    });
  } catch (error) {
    console.error('Toggle maintenance mode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get maintenance mode status
 */
const getMaintenanceMode = async (req, res) => {
  try {
    const maintenanceMode = await prisma.maintenanceMode.findFirst({
      orderBy: { id: 'desc' },
      include: {
        enabledByUser: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!maintenanceMode) {
      return res.status(200).json({
        isEnabled: false,
        message: 'System is under maintenance. Please check back later.',
      });
    }

    res.status(200).json(maintenanceMode);
  } catch (error) {
    console.error('Get maintenance mode error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  updateUserDetails,
  deleteUser,
  getSuperadminStats,
  toggleMaintenanceMode,
  getMaintenanceMode,
};