import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaBook, FaCalendarAlt, FaMapMarkerAlt, FaLinkedin, FaGlobe } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState('EMAIL'); // 'EMAIL' or 'PHONE'
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    currentName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    address: '',
    linkedinProfile: '',
    socialMediaWebsite: '',
    
    // Educational Information
    institutionAttended: '',
    courseProgram: '',
    enrollmentFromYear: '',
    enrollmentToYear: '',
    graduationYear: '',
    
    // Legacy fields for backend compatibility
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
    otp: '',
  });

  const kesInstitutions = [
    'Jayshreeben V. Vasani Rainbow Kids (Preschool)',
    'Smt. Ramilaben M. Dattani English Primary',
    'SVPVV Gujarati Primary',
    'Sardar Vallabhbhai Patel Vividhlaxi Vidyalaya (Secondary & Technical)',
    'Shri T. P. Bhatia Junior College of Science',
    'B.K. Shroff College of Arts & M.H. Shroff College of Commerce',
    'KES\' Shri Jayantilal H. Patel Law College'
  ];

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

  const mapFormDataForBackend = (data) => {
    return {
      ...data,
      // Map new fields to existing backend fields
      yearOfJoining: parseInt(data.enrollmentFromYear) || 0,
      passingYear: parseInt(data.graduationYear) || 0,
      department: data.courseProgram || '',
      college: data.institutionAttended || '',
      course: data.courseProgram || '',
    };
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phoneNumber || 
        !formData.institutionAttended || !formData.courseProgram || 
        !formData.enrollmentFromYear || !formData.enrollmentToYear || 
        !formData.graduationYear) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }
    
    try {
      setLoading(true);
      const mappedData = mapFormDataForBackend(formData);
      await sendOTP({
        ...mappedData,
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
      const mappedData = mapFormDataForBackend(formData);
      await register(mappedData);
      navigate('/welcome');
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {step === 1 ? 'Register as KES Alumni' : 'Verify OTP'}
      </h2>
      
      {step === 1 ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          {/* Personal Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">1. Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">Full Name (as attended)*</label>
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
              
              {/* Current Name */}
              <div>
                <label htmlFor="currentName" className="block text-gray-700 text-sm font-medium mb-2">Current Name (if changed)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="currentName"
                    name="currentName"
                    value={formData.currentName}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000] focus:border-transparent hover:border-[#800000]"
                    placeholder="Current name if different"
                  />
                </div>
              </div>
              
              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-medium mb-2">Date of Birth*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">Mobile Phone Number (with country code)*</label>
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
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-gray-700 text-sm font-medium mb-2">Address (Street, City, State, PIN)*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Street Address, City, State, PIN Code"
                    required
                  />
                </div>
              </div>
              
              {/* LinkedIn Profile */}
              <div>
                <label htmlFor="linkedinProfile" className="block text-gray-700 text-sm font-medium mb-2">LinkedIn Profile (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLinkedin className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="linkedinProfile"
                    name="linkedinProfile"
                    value={formData.linkedinProfile}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              
              {/* Social Media / Website */}
              <div>
                <label htmlFor="socialMediaWebsite" className="block text-gray-700 text-sm font-medium mb-2">Other Social Media / Personal Website (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGlobe className="text-gray-400" />
                  </div>
                  <input
                    type="url"
                    id="socialMediaWebsite"
                    name="socialMediaWebsite"
                    value={formData.socialMediaWebsite}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Educational Information Section */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">2. Educational Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Institution Attended */}
              <div className="md:col-span-2">
                <label htmlFor="institutionAttended" className="block text-gray-700 text-sm font-medium mb-2">Select Institution Attended*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <select
                    id="institutionAttended"
                    name="institutionAttended"
                    value={formData.institutionAttended}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select your KES institution</option>
                    {kesInstitutions.map((institution, index) => (
                      <option key={index} value={institution}>{institution}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Course or Program */}
              <div className="md:col-span-2">
                <label htmlFor="courseProgram" className="block text-gray-700 text-sm font-medium mb-2">Course or Program*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBook className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="courseProgram"
                    name="courseProgram"
                    value={formData.courseProgram}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Science Stream – Junior College; B.Com; BA LLB; ECCEd"
                    required
                  />
                </div>
              </div>
              
              {/* Years of Enrollment */}
              <div>
                <label htmlFor="enrollmentFromYear" className="block text-gray-700 text-sm font-medium mb-2">Enrollment From Year*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="enrollmentFromYear"
                    name="enrollmentFromYear"
                    value={formData.enrollmentFromYear}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2018"
                    min="1936"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="enrollmentToYear" className="block text-gray-700 text-sm font-medium mb-2">Enrollment To Year*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="enrollmentToYear"
                    name="enrollmentToYear"
                    value={formData.enrollmentToYear}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2022"
                    min="1936"
                    max={new Date().getFullYear() + 10}
                    required
                  />
                </div>
              </div>
              
              {/* Year of Graduation */}
              <div>
                <label htmlFor="graduationYear" className="block text-gray-700 text-sm font-medium mb-2">Year of Graduation / Certification*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="graduationYear"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2022"
                    min="1936"
                    max={new Date().getFullYear() + 10}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* OTP Type Selection */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">3. Verification Method</h3>
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
                  className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300"
                />
                <label htmlFor="otpPhone" className="ml-2 block text-gray-700 text-sm">
                  Phone
                </label>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="pb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="acceptedTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-4 w-4 text-[#800000] focus:ring-[#800000] border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="acceptedTerms" className="ml-2 block text-gray-700 text-sm">
                I accept the{' '}
                <a href="#terms" className="text-[#800000] hover:text-[#a83232] underline">
                  Terms & Conditions
                </a>{' '}
                and{' '}
                <a href="#privacy" className="text-[#800000] hover:text-[#a83232] underline">
                  Privacy Policy
                </a>
                *
              </label>
            </div>
          </div>
          
          <div className="mt-6">
            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className={`w-full bg-[#800000] text-white py-3 px-4 rounded-md hover:bg-[#a83232] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 transition duration-150 ${loading || !acceptedTerms ? 'opacity-70 cursor-not-allowed' : ''}`}
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
              className={`w-1/2 bg-[#800000] text-white py-2 px-4 rounded-md hover:bg-[#a83232] focus:outline-none focus:ring-2 focus:ring-[#800000] focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
            className="text-[#800000] hover:text-[#a83232] font-medium focus:outline-none"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;