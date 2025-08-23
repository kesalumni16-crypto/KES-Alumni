const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get alumni profile with dashboard data
 */
const getProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        currentName: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        address: true,
        linkedinProfile: true,
        socialMediaWebsite: true,
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
        yearOfJoining: true,
        passingYear: true,
        admissionInFirstYear: true,
        department: true,
        college: true,
        course: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    res.status(200).json({ alumni });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update alumni profile
 */
const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      fullName,
      currentName,
      dateOfBirth,
      phoneNumber,
      address,
      linkedinProfile,
      socialMediaWebsite,
      currentJobTitle,
      currentCompany,
      workExperience,
      skills,
      achievements,
      bio,
      interests,
      mentorshipAvailable,
      lookingForMentor,
      currentCity,
      currentCountry,
      yearOfJoining,
      passingYear,
      admissionInFirstYear,
      department,
      college,
      course,
    } = req.body;

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { id },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Update alumni record
    const updatedAlumni = await prisma.alumni.update({
      where: { id },
      data: {
        fullName: fullName || alumni.fullName,
        currentName: currentName || alumni.currentName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : alumni.dateOfBirth,
        phoneNumber: phoneNumber || alumni.phoneNumber,
        address: address || alumni.address,
        linkedinProfile: linkedinProfile || alumni.linkedinProfile,
        socialMediaWebsite: socialMediaWebsite || alumni.socialMediaWebsite,
        currentJobTitle: currentJobTitle || alumni.currentJobTitle,
        currentCompany: currentCompany || alumni.currentCompany,
        workExperience: workExperience || alumni.workExperience,
        skills: skills || alumni.skills,
        achievements: achievements || alumni.achievements,
        bio: bio || alumni.bio,
        interests: interests || alumni.interests,
        mentorshipAvailable: mentorshipAvailable !== undefined ? mentorshipAvailable : alumni.mentorshipAvailable,
        lookingForMentor: lookingForMentor !== undefined ? lookingForMentor : alumni.lookingForMentor,
        currentCity: currentCity || alumni.currentCity,
        currentCountry: currentCountry || alumni.currentCountry,
        yearOfJoining: yearOfJoining || alumni.yearOfJoining,
        passingYear: passingYear || alumni.passingYear,
        admissionInFirstYear: admissionInFirstYear !== undefined ? admissionInFirstYear : alumni.admissionInFirstYear,
        department: department || alumni.department,
        college: college || alumni.college,
        course: course || alumni.course,
      },
      select: {
        id: true,
        fullName: true,
        currentName: true,
        dateOfBirth: true,
        email: true,
        phoneNumber: true,
        address: true,
        linkedinProfile: true,
        socialMediaWebsite: true,
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
        yearOfJoining: true,
        passingYear: true,
        admissionInFirstYear: true,
        department: true,
        college: true,
        course: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      alumni: updatedAlumni,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
  try {
    const { id } = req.user;

    // Get total alumni count
    const totalAlumni = await prisma.alumni.count({
      where: { isVerified: true }
    });

    // Get alumni from same batch
    const currentAlumni = await prisma.alumni.findUnique({
      where: { id },
      select: { passingYear: true, department: true }
    });

    const sameBatchCount = await prisma.alumni.count({
      where: {
        passingYear: currentAlumni.passingYear,
        isVerified: true
      }
    });

    const sameDepartmentCount = await prisma.alumni.count({
      where: {
        department: currentAlumni.department,
        isVerified: true
      }
    });

    // Get mentors available
    const mentorsAvailable = await prisma.alumni.count({
      where: {
        mentorshipAvailable: true,
        isVerified: true
      }
    });

    res.status(200).json({
      stats: {
        totalAlumni,
        sameBatchCount,
        sameDepartmentCount,
        mentorsAvailable
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
};