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
    <div className="card-professional w-full max-w-md animate-fade-in-up">
      <div className="card-content">
      <h2 className="text-2xl font-black text-deloitte-black mb-6 text-center">
        {step === 1 ? 'Login to Alumni Portal' : 'Verify OTP'}
      </h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP}>
          <div className="mb-6">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-deloitte-dark-gray">
                <FaEnvelope />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                className="form-input pl-10"
                placeholder="your.email@example.com"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <div className="mb-4">
            <p className="text-sm text-deloitte-dark-gray mb-4">
              We've sent a 6-digit OTP to <strong>{loginData.email}</strong>
            </p>
            <label htmlFor="otp" className="form-label">
              Enter OTP
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-deloitte-dark-gray">
                <FaKey />
              </div>
              <input
                type="text"
                id="otp"
                name="otp"
                value={loginData.otp}
                onChange={handleChange}
                className="form-input pl-10 text-center text-lg tracking-widest"
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
              className="btn-outline w-1/2"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn-primary w-1/2 ${loading ? 'disabled' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-deloitte-dark-gray">
          Don't have an account?{' '}
          <button 
            onClick={() => navigate('/register')} 
            className="text-deloitte-deep-green hover:text-deloitte-green font-medium focus:outline-none"
          >
            Register here
          </button>
        </p>
      </div>
      </div>
    </div>
  );
};

export default LoginForm;