import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationData, setRegistrationData] = useState(null);
  
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
      setLoading(true);
      const response = await authAPI.sendOTP(data);
      setRegistrationData({
        ...data,
        alumniId: response.data.alumniId,
      });
      toast.success('OTP sent successfully');
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      toast.error(error.response?.data?.message || 'Failed to send OTP');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Register user
  const register = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.register({
        ...registrationData,
        ...data,
      });
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Registration successful');
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Login user
  const login = async (data) => {
    try {
      setLoading(true);
      const response = await authAPI.login(data);
      
      // Save token and user data
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Login successful');
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    } finally {
      setLoading(false);
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
      setLoading(true);
      const response = await profileAPI.updateProfile(data);
      setUser(response.data.alumni);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const value = {
    user,
    loading,
    registrationData,
    setRegistrationData,
    sendOTP,
    register,
    login,
    logout,
    updateProfile,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};