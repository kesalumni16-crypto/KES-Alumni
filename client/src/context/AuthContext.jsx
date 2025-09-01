import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI, maintenanceAPI } from '../utils/api';
import toast from 'react-hot-toast';
import MaintenanceMode from '../components/MaintenanceMode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(null);
  const [registrationData, setRegistrationData] = useState(null);
  
  // Check maintenance mode on app load
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await maintenanceAPI.getStatus();
        setMaintenanceMode(response.data);
      } catch (error) {
        console.error('Error checking maintenance mode:', error);
      }
    };
    
    checkMaintenanceMode();
  }, []);
  
  // Check if user is logged in on page load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await profileAPI.getProfile();
          setUser(response.data.alumni);
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Send OTP for registration
  const sendOTP = async (data) => {
    try {
      const response = await authAPI.sendOTP(data);
      setRegistrationData({
        ...data,
        alumniId: response.data.alumniId,
      });
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  };
  
  // Register user
  const register = async (data) => {
    try {
      const response = await authAPI.register({
        ...data,
      });
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  // Send login OTP
  const sendLoginOTP = async (data) => {
    try {
      const response = await authAPI.sendLoginOTP(data);
      return response.data;
    } catch (error) {
      console.error('Send login OTP error:', error);
      throw error;
    }
  };
  
  // Verify login OTP
  const verifyLoginOTP = async (data) => {
    try {
      const response = await authAPI.verifyLoginOTP(data);
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Verify login OTP error:', error);
      throw error;
    }
  };
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };
  
  // Update profile
  const updateProfile = async (data) => {
    try {
      const response = await profileAPI.updateProfile(data);
      setUser(response.data.alumni);
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };
  
  // If maintenance mode is enabled and user is not admin/superadmin, show maintenance page
  if (maintenanceMode?.isEnabled && user && !['ADMIN', 'SUPERADMIN'].includes(user.role)) {
    return <MaintenanceMode message={maintenanceMode.message} />;
  }
  
  // If maintenance mode is enabled and no user is logged in, show maintenance page
  if (maintenanceMode?.isEnabled && !user) {
    return <MaintenanceMode message={maintenanceMode.message} />;
  }
  
  const value = {
    user,
    loading,
    maintenanceMode,
    registrationData,
    setRegistrationData,
    sendOTP,
    register,
    sendLoginOTP,
    verifyLoginOTP,
    logout,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};