import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey, FaArrowLeft, FaUser, FaLock, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { sendLoginOTP, verifyLoginOTP } = useAuth();
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    alumniId: null,
  });

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Clean the email input to remove any unwanted characters
    const cleanValue = name === 'email' ? value.replace(/[^\w@.-]/g, '').toLowerCase().trim() : value;
    setLoginData({ ...loginData, [name]: cleanValue });
  };

  // Auto-append @gmail.com when user leaves email field or presses Tab/Enter
  const handleEmailBlur = (e) => {
    const email = e.target.value.trim();
    
    // Only auto-append if:
    // 1. Email field has content
    // 2. Doesn't already contain "@"
    // 3. Is not empty after trimming
    if (email && !email.includes('@') && email.length > 0) {
      const updatedEmail = email + '@gmail.com';
      setLoginData(prev => ({ ...prev, email: updatedEmail }));
    }
  };

  // Handle Tab and Enter key for email field
  const handleEmailKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      const email = e.target.value.trim();
      
      if (email && !email.includes('@') && email.length > 0) {
        const updatedEmail = email + '@gmail.com';
        setLoginData(prev => ({ ...prev, email: updatedEmail }));
      }
    }
  };

  // Enhanced OTP handler with better UX
  const handleOtpChange = (index, value) => {
    // Allow only digits
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...loginData.otp];
    newOtp[index] = value;
    setLoginData(prev => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !loginData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste in OTP inputs
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const digits = paste.replace(/\D/g, '').slice(0, 6).split('');
    
    if (digits.length > 0) {
      const newOtp = [...loginData.otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setLoginData(prev => ({ ...prev, otp: newOtp }));
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  const otpString = loginData.otp.join('');

  // Email validation
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    if (!loginData.email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!isValidEmail(loginData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const response = await sendLoginOTP({ email: loginData.email });
      setLoginData(prev => ({ ...prev, alumniId: response.alumniId }));
      setStep(2);
      setResendCooldown(60);
      // Removed duplicate success message - let AuthContext handle it
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await verifyLoginOTP({
        alumniId: loginData.alumniId,
        otp: otpString,
      });
      // Removed duplicate success message and navigation - let AuthContext handle it
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setLoginData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      setLoading(true);
      await sendLoginOTP({ email: loginData.email });
      setResendCooldown(60);
      // Removed duplicate success message - let AuthContext handle it
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setLoginData({ 
      email: loginData.email, 
      otp: ['', '', '', '', '', ''], 
      alumniId: null 
    });
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-100 to-transparent rounded-full -ml-12 -mb-12"></div>
        
        {/* Header with Icon */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
            <FaShieldAlt className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-custom mb-2">
            {step === 1 ? 'Welcome Back' : 'Verify Identity'}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 1 
              ? 'Sign in to your Alumni Portal account'
              : 'Enter the verification code sent to your email'
            }
          </p>
        </div>

        {step === 1 ? (
          // Email Step
          <form onSubmit={handleSendOTP} noValidate className="relative z-10">
            <div className="mb-6">
              <label htmlFor="email" className="block text-custom text-sm font-semibold mb-3">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-lg group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  onKeyDown={handleEmailKeyDown}
                  className="pl-12 w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 text-base bg-secondary focus:bg-white"
                  placeholder="Enter username or full email"
                  autoComplete="email"
                  required
                  aria-describedby="email-error"
                />
              </div>
              {loginData.email && !loginData.email.includes('@') && (
                <div className="mt-2 text-xs text-blue-600 flex items-center">
                  <span className="mr-1">💡</span>
                  Press Tab or Enter to auto-add @gmail.com
                </div>
              )}
              {loginData.email && loginData.email.includes('@') && !isValidEmail(loginData.email) && (
                <div id="email-error" className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                  <span className="mr-1">⚠️</span>
                  Please enter a valid email address
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !loginData.email || !isValidEmail(loginData.email)}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaKey className="mr-2" />
                  Send Login Code
                </span>
              )}
            </button>
          </form>
        ) : (
          // OTP Verification Step
          <form onSubmit={handleVerifyOTP} noValidate className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center text-primary hover:opacity-80 focus:outline-none focus:underline text-sm font-medium"
                  aria-label="Go back to email input"
                >
                  <FaArrowLeft className="mr-2" />
                  Change Email
                </button>
                <span className="text-sm text-custom font-medium truncate ml-2">
                  {loginData.email}
                </span>
              </div>

              <label className="block text-custom text-sm font-semibold mb-3">
                Enter Verification Code
              </label>
              
              <div className="flex justify-center gap-3 mb-6">
                {loginData.otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => otpRefs.current[idx] = el}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                    aria-label={`Digit ${idx + 1} of verification code`}
                  />
                ))}
              </div>

              {/* Resend OTP */}
              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm text-primary hover:opacity-80 focus:outline-none focus:underline disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpString.length !== 6}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaLock className="mr-2" />
                  Verify & Sign In
                </span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link 
              to="/register"
              className="text-primary hover:opacity-80 font-semibold focus:outline-none focus:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;