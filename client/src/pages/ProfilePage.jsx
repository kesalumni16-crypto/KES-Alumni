import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  // Only show edit form if location.state?.editProfile is true
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) return null; // This will prevent rendering before redirect happens

  // Only show edit form if location.state?.editProfile is true
  const showEdit = location.state && location.state.editProfile;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-8 items-center">
          {showEdit && (
            <div className="w-full max-w-2xl">
              <ProfileForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProfileInfoItem = ({ icon, label, value }) => {
  if (!value) return null;
  
  return (
    <div className="flex items-center">
      <div className="text-blue-500 mr-3">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default ProfilePage;