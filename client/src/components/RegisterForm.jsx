import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaBook, FaCalendarAlt, FaMapMarkerAlt, FaLinkedin, FaGlobe, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();
  const [step, setStep] = useState(1); // 1: Initial form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [otpType, setOtpType] = useState('EMAIL'); // 'EMAIL' or 'PHONE'
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
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

  // Terms and Conditions Modal Component
  const TermsModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={() => setShowTerms(false)} />
      
      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          {/* Sticky header */}
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
          
          {/* Scrollable content area */}
          <div className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Acceptance of Terms</h3>
            <p className="mb-4">
              By accessing or using the KES Alumni Portal ("Portal"), the website, or related services (together, "Services"),
              the user ("Member," "you") agrees to these Terms & Conditions ("Terms") and our Privacy Policy.
            </p>
            <p className="mb-6">If you do not agree, do not access or use the Services.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Eligibility and Account</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Eligibility:</strong> Membership is limited to alumni, current/former staff, and invited stakeholders of Kandivli Education Society/KES, subject to verification.</li>
              <li><strong>Account Registration:</strong> You must provide accurate, current, and complete information and keep it updated.</li>
              <li><strong>Account Security:</strong> You are responsible for all activities under your account and must keep credentials confidential. Notify us immediately of suspected unauthorized use.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Permitted Use</h3>
            <p className="mb-2"><strong>Personal and Non-Commercial:</strong> The Portal is intended to support alumni networking, mentoring, events, fundraising, and institutional engagement. Use is strictly personal and non-commercial unless expressly authorized in writing.</p>
            <p className="mb-2"><strong>Prohibited Activities:</strong> You must not:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Violate any law or the rights of others.</li>
              <li>Harass, intimidate, defame, or discriminate against any person or group.</li>
              <li>Post or transmit harmful code, spam, or misleading/false information.</li>
              <li>Scrape, harvest, or misuse personal data of members.</li>
              <li>Attempt to bypass security or interfere with the Services' operation.</li>
              <li>Upload content you do not have the right to share (e.g., copyrighted materials, confidential data).</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Member Content and License</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Ownership:</strong> You retain ownership of content you submit ("Member Content").</li>
              <li><strong>License to KES:</strong> By submitting Member Content, you grant KES a worldwide, non-exclusive, royalty-free license to host, use, reproduce, display, and distribute such content solely to operate, promote, and improve the Services and alumni engagement.</li>
              <li><strong>Responsibility:</strong> You are solely responsible for your Member Content. Do not post confidential, sensitive, or infringing material.</li>
              <li><strong>Moderation:</strong> KES may review, remove, or restrict content or accounts at its discretion for violations or risks to Members or the institution.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy and Data Protection</h3>
            <p className="mb-2">We process personal data per our Privacy Policy and applicable data protection laws. Purposes include alumni verification, communications, event management, mentoring, fundraising, analytics, and institutional updates.</p>
            <p className="mb-2">Directories and discoverability settings may allow other Members to view your profile information. You can manage visibility preferences where features permit.</p>
            <p className="mb-4">Do not use member data for unauthorized marketing or scraping.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Communications</h3>
            <p className="mb-4">You consent to receive service, transactional, and alumni-related communications (e.g., newsletters, events, opportunities). You may opt-out of non-essential communications, except those necessary to operate your account or comply with law.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Intellectual Property</h3>
            <p className="mb-2">The Portal, including software, design, trademarks, and content (excluding Member Content), is owned by KES or its licensors and protected by IP laws.</p>
            <p className="mb-4">You may not reproduce, modify, distribute, or create derivative works without prior written consent, except for personal, fair, and non-commercial use permitted by law.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Code of Conduct</h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Treat all Members with respect and professionalism.</li>
              <li>No bullying, hate speech, sexual harassment, or stalking.</li>
              <li>Respect cultural and personal boundaries at events and online.</li>
              <li>Report misconduct via our contact channels. KES may investigate and take appropriate action, including warnings, suspension, or termination.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Disclaimers</h3>
            <p className="mb-2">The Services are provided "as is" and "as available" without warranties of any kind, express or implied (including merchantability, fitness for a particular purpose, non-infringement).</p>
            <p className="mb-4">KES does not guarantee uninterrupted or error-free operation, accuracy of content, or the conduct of Members.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
            <p className="mb-2">To the maximum extent permitted by law, KES and its officers, employees, and agents shall not be liable for indirect, incidental, special, consequential, or punitive damages, loss of data, business, goodwill, or profits arising from or related to the Services or these Terms.</p>
            <p className="mb-4">In no event shall KES's total liability exceed the greater of: (a) the amount paid by you (if any) to use paid features in the 12 months preceding the claim, or (b) INR 10,000.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Governing Law and Dispute Resolution</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Governing Law:</strong> These Terms are governed by the laws of State of Maharashtra, India, without regard to conflict of law principles.</li>
              <li><strong>Jurisdiction:</strong> Courts located in Mumbai, India shall have exclusive jurisdiction.</li>
              <li><strong>Informal Resolution:</strong> Contact our support team to attempt informal resolution before formal action.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact</h3>
            <div className="mb-4">
              <p><strong>Institution:</strong> Kandivli Education Society (KES)</p>
              <p><strong>Address:</strong> Kandivali, Mumbai, Maharashtra, India</p>
              <p><strong>Email:</strong> alumni@kes.edu.in</p>
              <p><strong>Phone:</strong> +91-22-XXXX-XXXX</p>
            </div>

            <p className="text-sm text-gray-600 mt-6 mb-4">
              These Terms and the Privacy Policy constitute the entire agreement between you and KES regarding the Services.
              If any provision is found unenforceable, the remainder will remain in effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
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
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
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
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                required
              />
              <label htmlFor="acceptedTerms" className="ml-2 block text-gray-700 text-sm">
                I accept the{' '}
                <button
                  type="button"
                  onClick={() => setShowTerms(true)}
                  className="text-blue-600 hover:text-blue-800 underline focus:outline-none"
                >
                  Terms & Conditions
                </button>{' '}
                and{' '}
                <a href="#privacy" className="text-blue-600 hover:text-blue-800 underline">
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
              className={`w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ${loading || !acceptedTerms ? 'opacity-70 cursor-not-allowed' : ''}`}
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
      
      {/* Terms Modal */}
      {showTerms && <TermsModal />}
    </>
  );
};

export default RegisterForm;