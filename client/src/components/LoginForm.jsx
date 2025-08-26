import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey } from 'react-icons/fa';
import toast from 'react-hot-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { sendLoginOTP, verifyLoginOTP } = useAuth();
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    otp: '',
    alumniId: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!loginData.email) {
      toast.error('Please enter your email address');
      return;
    }
    
    try {
      setLoading(true);
      const response = await sendLoginOTP({ email: loginData.email });
      setLoginData({ ...loginData, alumniId: response.alumniId });
      setStep(2);
    } catch (error) {
      console.error('Send OTP error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    
    if (!loginData.otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    try {
      setLoading(true);
      await verifyLoginOTP({
        alumniId: loginData.alumniId,
        otp: loginData.otp,
      });
      navigate('/profile');
    } catch (error) {
      console.error('Verify OTP error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {step === 1 ? 'Login to Alumni Portal' : 'Verify OTP'}
      </h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-highlight-green text-black py-2 px-4 rounded-md hover:bg-highlight-green-dark focus:outline-none focus:ring-2 focus:ring-highlight-green focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit OTP to <strong>{loginData.email}</strong>
            </p>
            <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-2">
              Enter OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaKey className="text-gray-400" />
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={loginData.otp}
                onChange={handleChange}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent text-center text-lg tracking-widest"
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setLoginData({ email: loginData.email, otp: '', alumniId: null });
              }}
              className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 bg-highlight-green text-black py-2 px-4 rounded-md hover:bg-highlight-green-dark focus:outline-none focus:ring-2 focus:ring-highlight-green focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-primary-green hover:text-highlight-green font-medium focus:outline-none"
          >
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;