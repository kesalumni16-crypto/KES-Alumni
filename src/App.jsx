@@ .. @@
import ProfilePage from './pages/ProfilePage'; // Now Alumni Dashboard
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminDashboard from './pages/AdminDashboard';
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
+      <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/superadmin" element={<SuperAdminDashboard />} />
-      <Route path="/admin" element={<AdminDashboard />} />
       <Route path="/about" element={<AboutPage />} />
       <Route path="/coming-soon/:section" element={<ComingSoonPage />} />
       <Route path="/alumni-globe" element={<ComingSoonPage />} />
       <Route path="/career" element={<ComingSoonPage />} />
       <Route path="/news-events" element={<ComingSoonPage />} />
       <Route path="*" element={<Navigate to="/" replace />} />
     </Routes>
   );
 };