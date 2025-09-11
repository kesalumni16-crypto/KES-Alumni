const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get alumni locations for the globe view
 */
const getAlumniLocations = async (req, res) => {
  try {
    const { visibility = 'public' } = req.query;
    const userId = req.user?.id;

    // Build where clause based on visibility and user authentication
    let where = {
      isVerified: true,
      latitude: { not: null },
      longitude: { not: null },
    };

    // Apply visibility filters
    if (visibility === 'public') {
      where.locationVisibility = 'public';
    } else if (visibility === 'alumni_only' && userId) {
      where.locationVisibility = { in: ['public', 'alumni_only'] };
    } else if (visibility === 'all' && userId) {
      // For authenticated users, show public and alumni_only
      where.locationVisibility = { in: ['public', 'alumni_only'] };
    }

    const locations = await prisma.alumni.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        profilePhoto: true,
        currentCity: true,
        currentCountry: true,
        personalCity: true,
        personalCountry: true,
        latitude: true,
        longitude: true,
        department: true,
        passingYear: true,
        currentJobTitle: true,
        currentCompany: true,
        locationVisibility: true,
      },
    });

    // Transform data for the globe
    const transformedLocations = locations.map(alumni => ({
      id: alumni.id,
      name: alumni.fullName,
      profilePhoto: alumni.profilePhoto,
      city: alumni.currentCity || alumni.personalCity,
      country: alumni.currentCountry || alumni.personalCountry,
      latitude: alumni.latitude,
      longitude: alumni.longitude,
      department: alumni.department,
      graduationYear: alumni.passingYear,
      jobTitle: alumni.currentJobTitle,
      company: alumni.currentCompany,
      visibility: alumni.locationVisibility,
    }));

    res.status(200).json({
      locations: transformedLocations,
      total: transformedLocations.length,
    });
  } catch (error) {
    console.error('Get alumni locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update user's location information
 */
const updateUserLocation = async (req, res) => {
  try {
    const { id } = req.user;
    const { latitude, longitude, locationVisibility = 'public' } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Validate coordinates
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Validate visibility setting
    if (!['public', 'alumni_only', 'private'].includes(locationVisibility)) {
      return res.status(400).json({ message: 'Invalid visibility setting' });
    }

    const updatedAlumni = await prisma.alumni.update({
      where: { id },
      data: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        locationVisibility,
      },
      select: {
        id: true,
        latitude: true,
        longitude: true,
        locationVisibility: true,
      },
    });

    res.status(200).json({
      message: 'Location updated successfully',
      location: updatedAlumni,
    });
  } catch (error) {
    console.error('Update user location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get location statistics
 */
const getLocationStats = async (req, res) => {
  try {
    // Get total alumni with locations
    const totalWithLocations = await prisma.alumni.count({
      where: {
        isVerified: true,
        latitude: { not: null },
        longitude: { not: null },
        locationVisibility: { in: ['public', 'alumni_only'] },
      },
    });

    // Get country distribution
    const countryStats = await prisma.alumni.groupBy({
      by: ['currentCountry'],
      where: {
        isVerified: true,
        latitude: { not: null },
        longitude: { not: null },
        locationVisibility: { in: ['public', 'alumni_only'] },
        currentCountry: { not: null },
      },
      _count: { currentCountry: true },
      orderBy: { _count: { currentCountry: 'desc' } },
      take: 10,
    });

    // Get city distribution
    const cityStats = await prisma.alumni.groupBy({
      by: ['currentCity', 'currentCountry'],
      where: {
        isVerified: true,
        latitude: { not: null },
        longitude: { not: null },
        locationVisibility: { in: ['public', 'alumni_only'] },
        currentCity: { not: null },
      },
      _count: { currentCity: true },
      orderBy: { _count: { currentCity: 'desc' } },
      take: 10,
    });

    res.status(200).json({
      stats: {
        totalWithLocations,
        countries: countryStats.map(stat => ({
          country: stat.currentCountry,
          count: stat._count.currentCountry,
        })),
        cities: cityStats.map(stat => ({
          city: stat.currentCity,
          country: stat.currentCountry,
          count: stat._count.currentCity,
        })),
      },
    });
  } catch (error) {
    console.error('Get location stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAlumniLocations,
  updateUserLocation,
  getLocationStats,
};