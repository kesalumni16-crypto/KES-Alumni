const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @returns {Promise} - Nodemailer response
 */
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Alumni Portal - Verification Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568; text-align: center;">Alumni Portal Verification</h2>
        <p style="color: #4a5568; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; font-size: 16px;">Your verification code for Alumni Portal registration is:</p>
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
          <h1 style="color: #4299e1; margin: 0; font-size: 32px;">${otp}</h1>
        </div>
        <p style="color: #4a5568; font-size: 16px;">This code will expire in 10 minutes.</p>
        <p style="color: #4a5568; font-size: 16px;">If you didn't request this code, please ignore this email.</p>
        <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">Regards,<br>Alumni Portal Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send registration success email
 * @param {string} email - Recipient email
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise} - Nodemailer response
 */
const sendRegistrationSuccessEmail = async (email, username, password) => {
  const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Alumni Portal - Registration Successful',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568; text-align: center;">Welcome to Alumni Portal!</h2>
        <p style="color: #4a5568; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; font-size: 16px;">Your registration has been successful. Here are your login details:</p>
        <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0; color: #4a5568;"><strong>Username:</strong> ${username}</p>
          <p style="margin: 5px 0; color: #4a5568;"><strong>Password:</strong> ${password}</p>
        </div>
        <p style="color: #4a5568; font-size: 16px;">For security reasons, we recommend changing your password after logging in.</p>
        <p style="color: #4a5568; font-size: 16px;">You can reset your password by clicking the link below:</p>
        <p style="text-align: center; margin: 25px 0;">
          <a href="${resetPasswordLink}" style="background-color: #4299e1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </p>
        <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">Regards,<br>Alumni Portal Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send registration rejection email
 * @param {string} email - Recipient email
 * @param {string} reason - Reason for rejection
 * @returns {Promise} - Nodemailer response
 */
const sendRegistrationRejectionEmail = async (email, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Alumni Portal - Registration Unsuccessful',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #4a5568; text-align: center;">Registration Unsuccessful</h2>
        <p style="color: #4a5568; font-size: 16px;">Hello,</p>
        <p style="color: #4a5568; font-size: 16px;">We regret to inform you that your registration for the Alumni Portal was unsuccessful.</p>
        <div style="background-color: #fff5f5; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f56565;">
          <p style="margin: 5px 0; color: #4a5568;"><strong>Reason:</strong> ${reason}</p>
        </div>
        <p style="color: #4a5568; font-size: 16px;">If you believe this is an error or need further assistance, please contact our support team.</p>
        <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">Regards,<br>Alumni Portal Team</p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendOTPEmail,
  sendRegistrationSuccessEmail,
  sendRegistrationRejectionEmail,
};