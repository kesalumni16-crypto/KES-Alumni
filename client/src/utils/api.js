import axios from 'axios';

const API_URL = 'https://kes-alumni-bhz1.vercel.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  sendOTP: (data) => api.post('/auth/send-otp', data),
  register: (data) => api.post('/auth/register', data),
  sendLoginOTP: (data) => api.post('/auth/send-login-otp', data),
  verifyLoginOTP: (data) => api.post('/auth/verify-login-otp', data),
};

// Profile API
export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getDashboardStats: () => api.get('/profile/stats'),
};

// SuperAdmin API
export const superadminAPI = {
  getAllUsers: (params) => api.get('/superadmin/users', { params }),
  getUserById: (userId) => api.get(`/superadmin/users/${userId}`),
  updateUserRole: (userId, role) => api.put(`/superadmin/users/${userId}/role`, { role }),
  updateUserDetails: (userId, data) => api.put(`/superadmin/users/${userId}`, data),
  deleteUser: (userId) => api.delete(`/superadmin/users/${userId}`),
  getStats: () => api.get('/superadmin/stats'),
  toggleMaintenanceMode: (data) => api.post('/superadmin/maintenance', data),
  getMaintenanceMode: () => api.get('/superadmin/maintenance'),
};

// Maintenance API (public)
export const maintenanceAPI = {
  getStatus: () => api.get('/maintenance/status'),
};

export default api;