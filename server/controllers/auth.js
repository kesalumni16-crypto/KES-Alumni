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

    // Check if user with this email or phone already exists and is verified
    const existingAlumni = await prisma.alumni.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber },
        ],
        isVerified: true,
      },
    });

    if (existingAlumni) {
      return res.status(400).json({ message: 'User with this email or phone number already exists' });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Find or create alumni record (unverified)
    let alumni = await prisma.alumni.findFirst({
      where: {
        OR: [
          { email },
          { phoneNumber },
        ],
        isVerified: false,
      },
    });

    if (!alumni) {
      alumni = await prisma.alumni.create({
        data: {
          fullName: req.body.fullName || '',
          email: email || '',
          phoneNumber: phoneNumber || '',
          yearOfJoining: parseInt(req.body.yearOfJoining) || 0,
          passingYear: parseInt(req.body.passingYear) || 0,
          admissionInFirstYear: req.body.admissionInFirstYear || true,
          department: req.body.department || '',
          college: req.body.college || '',
          course: req.body.course || '',
          isVerified: false,
        },
      });
    }

    // Create OTP record
    await prisma.oTP.create({
      data: {
        code: otp,
        type: otpType,
        expiresAt,
        alumniId: alumni.id,
      },
    });

    // Send OTP via email
    if (otpType === 'EMAIL' && email) {
      await sendOTPEmail(email, otp);
    }

    // For phone OTP, in a real application you would integrate with an SMS service
    // This is just a placeholder for demonstration
    if (otpType === 'PHONE') {
      console.log(`SMS OTP sent to ${phoneNumber}: ${otp}`);
      // In a real app: await sendSMSOTP(phoneNumber, otp);
    }

    res.status(200).json({
      message: `OTP sent to your ${otpType.toLowerCase()}`,
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
      fullName,
      email,
      phoneNumber,
      yearOfJoining,
      passingYear,
      admissionInFirstYear,
      department,
      college,
      course,
    } = req.body;

    // Validate required fields
    if (!alumniId || !otp || !fullName || !email || !phoneNumber || !yearOfJoining || 
        !passingYear || admissionInFirstYear === undefined || !department || !college || !course) {
      return res.status(400).json({ message: 'All fields are required' });
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

    // Mark OTP as used
    await prisma.oTP.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
    });

    // Generate random password
    const password = generateRandomPassword();
    const hashedPassword = await hashPassword(password);

    // Update alumni record
    const updatedAlumni = await prisma.alumni.update({
      where: { id: alumniId },
      data: {
        fullName,
        email,
        phoneNumber,
        password: hashedPassword,
        yearOfJoining: parseInt(yearOfJoining) || 0,
        passingYear: parseInt(passingYear) || 0,
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
    });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: updatedAlumni.id,
        fullName: updatedAlumni.fullName,
        email: updatedAlumni.email,
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
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: alumni.id,
        fullName: alumni.fullName,
        email: alumni.email,
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