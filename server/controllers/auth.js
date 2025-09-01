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
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user with this email already exists and is verified
    const existingAlumni = await prisma.alumni.findFirst({
      where: {
        email,
        isVerified: true,
      },
    });

    if (existingAlumni) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create temporary alumni record (unverified) with minimal data
    let alumni = await prisma.alumni.findFirst({
      where: {
        email,
        isVerified: false,
      },
    });

    if (!alumni) {
      // Create minimal alumni record for OTP verification
      alumni = await prisma.alumni.create({
        data: {
          fullName: 'Pending Verification',
          email,
          phoneNumber: 'pending',
          yearOfJoining: 0,
          passingYear: 0,
          department: 'pending',
          college: 'pending',
          course: 'pending',
          isVerified: false,
        },
      });
    }

    // Create OTP record
    await prisma.oTP.create({
      data: {
        code: otp,
        type: 'EMAIL',
        expiresAt,
        alumniId: alumni.id,
      },
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: 'OTP sent to your email',
      alumniId: alumni.id,
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error' });
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

    if (!fullName || (!firstName && !lastName)) {
      return res.status(400).json({ message: 'Full name or first and last name is required' });
    }

    if (!email || !phoneNumber) {
      return res.status(400).json({ message: 'Email and phone number are required' });
    }

    if (!yearOfJoining || !passingYear || !department || !college || !course) {
      return res.status(400).json({ message: 'Academic information (year of joining, passing year, department, college, course) is required' });
    }

    // Validate year fields
    if (isNaN(parseInt(yearOfJoining)) || isNaN(parseInt(passingYear))) {
      return res.status(400).json({ message: 'Year of joining and passing year must be valid numbers' });
    }

    if (parseInt(passingYear) < parseInt(yearOfJoining)) {
      return res.status(400).json({ message: 'Passing year cannot be earlier than year of joining' });
    }

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
      include: { otps: true },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'Alumni not found' });
    }

    // Find the latest OTP
    const latestOtp = alumni.otps
      .filter(o => !o.isUsed)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!latestOtp) {
      return res.status(400).json({ message: 'No valid OTP found' });
    }

    // Check if OTP is valid
    if (latestOtp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(latestOtp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Check if email or phone number is already taken by another verified user
    const existingUser = await prisma.alumni.findFirst({
      where: {
        OR: [
          { email, id: { not: alumniId } },
          { phoneNumber, id: { not: alumniId } },
        ],
        isVerified: true,
      },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already registered' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
    });

    // Generate random password
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    // Update alumni record with complete registration data
    const updatedAlumni = await prisma.alumni.update({
      where: { id: alumniId },
      data: {
        fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
        firstName: firstName || '',
        lastName: lastName || '',
        email,
        phoneNumber,
        password: hashedPassword,
        whatsappNumber: whatsappNumber || '',
        secondaryPhoneNumber: secondaryPhoneNumber || '',
        gender: gender || '',
        countryCode: countryCode || '+91',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        personalStreet: personalStreet || '',
        personalCity: personalCity || '',
        personalState: personalState || '',
        personalPincode: personalPincode || '',
        personalCountry: personalCountry || '',
        companyStreet: companyStreet || '',
        companyCity: companyCity || '',
        companyState: companyState || '',
        companyPincode: companyPincode || '',
        companyCountry: companyCountry || '',
        country: country || 'India',
        linkedinProfile: linkedinProfile || '',
        instagramProfile: instagramProfile || '',
        twitterProfile: twitterProfile || '',
        facebookProfile: facebookProfile || '',
        githubProfile: githubProfile || '',
        personalWebsite: personalWebsite || '',
        yearOfJoining: parseInt(yearOfJoining),
        passingYear: parseInt(passingYear),
        admissionInFirstYear,
        department,
        college,
        course,
        isVerified: true,
      },
    });

    // Send success email with login credentials
    await sendRegistrationSuccessEmail(email, email, password);

    // Generate JWT token
    const token = generateToken({
      id: updatedAlumni.id,
      email: updatedAlumni.email,
      role: updatedAlumni.role,
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: updatedAlumni.id,
        fullName: updatedAlumni.fullName,
        email: updatedAlumni.email,
        phoneNumber: updatedAlumni.phoneNumber,
        profilePhoto: updatedAlumni.profilePhoto,
        yearOfJoining: updatedAlumni.yearOfJoining,
        passingYear: updatedAlumni.passingYear,
        department: updatedAlumni.department,
        college: updatedAlumni.college,
        course: updatedAlumni.course,
        role: updatedAlumni.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Send OTP for login
 */
const sendLoginOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { email },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!alumni.isVerified) {
      return res.status(401).json({ message: 'Account not verified' });
    }

    // Generate OTP for login
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create OTP record
    await prisma.oTP.create({
      data: {
        code: otp,
        type: 'EMAIL',
        expiresAt,
        alumniId: alumni.id,
      },
    });

    // Send OTP via email
    await sendLoginOTPEmail(email, otp);

    res.status(200).json({
      message: 'OTP sent to your email',
      alumniId: alumni.id,
    });
  } catch (error) {
    console.error('Send login OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Verify OTP and login alumni
 */
const verifyLoginOTP = async (req, res) => {
  try {
    const { alumniId, otp } = req.body;

    if (!alumniId || !otp) {
      return res.status(400).json({ message: 'Alumni ID and OTP are required' });
    }

    // Find the alumni
    const alumni = await prisma.alumni.findUnique({
      where: { id: alumniId },
      include: { otps: true },
    });

    if (!alumni) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the latest unused OTP
    const latestOtp = alumni.otps
      .filter(o => !o.isUsed && o.type === 'EMAIL')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

    if (!latestOtp) {
      return res.status(400).json({ message: 'No valid OTP found' });
    }

    // Check if OTP is valid
    if (latestOtp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if OTP is expired
    if (new Date() > new Date(latestOtp.expiresAt)) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
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
        email: alumni.email,
        role: alumni.role,
      },
    });
  } catch (error) {
    console.error('Verify login OTP error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  sendOTP,
  register,
  sendLoginOTP,
  verifyLoginOTP,
};