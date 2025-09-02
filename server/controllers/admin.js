const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get all users for admin dashboard with enhanced filtering
 */
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      search = '', 
      role = '', 
      department = '',
      passingYear = '',
      mentorshipAvailable = '',
      currentCity = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const skip = (page - 1) * limit;

    // Build where clause for filtering
    const where = {
      isVerified: true,
      ...(search && {
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phoneNumber: { contains: search } },
          { currentCompany: { contains: search, mode: 'insensitive' } },
          { currentJobTitle: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(role && { role }),
      ...(department && { department: { contains: department, mode: 'insensitive' } }),
      ...(passingYear && { passingYear: parseInt(passingYear) }),
      ...(mentorshipAvailable && { mentorshipAvailable: mentorshipAvailable === 'true' }),
      ...(currentCity && { currentCity: { contains: currentCity, mode: 'insensitive' } }),
    };

    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;

    // Get users with pagination
    const users = await prisma.alumni.findMany({
      where,
      skip: parseInt(skip),
      take: parseInt(limit),
      orderBy,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        department: true,
        college: true,
        course: true,
        passingYear: true,
        yearOfJoining: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
        profilePhoto: true,
        currentJobTitle: true,
        currentCompany: true,
        currentCity: true,
        currentCountry: true,
        mentorshipAvailable: true,
        lookingForMentor: true,
        bio: true,
        skills: true,
        linkedinProfile: true,
        personalWebsite: true,
        githubProfile: true,
        whatsappNumber: true,
        dateOfBirth: true,
        gender: true,
        workExperience: true,
        achievements: true,
        interests: true,
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
 * Get user details by ID for admin
 */
const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.alumni.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        fullName: true,
        currentName: true,
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        whatsappNumber: true,
        secondaryPhoneNumber: true,
        dateOfBirth: true,
        gender: true,
        profilePhoto: true,
        personalStreet: true,
        personalCity: true,
        personalState: true,
        personalPincode: true,
        personalCountry: true,
        companyStreet: true,
        companyCity: true,
        companyState: true,
        companyPincode: true,
        companyCountry: true,
        linkedinProfile: true,
        instagramProfile: true,
        twitterProfile: true,
        facebookProfile: true,
        githubProfile: true,
        personalWebsite: true,
        currentJobTitle: true,
        currentCompany: true,
        workExperience: true,
        skills: true,
        achievements: true,
        bio: true,
        interests: true,
        mentorshipAvailable: true,
        lookingForMentor: true,
        currentCity: true,
        currentCountry: true,
        role: true,
        yearOfJoining: true,
        passingYear: true,
        admissionInFirstYear: true,
        department: true,
        college: true,
        course: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
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
 * Get dashboard statistics for admin
 */
const getAdminStats = async (req, res) => {
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

    // Get mentorship statistics
    const mentorsCount = await prisma.alumni.count({
      where: { mentorshipAvailable: true, isVerified: true },
    });

    const seekingMentorsCount = await prisma.alumni.count({
      where: { lookingForMentor: true, isVerified: true },
    });

    // Get users by department (top 10)
    const departmentStats = await prisma.alumni.groupBy({
      by: ['department'],
      where: { isVerified: true },
      _count: { department: true },
      orderBy: { _count: { department: 'desc' } },
      take: 10,
    });

    // Get users by graduation year (last 10 years)
    const currentYear = new Date().getFullYear();
    const yearStats = await prisma.alumni.groupBy({
      by: ['passingYear'],
      where: { 
        isVerified: true,
        passingYear: { gte: currentYear - 10 }
      },
      _count: { passingYear: true },
      orderBy: { passingYear: 'desc' },
      take: 10,
    });

    // Get geographic distribution
    const locationStats = await prisma.alumni.groupBy({
      by: ['currentCity', 'currentCountry'],
      where: { 
        isVerified: true,
        currentCity: { not: null },
        currentCountry: { not: null }
      },
      _count: { currentCity: true },
      orderBy: { _count: { currentCity: 'desc' } },
      take: 10,
    });

    // Get countries count
    const countriesCount = await prisma.alumni.groupBy({
      by: ['currentCountry'],
      where: { 
        isVerified: true,
        currentCountry: { not: null }
      },
      _count: { currentCountry: true },
    });

    res.status(200).json({
      stats: {
        totalUsers,
        superadminCount,
        adminCount,
        alumniCount,
        recentRegistrations,
        mentorsCount,
        seekingMentorsCount,
        countriesCount: countriesCount.length,
        departmentStats: departmentStats.map(d => ({
          department: d.department,
          count: d._count.department,
        })),
        yearStats: yearStats.map(y => ({
          year: y.passingYear,
          count: y._count.passingYear,
        })),
        locationStats: locationStats.map(l => ({
          city: l.currentCity,
          country: l.currentCountry,
          count: l._count.currentCity,
        })),
      },
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Export users data in various formats
 */
const exportUsers = async (req, res) => {
  try {
    const { 
      format = 'csv',
      search = '',
      role = '',
      department = '',
      passingYear = '',
      mentorshipAvailable = '',
      currentCity = ''
    } = req.query;

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
      ...(department && { department: { contains: department, mode: 'insensitive' } }),
      ...(passingYear && { passingYear: parseInt(passingYear) }),
      ...(mentorshipAvailable && { mentorshipAvailable: mentorshipAvailable === 'true' }),
      ...(currentCity && { currentCity: { contains: currentCity, mode: 'insensitive' } }),
    };

    const users = await prisma.alumni.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
        role: true,
        department: true,
        college: true,
        course: true,
        passingYear: true,
        yearOfJoining: true,
        currentJobTitle: true,
        currentCompany: true,
        currentCity: true,
        currentCountry: true,
        mentorshipAvailable: true,
        lookingForMentor: true,
        linkedinProfile: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = [
        'ID', 'Full Name', 'Email', 'Phone', 'Role', 'Department', 'College', 
        'Course', 'Joining Year', 'Graduation Year', 'Job Title', 'Company',
        'Current City', 'Current Country', 'Mentor Available', 'Seeking Mentor',
        'LinkedIn', 'Registration Date'
      ].join(',');

      const csvRows = users.map(user => [
        user.id,
        `"${user.fullName}"`,
        user.email,
        user.phoneNumber,
        user.role,
        `"${user.department}"`,
        `"${user.college}"`,
        `"${user.course}"`,
        user.yearOfJoining,
        user.passingYear,
        `"${user.currentJobTitle || ''}"`,
        `"${user.currentCompany || ''}"`,
        `"${user.currentCity || ''}"`,
        `"${user.currentCountry || ''}"`,
        user.mentorshipAvailable ? 'Yes' : 'No',
        user.lookingForMentor ? 'Yes' : 'No',
        `"${user.linkedinProfile || ''}"`,
        new Date(user.createdAt).toLocaleDateString()
      ].join(','));

      const csvContent = [csvHeader, ...csvRows].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=alumni_data.csv');
      res.send(csvContent);
    } else if (format === 'json') {
      // Generate JSON
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename=alumni_data.json');
      res.json({
        exportDate: new Date().toISOString(),
        totalRecords: users.length,
        data: users
      });
    } else {
      res.status(400).json({ message: 'Unsupported export format' });
    }
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getAdminStats,
  exportUsers,
};