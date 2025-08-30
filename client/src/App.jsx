import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage'; // Now Alumni Dashboard
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AboutPage from './pages/AboutPage';
import ComingSoonPage from './pages/ComingSoonPage';

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
      <Route path="/profile" element={<ProfilePage />} /> {/* Alumni Dashboard */}
      <Route path="/superadmin" element={<SuperAdminDashboard />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/coming-soon/:section" element={<ComingSoonPage />} />
      <Route path="/alumni-globe" element={<ComingSoonPage />} />
      <Route path="/career" element={<ComingSoonPage />} />
      <Route path="/news-events" element={<ComingSoonPage />} />
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