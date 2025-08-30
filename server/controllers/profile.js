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
        whatsappNumber: true,
        secondaryPhoneNumber: true,
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
        firstName: true,
        lastName: true,
        address: true,
        street: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        countryCode: true,
        socialMediaWebsite: true,
        role: true,
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
      whatsappNumber,
      secondaryPhoneNumber,
      gender,
      profilePhoto,
      personalStreet,
      personalCity,
      personalState,
      personalPincode,
      personalCountry,
      companyStreet,
      companyCity,
      companyState,
      companyPincode,
      companyCountry,
      linkedinProfile,
      instagramProfile,
      twitterProfile,
      facebookProfile,
      githubProfile,
      personalWebsite,
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
      firstName,
      lastName,
      street,
      city,
      state,
      pincode,
      country,
      countryCode,
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
        whatsappNumber: whatsappNumber || alumni.whatsappNumber,
        secondaryPhoneNumber: secondaryPhoneNumber || alumni.secondaryPhoneNumber,
        gender: gender || alumni.gender,
        profilePhoto: profilePhoto || alumni.profilePhoto,
        personalStreet: personalStreet || alumni.personalStreet,
        personalCity: personalCity || alumni.personalCity,
        personalState: personalState || alumni.personalState,
        personalPincode: personalPincode || alumni.personalPincode,
        personalCountry: personalCountry || alumni.personalCountry,
        companyStreet: companyStreet || alumni.companyStreet,
        companyCity: companyCity || alumni.companyCity,
        companyState: companyState || alumni.companyState,
        companyPincode: companyPincode || alumni.companyPincode,
        companyCountry: companyCountry || alumni.companyCountry,
        linkedinProfile: linkedinProfile || alumni.linkedinProfile,
        instagramProfile: instagramProfile || alumni.instagramProfile,
        twitterProfile: twitterProfile || alumni.twitterProfile,
        facebookProfile: facebookProfile || alumni.facebookProfile,
        githubProfile: githubProfile || alumni.githubProfile,
        personalWebsite: personalWebsite || alumni.personalWebsite,
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
        firstName: firstName || alumni.firstName,
        lastName: lastName || alumni.lastName,
        street: street || alumni.street,
        city: city || alumni.city,
        state: state || alumni.state,
        pincode: pincode || alumni.pincode,
        country: country || alumni.country,
        countryCode: countryCode || alumni.countryCode,
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
        whatsappNumber: true,
        secondaryPhoneNumber: true,
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
        firstName: true,
        lastName: true,
        address: true,
        street: true,
        city: true,
        state: true,
        pincode: true,
        country: true,
        countryCode: true,
        socialMediaWebsite: true,
        role: true,
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