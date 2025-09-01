const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const { generateOTP, hashPassword, generateRandomPassword, generateToken } = require('../utils/auth');
const { sendOTPEmail, sendLoginOTPEmail, sendRegistrationSuccessEmail, sendRegistrationRejectionEmail } = require('../utils/email');

const prisma = new PrismaClient();

/**
 * Generate and send OTP for registration
 */
const sendOTP = async (req, res) => {
  try {
    const { email, phoneNumber, otpType } = req.body;

    if (!email && !phoneNumber) {
      return res.status(400).json({ message: 'Email or phone number is required' });
    }

    if (!otpType || (otpType !== 'EMAIL' && otpType !== 'PHONE')) {
      return res.status(400).json({ message: 'Valid OTP type (EMAIL or PHONE) is required' });
    }

    // Normalize empty strings to null to avoid unique constraint issues
    const normalizedEmail = email?.trim() || null;
    const normalizedPhoneNumber = phoneNumber?.trim() || null;

    // Build where conditions dynamically to avoid empty string issues
    const whereConditions = [];
    if (normalizedEmail) {
      whereConditions.push({ email: normalizedEmail });
    }
    if (normalizedPhoneNumber) {
      whereConditions.push({ phoneNumber: normalizedPhoneNumber });
    }

    if (whereConditions.length === 0) {
      return res.status(400).json({ message: 'Valid email or phone number is required' });
    }

    // Check if user with this email or phone already exists and is verified
    const existingAlumni = await prisma.alumni.findFirst({
      where: {
        OR: whereConditions,
        isVerified: true,
      },
    });

    if (existingAlumni) {
      return res.status(400).json({ 
        message: 'User with this email or phone number already exists and is verified' 
      });
    }

    // Find existing unverified alumni record
    let alumni = await prisma.alumni.findFirst({
      where: {
        OR: whereConditions,
        isVerified: false,
      },
    });

    if (!alumni) {
      // Create new unverified alumni record with minimal data
      try {
        alumni = await prisma.alumni.create({
          data: {
            fullName: req.body.fullName?.trim() || `${req.body.firstName?.trim() || ''} ${req.body.lastName?.trim() || ''}`.trim() || 'New User',
            firstName: req.body.firstName?.trim() || '',
            lastName: req.body.lastName?.trim() || '',
            email: normalizedEmail || '',
            phoneNumber: normalizedPhoneNumber || '',
            whatsappNumber: req.body.whatsappNumber?.trim() || '',
            secondaryPhoneNumber: req.body.secondaryPhoneNumber?.trim() || '',
            gender: req.body.gender?.trim() || '',
            countryCode: req.body.countryCode?.trim() || '+91',
            dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null,
            personalStreet: req.body.personalStreet?.trim() || '',
            personalCity: req.body.personalCity?.trim() || '',
            personalState: req.body.personalState?.trim() || '',
            personalPincode: req.body.personalPincode?.trim() || '',
            personalCountry: req.body.personalCountry?.trim() || 'India',
            companyStreet: req.body.companyStreet?.trim() || '',
            companyCity: req.body.companyCity?.trim() || '',
            companyState: req.body.companyState?.trim() || '',
            companyPincode: req.body.companyPincode?.trim() || '',
            companyCountry: req.body.companyCountry?.trim() || '',
            country: req.body.country?.trim() || 'India',
            linkedinProfile: req.body.linkedinProfile?.trim() || '',
            instagramProfile: req.body.instagramProfile?.trim() || '',
            twitterProfile: req.body.twitterProfile?.trim() || '',
            facebookProfile: req.body.facebookProfile?.trim() || '',
            githubProfile: req.body.githubProfile?.trim() || '',
            personalWebsite: req.body.personalWebsite?.trim() || '',
            yearOfJoining: parseInt(req.body.yearOfJoining) || null,
            passingYear: parseInt(req.body.passingYear) || null,
            admissionInFirstYear: req.body.admissionInFirstYear !== undefined ? req.body.admissionInFirstYear : true,
            department: req.body.department?.trim() || '',
            college: req.body.college?.trim() || '',
            course: req.body.course?.trim() || '',
            isVerified: false,
          },
        });
      } catch (createError) {
        // Handle unique constraint error
        if (createError.code === 'P2002') {
          // Try to find the existing record again
          alumni = await prisma.alumni.findFirst({
            where: {
              OR: whereConditions,
            },
          });
          
          if (!alumni) {
            return res.status(500).json({ 
              message: 'Unable to create or find user record. Please try again.' 
            });
          }
        } else {
          throw createError;
        }
      }
    } else {
      // Update existing unverified record with new data if provided
      const updateData = {};
      if (req.body.fullName) updateData.fullName = req.body.fullName.trim();
      if (req.body.firstName) updateData.firstName = req.body.firstName.trim();
      if (req.body.lastName) updateData.lastName = req.body.lastName.trim();
      if (req.body.personalStreet) updateData.personalStreet = req.body.personalStreet.trim();
      if (req.body.personalCity) updateData.personalCity = req.body.personalCity.trim();
      if (req.body.personalState) updateData.personalState = req.body.personalState.trim();
      if (req.body.personalPincode) updateData.personalPincode = req.body.personalPincode.trim();
      if (req.body.personalCountry) updateData.personalCountry = req.body.personalCountry.trim();
      if (req.body.department) updateData.department = req.body.department.trim();
      if (req.body.college) updateData.college = req.body.college.trim();
      if (req.body.course) updateData.course = req.body.course.trim();
      if (req.body.yearOfJoining) updateData.yearOfJoining = parseInt(req.body.yearOfJoining);
      if (req.body.passingYear) updateData.passingYear = parseInt(req.body.passingYear);
      if (req.body.admissionInFirstYear !== undefined) updateData.admissionInFirstYear = req.body.admissionInFirstYear;

      if (Object.keys(updateData).length > 0) {
        alumni = await prisma.alumni.update({
          where: { id: alumni.id },
          data: updateData,
        });
      }
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous unused OTPs for this alumni
    await prisma.oTP.updateMany({
      where: {
        alumniId: alumni.id,
        isUsed: false,
        type: otpType,
      },
      data: {
        isUsed: true,
      },
    });

    // Create new OTP record
    await prisma.oTP.create({
      data: {
        code: otp,
        type: otpType,
        expiresAt,
        alumniId: alumni.id,
      },
    });

    // Send OTP via email
    if (otpType === 'EMAIL' && normalizedEmail) {
      await sendOTPEmail(normalizedEmail, otp);
    }

    // For phone OTP, integrate with SMS service
    if (otpType === 'PHONE' && normalizedPhoneNumber) {
      console.log(`SMS OTP sent to ${normalizedPhoneNumber}: ${otp}`);
      // In a real app: await sendSMSOTP(normalizedPhoneNumber, otp);
    }

    res.status(200).json({
      message: `OTP sent to your ${otpType.toLowerCase()}`,
      alumniId: alumni.id,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    
    // Provide more specific error messages
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'User with this email or phone number already exists' 
      });
    }
    
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * Register a new alumni with OTP verification
 */
const register = async (req, res) => {
  try {
    const {
      alumniId,
      otp,
      firstName,
      lastName,
      fullName,
      email,
      phoneNumber,
      whatsappNumber,
      secondaryPhoneNumber,
      gender,
      countryCode,
      dateOfBirth,
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
      country,
      linkedinProfile,
      instagramProfile,
      twitterProfile,
      facebookProfile,
      githubProfile,
      personalWebsite,
      yearOfJoining,
      passingYear,
      admissionInFirstYear,
      department,
      college,
      course,
    } = req.body;

    // Validate required fields
    if (!alumniId || !otp) {
      return res.status(400).json({ message: 'Alumni ID and OTP are required' });
    }

    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!fullName?.trim() && (!firstName?.trim() || !lastName?.trim())) {
      return res.status(400).json({ message: 'Full name or first and last name are required' });
    }

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
      include: { otps: true },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    if (alumni.isVerified) {
      return res.status(400).json({ message: 'Alumni already verified' });
    }

    // Find the latest unused OTP
    const latestOtp = alumni.otps
      .filter(o => !o.isUsed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!latestOtp) {
      return res.status(400).json({ message: 'No valid OTP found. Please request a new OTP.' });
    }

    // Check if OTP is valid
    if (latestOtp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(latestOtp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
    });

    // Generate random password
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    // Prepare the final full name
    const finalFullName = fullName?.trim() || `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim();

    // Update alumni record with complete information
    const updatedAlumni = await prisma.alumni.update({
      where: { id: alumniId },
      data: {
        fullName: finalFullName,
        firstName: firstName?.trim() || alumni.firstName,
        lastName: lastName?.trim() || alumni.lastName,
        email: email.trim(),
        phoneNumber: phoneNumber?.trim() || alumni.phoneNumber || '',
        password: hashedPassword,
        whatsappNumber: whatsappNumber?.trim() || alumni.whatsappNumber || '',
        secondaryPhoneNumber: secondaryPhoneNumber?.trim() || alumni.secondaryPhoneNumber || '',
        gender: gender?.trim() || alumni.gender || '',
        countryCode: countryCode?.trim() || alumni.countryCode || '+91',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : alumni.dateOfBirth,
        personalStreet: personalStreet?.trim() || alumni.personalStreet || '',
        personalCity: personalCity?.trim() || alumni.personalCity || '',
        personalState: personalState?.trim() || alumni.personalState || '',
        personalPincode: personalPincode?.trim() || alumni.personalPincode || '',
        personalCountry: personalCountry?.trim() || alumni.personalCountry || 'India',
        companyStreet: companyStreet?.trim() || alumni.companyStreet || '',
        companyCity: companyCity?.trim() || alumni.companyCity || '',
        companyState: companyState?.trim() || alumni.companyState || '',
        companyPincode: companyPincode?.trim() || alumni.companyPincode || '',
        companyCountry: companyCountry?.trim() || alumni.companyCountry || '',
        country: country?.trim() || alumni.country || 'India',
        linkedinProfile: linkedinProfile?.trim() || alumni.linkedinProfile || '',
        instagramProfile: instagramProfile?.trim() || alumni.instagramProfile || '',
        twitterProfile: twitterProfile?.trim() || alumni.twitterProfile || '',
        facebookProfile: facebookProfile?.trim() || alumni.facebookProfile || '',
        githubProfile: githubProfile?.trim() || alumni.githubProfile || '',
        personalWebsite: personalWebsite?.trim() || alumni.personalWebsite || '',
        yearOfJoining: parseInt(yearOfJoining) || alumni.yearOfJoining || 0,
        passingYear: parseInt(passingYear) || alumni.passingYear || 0,
        admissionInFirstYear: admissionInFirstYear !== undefined ? admissionInFirstYear : alumni.admissionInFirstYear,
        department: department?.trim() || alumni.department || '',
        college: college?.trim() || alumni.college || '',
        course: course?.trim() || alumni.course || '',
        isVerified: true,
        updatedAt: new Date(),
      },
    });

    // Send success email with login credentials
    try {
      await sendRegistrationSuccessEmail(email.trim(), email.trim(), password);
    } catch (emailError) {
      console.error('Failed to send registration success email:', emailError);
      // Don't fail registration if email fails
    }

    // Generate JWT token
    const token = generateToken({
      id: updatedAlumni.id,
      email: updatedAlumni.email,
      role: updatedAlumni.role,
    });

    res.status(201).json({
      message: 'Registration successful! Check your email for login credentials.',
      token,
      user: {
        id: updatedAlumni.id,
        fullName: updatedAlumni.fullName,
        firstName: updatedAlumni.firstName,
        lastName: updatedAlumni.lastName,
        dateOfBirth: updatedAlumni.dateOfBirth,
        gender: updatedAlumni.gender,
        countryCode: updatedAlumni.countryCode,
        email: updatedAlumni.email,
        phoneNumber: updatedAlumni.phoneNumber,
        whatsappNumber: updatedAlumni.whatsappNumber,
        secondaryPhoneNumber: updatedAlumni.secondaryPhoneNumber,
        profilePhoto: updatedAlumni.profilePhoto,
        personalStreet: updatedAlumni.personalStreet,
        personalCity: updatedAlumni.personalCity,
        personalState: updatedAlumni.personalState,
        personalPincode: updatedAlumni.personalPincode,
        personalCountry: updatedAlumni.personalCountry,
        yearOfJoining: updatedAlumni.yearOfJoining,
        passingYear: updatedAlumni.passingYear,
        admissionInFirstYear: updatedAlumni.admissionInFirstYear,
        department: updatedAlumni.department,
        college: updatedAlumni.college,
        course: updatedAlumni.course,
        role: updatedAlumni.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'User with this email or phone number already exists' 
      });
    }
    
    res.status(500).json({ message: 'Registration failed. Please try again.' });
  }
};

/**
 * Send OTP for login
 */
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const normalizedEmail = email.trim();

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { email: normalizedEmail },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!alumni.isVerified) {
      return res.status(401).json({ message: 'Account not verified. Please complete registration first.' });
    }

    // Generate OTP for login
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Invalidate previous unused login OTPs
    await prisma.oTP.updateMany({
      where: {
        alumniId: alumni.id,
        isUsed: false,
        type: 'EMAIL',
      },
      data: {
        isUsed: true,
      },
    });

    // Create new OTP record
    await prisma.oTP.create({
      data: {
        code: otp,
        type: 'EMAIL',
        expiresAt,
        alumniId: alumni.id,
      },
    });

    // Send OTP via email
    try {
      await sendLoginOTPEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error('Failed to send login OTP email:', emailError);
      return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }

    res.status(200).json({
      message: 'OTP sent to your email',
      alumniId: alumni.id,
    });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};

/**
 * Verify OTP and login alumni
 */
const verifyLoginOTP = async (req, res) => {
  try {
    const { alumniId, otp } = req.body;

    if (!alumniId || !otp?.trim()) {
      return res.status(400).json({ message: 'Alumni ID and OTP are required' });
    }

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
      include: { 
        otps: {
          where: {
            type: 'EMAIL',
            isUsed: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!alumni.isVerified) {
      return res.status(401).json({ message: 'Account not verified. Please complete registration first.' });
    }

    // Get the latest unused OTP
    const latestOtp = alumni.otps[0];

    if (!latestOtp) {
      return res.status(400).json({ message: 'No valid OTP found. Please request a new OTP.' });
    }

    // Check if OTP is valid
    if (latestOtp.code !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(latestOtp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
    });

    // Update last login
    await prisma.alumni.update({
      where: { id: alumni.id },
      data: { 
        lastLogin: new Date(),
        updatedAt: new Date(),
      },
    });

    // Generate JWT token
    const token = generateToken({
      id: alumni.id,
      email: alumni.email,
      role: alumni.role,
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: alumni.id,
        fullName: alumni.fullName,
        firstName: alumni.firstName,
        lastName: alumni.lastName,
        email: alumni.email,
        phoneNumber: alumni.phoneNumber,
        profilePhoto: alumni.profilePhoto,
        role: alumni.role,
        department: alumni.department,
        college: alumni.college,
        course: alumni.course,
        yearOfJoining: alumni.yearOfJoining,
        passingYear: alumni.passingYear,
      },
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: 'Login failed. Please try again.' });
  }
};

module.exports = {
  sendOTP,
  register,
  sendLoginOTP,
  verifyLoginOTP,
};
