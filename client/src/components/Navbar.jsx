import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt, FaBars, FaTimes, FaUserShield } from 'react-icons/fa';
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

  return (
    <nav className="bg-white shadow-lg border-b-4 border-red-600">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 sm:py-4">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FaGraduationCap className="text-white text-lg sm:text-2xl group-hover:scale-110 transform transition duration-300" />
            </div>
            <div className="flex flex-col hidden sm:block">
              <span className="text-xl sm:text-2xl font-bold text-red-800 group-hover:text-red-600 transition duration-300">
                KES Alumni Portal
              </span>
              <span className="text-xs text-gray-600 font-medium">
                Kandivli Education Society
              </span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:border-b-2 hover:border-red-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="flex items-center space-x-3 xl:space-x-4 ml-4 xl:ml-6 pl-4 xl:pl-6 border-l border-gray-300">
              {user ? (
                <>
                  {user.role === 'SUPERADMIN' && (
                    <Link 
                      to="/superadmin" 
                      className={`flex items-center px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-300 ${
                        isActive('/superadmin')
                          ? 'text-red-600 border-b-2 border-red-600'
                          : 'text-gray-700 hover:text-red-600'
                      }`}
                    >
                      <FaUserShield className="mr-2" />
                      SuperAdmin
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className={`flex items-center px-2 xl:px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive('/profile')
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center px-3 xl:px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    <FaSignOutAlt className="mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-3 xl:px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
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
              className="text-gray-700 hover:text-red-600 focus:outline-none focus:text-red-600 transition duration-300 p-2"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {user ? (
                  <>
                    {user.role === 'SUPERADMIN' && (
                      <Link 
                        to="/superadmin" 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                          isActive('/superadmin')
                            ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                            : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                        }`}
                      >
                        <FaUserShield className="mr-3" />
                        SuperAdmin
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                        isActive('/profile')
                          ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <FaUser className="mr-3" />
                      Dashboard
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition duration-300"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
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