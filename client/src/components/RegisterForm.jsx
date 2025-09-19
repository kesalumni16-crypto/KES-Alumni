import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaLinkedin, FaGraduationCap, FaCheckCircle, FaTimes, FaInstagram, 
  FaTwitter, FaFacebook, FaGithub, FaGlobe, FaWhatsapp, FaPhone, 
  FaUser, FaEnvelope, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, 
  FaArrowLeft, FaArrowRight, FaShieldAlt, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const institutions = [
  "Sardar Vallabhbhai Patel High School (SVP)",
  "SVP Night School", 
  "Shri T. P. Bhatia Junior College of Science",
  "KES' Shri Vithaldas H. Sanghvi Junior College of Arts & Commerce",
  "KES' Shroff College of Arts and Commerce",
  "Sangeet Mahavidyalaya",
  "KES Cambridge International Junior College",
  "KES' Shri Jayantilal H. Patel Law College"
];

const coursesByInstitution = {
  "Sardar Vallabhbhai Patel High School (SVP)": [
    "Primary Education (Std 1-7)",
    "Secondary Education (Std 8-10)", 
    "Science Stream (Std 11-12)",
    "Commerce Stream (Std 11-12)",
    "Arts Stream (Std 11-12)",
    "Technical Education",
    "Vocational Courses"
  ],
  "SVP Night School": [
    "Secondary Education (Evening)",
    "Higher Secondary Education (Evening)",
    "Working Youth Program"
  ],
  "Shri T. P. Bhatia Junior College of Science": [
    "HSC Science - PCM (Physics, Chemistry, Mathematics)",
    "HSC Science - PCB (Physics, Chemistry, Biology)", 
    "HSC Science - PCMB (Physics, Chemistry, Mathematics, Biology)",
    "Computer Science",
    "Information Technology"
  ],
  "KES' Shri Vithaldas H. Sanghvi Junior College of Arts & Commerce": [
    "HSC Arts Stream",
    "HSC Commerce Stream",
    "Bachelor of Arts (BA)",
    "Bachelor of Commerce (B.Com)"
  ],
  "KES' Shroff College of Arts and Commerce": [
    "Bachelor of Commerce (B.Com)",
    "Bachelor of Arts (BA)", 
    "Bachelor of Accounting and Finance (B.A.F.)",
    "Bachelor of Banking and Insurance (B.B.I.)",
    "Bachelor of Financial Markets (B.F.M.)",
    "Bachelor of Management Studies (B.M.S.)",
    "Bachelor of Mass Media (B.M.M.)",
    "Bachelor of Science in Information Technology (B.Sc.IT)",
    "Bachelor of Computer Applications (BCA)",
    "Bachelor of Science in Data Science (B.Sc. Data Science)",
    "Bachelor of Science in Artificial Intelligence (B.Sc. AI)",
    "Master of Commerce (M.Com)",
    "Master of Arts (M.A.)",
    "Master of Science in Information Technology (M.Sc.IT)",
    "Master of Science in Data Science (M.Sc. Data Science)",
    "Master of Science in Artificial Intelligence (M.Sc. AI)",
    "Diploma in Computer Applications",
    "Diploma in Business Management"
  ],
  "Sangeet Mahavidyalaya": [
    "Certificate in Indian Classical Music (Vocal)",
    "Certificate in Indian Classical Music (Instrumental)",
    "Certificate in Indian Classical Dance",
    "Diploma in Indian Classical Music (Vocal)",
    "Diploma in Indian Classical Music (Instrumental)", 
    "Diploma in Indian Classical Dance",
    "Advanced Diploma in Music",
    "Advanced Diploma in Dance"
  ],
  "KES Cambridge International Junior College": [
    "A-Level Arts Stream",
    "A-Level Science Stream", 
    "A-Level Commerce Stream",
    "Cambridge International AS Level",
    "Cambridge International A Level",
    "International Foundation Program"
  ],
  "KES' Shri Jayantilal H. Patel Law College": [
    "Bachelor of Laws (LL.B.) - 3 Year",
    "Bachelor of Arts + Bachelor of Laws (BA LL.B.) - 5 Year Integrated",
    "Bachelor of Commerce + Bachelor of Laws (B.Com LL.B.) - 5 Year Integrated",
    "Master of Laws (LL.M.)",
    "Diploma in Cyber Law",
    "Certificate in Legal Studies"
  ]
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

const STEPS = ['email', 'otp', 'personal', 'contact', 'address', 'academic'];

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
  const [errors, setErrors] = useState({});

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    middleName: '', // Added middle name field
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

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Auto-populate WhatsApp number with phone number if empty
    if (name === 'phoneNumber' && !formData.whatsappNumber) {
      setFormData(prev => ({ ...prev, whatsappNumber: value }));
    }
  };

  // Auto-append @gmail.com when user leaves email field or presses Tab/Enter
  const handleEmailBlur = (e) => {
    const email = e.target.value.trim();
    
    if (email && !email.includes('@') && email.length > 0) {
      const updatedEmail = email + '@gmail.com';
      setFormData(prev => ({ ...prev, email: updatedEmail }));
    }
  };

  // Handle Tab and Enter key for email field
  const handleEmailKeyDown = (e) => {
    if (e.key === 'Tab' || e.key === 'Enter') {
      const email = e.target.value.trim();
      
      if (email && !email.includes('@') && email.length > 0) {
        const updatedEmail = email + '@gmail.com';
        setFormData(prev => ({ ...prev, email: updatedEmail }));
      }
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1 || !/[0-9]/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
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
      const newOtp = [...otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  // Timer for resend OTP
  useEffect(() => {
    if (!resendTimer) return;

    const timerId = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [resendTimer]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (currentStep === 'otp' && otpRefs.current[0]) {
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  }, [currentStep]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email?.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await sendOTP({ email: formData.email.trim(), otpType: 'EMAIL' });
      setAlumniId(response.alumniId || null);
      setCurrentStep('otp');
      setResendTimer(60);
    } catch (error) {
      toast.error(error.message || 'Failed to send OTP. Please try again.');
      console.error('Email submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    const otpStr = otp.join('');
    if (otpStr.length !== 6) {
      toast.error('Please enter complete 6-digit verification code');
      return;
    }
    setCurrentStep('personal');
    toast.success('Email verified successfully!');
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;

    try {
      setLoading(true);
      await sendOTP({ email: formData.email.trim(), otpType: 'EMAIL' });
      setResendTimer(60);
    } catch (error) {
      toast.error('Could not resend verification code');
      console.error('Resend OTP error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, dateOfBirth } = formData;
    
    const newErrors = {};
    if (!firstName?.trim()) newErrors.firstName = 'First name is required';
    if (!lastName?.trim()) newErrors.lastName = 'Last name is required';
    if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please complete all required fields');
      return;
    }

    setCurrentStep('contact');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Primary phone number is required';
    } else if (!validatePhone(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please enter a valid phone number');
      return;
    }

    setCurrentStep('address');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const { personalStreet, personalCity, personalState, personalPincode, personalCountry } = formData;
    
    const newErrors = {};
    if (!personalStreet?.trim()) newErrors.personalStreet = 'Street address is required';
    if (!personalCity?.trim()) newErrors.personalCity = 'City is required';
    if (!personalState?.trim()) newErrors.personalState = 'State is required';
    if (!personalPincode?.trim()) newErrors.personalPincode = 'PIN code is required';
    if (!personalCountry?.trim()) newErrors.personalCountry = 'Country is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please complete all address fields');
      return;
    }

    setCurrentStep('academic');
  };

  const handleAcademicSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'dateOfBirth', label: 'Date of Birth' },
      { key: 'phoneNumber', label: 'Phone Number' },
      { key: 'personalStreet', label: 'Street Address' },
      { key: 'personalCity', label: 'City' },
      { key: 'personalState', label: 'State' },
      { key: 'personalPincode', label: 'PIN Code' },
      { key: 'personalCountry', label: 'Country' },
      { key: 'institutionAttended', label: 'Institution' },
      { key: 'courseProgram', label: 'Course/Program' },
      { key: 'graduationYear', label: 'Graduation Year' },
    ];

    const emptyFields = requiredFields.filter(field => {
      const value = formData[field.key];
      return !value || (typeof value === 'string' && !value.trim());
    });

    if (emptyFields.length > 0) {
      toast.error(`Missing required fields: ${emptyFields.map(f => f.label).join(', ')}`);
      return;
    }

    if (otp.join('').length !== 6) {
      toast.error('Please enter complete 6-digit verification code');
      return;
    }

    if (!acceptedTerms) {
      toast.error('Please accept Terms & Conditions');
      return;
    }

    try {
      setLoading(true);

      // Create full name with optional middle name
      const fullName = `${formData.firstName.trim()} ${formData.middleName.trim()} ${formData.lastName.trim()}`.replace(/\s+/g, ' ').trim();

      // Prepare registration data
      const registrationData = {
        alumniId,
        otp: otp.join(''),
        email: formData.email.trim(),
        fullName: fullName,
        firstName: formData.firstName.trim(),
        middleName: formData.middleName.trim(), // Include middle name in registration data
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        countryCode: formData.countryCode,
        phoneNumber: formData.phoneNumber.trim(),
        whatsappNumber: formData.whatsappNumber?.trim() || '',
        secondaryPhoneNumber: formData.secondaryPhoneNumber?.trim() || '',
        personalStreet: formData.personalStreet.trim(),
        personalCity: formData.personalCity.trim(),
        personalState: formData.personalState.trim(),
        personalPincode: formData.personalPincode.trim(),
        personalCountry: formData.personalCountry.trim(),
        institutionAttended: formData.institutionAttended,
        courseProgram: formData.courseProgram,
        graduationYear: formData.graduationYear,
        // Calculate year of joining based on course duration
        yearOfJoining: parseInt(formData.graduationYear) - (
          formData.courseProgram.includes('Master') || formData.courseProgram.includes('LLM') ? 2 :
          formData.courseProgram.includes('LLB') && !formData.courseProgram.includes('BA LLB') && !formData.courseProgram.includes('B.Com LLB') ? 3 :
          formData.courseProgram.includes('BA LLB') || formData.courseProgram.includes('B.Com LLB') ? 5 : 4
        ),
        passingYear: parseInt(formData.graduationYear),
        department: formData.courseProgram,
        college: formData.institutionAttended,
        course: formData.courseProgram,
        admissionInFirstYear: true,
      };

      await register(registrationData);
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Registration failed, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowTerms(false)}></div>
      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="bg-white rounded-2xl shadow-2xl flex flex-col h-full">
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center rounded-t-2xl z-10">
            <h2 className="text-2xl font-bold text-custom">KES Alumni Portal Terms and Conditions</h2>
            <button 
              onClick={() => setShowTerms(false)}
              className="text-gray-500 hover:text-primary transition-colors duration-200 p-2 rounded-full hover:bg-gray-100"
              aria-label="Close terms and conditions"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 text-sm text-gray-700 space-y-4">
            <p><strong>Last updated:</strong> January 2025</p>
            <p>By accessing or using the KES Alumni Portal, you agree to these Terms & Conditions and our Privacy Policy.</p>
            
            <p>Membership is limited to alumni, current/former staff, and invited stakeholders of Kandivli Education Society(KES), subject to verification.</p>
            <p>You must provide accurate, current, and complete information and keep it updated.</p>
            <p>The Portal is intended for personal and non-commercial use only.</p>
            <p>You are responsible for all activities under your account and must keep credentials confidential.</p>
            
            <div className="mt-6 p-4 bg-secondary rounded-lg">
              <p className="text-custom font-medium">By clicking "I Accept", you acknowledge that you have read, understood, and agree to be bound by these terms.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ProgressIndicator = () => {
    const stepIndex = STEPS.indexOf(currentStep);
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto px-2">
          {STEPS.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                idx <= stepIndex ? 'bg-primary text-white shadow-lg' : 'bg-gray-200 text-gray-600'
              }`}>
                {idx < stepIndex ? <FaCheckCircle /> : idx + 1}
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 sm:w-16 h-1 mx-2 rounded transition-all duration-300 ${
                  idx < stepIndex ? 'bg-primary' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between max-w-2xl mx-auto mt-3 text-xs font-medium text-gray-600 px-2">
          {STEPS.map(step => (
            <span key={step} className="capitalize text-center">
              {step === 'otp' ? 'Verify' : step}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Email Step Component
  if (currentStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-slate-100 to-transparent rounded-full -ml-12 -mb-12"></div>

          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
              <FaGraduationCap className="text-white text-2xl" />
            </div>
            <h1 className="text-3xl font-bold text-custom mb-2">Join KES Alumni</h1>
            <p className="text-gray-600">Connect with fellow alumni and stay updated with KES community</p>
          </div>

          <div className="mb-6 space-y-3 relative z-10">
            <button 
              onClick={() => toast.info('LinkedIn registration coming soon!')}
              className="w-full flex items-center justify-center gap-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              <FaLinkedin className="text-xl" />
              Continue with LinkedIn
            </button>
            <button 
              onClick={() => toast.info('Google registration coming soon!')}
              className="w-full flex items-center justify-center gap-3 border-2 border-primary text-primary hover:bg-primary py-3 px-4 rounded-xl font-semibold transition-all duration-300 hover:scale-[1.02]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6 relative z-10">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-custom mb-3">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-lg group-focus-within:text-primary transition-colors duration-200" />
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleEmailBlur}
                  onKeyDown={handleEmailKeyDown}
                  placeholder="Enter username or full email"
                  required
                  className="pl-12 w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                />
              </div>
              {formData.email && !formData.email.includes('@') && (
                <div className="mt-2 text-xs text-blue-600 flex items-center">
                  <span className="mr-1">💡</span>
                  Press Tab or Enter to auto-add @gmail.com
                </div>
              )}
              {errors.email && (
                <div className="mt-2 text-sm text-red-600 flex items-center" role="alert">
                  <span className="mr-1">⚠️</span>
                  {errors.email}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-[1.02]"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Code...
                </span>
              ) : (
                'Send Verification Code'
              )}
            </button>
          </form>

          <div className="mt-6 text-center relative z-10">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login"
                className="text-primary hover:opacity-80 font-semibold focus:outline-none focus:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  if (currentStep === 'otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
          
          <div className="p-8 text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6 shadow-lg">
              <FaEnvelope className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-custom mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-8">
              We've sent a 6-digit verification code to<br />
              <span className="font-semibold text-custom break-all">{formData.email}</span>
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => otpRefs.current[idx] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  onPaste={handleOtpPaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  aria-label={`Digit ${idx + 1} of verification code`}
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4 shadow-lg hover:scale-[1.02]"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || loading}
                  className={`font-semibold ${resendTimer > 0 || loading ? 'text-gray-400 cursor-not-allowed' : 'text-primary hover:opacity-80 focus:outline-none focus:underline'}`}
                >
                  Resend {resendTimer > 0 && `(${resendTimer}s)`}
                </button>
              </p>
              <button
                onClick={() => setCurrentStep('email')}
                className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
              >
                Change email address
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Personal Information Step
  if (currentStep === 'personal') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
                <FaUser className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-custom mb-2">Personal Information</h1>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>

            <form onSubmit={handlePersonalSubmit} className="space-y-6 relative z-10">
              <div className="grid grid-cols-1 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-custom mb-2">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter your first name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                    />
                    {errors.firstName && (
                      <div className="mt-1 text-sm text-red-600">{errors.firstName}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="middleName" className="block text-sm font-semibold text-custom mb-2">
                      Middle Name
                    </label>
                    <input
                      id="middleName"
                      name="middleName"
                      type="text"
                      value={formData.middleName}
                      onChange={handleChange}
                      placeholder="Enter your middle name"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-custom mb-2">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter your last name"
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                    />
                    {errors.lastName && (
                      <div className="mt-1 text-sm text-red-600">{errors.lastName}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-custom mb-2">
                    Date of Birth
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400 group-focus-within:text-primary transition-colors duration-200" />
                    </div>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                      className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                    />
                  </div>
                  {errors.dateOfBirth && (
                    <div className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-semibold text-custom mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefernottosay">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('otp')}
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-all duration-300"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-all duration-300 shadow-lg"
                >
                  Continue
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Contact Information Step
  if (currentStep === 'contact') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
                <FaPhone className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-custom mb-2">Contact Information</h1>
              <p className="text-gray-600">How can we reach you?</p>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-semibold text-custom mb-2">
                  Primary Phone Number
                </label>
                <div className="flex gap-3">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="w-32 px-3 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  >
                    {countryCodes.map(({ code, country }) => (
                      <option key={code} value={code}>
                        {code} {country}
                      </option>
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
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  />
                </div>
                {errors.phoneNumber && (
                  <div className="mt-1 text-sm text-red-600">{errors.phoneNumber}</div>
                )}
              </div>

              <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-semibold text-custom mb-2">
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                />
              </div>

              <div>
                <label htmlFor="secondaryPhoneNumber" className="block text-sm font-semibold text-custom mb-2">
                  Secondary Phone Number
                </label>
                <input
                  id="secondaryPhoneNumber"
                  name="secondaryPhoneNumber"
                  type="tel"
                  value={formData.secondaryPhoneNumber}
                  onChange={handleChange}
                  placeholder="Enter secondary phone number"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('personal')}
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-all duration-300"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-all duration-300 shadow-lg"
                >
                  Continue
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Address Information Step
  if (currentStep === 'address') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
                <FaMapMarkerAlt className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-custom mb-2">Address Information</h1>
              <p className="text-gray-600">Where do you currently live?</p>
            </div>

            <form onSubmit={handleAddressSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="personalStreet" className="block text-sm font-semibold text-custom mb-2">
                  Street Address
                </label>
                <input
                  id="personalStreet"
                  name="personalStreet"
                  type="text"
                  value={formData.personalStreet}
                  onChange={handleChange}
                  placeholder="Enter your street address"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                />
                {errors.personalStreet && (
                  <div className="mt-1 text-sm text-red-600">{errors.personalStreet}</div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="personalCity" className="block text-sm font-semibold text-custom mb-2">
                    City
                  </label>
                  <input
                    id="personalCity"
                    name="personalCity"
                    type="text"
                    value={formData.personalCity}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  />
                  {errors.personalCity && (
                    <div className="mt-1 text-sm text-red-600">{errors.personalCity}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="personalState" className="block text-sm font-semibold text-custom mb-2">
                    State
                  </label>
                  <input
                    id="personalState"
                    name="personalState"
                    type="text"
                    value={formData.personalState}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  />
                  {errors.personalState && (
                    <div className="mt-1 text-sm text-red-600">{errors.personalState}</div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="personalPincode" className="block text-sm font-semibold text-custom mb-2">
                    PIN Code
                  </label>
                  <input
                    id="personalPincode"
                    name="personalPincode"
                    type="text"
                    value={formData.personalPincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  />
                  {errors.personalPincode && (
                    <div className="mt-1 text-sm text-red-600">{errors.personalPincode}</div>
                  )}
                </div>

                <div>
                  <label htmlFor="personalCountry" className="block text-sm font-semibold text-custom mb-2">
                    Country
                  </label>
                  <input
                    id="personalCountry"
                    name="personalCountry"
                    type="text"
                    value={formData.personalCountry}
                    onChange={handleChange}
                    placeholder="Enter your country"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  />
                  {errors.personalCountry && (
                    <div className="mt-1 text-sm text-red-600">{errors.personalCountry}</div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('contact')}
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-all duration-300"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-all duration-300 shadow-lg"
                >
                  Continue
                  <FaArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Academic Information Step
  if (currentStep === 'academic') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <ProgressIndicator />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-full -mr-16 -mt-16"></div>
            
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4 shadow-lg">
                <FaGraduationCap className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-bold text-custom mb-2">Academic Information</h1>
              <p className="text-gray-600">Tell us about your educational background at KES</p>
            </div>

            <form onSubmit={handleAcademicSubmit} className="space-y-6 relative z-10">
              <div>
                <label htmlFor="institutionAttended" className="block text-sm font-semibold text-custom mb-2">
                  Institution Attended
                </label>
                <select
                  id="institutionAttended"
                  name="institutionAttended"
                  value={formData.institutionAttended}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                  required
                >
                  <option value="">Choose your institution</option>
                  {institutions.map(inst => (
                    <option key={inst} value={inst}>{inst}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="courseProgram" className="block text-sm font-semibold text-custom mb-2">
                  Course or Program
                </label>
                <select
                  id="courseProgram"
                  name="courseProgram"
                  value={formData.courseProgram}
                  onChange={handleChange}
                  disabled={!formData.institutionAttended}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 disabled:bg-gray-100 bg-secondary focus:bg-white"
                  required
                >
                  <option value="">
                    {formData.institutionAttended ? 'Choose your course' : 'Select institution first'}
                  </option>
                  {formData.institutionAttended && coursesByInstitution[formData.institutionAttended]?.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="graduationYear" className="block text-sm font-semibold text-custom mb-2">
                  Year of Graduation
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
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-0 focus:border-primary transition-all duration-300 bg-secondary focus:bg-white"
                />
              </div>

              <div className="bg-gradient-to-r from-secondary to-blue-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-start">
                  <input
                    id="acceptedTerms"
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
                    required
                  />
                  <label htmlFor="acceptedTerms" className="ml-3 block text-sm text-custom">
                    I accept the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-primary underline hover:opacity-80 focus:outline-none font-semibold"
                    >
                      Terms & Conditions
                    </button>
                    {' '}and{' '}
                    <a
                      href="/privacy"
                      className="text-primary underline hover:opacity-80 font-semibold"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setCurrentStep('address')}
                  className="flex-1 flex items-center justify-center py-3 px-6 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-semibold transition-all duration-300"
                >
                  <FaArrowLeft className="mr-2" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !acceptedTerms}
                  className="flex-1 py-3 px-6 bg-primary text-white rounded-lg hover:bg-primary-dark font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    'Complete Registration'
                  )}
                </button>
              </div>
            </form>

            {showTerms && <TermsModal />}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RegisterForm;
