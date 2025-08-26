import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaPhone, FaGraduationCap, FaBuilding, FaBook } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    yearOfJoining: '',
    passingYear: '',
    admissionInFirstYear: true,
    department: '',
    college: '',
    course: '',
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phoneNumber: user.phoneNumber || '',
        yearOfJoining: user.yearOfJoining || '',
        passingYear: user.passingYear || '',
        admissionInFirstYear: user.admissionInFirstYear !== undefined ? user.admissionInFirstYear : true,
        department: user.department || '',
        college: user.college || '',
        course: user.course || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
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
      // Error is already handled in the auth context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="John Doe"
                required
              />
            </div>
          </div>
          
          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="+1234567890"
                required
              />
            </div>
          </div>
          
          {/* Year of Joining */}
          <div>
            <label htmlFor="yearOfJoining" className="block text-gray-700 text-sm font-medium mb-2">Year of Joining</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="2018"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>
          </div>
          
          {/* Passing Year */}
          <div>
            <label htmlFor="passingYear" className="block text-gray-700 text-sm font-medium mb-2">Passing Year</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
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
                className="h-4 w-4 text-primary-green focus:ring-primary-green border-gray-300 rounded"
              />
              <label htmlFor="admissionInFirstYear" className="ml-2 block text-gray-700 text-sm font-medium">
                Admission in 1st year
              </label>
            </div>
          </div>
          
          {/* Department */}
          <div>
            <label htmlFor="department" className="block text-gray-700 text-sm font-medium mb-2">Department</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="Computer Science"
                required
              />
            </div>
          </div>
          
          {/* College */}
          <div>
            <label htmlFor="college" className="block text-gray-700 text-sm font-medium mb-2">College</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="University of Example"
                required
              />
            </div>
          </div>
          
          {/* Course */}
          <div>
            <label htmlFor="course" className="block text-gray-700 text-sm font-medium mb-2">Course</label>
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
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                placeholder="B.Tech"
                required
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-highlight-green text-black py-2 px-4 rounded-md hover:bg-highlight-green-dark focus:outline-none focus:ring-2 focus:ring-highlight-green focus:ring-offset-2 transition duration-150 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;