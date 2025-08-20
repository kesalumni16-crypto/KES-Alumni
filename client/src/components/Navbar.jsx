import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
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
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FaGraduationCap className="text-white text-2xl group-hover:scale-110 transform transition duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-red-800 group-hover:text-red-600 transition duration-300">
                KES Alumni Portal
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
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:border-b-2 hover:border-red-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-gray-300">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ${
                      isActive('/profile')
                        ? 'text-red-600 border-b-2 border-red-600'
                        : 'text-gray-700 hover:text-red-600'
                    }`}
                  >
                    <FaUser className="mr-2" />
                    Profile
                  </Link>
                  <button 
                    onClick={logout}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
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
              className="text-gray-700 hover:text-red-600 focus:outline-none focus:text-red-600 transition duration-300"
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
                  className={`px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-all duration-300 ${
                        isActive('/profile')
                          ? 'text-red-600 bg-red-50 border-l-4 border-red-600'
                          : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      <FaUser className="mr-3" />
                      Profile
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-md transition duration-300"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition duration-300"
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