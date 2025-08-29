import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaLinkedin, FaGraduationCap, FaCheckCircle, FaTimes,
  FaInstagram, FaTwitter, FaFacebook, FaGithub, FaGlobe,
  FaWhatsapp, FaPhone, FaUser, FaEnvelope, FaMapMarkerAlt,
  FaBuilding, FaCalendarAlt
} from 'react-icons/fa';
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
  { code: "+65", country: "Singapore" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
];

const STEPS = [
  'email',
  'otp',
  'personal',
  'contact',
  'address',
  'academic',
];

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();

  const [currentStep, setCurrentStep] = useState('email');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [alumniId, setAlumniId] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    countryCode: '+91',
    phoneNumber: '',
    whatsappNumber: '',
    secondaryPhoneNumber: '',
    personalStreet: '',
    personalCity: '',
    personalState: '',
    personalPincode: '',
    personalCountry: 'India',
    institutionAttended: '',
    courseProgram: '',
    graduationYear: '',
  });

  const mapFormDataForBackend = (data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`.trim(),
    yearOfJoining: parseInt(data.graduationYear, 10) - 4 || 0,
    passingYear: parseInt(data.graduationYear, 10) || 0,
    department: data.courseProgram || '',
    college: data.institutionAttended || '',
    course: data.courseProgram || '',
    otp: otp.join(''),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  useEffect(() => {
    if (!resendTimer) return;
    const timerId = setInterval(() => {
      setResendTimer((t) => {
        if (t <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [resendTimer]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    try {
      setLoading(true);
      const response = await sendOTP({ email: formData.email, otpType: 'EMAIL' });
      setAlumniId(response.alumniId || null);
      setCurrentStep('otp');
      setResendTimer(60);
      toast.success('OTP sent to your email');
    } catch (e) {
      toast.error('Failed to send OTP. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }
    setCurrentStep('personal');
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true);
      await sendOTP({ email: formData.email, otpType: 'EMAIL' });
      setResendTimer(60);
      toast.success('OTP resent successfully');
    } catch (e) {
      toast.error('Could not resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth } = formData;
    if (!firstName || !lastName || !dateOfBirth) {
      toast.error('Please complete the personal information');
      return;
    }
    setCurrentStep('contact');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.phoneNumber) {
      toast.error('Please enter primary phone number');
      return;
    }
    setCurrentStep('address');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { personalStreet, personalCity, personalState, personalPincode, personalCountry } = formData;
    if (!personalStreet || !personalCity || !personalState || !personalPincode || !personalCountry) {
      toast.error('Please complete personal address');
      return;
    }
    setCurrentStep('academic');
  };

  const handleAcademicSubmit = async (e) => {
    e.preventDefault();
    const { institutionAttended, courseProgram, graduationYear } = formData;
    if (!institutionAttended || !courseProgram || !graduationYear) {
      toast.error('Please complete academic information');
      return;
    }
    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions');
      return;
    }
    try {
      setLoading(true);
      const mappedData = mapFormDataForBackend(formData);
      await register({ ...mappedData, alumniId });
      toast.success('Registration successful!');
      navigate('/profile');
    } catch (e) {
      toast.error('Registration failed, please try again');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

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
          <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4">
            <p>Last updated: January 2025</p>
            <p>By accessing or using the KES Alumni Portal, you agree to these Terms & Conditions and our Privacy Policy.</p>
            <p>Membership is limited to alumni, current/former staff, and invited stakeholders of Kandivli Education Society/KES, subject to verification.</p>
            <p>You must provide accurate, current, and complete information and keep it updated.</p>
            <p>The Portal is intended for personal and non-commercial use only.</p>
            <p>You are responsible for all activities under your account and must keep credentials confidential.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressIndicator = () => {
    const stepIndex = STEPS.indexOf(currentStep);
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                idx <= stepIndex 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {idx < stepIndex ? <FaCheckCircle /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${
                  idx < stepIndex ? 'bg-red-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs text-gray-600">
          {STEPS.map((step) => (
            <span key={step} className="capitalize">
              {step === 'otp' ? 'Verify' : step}
            </span>
          ))}
        </div>
      </div>
    );
  };

  if (currentStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Join KES Alumni</h2>
            <p className="text-gray-600">Connect with fellow alumni and stay updated with KES community</p>
          </div>

          <div className="mb-6 space-y-3">
            <button
              onClick={() => toast.info('LinkedIn registration coming soon!')}
              className="w-full flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
            >
              <FaLinkedin className="text-xl" />
              Continue with LinkedIn
            </button>

            <button
              onClick={() => toast.info('Google registration coming soon!')}
              className="w-full flex items-center justify-center gap-3 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 px-4 rounded-lg font-medium transition-all duration-300"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send Verification Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button 
                onClick={() => navigate('/login')} 
                className="text-red-600 hover:text-red-800 font-medium focus:outline-none"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600 mb-8">
              We've sent a 6-digit verification code to<br />
              <span className="font-medium text-gray-900">{formData.email}</span>
            </p>
            
            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`font-medium ${resendTimer > 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:text-red-800'}`}
                >
                  Resend {resendTimer > 0 && `(${resendTimer}s)`}
                </button>
              </p>
              <button
                onClick={() => setCurrentStep('email')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Change email address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'personal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <FaUser className="text-4xl text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <form onSubmit={handlePersonalSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('otp')}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'contact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <FaPhone className="text-4xl text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
              <p className="text-gray-600">How can we reach you?</p>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-6">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Phone Number *
                </label>
                <div className="flex gap-3">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-32 px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  >
                    {countryCodes.map(({ code, country }) => (
                      <option key={code} value={code}>{code} {country}</option>
                    ))}
                  </select>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  <FaWhatsapp className="inline text-green-600 mr-2" />
                  WhatsApp Number
                </label>
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label htmlFor="secondaryPhoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Phone Number
                </label>
                <input
                  id="secondaryPhoneNumber"
                  name="secondaryPhoneNumber"
                  type="tel"
                  value={formData.secondaryPhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter secondary phone number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('personal')}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'address') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <FaMapMarkerAlt className="text-4xl text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Address Information</h1>
              <p className="text-gray-600">Where do you currently live?</p>
            </div>
            
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <div>
                <label htmlFor="personalStreet" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  id="personalStreet"
                  name="personalStreet"
                  type="text"
                  value={formData.personalStreet}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="personalCity" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    id="personalCity"
                    name="personalCity"
                    type="text"
                    value={formData.personalCity}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="personalState" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    id="personalState"
                    name="personalState"
                    type="text"
                    value={formData.personalState}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="personalPincode" className="block text-sm font-medium text-gray-700 mb-2">
                    PIN Code *
                  </label>
                  <input
                    id="personalPincode"
                    name="personalPincode"
                    type="text"
                    value={formData.personalPincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="personalCountry" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    id="personalCountry"
                    name="personalCountry"
                    type="text"
                    value={formData.personalCountry}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('contact')}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-300"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'academic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="text-center mb-8">
              <FaGraduationCap className="text-4xl text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Information</h1>
              <p className="text-gray-600">Tell us about your educational background at KES</p>
            </div>
            
            <form onSubmit={handleAcademicSubmit} className="space-y-6">
              <div>
                <label htmlFor="institutionAttended" className="block text-sm font-medium text-gray-700 mb-2">
                  Institution Attended *
                </label>
                <select
                  id="institutionAttended"
                  name="institutionAttended"
                  value={formData.institutionAttended}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                  required
                >
                  <option value="">Choose your institution</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="courseProgram" className="block text-sm font-medium text-gray-700 mb-2">
                  Course or Program *
                </label>
                <select
                  id="courseProgram"
                  name="courseProgram"
                  value={formData.courseProgram}
                  onChange={handleChange}
                  disabled={!formData.institutionAttended}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300 disabled:bg-gray-100"
                  required
                >
                  <option value="">
                    {formData.institutionAttended ? "Choose your course" : "Select institution first"}
                  </option>
                  {formData.institutionAttended && coursesByInstitution[formData.institutionAttended]?.map((course) => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-2">
                  Year of Graduation *
                </label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min="1950"
                  max="2030"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="e.g., 2022"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start">
                  <input
                    id="acceptedTerms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    required
                  />
                  <label htmlFor="acceptedTerms" className="ml-3 block text-sm text-gray-700">
                    I accept the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-red-600 underline hover:text-red-800 focus:outline-none font-medium"
                    >
                      Terms & Conditions
                    </button>{' '}
                    and{' '}
                    <a
                      href="#privacy"
                      className="text-red-600 underline hover:text-red-800 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                    *
                  </label>
                </div>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-all duration-300"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="flex-1 py-3 px-6 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating Account...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
          {showTerms && <TermsModal />}
        </div>
      </div>
    );
  }

  return null;
};

export default RegisterForm;