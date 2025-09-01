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

    // Validate required fields for alumni creation
    const { fullName, firstName, lastName, yearOfJoining, passingYear, department, college, course } = req.body;
    
    if (!fullName && (!firstName || !lastName)) {
      return res.status(400).json({ message: 'Full name or first and last name is required' });
    }
    
    if (!yearOfJoining || isNaN(parseInt(yearOfJoining)) || parseInt(yearOfJoining) <= 0) {
      return res.status(400).json({ message: 'Valid year of joining is required' });
    }
    
    if (!passingYear || isNaN(parseInt(passingYear)) || parseInt(passingYear) <= 0) {
      return res.status(400).json({ message: 'Valid passing year is required' });
    }
    
    if (!department || department.trim() === '') {
      return res.status(400).json({ message: 'Department is required' });
    }
    
    if (!college || college.trim() === '') {
      return res.status(400).json({ message: 'College is required' });
    }
    
    if (!course || course.trim() === '') {
      return res.status(400).json({ message: 'Course is required' });
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
          fullName: req.body.fullName || `${req.body.firstName || ''} ${req.body.lastName || ''}`.trim(),
          firstName: req.body.firstName || '',
          lastName: req.body.lastName || '',
          email: email || '',
          phoneNumber: phoneNumber || '',
          whatsappNumber: req.body.whatsappNumber || '',
          secondaryPhoneNumber: req.body.secondaryPhoneNumber || '',
          gender: req.body.gender || '',
          countryCode: req.body.countryCode || '+91',
          dateOfBirth: req.body.dateOfBirth ? new Date(req.body.dateOfBirth) : null,
          personalStreet: req.body.personalStreet || '',
          personalCity: req.body.personalCity || '',
          personalState: req.body.personalState || '',
          personalPincode: req.body.personalPincode || '',
          personalCountry: req.body.personalCountry || '',
          companyStreet: req.body.companyStreet || '',
          companyCity: req.body.companyCity || '',
          companyState: req.body.companyState || '',
          companyPincode: req.body.companyPincode || '',
          companyCountry: req.body.companyCountry || '',
          country: req.body.country || 'India',
          linkedinProfile: req.body.linkedinProfile || '',
          instagramProfile: req.body.instagramProfile || '',
          twitterProfile: req.body.twitterProfile || '',
          facebookProfile: req.body.facebookProfile || '',
          githubProfile: req.body.githubProfile || '',
          personalWebsite: req.body.personalWebsite || '',
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
        fullName: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
        firstName: firstName || alumni.firstName,
        lastName: lastName || alumni.lastName,
        email,
        phoneNumber,
        password: hashedPassword,
        whatsappNumber: whatsappNumber || alumni.whatsappNumber,
        secondaryPhoneNumber: secondaryPhoneNumber || alumni.secondaryPhoneNumber,
        gender: gender || alumni.gender,
        countryCode: countryCode || alumni.countryCode,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : alumni.dateOfBirth,
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
        country: country || alumni.country,
        linkedinProfile: linkedinProfile || alumni.linkedinProfile,
        instagramProfile: instagramProfile || alumni.instagramProfile,
        twitterProfile: twitterProfile || alumni.twitterProfile,
        facebookProfile: facebookProfile || alumni.facebookProfile,
        githubProfile: githubProfile || alumni.githubProfile,
        personalWebsite: personalWebsite || alumni.personalWebsite,
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