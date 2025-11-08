import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';


// Components
import Navbar from './components/Navbar';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Now Alumni Dashboard
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import ComingSoonPage from './pages/ComingSoonPage';
import CareerPage from './pages/CareerPage';
import AlumniGlobePage from './pages/AlumniGlobePage';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/profile" replace />;
  }
  
  return children;
};

// Component to handle route persistence
const RouteHandler = () => {
  const location = useLocation();
  
  // Store current route in sessionStorage
  React.useEffect(() => {
    sessionStorage.setItem('currentRoute', location.pathname);
  }, [location.pathname]);
  
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute allowedRoles={['ALUMNI', 'ADMIN', 'SUPERADMIN']}>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPERADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/superadmin" 
        element={
          <ProtectedRoute allowedRoles={['SUPERADMIN']}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/alumni-globe" element={<AlumniGlobePage />} />
      <Route path="/career" element={<CareerPage />} />
      <Route path="/news-events" element={<ComingSoonPage />} />
      <Route path="/coming-soon/:section" element={<ComingSoonPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Navbar />
        <RouteHandler />
      </Router>
    </AuthProvider>
  );
};

export default App;