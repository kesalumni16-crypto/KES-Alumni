import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUserShield, FaCog } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Alumni Globe', path: '/alumni-globe' },
    { name: 'Career', path: '/career' },
    { name: 'News/Events', path: '/news-events' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Function to get dashboard items based on user role
  const getDashboardItems = () => {
    if (!user) return [];

    const items = [];

    // SuperAdmin gets only SuperAdmin access
    if (user.role === 'SUPERADMIN') {
      items.push({
        name: 'SuperAdmin',
        path: '/superadmin',
        icon: <FaUserShield className="mr-2" />,
        color: 'text-red-600'
      });
    }
    // Admin gets only Admin access
    else if (user.role === 'ADMIN') {
      items.push({
        name: 'Admin',
        path: '/admin',
        icon: <FaCog className="mr-2" />,
        color: 'text-orange-600'
      });
    }

    // All authenticated users get Dashboard
    items.push({
      name: 'Dashboard',
      path: '/profile',
      icon: <FaUser className="mr-2" />,
      color: 'text-gray-700'
    });

    return items;
  };

  const dashboardItems = getDashboardItems();

  return (
    <nav className="bg-white shadow-lg border-b-4 border-primary">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">

          {/* Logo Section */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div
              className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden"
              style={{
                backgroundColor: 'var(--accent)',      // White background (#FFFFFF)
                boxShadow: `0 0 0 2px var(--primary)`, // Green ring with thickness 2px (#86BC25)
              }}
            >
              <img
                src="/public/images/KES Society Logo.png"
                alt="KES Logo"
                className="h-10 w-10 object-contain group-hover:scale-110 transform transition duration-300"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary group-hover:opacity-80 transition duration-300">
                KES Alumni
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Kandivli Education Society
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive(item.path)
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-700 hover:text-primary hover:border-b-2 hover:border-blue-300'
                  }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-300">
              {user ? (
                <>
                  {/* Dashboard Items */}
                  {dashboardItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${isActive(item.path)
                        ? 'text-primary border-b-2 border-primary'
                        : `${item.color} hover:text-primary`
                        }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}

                  <button
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition duration-300"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition duration-300"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary focus:outline-none focus:text-primary transition duration-300"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${isActive(item.path)
                    ? 'text-primary bg-secondary border-l-4 border-primary'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                    }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {user ? (
                  <>
                    {/* Mobile Dashboard Items */}
                    {dashboardItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${isActive(item.path)
                          ? 'text-primary bg-secondary border-l-4 border-primary'
                          : `${item.color} hover:text-primary hover:bg-gray-50`
                          }`}
                      >
                        {item.icon}
                        {item.name}
                      </Link>
                    ))}

                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-primary hover:bg-gray-50 rounded-md transition duration-300"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark transition duration-300"
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
