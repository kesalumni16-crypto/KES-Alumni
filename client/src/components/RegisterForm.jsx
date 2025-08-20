import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState('EMAIL'); // 'EMAIL' or 'PHONE'
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
    otp: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleOtpTypeChange = (type) => {
    setOtpType(type);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phoneNumber || 
        !formData.yearOfJoining || !formData.passingYear || 
        !formData.department || !formData.college || !formData.course) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await sendOTP({
        ...formData,
        otpType,
      });
      setStep(2);
    } catch (error) {
      console.error('Send OTP error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.otp) {
      toast.error('Please enter the OTP');
      return;
    }
    
    try {
      setLoading(true);
      await register(formData);
      navigate('/welcome');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {step === 1 ? 'Register as Alumni' : 'Verify OTP'}
      </h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">Full Name*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email Address*</label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">Phone Number*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>
            
            {/* Year of Joining */}
            <div>
              <label htmlFor="yearOfJoining" className="block text-gray-700 text-sm font-medium mb-2">Year of Joining*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="yearOfJoining"
                  name="yearOfJoining"
                  value={formData.yearOfJoining}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2018"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>
            
            {/* Passing Year */}
            <div>
              <label htmlFor="passingYear" className="block text-gray-700 text-sm font-medium mb-2">Passing Year*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="passingYear"
                  name="passingYear"
                  value={formData.passingYear}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="2022"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  required
                />
              </div>
            </div>
            
            {/* Admission in First Year */}
            <div>
              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="admissionInFirstYear"
                  name="admissionInFirstYear"
                  checked={formData.admissionInFirstYear}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="admissionInFirstYear" className="ml-2 block text-gray-700 text-sm font-medium">
                  Admission in 1st year
                </label>
              </div>
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-gray-700 text-sm font-medium mb-2">Department*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBook className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Computer Science"
                  required
                />
              </div>
            </div>
            
            {/* College */}
            <div>
              <label htmlFor="college" className="block text-gray-700 text-sm font-medium mb-2">College*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBuilding className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="college"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="University of Example"
                  required
                />
              </div>
            </div>
            
            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-gray-700 text-sm font-medium mb-2">Course*</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaBook className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="course"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="B.Tech"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* OTP Type Selection */}
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Receive OTP via:</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="otpEmail"
                  name="otpType"
                  checked={otpType === 'EMAIL'}
                  onChange={() => handleOtpTypeChange('EMAIL')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="otpEmail" className="ml-2 block text-gray-700 text-sm">
                  Email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="otpPhone"
                  name="otpType"
                  checked={otpType === 'PHONE'}
                  onChange={() => handleOtpTypeChange('PHONE')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="otpPhone" className="ml-2 block text-gray-700 text-sm">
                  Phone
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="otp" className="block text-gray-700 text-sm font-medium mb-2">
              Enter OTP sent to your {otpType === 'EMAIL' ? 'email' : 'phone'}
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>
          </div>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;