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
    <nav className="nav-professional sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <div className="h-12 w-12 bg-gradient-to-br from-deloitte-deep-green to-deloitte-green rounded-full flex items-center justify-center shadow-professional group-hover:shadow-professional-lg transition-all duration-300">
              <FaGraduationCap className="text-white text-2xl group-hover:scale-110 transform transition duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-deloitte-deep-green group-hover:text-deloitte-green transition duration-300">
                KES Alumni Portal
              </span>
              <span className="text-xs text-deloitte-dark-gray font-medium">
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
                className={`nav-link ${
                  isActive(item.path)
                    ? 'active'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Auth Section */}
            <div className="flex items-center space-x-4 ml-6 pl-6 border-l border-deloitte-light-gray">
              {user ? (
                <>
                  <Link 
                    to="/profile" 
                    className={`nav-link flex items-center ${
                      isActive('/profile')
                        ? 'active'
                        : ''
                    }`}
                  >
                    <FaUser className="mr-2" />
                    Dashboard
                  </Link>
                  <button 
                    onClick={logout}
                    className="btn-primary flex items-center"
                  >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary flex items-center"
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
              className="text-deloitte-dark-gray hover:text-deloitte-deep-green focus:outline-none focus:text-deloitte-deep-green transition duration-300"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-deloitte-light-gray py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium rounded-professional transition-all duration-300 ${
                    isActive(item.path)
                      ? 'text-deloitte-deep-green bg-deloitte-light-gray border-l-4 border-deloitte-deep-green'
                      : 'text-deloitte-dark-gray hover:text-deloitte-deep-green hover:bg-deloitte-light-gray'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-deloitte-light-gray pt-4 mt-4">
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-professional transition-all duration-300 ${
                        isActive('/profile')
                          ? 'text-deloitte-deep-green bg-deloitte-light-gray border-l-4 border-deloitte-deep-green'
                          : 'text-deloitte-dark-gray hover:text-deloitte-deep-green hover:bg-deloitte-light-gray'
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
                      className="flex items-center w-full px-4 py-3 text-sm font-medium text-deloitte-dark-gray hover:text-deloitte-deep-green hover:bg-deloitte-light-gray rounded-professional transition duration-300"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary flex items-center mx-4"
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