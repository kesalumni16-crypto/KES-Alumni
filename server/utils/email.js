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
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🎓</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">KES Alumni Portal</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Verification Required</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Welcome to Our Alumni Community!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Thank you for joining the KES Alumni Portal. To complete your registration, please use the verification code below:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #f59e0b;">
              <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong> for security reasons.
              </p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
              If you didn't request this verification code, please ignore this email. Your account security is important to us.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              Best regards,<br>
              <strong style="color: #dc2626;">KES Alumni Portal Team</strong><br>
              Kandivli Education Society
            </p>
          </div>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send OTP email for login
 * @param {string} email - Recipient email
 * @param {string} otp - One-time password
 * @returns {Promise} - Nodemailer response
 */
const sendLoginOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Alumni Portal - Login Verification Code',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px 20px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🔐</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">KES Alumni Portal</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Secure Login</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">Login Verification</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              We received a login request for your account. Please use the verification code below to complete your sign-in:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 2px solid #3b82f6;">
              <p style="color: #1e40af; margin: 0 0 10px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your Login Code</p>
              <div style="font-size: 36px; font-weight: 800; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', monospace;">${otp}</div>
            </div>
            
            <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #ef4444;">
              <p style="color: #991b1b; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>🔒 Security Notice:</strong> This code will expire in <strong>10 minutes</strong>. If you didn't request this login, please ignore this email and consider changing your password.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              Best regards,<br>
              <strong style="color: #dc2626;">KES Alumni Portal Team</strong><br>
              Kandivli Education Society
            </p>
          </div>
        </div>
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
  const loginLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Alumni Portal - Registration Successful',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <div style="background: white; margin: 20px; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 24px;">🎉</span>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to KES Alumni Portal!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 16px;">Registration Successful</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">🎊 Congratulations!</h2>
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
              Your registration has been successfully completed! You can now access all the features of our alumni network.
            </p>
            
            <!-- Login Credentials Box -->
            <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 2px solid #0ea5e9;">
              <h3 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">Your Login Credentials</h3>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Email:</strong> ${username}</p>
              </div>
              <div style="background: white; padding: 15px; border-radius: 8px; margin: 10px 0;">
                <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Temporary Password:</strong> <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: 'Courier New', monospace;">${password}</code></p>
              </div>
            </div>
            
            <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.5;">
                <strong>🔐 Security Recommendation:</strong> For your account security, we strongly recommend changing your password after your first login.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginLink}" style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);">
                🚀 Login to Your Account
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 25px 30px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0; text-align: center;">
              Welcome to the KES Alumni family!<br>
              <strong style="color: #dc2626;">KES Alumni Portal Team</strong><br>
              Kandivli Education Society
            </p>
          </div>
        </div>
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
  sendLoginOTPEmail,
  sendRegistrationSuccessEmail,
  sendRegistrationRejectionEmail,
};