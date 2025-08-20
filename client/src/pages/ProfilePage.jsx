import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProfileForm from '../components/ProfileForm';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBuilding } from 'react-icons/fa';

const ProfilePage = () => {
  const { user, loading, logout } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Summary Card */}
          <div className="w-full md:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-6">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl mx-auto">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">{user.fullName || 'Alumni'}</h2>
                <p className="text-gray-600">{user.department} - {user.course}</p>
              </div>
              
              <div className="space-y-4">
                <ProfileInfoItem icon={<FaEnvelope />} label="Email" value={user.email} />
                <ProfileInfoItem icon={<FaPhone />} label="Phone" value={user.phoneNumber} />
                <ProfileInfoItem 
                  icon={<FaGraduationCap />} 
                  label="Education" 
                  value={`${user.yearOfJoining} - ${user.passingYear}`} 
                />
                <ProfileInfoItem icon={<FaBuilding />} label="College" value={user.college} />
              </div>
              
              <div className="mt-8">
                <button
                  onClick={logout}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Profile Edit Form */}
          <div className="w-full md:w-2/3">
            <ProfileForm />
          </div>
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