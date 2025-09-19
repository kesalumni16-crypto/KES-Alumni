import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../utils/api';
import PhotoUpload from '../components/PhotoUpload';
import { 
  FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding, FaBriefcase, 
  FaMapMarkerAlt, FaUsers, FaChartLine, FaEdit, FaSave, FaTimes, FaWhatsapp,
  FaLinkedin, FaInstagram, FaTwitter, FaFacebook, FaGithub, FaGlobe,
  FaVenusMars, FaHome, FaIndustry, FaBook, FaUserTie, FaAward, FaHeart,
  FaEye, FaEyeSlash, FaShieldAlt, FaCog, FaCalendarAlt, FaIdCard
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        middleName: user.middleName || '',
        lastName: user.lastName || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        phoneNumber: user.phoneNumber || '',
        whatsappNumber: user.whatsappNumber || '',
        secondaryPhoneNumber: user.secondaryPhoneNumber || '',
        gender: user.gender || '',
        profilePhoto: user.profilePhoto || '',
        countryCode: user.countryCode || '+91',
        
        // Personal Address
        personalAddressLine1: user.personalAddressLine1 || '',
        personalAddressLine2: user.personalAddressLine2 || '',
        personalCity: user.personalCity || '',
        personalState: user.personalState || '',
        personalPostalCode: user.personalPostalCode || '',
        personalCountry: user.personalCountry || '',
        
        // Company Address
        companyAddressLine1: user.companyAddressLine1 || '',
        companyAddressLine2: user.companyAddressLine2 || '',
        companyCity: user.companyCity || '',
        companyState: user.companyState || '',
        companyPostalCode: user.companyPostalCode || '',
        companyCountry: user.companyCountry || '',
        
        // Social Media
        linkedinProfile: user.linkedinProfile || '',
        instagramProfile: user.instagramProfile || '',
        twitterProfile: user.twitterProfile || '',
        facebookProfile: user.facebookProfile || '',
        githubProfile: user.githubProfile || '',
        personalWebsite: user.personalWebsite || '',
        
        // Professional
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

  const handlePhotoChange = (photoUrl) => {
    setFormData(prev => ({
      ...prev,
      profilePhoto: photoUrl
    }));
  };

  const handleSave = async () => {
    try {
      setUploading(true);
      const response = await profileAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FaUser /> },
    { id: 'personal', label: 'Personal', icon: <FaIdCard /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'professional', label: 'Professional', icon: <FaBriefcase /> },
    { id: 'social', label: 'Social & Contact', icon: <FaUsers /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600 mx-auto"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <PhotoUpload
                  currentPhoto={formData.profilePhoto}
                  onPhotoChange={handlePhotoChange}
                  isEditing={isEditing}
                />
                {user.role !== 'ALUMNI' && (
                  <div className="absolute -top-2 -right-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <FaShieldAlt className="mr-1" />
                      {user.role}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {[user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ') || user.fullName || 'Alumni Member'}
                </h1>
                <div className="space-y-1">
                  <p className="text-lg text-gray-600 flex items-center">
                    <FaBriefcase className="mr-2 text-gray-400" />
                    {user.currentJobTitle || 'Position not specified'} 
                    {user.currentCompany && ` at ${user.currentCompany}`}
                  </p>
                  <p className="text-gray-500 flex items-center">
                    <FaGraduationCap className="mr-2 text-gray-400" />
                    {user.course} • {user.department} • Class of {user.passingYear || 'N/A'}
                  </p>
                  <p className="text-gray-500 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    {user.currentCity || user.personalCity || 'Location not specified'}
                    {(user.currentCountry || user.personalCountry) && `, ${user.currentCountry || user.personalCountry}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={uploading}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave className="mr-2" />
                    {uploading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-300 font-medium"
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboardStats && (
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<FaUsers className="text-blue-600 text-3xl" />}
              title="Total Alumni"
              value={dashboardStats.totalAlumni?.toLocaleString() || '0'}
              subtitle="Registered members"
              color="blue"
            />
            <StatCard
              icon={<FaGraduationCap className="text-green-600 text-3xl" />}
              title="Your Batch"
              value={dashboardStats.sameBatchCount?.toLocaleString() || '0'}
              subtitle={`Class of ${user.passingYear || 'N/A'}`}
              color="green"
            />
            <StatCard
              icon={<FaBuilding className="text-purple-600 text-3xl" />}
              title="Same Department"
              value={dashboardStats.sameDepartmentCount?.toLocaleString() || '0'}
              subtitle={user.department}
              color="purple"
            />
            <StatCard
              icon={<FaUserTie className="text-orange-600 text-3xl" />}
              title="Mentors Available"
              value={dashboardStats.mentorsAvailable?.toLocaleString() || '0'}
              subtitle="Ready to help"
              color="orange"
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-12">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-red-600 border-b-2 border-red-600 bg-red-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'overview' && <OverviewTab user={user} />}
            {activeTab === 'personal' && (
              <PersonalTab 
                formData={formData} 
                isEditing={isEditing} 
                onChange={handleInputChange} 
              />
            )}
            {activeTab === 'education' && <EducationTab user={user} isEditing={isEditing} />}
            {activeTab === 'professional' && (
              <ProfessionalTab 
                formData={formData} 
                isEditing={isEditing} 
                onChange={handleInputChange} 
              />
            )}
            {activeTab === 'social' && (
              <SocialTab 
                formData={formData} 
                isEditing={isEditing} 
                onChange={handleInputChange} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ user }) => {
  const completionPercentage = calculateProfileCompletion(user);
  
  return (
    <div className="space-y-8">
      {/* Profile Completion */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Profile Completion</h3>
          <span className="text-2xl font-bold text-blue-600">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">
          {completionPercentage < 100 
            ? 'Complete your profile to unlock all features and connect better with fellow alumni.'
            : 'Your profile is complete! You\'re all set to make the most of the alumni network.'
          }
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard
          icon={<FaIdCard className="text-blue-600 text-2xl" />}
          title="Member Since"
          value={new Date(user.createdAt).getFullYear()}
          subtitle="Joined the portal"
        />
        <InfoCard
          icon={<FaGraduationCap className="text-green-600 text-2xl" />}
          title="Alumni Status"
          value={user.passingYear ? `${new Date().getFullYear() - user.passingYear} years` : 'N/A'}
          subtitle="Since graduation"
        />
        <InfoCard
          icon={<FaHeart className="text-red-600 text-2xl" />}
          title="Mentorship"
          value={user.mentorshipAvailable ? 'Mentor' : user.lookingForMentor ? 'Seeking' : 'None'}
          subtitle="Status"
        />
      </div>

      {/* Bio Section */}
      {user.bio && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <FaUser className="mr-2 text-gray-600" />
            About Me
          </h3>
          <p className="text-gray-700 leading-relaxed">{user.bio}</p>
        </div>
      )}

      {/* Recent Activity Placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-gray-600" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-500">
          <FaUsers className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Activity tracking coming soon!</p>
          <p className="text-sm">Connect with alumni and track your engagement.</p>
        </div>
      </div>
    </div>
  );
};

// Personal Tab Component
const PersonalTab = ({ formData, isEditing, onChange }) => {
  return (
    <div className="space-y-8">
      {/* Basic Information */}
      <Section title="Basic Information" icon={<FaUser />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaUser />}
            required
          />
          <ProfileField
            label="Middle Name"
            name="middleName"
            value={formData.middleName}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaUser />}
            placeholder="Optional"
          />
          <ProfileField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaUser />}
            required
          />
          <DateField
            label="Date of Birth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            isEditing={isEditing}
            onChange={onChange}
          />
          <SelectField
            label="Gender"
            name="gender"
            value={formData.gender}
            isEditing={isEditing}
            onChange={onChange}
            options={[
              { value: '', label: 'Select gender' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
              { value: 'prefer_not_to_say', label: 'Prefer not to say' },
            ]}
            icon={<FaVenusMars />}
          />
        </div>
      </Section>

      {/* Address Information */}
      <Section title="Personal Address" icon={<FaHome />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ProfileField
              label="Address Line 1"
              name="personalAddressLine1"
              value={formData.personalAddressLine1}
              isEditing={isEditing}
              onChange={onChange}
              icon={<FaMapMarkerAlt />}
              placeholder="Street address, P.O. Box, company name, c/o"
            />
          </div>
          <div className="md:col-span-2">
            <ProfileField
              label="Address Line 2"
              name="personalAddressLine2"
              value={formData.personalAddressLine2}
              isEditing={isEditing}
              onChange={onChange}
              icon={<FaMapMarkerAlt />}
              placeholder="Apartment, suite, unit, building, floor, etc. (optional)"
            />
          </div>
          <ProfileField
            label="City"
            name="personalCity"
            value={formData.personalCity}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
          <ProfileField
            label="State"
            name="personalState"
            value={formData.personalState}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
          <ProfileField
            label="Postal Code"
            name="personalPostalCode"
            value={formData.personalPostalCode}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
            placeholder="ZIP/PIN/Postal Code"
          />
          <ProfileField
            label="Country"
            name="personalCountry"
            value={formData.personalCountry}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
        </div>
      </Section>

      {/* Bio and Interests */}
      <Section title="About You" icon={<FaHeart />}>
        <div className="space-y-6">
          <TextAreaField
            label="Bio"
            name="bio"
            value={formData.bio}
            isEditing={isEditing}
            onChange={onChange}
            placeholder="Tell us about yourself, your journey, and what you're passionate about..."
            rows={4}
          />
          <TextAreaField
            label="Interests & Hobbies"
            name="interests"
            value={formData.interests}
            isEditing={isEditing}
            onChange={onChange}
            placeholder="Share your interests, hobbies, and what you enjoy doing in your free time..."
            rows={3}
          />
        </div>
      </Section>
    </div>
  );
};

// Education Tab Component
const EducationTab = ({ user, isEditing }) => {
  const [educationRecords, setEducationRecords] = useState(user.education || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [educationForm, setEducationForm] = useState({
    institutionName: '',
    degree: '',
    fieldOfStudy: '',
    startYear: '',
    endYear: '',
    isCurrentlyStudying: false,
    grade: '',
    description: '',
    activities: '',
  });

  const handleEducationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEducationForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddEducation = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile/education', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(educationForm)
      });

      if (response.ok) {
        const result = await response.json();
        setEducationRecords(prev => [...prev, result.education]);
        setEducationForm({
          institutionName: '',
          degree: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
          isCurrentlyStudying: false,
          grade: '',
          description: '',
          activities: '',
        });
        setShowAddForm(false);
        toast.success('Education record added successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add education record');
      }
    } catch (error) {
      console.error('Add education error:', error);
      toast.error('Failed to add education record');
    }
  };

  const handleUpdateEducation = async (educationId) => {
    try {
      const response = await fetch(`/api/profile/education/${educationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(educationForm)
      });

      if (response.ok) {
        const result = await response.json();
        setEducationRecords(prev => 
          prev.map(edu => edu.id === educationId ? result.education : edu)
        );
        setEditingEducation(null);
        setEducationForm({
          institutionName: '',
          degree: '',
          fieldOfStudy: '',
          startYear: '',
          endYear: '',
          isCurrentlyStudying: false,
          grade: '',
          description: '',
          activities: '',
        });
        toast.success('Education record updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update education record');
      }
    } catch (error) {
      console.error('Update education error:', error);
      toast.error('Failed to update education record');
    }
  };

  const handleDeleteEducation = async (educationId) => {
    if (!confirm('Are you sure you want to delete this education record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/profile/education/${educationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setEducationRecords(prev => prev.filter(edu => edu.id !== educationId));
        toast.success('Education record deleted successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete education record');
      }
    } catch (error) {
      console.error('Delete education error:', error);
      toast.error('Failed to delete education record');
    }
  };

  const startEditEducation = (education) => {
    setEducationForm({
      institutionName: education.institutionName,
      degree: education.degree,
      fieldOfStudy: education.fieldOfStudy,
      startYear: education.startYear.toString(),
      endYear: education.endYear ? education.endYear.toString() : '',
      isCurrentlyStudying: education.isCurrentlyStudying,
      grade: education.grade || '',
      description: education.description || '',
      activities: education.activities || '',
    });
    setEditingEducation(education.id);
  };

  return (
    <div className="space-y-8">
      <Section title="Education Records" icon={<FaGraduationCap />}>
        {/* Add Education Button */}
        {isEditing && (
          <div className="mb-6">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
            >
              <FaUserPlus className="mr-2" />
              Add Education
            </button>
          </div>
        )}

        {/* Add/Edit Education Form */}
        {(showAddForm || editingEducation) && (
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </h4>
            <form onSubmit={editingEducation ? (e) => { e.preventDefault(); handleUpdateEducation(editingEducation); } : handleAddEducation}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={educationForm.institutionName}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., KES Shroff College"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={educationForm.degree}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Bachelor of Technology"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Field of Study *
                  </label>
                  <input
                    type="text"
                    name="fieldOfStudy"
                    value={educationForm.fieldOfStudy}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Computer Science"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Year *
                  </label>
                  <input
                    type="number"
                    name="startYear"
                    value={educationForm.startYear}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1950"
                    max={new Date().getFullYear()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Year
                  </label>
                  <input
                    type="number"
                    name="endYear"
                    value={educationForm.endYear}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1950"
                    max={new Date().getFullYear() + 10}
                    disabled={educationForm.isCurrentlyStudying}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isCurrentlyStudying"
                      checked={educationForm.isCurrentlyStudying}
                      onChange={handleEducationChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      I am currently studying here
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade/GPA
                  </label>
                  <input
                    type="text"
                    name="grade"
                    value={educationForm.grade}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3.8 GPA, 85%, First Class"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activities
                  </label>
                  <input
                    type="text"
                    name="activities"
                    value={educationForm.activities}
                    onChange={handleEducationChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Student Council, Sports, Clubs"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={educationForm.description}
                    onChange={handleEducationChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional details about your education..."
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingEducation(null);
                    setEducationForm({
                      institutionName: '',
                      degree: '',
                      fieldOfStudy: '',
                      startYear: '',
                      endYear: '',
                      isCurrentlyStudying: false,
                      grade: '',
                      description: '',
                      activities: '',
                    });
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {editingEducation ? 'Update' : 'Add'} Education
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Education Records List */}
        <div className="space-y-4">
          {educationRecords.length > 0 ? (
            educationRecords.map((education) => (
              <div key={education.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {education.degree} in {education.fieldOfStudy}
                    </h4>
                    <p className="text-gray-600 mb-2 flex items-center">
                      <FaBuilding className="mr-2 text-gray-400" />
                      {education.institutionName}
                    </p>
                    <p className="text-gray-500 text-sm mb-2 flex items-center">
                      <FaCalendarAlt className="mr-2 text-gray-400" />
                      {education.startYear} - {education.isCurrentlyStudying ? 'Present' : education.endYear || 'N/A'}
                    </p>
                    {education.grade && (
                      <p className="text-gray-500 text-sm mb-2 flex items-center">
                        <FaAward className="mr-2 text-gray-400" />
                        Grade: {education.grade}
                      </p>
                    )}
                    {education.activities && (
                      <p className="text-gray-500 text-sm mb-2">
                        <strong>Activities:</strong> {education.activities}
                      </p>
                    )}
                    {education.description && (
                      <p className="text-gray-600 text-sm mt-3">
                        {education.description}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => startEditEducation(education)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition duration-300"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteEducation(education.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition duration-300"
                        title="Delete"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FaGraduationCap className="text-4xl mx-auto mb-4 opacity-50" />
              <p>No education records found.</p>
              {isEditing && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Add your first education record
                </button>
              )}
            </div>
          )}
        </div>
      </Section>

      {/* Legacy Academic Information */}
      <Section title="Legacy Academic Information" icon={<FaBook />}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This information is from your original registration. 
            Please add detailed education records above for better profile completeness.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            label="Institution"
            value={user.college}
            icon={<FaBuilding />}
          />
          <InfoField
            label="Course/Program"
            value={user.course}
            icon={<FaBook />}
          />
          <InfoField
            label="Department"
            value={user.department}
            icon={<FaGraduationCap />}
          />
          <InfoField
            label="Year of Joining"
            value={user.yearOfJoining}
            icon={<FaCalendarAlt />}
          />
          <InfoField
            label="Graduation Year"
            value={user.passingYear}
            icon={<FaGraduationCap />}
          />
          <InfoField
            label="Admission Type"
            value={user.admissionInFirstYear ? 'Direct (First Year)' : 'Lateral Entry'}
            icon={<FaGraduationCap />}
          />
        </div>
      </Section>

      {/* Academic Timeline */}
      <Section title="Academic Timeline" icon={<FaCalendarAlt />}>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
          <div className="space-y-6">
            <TimelineItem
              year={user.yearOfJoining}
              title="Started Journey"
              description={`Joined ${user.course} in ${user.department}`}
              icon={<FaGraduationCap />}
              color="blue"
            />
            <TimelineItem
              year={user.passingYear}
              title="Graduated"
              description={`Completed ${user.course} from ${user.college}`}
              icon={<FaAward />}
              color="green"
            />
            <TimelineItem
              year={new Date().getFullYear()}
              title="Alumni Member"
              description="Active member of KES Alumni Network"
              icon={<FaUsers />}
              color="purple"
            />
          </div>
        </div>
      </Section>
    </div>
  );
};

// Professional Tab Component
const ProfessionalTab = ({ formData, isEditing, onChange }) => {
  return (
    <div className="space-y-8">
      {/* Current Position */}
      <Section title="Current Position" icon={<FaBriefcase />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProfileField
            label="Job Title"
            name="currentJobTitle"
            value={formData.currentJobTitle}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaBriefcase />}
            placeholder="e.g., Software Engineer, Manager"
          />
          <ProfileField
            label="Company"
            name="currentCompany"
            value={formData.currentCompany}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaBuilding />}
            placeholder="e.g., Google, Microsoft"
          />
          <ProfileField
            label="Current City"
            name="currentCity"
            value={formData.currentCity}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
          <ProfileField
            label="Current Country"
            name="currentCountry"
            value={formData.currentCountry}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
        </div>
      </Section>

      {/* Company Address */}
      <Section title="Work Address" icon={<FaIndustry />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ProfileField
              label="Company Address Line 1"
              name="companyAddressLine1"
              value={formData.companyAddressLine1}
              isEditing={isEditing}
              onChange={onChange}
              icon={<FaBuilding />}
              placeholder="Company street address"
            />
          </div>
          <div className="md:col-span-2">
            <ProfileField
              label="Company Address Line 2"
              name="companyAddressLine2"
              value={formData.companyAddressLine2}
              isEditing={isEditing}
              onChange={onChange}
              icon={<FaBuilding />}
              placeholder="Suite, floor, building, etc. (optional)"
            />
          </div>
          <ProfileField
            label="City"
            name="companyCity"
            value={formData.companyCity}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
          <ProfileField
            label="State"
            name="companyState"
            value={formData.companyState}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
          <ProfileField
            label="Postal Code"
            name="companyPostalCode"
            value={formData.companyPostalCode}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
            placeholder="ZIP/PIN/Postal Code"
          />
          <ProfileField
            label="Country"
            name="companyCountry"
            value={formData.companyCountry}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaMapMarkerAlt />}
          />
        </div>
      </Section>

      {/* Professional Details */}
      <Section title="Professional Details" icon={<FaUserTie />}>
        <div className="space-y-6">
          <TextAreaField
            label="Work Experience"
            name="workExperience"
            value={formData.workExperience}
            isEditing={isEditing}
            onChange={onChange}
            placeholder="Describe your work experience, roles, and responsibilities..."
            rows={4}
          />
          <TextAreaField
            label="Skills & Expertise"
            name="skills"
            value={formData.skills}
            isEditing={isEditing}
            onChange={onChange}
            placeholder="List your technical and soft skills (e.g., JavaScript, Leadership, Project Management)..."
            rows={3}
          />
          <TextAreaField
            label="Achievements & Awards"
            name="achievements"
            value={formData.achievements}
            isEditing={isEditing}
            onChange={onChange}
            placeholder="Share your notable achievements, awards, certifications, or recognitions..."
            rows={3}
          />
        </div>
      </Section>

      {/* Mentorship */}
      <Section title="Mentorship" icon={<FaUsers />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="mentorshipAvailable"
                name="mentorshipAvailable"
                checked={formData.mentorshipAvailable}
                onChange={onChange}
                disabled={!isEditing}
                className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="mentorshipAvailable" className="ml-3 text-lg font-medium text-gray-800">
                Available as Mentor
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Help fellow alumni and students by sharing your experience and knowledge.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="lookingForMentor"
                name="lookingForMentor"
                checked={formData.lookingForMentor}
                onChange={onChange}
                disabled={!isEditing}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="lookingForMentor" className="ml-3 text-lg font-medium text-gray-800">
                Seeking Mentorship
              </label>
            </div>
            <p className="text-sm text-gray-600">
              Connect with experienced alumni who can guide your career journey.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

// Social Tab Component
const SocialTab = ({ formData, isEditing, onChange }) => {
  return (
    <div className="space-y-8">
      {/* Contact Information */}
      <Section title="Contact Information" icon={<FaPhone />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaPhone />
              </div>
              {isEditing ? (
                <select
                  name="countryCode"
                  value={formData.countryCode || '+91'}
                  onChange={onChange}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                >
                  <option value="+91">+91 India</option>
                  <option value="+1">+1 USA</option>
                  <option value="+44">+44 UK</option>
                  <option value="+61">+61 Australia</option>
                  <option value="+971">+971 UAE</option>
                  <option value="+65">+65 Singapore</option>
                  <option value="+49">+49 Germany</option>
                  <option value="+33">+33 France</option>
                  <option value="+81">+81 Japan</option>
                  <option value="+86">+86 China</option>
                </select>
              ) : (
                <div className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                  {formData.countryCode || 'Not provided'}
                </div>
              )}
            </div>
          </div>
          <ProfileField
            label="Primary Phone"
            name="phoneNumber"
            value={formData.phoneNumber}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaPhone />}
            type="tel"
          />
          <ProfileField
            label="WhatsApp Number"
            name="whatsappNumber"
            value={formData.whatsappNumber}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaWhatsapp />}
            type="tel"
          />
          <ProfileField
            label="Secondary Phone"
            name="secondaryPhoneNumber"
            value={formData.secondaryPhoneNumber}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaPhone />}
            type="tel"
          />
        </div>
      </Section>

      {/* Social Media Profiles */}
      <Section title="Social Media & Online Presence" icon={<FaGlobe />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SocialMediaField
            label="LinkedIn"
            name="linkedinProfile"
            value={formData.linkedinProfile}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaLinkedin />}
            color="text-blue-600"
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <SocialMediaField
            label="Personal Website"
            name="personalWebsite"
            value={formData.personalWebsite}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaGlobe />}
            color="text-green-600"
            placeholder="https://yourwebsite.com"
          />
          <SocialMediaField
            label="GitHub"
            name="githubProfile"
            value={formData.githubProfile}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaGithub />}
            color="text-gray-800"
            placeholder="https://github.com/yourusername"
          />
          <SocialMediaField
            label="Instagram"
            name="instagramProfile"
            value={formData.instagramProfile}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaInstagram />}
            color="text-pink-600"
            placeholder="https://instagram.com/yourusername"
          />
          <SocialMediaField
            label="Twitter/X"
            name="twitterProfile"
            value={formData.twitterProfile}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaTwitter />}
            color="text-blue-400"
            placeholder="https://twitter.com/yourusername"
          />
          <SocialMediaField
            label="Facebook"
            name="facebookProfile"
            value={formData.facebookProfile}
            isEditing={isEditing}
            onChange={onChange}
            icon={<FaFacebook />}
            color="text-blue-800"
            placeholder="https://facebook.com/yourprofile"
          />
        </div>
      </Section>
    </div>
  );
};

// Utility Components
const Section = ({ title, icon, children }) => (
  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
      <span className="mr-3 text-gray-600">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div>{icon}</div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, value, subtitle }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
    <div className="flex items-center justify-between mb-3">
      <div>{icon}</div>
      <div className="text-right">
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    <div>
      <p className="text-sm font-medium text-gray-800">{title}</p>
      <p className="text-xs text-gray-600">{subtitle}</p>
    </div>
  </div>
);

const InfoField = ({ label, value, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <div className="pl-10 w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 font-medium">
        {value || 'Not provided'}
      </div>
    </div>
  </div>
);

const ProfileField = ({ label, name, value, isEditing, onChange, icon, type = 'text', placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      ) : (
        <div className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
          {value || 'Not provided'}
        </div>
      )}
    </div>
  </div>
);

const DateField = ({ label, name, value, isEditing, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <FaCalendarAlt />
      </div>
      {isEditing ? (
        <input
          type="date"
          name={name}
          value={value || ''}
          onChange={onChange}
          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      ) : (
        <div className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
          {value ? new Date(value).toLocaleDateString() : 'Not provided'}
        </div>
      )}
    </div>
  </div>
);

const SelectField = ({ label, name, value, isEditing, onChange, options, icon }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      {isEditing ? (
        <select
          name={name}
          value={value || ''}
          onChange={onChange}
          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
          {value ? value.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Not provided'}
        </div>
      )}
    </div>
  </div>
);

const TextAreaField = ({ label, name, value, isEditing, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    {isEditing ? (
      <textarea
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
      />
    ) : (
      <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 min-h-[100px] whitespace-pre-wrap">
        {value || 'Not provided'}
      </div>
    )}
  </div>
);

const SocialMediaField = ({ label, name, value, isEditing, onChange, icon, color, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      <span className={`inline-flex items-center ${color}`}>
        <span className="mr-2">{icon}</span>
        {label}
      </span>
    </label>
    <div className="relative">
      <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none ${color}`}>
        {icon}
      </div>
      {isEditing ? (
        <input
          type="url"
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
        />
      ) : (
        <div className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
          {value ? (
            <a href={value} target="_blank" rel="noopener noreferrer" className={`${color} hover:underline break-all`}>
              {value}
            </a>
          ) : (
            'Not provided'
          )}
        </div>
      )}
    </div>
  </div>
);

const TimelineItem = ({ year, title, description, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    purple: 'bg-purple-600 text-white',
  };

  return (
    <div className="relative flex items-start">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colorClasses[color]} z-10`}>
        {icon}
      </div>
      <div className="ml-6">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
          <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {year || 'N/A'}
          </span>
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

// Utility function to calculate profile completion
const calculateProfileCompletion = (user) => {
  const fields = [
    'fullName', 'email', 'phoneNumber', 'dateOfBirth', 'gender',
    'personalCity', 'personalCountry', 'currentJobTitle', 'currentCompany',
    'bio', 'skills', 'linkedinProfile'
  ];
  
  const completedFields = fields.filter(field => user[field] && user[field].toString().trim() !== '');
  const percentage = Math.round((completedFields.length / fields.length) * 100);
  return isNaN(percentage) ? 0 : percentage;
};

export default ProfilePage;