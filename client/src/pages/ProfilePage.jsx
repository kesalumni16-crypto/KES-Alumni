import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaBriefcase, FaMapMarkerAlt, FaUsers, FaChartLine, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        currentName: user.currentName || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        linkedinProfile: user.linkedinProfile || '',
        socialMediaWebsite: user.socialMediaWebsite || '',
        currentJobTitle: user.currentJobTitle || '',
        currentCompany: user.currentCompany || '',
        workExperience: user.workExperience || '',
        skills: user.skills || '',
        achievements: user.achievements || '',
        bio: user.bio || '',
        interests: user.interests || '',
        currentCity: user.currentCity || '',
        currentCountry: user.currentCountry || '',
        mentorshipAvailable: user.mentorshipAvailable || false,
        lookingForMentor: user.lookingForMentor || false,
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await profileAPI.getDashboardStats();
        setDashboardStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await profileAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      // Update user context if needed
      window.location.reload(); // Simple refresh to update user data
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mr-4">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Alumni Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.fullName || 'Alumni'}!</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
              >
                {isEditing ? <FaTimes className="mr-2" /> : <FaEdit className="mr-2" />}
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FaUsers className="text-blue-600 text-2xl" />}
              title="Total Alumni"
              value={dashboardStats.totalAlumni}
              color="blue"
            />
            <StatCard
              icon={<FaGraduationCap className="text-green-600 text-2xl" />}
              title="Same Batch"
              value={dashboardStats.sameBatchCount}
              color="green"
            />
            <StatCard
              icon={<FaBuilding className="text-purple-600 text-2xl" />}
              title="Same Department"
              value={dashboardStats.sameDepartmentCount}
              color="purple"
            />
            <StatCard
              icon={<FaChartLine className="text-orange-600 text-2xl" />}
              title="Mentors Available"
              value={dashboardStats.mentorsAvailable}
              color="orange"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
                  >
                    <FaSave className="mr-2" />
                    Save Changes
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Personal Information</h3>
                </div>
                
                <ProfileField
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaUser />}
                />
                
                <ProfileField
                  label="Current Name"
                  name="currentName"
                  value={formData.currentName}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaUser />}
                />
                
                <ProfileField
                  label="Email"
                  name="email"
                  value={user.email}
                  isEditing={false}
                  icon={<FaEnvelope />}
                />
                
                <ProfileField
                  label="Phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaPhone />}
                />
                
                <ProfileField
                  label="Current City"
                  name="currentCity"
                  value={formData.currentCity}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaMapMarkerAlt />}
                />
                
                <ProfileField
                  label="Current Country"
                  name="currentCountry"
                  value={formData.currentCountry}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaMapMarkerAlt />}
                />

                {/* Professional Information */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Professional Information</h3>
                </div>
                
                <ProfileField
                  label="Current Job Title"
                  name="currentJobTitle"
                  value={formData.currentJobTitle}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaBriefcase />}
                />
                
                <ProfileField
                  label="Current Company"
                  name="currentCompany"
                  value={formData.currentCompany}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  icon={<FaBuilding />}
                />

                {/* Educational Information */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Educational Information</h3>
                </div>
                
                <ProfileField
                  label="College"
                  name="college"
                  value={user.college}
                  isEditing={false}
                  icon={<FaBuilding />}
                />
                
                <ProfileField
                  label="Course"
                  name="course"
                  value={user.course}
                  isEditing={false}
                  icon={<FaGraduationCap />}
                />
                
                <ProfileField
                  label="Year of Joining"
                  name="yearOfJoining"
                  value={user.yearOfJoining}
                  isEditing={false}
                  icon={<FaGraduationCap />}
                />
                
                <ProfileField
                  label="Passing Year"
                  name="passingYear"
                  value={user.passingYear}
                  isEditing={false}
                  icon={<FaGraduationCap />}
                />
              </div>

              {/* Text Areas */}
              <div className="mt-6 space-y-4">
                <TextAreaField
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                />
                
                <TextAreaField
                  label="Work Experience"
                  name="workExperience"
                  value={formData.workExperience}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Describe your work experience..."
                />
                
                <TextAreaField
                  label="Skills"
                  name="skills"
                  value={formData.skills}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="List your skills (comma-separated)..."
                />
                
                <TextAreaField
                  label="Achievements"
                  name="achievements"
                  value={formData.achievements}
                  isEditing={isEditing}
                  onChange={handleInputChange}
                  placeholder="Share your notable achievements..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentorship Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentorship</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="mentorshipAvailable"
                    name="mentorshipAvailable"
                    checked={formData.mentorshipAvailable}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="mentorshipAvailable" className="ml-2 text-sm text-gray-700">
                    Available for mentoring
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="lookingForMentor"
                    name="lookingForMentor"
                    checked={formData.lookingForMentor}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="lookingForMentor" className="ml-2 text-sm text-gray-700">
                    Looking for a mentor
                  </label>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="/alumni-globe" className="block text-blue-600 hover:text-blue-800 transition duration-300">
                  Alumni Globe
                </a>
                <a href="/career" className="block text-blue-600 hover:text-blue-800 transition duration-300">
                  Career Center
                </a>
                <a href="/news-events" className="block text-blue-600 hover:text-blue-800 transition duration-300">
                  News & Events
                </a>
                <a href="/about" className="block text-blue-600 hover:text-blue-800 transition duration-300">
                  About KES
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    green: 'bg-green-50 border-green-200',
    purple: 'bg-purple-50 border-purple-200',
    orange: 'bg-orange-50 border-orange-200',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div>{icon}</div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, value, isEditing, onChange, icon }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          {icon}
        </div>
        {isEditing ? (
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={onChange}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        ) : (
          <div className="pl-10 w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900">
            {value || 'Not provided'}
          </div>
        )}
      </div>
    </div>
  );
};

const TextAreaField = ({ label, name, value, isEditing, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {isEditing ? (
        <textarea
          name={name}
          value={value || ''}
          onChange={onChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={placeholder}
        />
      ) : (
        <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-900 min-h-[80px]">
          {value || 'Not provided'}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;