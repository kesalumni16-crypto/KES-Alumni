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
      include: {
        education: {
          orderBy: { startYear: 'desc' }
        }
      },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Generate fullName for backward compatibility
    const fullName = [alumni.firstName, alumni.middleName, alumni.lastName]
      .filter(Boolean)
      .join(' ');
    
    alumni.fullName = fullName;

    // Remove sensitive fields
    delete alumni.password;
    
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
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      phoneNumber,
      whatsappNumber,
      secondaryPhoneNumber,
      gender,
      profilePhoto,
      personalAddressLine1,
      personalAddressLine2,
      personalCity,
      personalState,
      personalPostalCode,
      personalCountry,
      companyAddressLine1,
      companyAddressLine2,
      companyCity,
      companyState,
      companyPostalCode,
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

    // Generate username from first and last name
    let username = alumni.username;
    if (firstName || lastName) {
      const newFirstName = firstName || alumni.firstName;
      const newLastName = lastName || alumni.lastName;
      username = `${newFirstName}.${newLastName}`.toLowerCase()
        .replace(/[^a-z0-9.]/g, '')
        .replace(/\.+/g, '.');
      
      // Ensure username is unique
      const existingUser = await prisma.alumni.findFirst({
        where: { 
          username,
          id: { not: id }
        }
      });
      
      if (existingUser) {
        username = `${username}.${id}`;
      }
    }
    // Update alumni record
    const updatedAlumni = await prisma.alumni.update({
      where: { id },
      data: {
        firstName: firstName || alumni.firstName,
        middleName: middleName || alumni.middleName,
        lastName: lastName || alumni.lastName,
        username,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : alumni.dateOfBirth,
        countryCode: countryCode || alumni.countryCode,
        phoneNumber: phoneNumber || alumni.phoneNumber,
        whatsappNumber: whatsappNumber || alumni.whatsappNumber,
        secondaryPhoneNumber: secondaryPhoneNumber || alumni.secondaryPhoneNumber,
        gender: gender || alumni.gender,
        profilePhoto: profilePhoto || alumni.profilePhoto,
        personalAddressLine1: personalAddressLine1 || alumni.personalAddressLine1,
        personalAddressLine2: personalAddressLine2 || alumni.personalAddressLine2,
        personalCity: personalCity || alumni.personalCity,
        personalState: personalState || alumni.personalState,
        personalPostalCode: personalPostalCode || alumni.personalPostalCode,
        personalCountry: personalCountry || alumni.personalCountry,
        companyAddressLine1: companyAddressLine1 || alumni.companyAddressLine1,
        companyAddressLine2: companyAddressLine2 || alumni.companyAddressLine2,
        companyCity: companyCity || alumni.companyCity,
        companyState: companyState || alumni.companyState,
        companyPostalCode: companyPostalCode || alumni.companyPostalCode,
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
        yearOfJoining: yearOfJoining || alumni.yearOfJoining,
        passingYear: passingYear || alumni.passingYear,
        admissionInFirstYear: admissionInFirstYear !== undefined ? admissionInFirstYear : alumni.admissionInFirstYear,
        department: department || alumni.department,
        college: college || alumni.college,
        course: course || alumni.course,
      },
      include: {
        education: {
          orderBy: { startYear: 'desc' }
        }
      },
    });

    // Generate fullName for backward compatibility
    const fullName = [updatedAlumni.firstName, updatedAlumni.middleName, updatedAlumni.lastName]
      .filter(Boolean)
      .join(' ');
    
    updatedAlumni.fullName = fullName;

    // Remove sensitive fields
    delete updatedAlumni.password;
    
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

/**
 * Add education record
 */
const addEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      institutionName,
      degree,
      fieldOfStudy,
      startYear,
      endYear,
      isCurrentlyStudying,
      grade,
      description,
      activities,
    } = req.body;

    if (!institutionName || !degree || !fieldOfStudy || !startYear) {
      return res.status(400).json({ 
        message: 'Institution name, degree, field of study, and start year are required' 
      });
    }

    const education = await prisma.education.create({
      data: {
        alumniId: id,
        institutionName,
        degree,
        fieldOfStudy,
        startYear: parseInt(startYear),
        endYear: endYear ? parseInt(endYear) : null,
        isCurrentlyStudying: isCurrentlyStudying || false,
        grade: grade || null,
        description: description || null,
        activities: activities || null,
      },
    });

    res.status(201).json({
      message: 'Education record added successfully',
      education,
    });
  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update education record
 */
const updateEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const { educationId } = req.params;
    const updateData = req.body;

    // Verify the education record belongs to the user
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: parseInt(educationId),
        alumniId: id,
      },
    });

    if (!existingEducation) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    const updatedEducation = await prisma.education.update({
      where: { id: parseInt(educationId) },
      data: {
        ...updateData,
        startYear: updateData.startYear ? parseInt(updateData.startYear) : existingEducation.startYear,
        endYear: updateData.endYear ? parseInt(updateData.endYear) : updateData.endYear === null ? null : existingEducation.endYear,
      },
    });

    res.status(200).json({
      message: 'Education record updated successfully',
      education: updatedEducation,
    });
  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete education record
 */
const deleteEducation = async (req, res) => {
  try {
    const { id } = req.user;
    const { educationId } = req.params;

    // Verify the education record belongs to the user
    const existingEducation = await prisma.education.findFirst({
      where: {
        id: parseInt(educationId),
        alumniId: id,
      },
    });

    if (!existingEducation) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    await prisma.education.delete({
      where: { id: parseInt(educationId) },
    });

    res.status(200).json({
      message: 'Education record deleted successfully',
    });
  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboardStats,
  addEducation,
  updateEducation,
  deleteEducation,
};