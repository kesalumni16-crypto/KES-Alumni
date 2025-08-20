const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Get alumni profile
 */
const getProfile = async (req, res) => {
  try {
    const { id } = req.user;

    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phoneNumber: true,
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
      phoneNumber,
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
        phoneNumber: phoneNumber || alumni.phoneNumber,
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
        email: true,
        phoneNumber: true,
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

module.exports = {
  getProfile,
  updateProfile,
};