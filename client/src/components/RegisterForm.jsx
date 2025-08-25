import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaLinkedin, FaGraduationCap, FaCheckCircle, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const institutions = [
  "Jayshreeben V. Vasani Rainbow Kids (Preschool)",
  "Smt. Ramilaben M. Dattani English Primary", 
  "SVPVV Gujarati Primary",
  "Sardar Vallabhbhai Patel Vividhlaxi Vidyalaya (Secondary & Technical)",
  "Shri T. P. Bhatia Junior College of Science",
  "B.K. Shroff College of Arts & M.H. Shroff College of Commerce",
  "KES' Shri Jayantilal H. Patel Law College",
];

const coursesByInstitution = {
  "Jayshreeben V. Vasani Rainbow Kids (Preschool)": [
    "Pre-Primary Education",
    "Early Childhood Care and Education (ECCE)",
    "Nursery Program",
    "Kindergarten Program",
  ],
  "Smt. Ramilaben M. Dattani English Primary": [
    "Primary Education (Std 1-7)",
    "English Medium Primary",
    "Cambridge Primary Program",
  ],
  "SVPVV Gujarati Primary": ["Primary Education (Std 1-7)", "Gujarati Medium Primary", "State Board Primary"],
  "Sardar Vallabhbhai Patel Vividhlaxi Vidyalaya (Secondary & Technical)": [
    "Secondary Education (Std 8-10)",
    "Science Stream",
    "Commerce Stream", 
    "Arts Stream",
    "Technical Education",
    "Vocational Courses",
  ],
  "Shri T. P. Bhatia Junior College of Science": [
    "Science Stream - PCM (Physics, Chemistry, Mathematics)",
    "Science Stream - PCB (Physics, Chemistry, Biology)",
    "Science Stream - PCMB (Physics, Chemistry, Mathematics, Biology)",
    "Computer Science",
    "Information Technology",
  ],
  "B.K. Shroff College of Arts & M.H. Shroff College of Commerce": [
    "Bachelor of Arts (BA)",
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Management Studies (BMS)",
    "Bachelor of Mass Media (BMM)",
    "Master of Arts (MA)",
    "Master of Commerce (M.Com)",
  ],
  "KES' Shri Jayantilal H. Patel Law College": [
    "Bachelor of Laws (LLB)",
    "Bachelor of Arts + Bachelor of Laws (BA LLB)",
    "Bachelor of Commerce + Bachelor of Laws (B.Com LLB)",
    "Master of Laws (LLM)",
  ],
};

const countryCodes = [
  { code: "+91", country: "India" },
  { code: "+1", country: "USA" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+971", country: "UAE" },
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();
  const [currentStep, setCurrentStep] = useState('initial');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [alumniId, setAlumniId] = useState(null);
  
  const [formData, setFormData] = useState({
    // Initial step
    email: '',
    
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phoneNumber: '',
    countryCode: '+91',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    linkedinProfile: '',
    socialMediaWebsite: '',
    
    // Academic Information
    institutionAttended: '',
    courseProgram: '',
    graduationYear: '',
    
    // Legacy fields for backend compatibility
    fullName: '',
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSocialLogin = (provider) => {
    toast.info(`${provider} login will be available soon!`);
  };

  const mapFormDataForBackend = (data) => {
    return {
      ...data,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      address: `${data.street}, ${data.city}, ${data.state}, ${data.pincode}`.replace(/^,\s*|,\s*$/g, ''),
      phoneNumber: `${data.countryCode}${data.phoneNumber}`,
      yearOfJoining: parseInt(data.graduationYear) - 4 || 0,
      passingYear: parseInt(data.graduationYear) || 0,
      department: data.courseProgram || '',
      college: data.institutionAttended || '',
      course: data.courseProgram || '',
    };
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      const mappedData = mapFormDataForBackend(formData);
      const response = await sendOTP({
        ...mappedData,
        otpType: 'EMAIL',
      });
      setAlumniId(response.alumniId);
      setCurrentStep('otp');
      setResendTimer(60);
      
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP');
      return;
    }

    try {
      setLoading(true);
      setFormData({ ...formData, otp: otpString });
      setCurrentStep('personal');
    } catch (error) {
      console.error('OTP verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      try {
        setLoading(true);
        const mappedData = mapFormDataForBackend(formData);
        const response = await sendOTP({
          ...mappedData,
          otpType: 'EMAIL',
        });
        setResendTimer(60);
        const timer = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        toast.success('OTP sent successfully');
      } catch (error) {
        console.error('Resend OTP error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePersonalInfoSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.dateOfBirth || 
        !formData.phoneNumber || !formData.street || !formData.city || 
        !formData.state || !formData.pincode || !formData.linkedinProfile) {
      toast.error('Please fill in all required fields');
      return;
    }

    setCurrentStep('academic');
  };

  const handleAcademicInfoSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.institutionAttended || !formData.courseProgram || !formData.graduationYear) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept the Terms & Conditions to continue');
      return;
    }

    try {
      setLoading(true);
      const mappedData = mapFormDataForBackend({
        ...formData,
        otp: otp.join(''),
      });
      
      await register({
        ...mappedData,
        alumniId: alumniId,
      });
      navigate('/profile');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Terms Modal Component
  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowTerms(false)} />
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
            <h2 className="text-2xl font-bold text-gray-800">KES Alumni Portal – Terms and Conditions</h2>
            <button
              onClick={() => setShowTerms(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close terms and conditions"
            >
              <FaTimes size={24} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>
            <div className="space-y-4 text-sm text-gray-700">
              <p>By accessing or using the KES Alumni Portal, you agree to these Terms & Conditions and our Privacy Policy.</p>
              <p>Membership is limited to alumni, current/former staff, and invited stakeholders of Kandivli Education Society/KES, subject to verification.</p>
              <p>You must provide accurate, current, and complete information and keep it updated.</p>
              <p>The Portal is intended for personal and non-commercial use only.</p>
              <p>You are responsible for all activities under your account and must keep credentials confidential.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Progress Indicator Component
  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <FaCheckCircle className="w-5 h-5 text-deloitte-green" />
          <span className="text-sm text-deloitte-green">Email Verified</span>
        </div>
        <div className={`w-8 h-px ${currentStep === 'personal' || currentStep === 'academic' ? 'bg-deloitte-green' : 'bg-gray-300'}`}></div>
        <div className="flex items-center gap-2">
          {currentStep === 'personal' || currentStep === 'academic' ? (
            <FaCheckCircle className="w-5 h-5 text-deloitte-green" />
          ) : (
            <div className={`w-5 h-5 rounded-full ${currentStep === 'personal' ? 'bg-deloitte-green' : 'bg-gray-300'} flex items-center justify-center`}>
              {currentStep === 'personal' && <div className="w-2 h-2 rounded-full bg-white"></div>}
            </div>
          )}
          <span className={`text-sm ${currentStep === 'personal' || currentStep === 'academic' ? 'text-deloitte-green' : currentStep === 'personal' ? 'text-deloitte-green font-medium' : 'text-gray-500'}`}>
            Personal Info
          </span>
        </div>
        <div className={`w-8 h-px ${currentStep === 'academic' ? 'bg-deloitte-green' : 'bg-gray-300'}`}></div>
        <div className="flex items-center gap-2">
          <div className={`w-5 h-5 rounded-full ${currentStep === 'academic' ? 'bg-deloitte-green' : 'bg-gray-300'} flex items-center justify-center`}>
            {currentStep === 'academic' && <div className="w-2 h-2 rounded-full bg-white"></div>}
          </div>
          <span className={`text-sm ${currentStep === 'academic' ? 'text-deloitte-green font-medium' : 'text-gray-500'}`}>
            Academic Info
          </span>
        </div>
      </div>
    </div>
  );

  // OTP Step
  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="p-6 text-center border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">One Time Password (OTP) Verification</h2>
            <p className="text-gray-600">Please enter the OTP sent to {formData.email}</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-deloitte-green hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive OTP? Check your Spam folder or{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`font-medium ${
                    resendTimer > 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-deloitte-green hover:underline'
                  }`}
                >
                  Resend OTP {resendTimer > 0 && `(${resendTimer}s)`}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Personal Info Step
  if (currentStep === 'personal') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="h-8 w-8 text-deloitte-green" />
              <span className="text-xl font-bold text-gray-900">KES Alumni Portal</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-700 hover:text-deloitte-green transition-colors">Home</a>
              <a href="/about" className="text-gray-700 hover:text-deloitte-green transition-colors">About</a>
              <a href="/login" className="text-gray-700 hover:text-deloitte-green transition-colors">Login</a>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ProgressIndicator />
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
              <p className="text-gray-600 text-lg">Please provide your personal details to complete your profile.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-8">
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Mobile Phone Number *</label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleChange}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.code} {item.country}
                          </option>
                        ))}
                      </select>
                      <input
                        id="phone"
                        name="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-base font-medium text-gray-700">Address *</label>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="street" className="block text-sm font-medium text-gray-700">Street Address</label>
                        <input
                          id="street"
                          name="street"
                          type="text"
                          value={formData.street}
                          onChange={handleChange}
                          placeholder="Enter your street address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            id="city"
                            name="city"
                            type="text"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Enter your city"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                          <input
                            id="state"
                            name="state"
                            type="text"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter your state"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">PIN Code</label>
                          <input
                            id="pincode"
                            name="pincode"
                            type="text"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="Enter PIN code"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                          <input
                            id="country"
                            name="country"
                            type="text"
                            value={formData.country}
                            onChange={handleChange}
                            placeholder="Enter your country"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn Profile *</label>
                      <input
                        id="linkedin"
                        name="linkedinProfile"
                        type="url"
                        value={formData.linkedinProfile}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="website" className="block text-sm font-medium text-gray-700">Website (Optional)</label>
                      <input
                        id="website"
                        name="socialMediaWebsite"
                        type="url"
                        value={formData.socialMediaWebsite}
                        onChange={handleChange}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-deloitte-green hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300"
                  >
                    Continue to Academic Information
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Academic Info Step
  if (currentStep === 'academic') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaGraduationCap className="h-8 w-8 text-deloitte-green" />
              <span className="text-xl font-bold text-gray-900">KES Alumni Portal</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-gray-700 hover:text-deloitte-green transition-colors">Home</a>
              <a href="/about" className="text-gray-700 hover:text-deloitte-green transition-colors">About</a>
              <a href="/login" className="text-gray-700 hover:text-deloitte-green transition-colors">Login</a>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <ProgressIndicator />
            
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Information</h1>
              <p className="text-gray-600 text-lg">Tell us about your educational background at KES Institutions.</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-8">
                <form onSubmit={handleAcademicInfoSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Select Institution Attended *</label>
                    <select
                      id="institution"
                      name="institutionAttended"
                      value={formData.institutionAttended}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      required
                    >
                      <option value="">Choose your institution</option>
                      {institutions.map((institution) => (
                        <option key={institution} value={institution}>
                          {institution}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course or Program *</label>
                    <select
                      id="course"
                      name="courseProgram"
                      value={formData.courseProgram}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      disabled={!formData.institutionAttended}
                      required
                    >
                      <option value="">
                        {formData.institutionAttended ? "Choose your course" : "Select institution first"}
                      </option>
                      {formData.institutionAttended &&
                        coursesByInstitution[formData.institutionAttended]?.map((course) => (
                          <option key={course} value={course}>
                            {course}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="graduation" className="block text-sm font-medium text-gray-700">Year of Graduation *</label>
                    <input
                      id="graduation"
                      name="graduationYear"
                      type="number"
                      min="1950"
                      max="2024"
                      value={formData.graduationYear}
                      onChange={handleChange}
                      placeholder="2022"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="pb-6">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="acceptedTerms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="h-4 w-4 text-deloitte-green focus:ring-deloitte-green border-gray-300 rounded mt-1"
                        required
                      />
                      <label htmlFor="acceptedTerms" className="ml-2 block text-gray-700 text-sm">
                        I accept the{' '}
                        <button
                          type="button"
                          onClick={() => setShowTerms(true)}
                          className="text-deloitte-green hover:text-green-800 underline focus:outline-none"
                        >
                          Terms & Conditions
                        </button>{' '}
                        and{' '}
                        <a href="#privacy" className="text-deloitte-green hover:text-green-800 underline">
                          Privacy Policy
                        </a>
                        *
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep('personal')}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition duration-300"
                    >
                      Back to Personal Info
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !acceptedTerms}
                      className="flex-1 bg-deloitte-green hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 disabled:opacity-50"
                    >
                      {loading ? 'Completing...' : 'Complete Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Initial Step
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaGraduationCap className="h-8 w-8 text-deloitte-green" />
            <span className="text-xl font-bold text-gray-900">KES Alumni Portal</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-deloitte-green transition-colors">Home</a>
            <a href="/about" className="text-gray-700 hover:text-deloitte-green transition-colors">About</a>
            <a href="/login" className="text-gray-700 hover:text-deloitte-green transition-colors">Login</a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Alumni Registration</h1>
            <p className="text-gray-600 text-lg">
              Create your profile to connect with fellow alumni and stay updated with KES Institutions.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-8">
              <div className="space-y-4 mb-6">
                <button
                  onClick={() => handleSocialLogin("LinkedIn")}
                  className="w-full border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center"
                >
                  <FaLinkedin className="w-5 h-5 mr-2" />
                  Sign up with LinkedIn
                </button>

                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 px-4 rounded-md font-medium transition duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-deloitte-green focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-deloitte-green hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition duration-300 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Continue with Email'}
                </button>
              </form>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already a member?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-deloitte-green hover:underline font-medium focus:outline-none"
              >
                Click here to Login
              </button>
            </p>
          </div>
        </div>
      </main>
      
      {showTerms && <TermsModal />}
    </div>
  );
};

export default RegisterForm;