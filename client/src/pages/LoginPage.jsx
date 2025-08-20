import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  });
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const RESEND_SECONDS = 30;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const startResendCooldown = () => {
    setResendCooldown(RESEND_SECONDS);
    const interval = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }
    try {
      setLoading(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      startResendCooldown();
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.otp) {
      toast.error('Please enter email and OTP');
      return;
    }
    try {
      setLoading(true);
      await verifyOtp({ email: formData.email, otp: formData.otp });
      toast.success('Logged in successfully');
      navigate('/welcome');
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error?.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Alumni Portal</h2>

      <form onSubmit={otpSent ? handleVerify : handleSendOtp}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="your.email@example.com"
              required
              disabled={otpSent || loading}
            />
          </div>
        </div>

        {otpSent && (
          <div className="mb-6">
            <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-2">Enter OTP</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={formData.otp}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="6-digit code"
                required
              />
            </div>
          </div>
        )}

        {!otpSent ? (
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading || resendCooldown > 0}
              className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-150 disabled:opacity-60"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </div>
        )}
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
