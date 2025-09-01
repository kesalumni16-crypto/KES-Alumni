import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaKey, FaArrowLeft, FaUser, FaPhone, FaGraduationCap, FaBuilding, FaBook, FaCalendarAlt, FaMapMarkerAlt, FaVenusMars } from 'react-icons/fa';
import toast from 'react-hot-toast';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { sendOTP, register } = useAuth();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP verification
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    whatsappNumber: '',
    secondaryPhoneNumber: '',
    gender: '',
    countryCode: '+91',
    dateOfBirth: '',
    
    // Address Information
    personalStreet: '',
    personalCity: '',
    personalState: '',
    personalPincode: '',
    personalCountry: 'India',
    
    // Academic Information
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
    
    // OTP Data
    otp: ['', '', '', '', '', ''],
    alumniId: null,
    otpType: 'EMAIL',
  });

  // Refs for OTP inputs
  const otpRefs = useRef([]);

  // Cooldown timer for resend OTP
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first OTP input when step changes
  useEffect(() => {
    if (step === 2 && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [step]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle special cases
    let processedValue = value;
    if (name === 'email') {
      processedValue = value.toLowerCase().trim();
    } else if (name === 'phoneNumber' || name === 'whatsappNumber' || name === 'secondaryPhoneNumber') {
      processedValue = value.replace(/\D/g, ''); // Only digits
    } else if (name === 'personalPincode' || name === 'companyPincode') {
      processedValue = value.replace(/\D/g, '').slice(0, 6); // Max 6 digits
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // Auto-generate full name from first and last name
    if (name === 'firstName' || name === 'lastName') {
      const firstName = name === 'firstName' ? processedValue : formData.firstName;
      const lastName = name === 'lastName' ? processedValue : formData.lastName;
      setFormData(prev => ({
        ...prev,
        [name]: processedValue,
        fullName: `${firstName} ${lastName}`.trim()
      }));
    }
  };

  // Enhanced OTP handler
  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData(prev => ({ ...prev, otp: newOtp }));

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace and navigation in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
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
      const newOtp = [...formData.otp];
      digits.forEach((digit, index) => {
        if (index < 6) newOtp[index] = digit;
      });
      setFormData(prev => ({ ...prev, otp: newOtp }));
      
      // Focus the next empty input or last input
      const nextIndex = Math.min(digits.length, 5);
      otpRefs.current[nextIndex]?.focus();
    }
  };

  const otpString = formData.otp.join('');

  // Validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhone = (phone) => {
    return phone && phone.length >= 10;
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.firstName.trim()) errors.push('First name is required');
    if (!formData.lastName.trim()) errors.push('Last name is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!isValidEmail(formData.email)) errors.push('Valid email is required');
    if (!formData.phoneNumber.trim()) errors.push('Phone number is required');
    if (!isValidPhone(formData.phoneNumber)) errors.push('Valid phone number is required');
    if (!formData.yearOfJoining) errors.push('Year of joining is required');
    if (!formData.passingYear) errors.push('Passing year is required');
    if (!formData.department.trim()) errors.push('Department is required');
    if (!formData.college.trim()) errors.push('College is required');
    if (!formData.course.trim()) errors.push('Course is required');
    
    return errors;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    try {
      setLoading(true);
      const response = await sendOTP({
        ...formData,
        otpType: formData.otpType,
      });
      setFormData(prev => ({ ...prev, alumniId: response.alumniId }));
      setStep(2);
      setResendCooldown(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (otpString.length !== 6) {
      toast.error('Please enter complete 6-digit OTP');
      return;
    }

    try {
      setLoading(true);
      await register({
        ...formData,
        otp: otpString,
      });
      toast.success('Registration successful!');
      navigate('/profile');
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.message || 'Invalid OTP. Please try again.');
      // Clear OTP on error
      setFormData(prev => ({ ...prev, otp: ['', '', '', '', '', ''] }));
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return;

    try {
      setLoading(true);
      await sendOTP({
        ...formData,
        otpType: formData.otpType,
      });
      setResendCooldown(60);
      toast.success('OTP resent successfully!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData(prev => ({ 
      ...prev, 
      otp: ['', '', '', '', '', ''], 
      alumniId: null 
    }));
    setResendCooldown(0);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-red-100 to-transparent rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-100 to-transparent rounded-full -ml-12 -mb-12"></div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4 shadow-lg">
            <FaGraduationCap className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {step === 1 ? 'Join Alumni Network' : 'Verify Your Identity'}
          </h1>
          <p className="text-gray-600 text-sm">
            {step === 1 
              ? 'Create your account to connect with fellow alumni'
              : 'Enter the verification code sent to your email'
            }
          </p>
        </div>

        {step === 1 ? (
          // Registration Form
          <form onSubmit={handleSendOTP} noValidate className="relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Basic Information */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-red-600" />
                  Basic Information
                </h3>
              </div>

              <div>
                <label htmlFor="firstName" className="block text-gray-700 text-sm font-semibold mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your first name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-gray-700 text-sm font-semibold mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 text-sm font-semibold mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-semibold mb-2">
                  Phone Number *
                </label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="px-3 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+61">+61</option>
                    <option value="+971">+971</option>
                  </select>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">
                  Gender
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaVenusMars className="text-gray-400" />
                  </div>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-gray-700 text-sm font-semibold mb-2">
                  Date of Birth
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Academic Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaGraduationCap className="mr-2 text-red-600" />
                  Academic Information
                </h3>
              </div>

              <div>
                <label htmlFor="yearOfJoining" className="block text-gray-700 text-sm font-semibold mb-2">
                  Year of Joining *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaCalendarAlt className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="yearOfJoining"
                    name="yearOfJoining"
                    value={formData.yearOfJoining}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="2018"
                    min="1936"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="passingYear" className="block text-gray-700 text-sm font-semibold mb-2">
                  Passing Year *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaGraduationCap className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="passingYear"
                    name="passingYear"
                    value={formData.passingYear}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="2022"
                    min="1940"
                    max={new Date().getFullYear() + 10}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="department" className="block text-gray-700 text-sm font-semibold mb-2">
                  Department *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaBook className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Computer Science"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="college" className="block text-gray-700 text-sm font-semibold mb-2">
                  College *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaBuilding className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="college"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="KES Shroff College"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="course" className="block text-gray-700 text-sm font-semibold mb-2">
                  Course *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaBook className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="B.Tech"
                    required
                  />
                </div>
              </div>

              {/* Admission Type */}
              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="admissionInFirstYear"
                    name="admissionInFirstYear"
                    checked={formData.admissionInFirstYear}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="admissionInFirstYear" className="ml-2 block text-gray-700 text-sm font-medium">
                    I was admitted in the first year (uncheck if you were a lateral entry student)
                  </label>
                </div>
              </div>

              {/* Address Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-red-600" />
                  Address Information
                </h3>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="personalStreet" className="block text-gray-700 text-sm font-semibold mb-2">
                  Street Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="personalStreet"
                    name="personalStreet"
                    value={formData.personalStreet}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your street address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="personalCity" className="block text-gray-700 text-sm font-semibold mb-2">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="personalCity"
                    name="personalCity"
                    value={formData.personalCity}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your city"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="personalState" className="block text-gray-700 text-sm font-semibold mb-2">
                  State
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="personalState"
                    name="personalState"
                    value={formData.personalState}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your state"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="personalPincode" className="block text-gray-700 text-sm font-semibold mb-2">
                  PIN Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="personalPincode"
                    name="personalPincode"
                    value={formData.personalPincode}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter PIN code"
                    maxLength="6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="personalCountry" className="block text-gray-700 text-sm font-semibold mb-2">
                  Country
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="personalCountry"
                    name="personalCountry"
                    value={formData.personalCountry}
                    onChange={handleChange}
                    className="pl-12 w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    placeholder="Enter your country"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-300 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaKey className="mr-2" />
                  Send Verification Code
                </span>
              )}
            </button>
          </form>
        ) : (
          // OTP Verification Step
          <form onSubmit={handleVerifyOTP} noValidate className="relative z-10">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center text-red-600 hover:text-red-800 focus:outline-none focus:underline text-sm font-medium"
                >
                  <FaArrowLeft className="mr-2" />
                  Back to Form
                </button>
                <span className="text-sm text-gray-600 font-medium truncate ml-2">
                  {formData.email}
                </span>
              </div>

              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Enter Verification Code
              </label>
              
              <div className="flex justify-center gap-3 mb-6">
                {formData.otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => otpRefs.current[idx] = el}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    maxLength={1}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-0 focus:border-red-500 transition-all duration-300 bg-gray-50 focus:bg-white"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="one-time-code"
                  />
                ))}
              </div>

              <div className="text-center mb-4">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resendCooldown > 0 || loading}
                  className="text-sm text-red-600 hover:text-red-800 focus:outline-none focus:underline disabled:text-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {resendCooldown > 0 
                    ? `Resend code in ${resendCooldown}s`
                    : 'Resend verification code'
                  }
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpString.length !== 6}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-200 transition-all duration-300 font-semibold text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <FaGraduationCap className="mr-2" />
                  Complete Registration
                </span>
              )}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 text-center relative z-10">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link 
              to="/login"
              className="text-red-600 hover:text-red-800 font-semibold focus:outline-none focus:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;