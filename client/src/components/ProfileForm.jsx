import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaPhone, FaGraduationCap, FaBuilding, FaBook, FaCalendarAlt, FaVenusMars, FaEnvelope, FaUpload, FaTimes, FaUserCircle, FaFilePdf, FaEdit, FaCrop } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Helper function to create image from canvas
const getCroppedImg = (imageSrc, pixelCrop) => {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      
      canvas.toBlob(resolve, 'image/jpeg', 0.9);
    };
  });
};

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Original form data
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
  });

  // PDF upload states
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfNumPages, setPdfNumPages] = useState(null);
  const [pdfPageNumber, setPdfPageNumber] = useState(1);

  // Photo upload states
  const [profileImage, setProfileImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || '',
        yearOfJoining: user.yearOfJoining === 0 ? null : user.yearOfJoining || null,
        passingYear: user.passingYear === 0 ? null : user.passingYear || null,
        admissionInFirstYear: user.admissionInFirstYear !== undefined ? user.admissionInFirstYear : true,
        department: user.department || '',
        college: user.college || '',
        course: user.course || '',
      });
      
      // Set profile image if exists
      if (user.profileImage) {
        setProfileImage(user.profileImage);
      }
    }
  }, [user]);

  // Original handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' && value === '' ? null : value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  // PDF handlers
  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      const fileUrl = URL.createObjectURL(file);
      setPdfFile(fileUrl);
      toast.success('PDF uploaded successfully');
    } else {
      toast.error('Please select a valid PDF file');
    }
  };

  const onPdfLoadSuccess = ({ numPages }) => {
    setPdfNumPages(numPages);
  };

  const openPdfModal = () => {
    if (pdfFile) {
      setPdfModalOpen(true);
    } else {
      toast.error('No PDF file to preview');
    }
  };

  // Photo handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setOriginalImage(reader.result);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels);
      const imageUrl = URL.createObjectURL(croppedImage);
      setProfileImage(imageUrl);
      setCropModalOpen(false);
      toast.success('Profile photo updated successfully');
      
      // Here you would typically upload the cropped image to your server
      // const formData = new FormData();
      // formData.append('profileImage', croppedImage);
      // await uploadProfileImage(formData);
      
    } catch (error) {
      console.error('Error cropping image:', error);
      toast.error('Failed to crop image');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl border border-gray-200 mx-auto">
      <h2 className="text-2xl font-bold text-custom mb-6">Edit Profile</h2>
      
      {/* Profile Picture Section */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaUserCircle className="mr-2 text-gray-600" />
          Profile Picture
        </h3>
        
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full border-4 border-gray-200 object-cover shadow-lg"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                <FaUserCircle className="text-6xl text-gray-400" />
              </div>
            )}
            
            <button
              type="button"
              onClick={() => document.getElementById('profileImageInput').click()}
              className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary-dark transition-colors shadow-lg"
              title="Upload Profile Picture"
            >
              <FaEdit size={14} />
            </button>
          </div>
          
          <input
            id="profileImageInput"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <p className="text-sm text-gray-500 text-center">
            Click the edit button to upload and crop your profile picture<br />
            Recommended: Square image, JPG/PNG format
          </p>
        </div>
      </div>

      {/* Biodata/CV Upload Section */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaFilePdf className="mr-2 text-gray-600" />
          Biodata / CV Upload
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-custom text-sm font-medium mb-2">
              Upload your CV/Resume (PDF only)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
              />
            </div>
          </div>
          
          {pdfFile && (
            <button
              type="button"
              onClick={openPdfModal}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
            >
              <FaFilePdf />
              Preview PDF
            </button>
          )}
        </div>
        
        {pdfFile && (
          <p className="text-sm text-green-600 mt-2">
            ✓ PDF uploaded successfully. Click "Preview PDF" to view.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaUser className="mr-2 text-gray-600" />
            Basic Information
          </h3>
          
          {/* Name Fields in Same Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-custom text-sm font-medium mb-2">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="First Name"
                  required
                />
              </div>
            </div>

            {/* Middle Name */}
            <div>
              <label htmlFor="middleName" className="block text-custom text-sm font-medium mb-2">
                Middle Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="Middle Name (Optional)"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-custom text-sm font-medium mb-2">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Other Basic Info Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-custom text-sm font-medium mb-2">
                Email Address *
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-custom text-sm font-medium mb-2">
                Date of Birth
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-custom text-sm font-medium mb-2">
                Gender
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="text-gray-400" />
                </div>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-custom text-sm font-medium mb-2">
                Phone Number *
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="+1234567890"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Academic Information Section */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaGraduationCap className="mr-2 text-gray-600" />
            Academic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year of Joining */}
            <div>
              <label htmlFor="yearOfJoining" className="block text-custom text-sm font-medium mb-2">
                Year of Joining *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="yearOfJoining"
                  name="yearOfJoining"
                  value={formData.yearOfJoining ?? ''}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="2018"
                  min="1900"
                  max={new Date().getFullYear()}
                  required
                />
              </div>
            </div>
            
            {/* Passing Year */}
            <div>
              <label htmlFor="passingYear" className="block text-custom text-sm font-medium mb-2">
                Passing Year *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaGraduationCap className="text-gray-400" />
                </div>
                <input
                  type="number"
                  id="passingYear"
                  name="passingYear"
                  value={formData.passingYear ?? ''}
                  onChange={handleChange}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="2022"
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  required
                />
              </div>
            </div>
            
            {/* Department */}
            <div>
              <label htmlFor="department" className="block text-custom text-sm font-medium mb-2">
                Department *
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="Computer Science"
                  required
                />
              </div>
            </div>
            
            {/* College */}
            <div>
              <label htmlFor="college" className="block text-custom text-sm font-medium mb-2">
                College *
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="University of Example"
                  required
                />
              </div>
            </div>
            
            {/* Course */}
            <div>
              <label htmlFor="course" className="block text-custom text-sm font-medium mb-2">
                Course *
              </label>
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
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-primary transition-colors duration-200 bg-secondary focus:bg-white"
                  placeholder="B.Tech"
                  required
                />
              </div>
            </div>

            {/* Admission in First Year */}
            <div className="md:col-span-2">
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="admissionInFirstYear"
                  name="admissionInFirstYear"
                  checked={formData.admissionInFirstYear}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="admissionInFirstYear" className="ml-2 block text-custom text-sm font-medium">
                  Admission in 1st year
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaUser className="mr-2 text-gray-600" />
            About
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete your profile information to connect with fellow alumni and showcase your journey.
          </p>
        </div>
        
        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2 transition duration-200 font-medium ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>

      {/* PDF Preview Modal */}
      <Modal
        isOpen={pdfModalOpen}
        onRequestClose={() => setPdfModalOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800">CV/Biodata Preview</h3>
            <button
              onClick={() => setPdfModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-auto p-4">
            {pdfFile && (
              <Document
                file={pdfFile}
                onLoadSuccess={onPdfLoadSuccess}
                loading={<div className="text-center p-4">Loading PDF...</div>}
                error={<div className="text-center p-4 text-red-500">Error loading PDF</div>}
              >
                <Page 
                  pageNumber={pdfPageNumber}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="mx-auto"
                />
              </Document>
            )}
          </div>
          
          {pdfNumPages && (
            <div className="flex justify-between items-center p-4 border-t bg-gray-50">
              <button
                onClick={() => setPdfPageNumber(Math.max(1, pdfPageNumber - 1))}
                disabled={pdfPageNumber <= 1}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pdfPageNumber} of {pdfNumPages}
              </span>
              
              <button
                onClick={() => setPdfPageNumber(Math.min(pdfNumPages, pdfPageNumber + 1))}
                disabled={pdfPageNumber >= pdfNumPages}
                className="px-3 py-1 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </Modal>

      {/* Image Crop Modal */}
      <Modal
        isOpen={cropModalOpen}
        onRequestClose={() => setCropModalOpen(false)}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-50"
      >
        <div className="bg-white rounded-lg max-w-2xl w-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaCrop className="mr-2" />
              Crop Profile Picture
            </h3>
            <button
              onClick={() => setCropModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <FaTimes size={20} />
            </button>
          </div>
          
          <div className="p-4">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              {originalImage && (
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              )}
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Zoom
              </label>
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setCropModalOpen(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileForm;
