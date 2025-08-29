import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaLinkedin, FaGraduationCap, FaCheckCircle, FaTimes,
  FaInstagram, FaTwitter, FaFacebook, FaGithub, FaGlobe,
  FaWhatsapp, FaPhone
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

const socialMediaPlatforms = [
  { name: 'LinkedIn', icon: <FaLinkedin />, placeholder: 'https://linkedin.com/in/yourprofile', field: 'linkedinProfile', required: true },
  { name: 'Instagram', icon: <FaInstagram />, placeholder: 'https://instagram.com/yourprofile', field: 'instagramProfile' },
  { name: 'Twitter/X', icon: <FaTwitter />, placeholder: 'https://twitter.com/yourprofile', field: 'twitterProfile' },
  { name: 'Facebook', icon: <FaFacebook />, placeholder: 'https://facebook.com/yourprofile', field: 'facebookProfile' },
  { name: 'GitHub', icon: <FaGithub />, placeholder: 'https://github.com/yourprofile', field: 'githubProfile' },
  { name: 'Personal Website', icon: <FaGlobe />, placeholder: 'https://yourwebsite.com', field: 'personalWebsite' },
];

const STEPS = [
  'email',
  'otp',
  'personal',
  'contact',
  'address',
  'work',
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

    // Personal
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',

    // Contact
    countryCode: '+91',
    phoneNumber: '',
    whatsappNumber: '',
    secondaryPhoneNumber: '',

    // Address
    personalStreet: '',
    personalCity: '',
    personalState: '',
    personalPincode: '',
    personalCountry: 'India',

    // Work
    companyStreet: '',
    companyCity: '',
    companyState: '',
    companyPincode: '',
    companyCountry: '',

    // Social Media
    linkedinProfile: '',
    instagramProfile: '',
    twitterProfile: '',
    facebookProfile: '',
    githubProfile: '',
    personalWebsite: '',

    // Academic
    institutionAttended: '',
    courseProgram: '',
    graduationYear: '',
  });

  // Map form data for backend compatibility
  const mapFormDataForBackend = (data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`.trim(),
    address: `${data.personalStreet}, ${data.personalCity}, ${data.personalState}, ${data.personalPincode}`.replace(/^,\s*|,\s*$/g, ''),
    phoneNumber: `${data.countryCode}${data.phoneNumber}`,
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

  // OTP input handlers
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

  // Email step submission - send OTP
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

  // OTP verification step
  const handleVerifyOTP = () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }
    // In real scenario, verify OTP via API, here just proceed
    setCurrentStep('personal');
  };

  // Resend OTP
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

  // Personal Info submit
  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth } = formData;
    if (!firstName || !lastName || !dateOfBirth) {
      toast.error('Please complete the personal information');
      return;
    }
    setCurrentStep('contact');
  };

  // Contact Info submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!formData.phoneNumber) {
      toast.error('Please enter primary phone number');
      return;
    }
    setCurrentStep('address');
  };

  // Address submit
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { personalStreet, personalCity, personalState, personalPincode, personalCountry } = formData;
    if (!personalStreet || !personalCity || !personalState || !personalPincode || !personalCountry) {
      toast.error('Please complete personal address');
      return;
    }
    setCurrentStep('work');
  };

  // Work submit (optional)
  const handleWorkSubmit = (e) => {
    e.preventDefault();
    setCurrentStep('academic');
  };

  // Academic info submit + final register
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

  // Modal terms
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

  // Progress bar
  const ProgressIndicator = () => {
    const stepIndex = STEPS.indexOf(currentStep);
    return (
      <div className="flex items-center justify-center mb-8 gap-6 text-sm font-medium text-gray-600">
        {STEPS.map((step, idx) => (
          <span
            key={step}
            className={`${idx <= stepIndex ? 'text-green-600 font-semibold' : 'text-gray-400'}`}
          >
            {step.charAt(0).toUpperCase() + step.slice(1).replace(/([A-Z])/g, ' $1').trim()}
          </span>
        ))}
      </div>
    );
  };

  // Render Steps UI

  if (currentStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Alumni Registration</h2>
          <p className="mb-6 text-gray-600 text-center">Create your profile to connect with fellow alumni and stay updated with KES Institutions.</p>

          <div className="mb-6 space-y-2">
            <button
              onClick={() => toast.info('LinkedIn login will be available soon!')}
              className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 rounded-md font-semibold transition"
            >
              <FaLinkedin /> Sign up with LinkedIn
            </button>

            <button
              onClick={() => toast.info('Google login will be available soon!')}
              className="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white py-3 rounded-md font-semibold transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
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

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
                className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Continue with Email'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive OTP? Check your Spam folder or{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`font-medium ${resendTimer > 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-green-600 hover:underline'}`}
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

  if (currentStep === 'personal') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <ProgressIndicator />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Information</h1>
            <p className="text-gray-600 text-lg">Please provide your personal details to complete your profile.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <form onSubmit={handlePersonalSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name *</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name *</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer_not_to_say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('otp')}
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Continue to Contact Info
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'contact') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <ProgressIndicator />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Information</h1>
            <p className="text-gray-600 text-lg">Provide your contact phone numbers and WhatsApp.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleContactSubmit} className="space-y-8">
              {/* Primary Phone */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Primary Phone Number *</label>
                <div className="flex gap-2 mt-1 max-w-full">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-32 min-w-[100px] px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
                    className="flex-1 px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaWhatsapp className="text-green-600" /> WhatsApp Number
                </label>
                <input
                  id="whatsappNumber"
                  name="whatsappNumber"
                  type="tel"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="Enter WhatsApp number"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Secondary Phone */}
              <div>
                <label htmlFor="secondaryPhoneNumber" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                  <FaPhone className="text-blue-600" /> Secondary Phone
                </label>
                <input
                  id="secondaryPhoneNumber"
                  name="secondaryPhoneNumber"
                  type="tel"
                  value={formData.secondaryPhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter secondary phone"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep('personal')}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-md font-medium transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-medium transition"
                >
                  Continue to Address
                </button>
              </div>
            </form>

          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'address') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <ProgressIndicator />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Address</h1>
            <p className="text-gray-600 text-lg">Please provide your personal address details.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleAddressSubmit} className="space-y-8">
              <div>
                <label htmlFor="personalStreet" className="block text-sm font-medium text-gray-700">Street Address *</label>
                <input
                  id="personalStreet"
                  name="personalStreet"
                  type="text"
                  value={formData.personalStreet}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personalCity" className="block text-sm font-medium text-gray-700">City *</label>
                  <input
                    id="personalCity"
                    name="personalCity"
                    type="text"
                    value={formData.personalCity}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="personalState" className="block text-sm font-medium text-gray-700">State *</label>
                  <input
                    id="personalState"
                    name="personalState"
                    type="text"
                    value={formData.personalState}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="personalPincode" className="block text-sm font-medium text-gray-700">PIN Code *</label>
                  <input
                    id="personalPincode"
                    name="personalPincode"
                    type="text"
                    value={formData.personalPincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    required
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="personalCountry" className="block text-sm font-medium text-gray-700">Country *</label>
                  <input
                    id="personalCountry"
                    name="personalCountry"
                    type="text"
                    value={formData.personalCountry}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    required
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('contact')}
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Continue to Work Info
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'work') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <ProgressIndicator />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Company / Work Address</h1>
            <p className="text-gray-600 text-lg">Optional: Provide your current company or work address.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleWorkSubmit} className="space-y-8">
              <div>
                <label htmlFor="companyStreet" className="block text-sm font-medium text-gray-700">Company Street Address</label>
                <input
                  id="companyStreet"
                  name="companyStreet"
                  type="text"
                  value={formData.companyStreet}
                  onChange={handleChange}
                  placeholder="Enter company street address"
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyCity" className="block text-sm font-medium text-gray-700">Company City</label>
                  <input
                    id="companyCity"
                    name="companyCity"
                    type="text"
                    value={formData.companyCity}
                    onChange={handleChange}
                    placeholder="Enter company city"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="companyState" className="block text-sm font-medium text-gray-700">Company State</label>
                  <input
                    id="companyState"
                    name="companyState"
                    type="text"
                    value={formData.companyState}
                    onChange={handleChange}
                    placeholder="Enter company state"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="companyPincode" className="block text-sm font-medium text-gray-700">Company PIN Code</label>
                  <input
                    id="companyPincode"
                    name="companyPincode"
                    type="text"
                    value={formData.companyPincode}
                    onChange={handleChange}
                    placeholder="Enter company PIN code"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label htmlFor="companyCountry" className="block text-sm font-medium text-gray-700">Company Country</label>
                  <input
                    id="companyCountry"
                    name="companyCountry"
                    type="text"
                    value={formData.companyCountry}
                    onChange={handleChange}
                    placeholder="Enter company country"
                    className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Continue to Academic Info
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (currentStep === 'academic') {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <ProgressIndicator />
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Information</h1>
            <p className="text-gray-600 text-lg">Tell us about your educational background at KES Institutions.</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleAcademicSubmit} className="space-y-6">
              <div>
                <label htmlFor="institutionAttended" className="block text-sm font-medium text-gray-700">Select Institution Attended *</label>
                <select
                  id="institutionAttended"
                  name="institutionAttended"
                  value={formData.institutionAttended}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  required
                >
                  <option value="">Choose your institution</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="courseProgram" className="block text-sm font-medium text-gray-700">Course or Program *</label>
                <select
                  id="courseProgram"
                  name="courseProgram"
                  value={formData.courseProgram}
                  onChange={handleChange}
                  disabled={!formData.institutionAttended}
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
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
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">Year of Graduation *</label>
                <input
                  id="graduationYear"
                  name="graduationYear"
                  type="number"
                  min="1950"
                  max="2024"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  placeholder="2022"
                  required
                  className="w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <div className="flex items-start">
                <input
                  id="acceptedTerms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  required
                />
                <label htmlFor="acceptedTerms" className="ml-2 block text-gray-700 text-sm">
                  I accept the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    className="text-green-600 underline hover:text-green-800 focus:outline-none"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <a
                    href="#privacy"
                    className="text-green-600 underline hover:text-green-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                  *
                </label>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep('work')}
                  className="py-3 px-6 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="py-3 px-6 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Complete Registration'}
                </button>
              </div>
            </form>
          </div>
          {showTerms && <TermsModal />}
        </main>
      </div>
    );
  }

  // fallback
  return null;
};

export default RegisterForm;
