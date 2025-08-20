import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaGraduationCap, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-red-900 via-red-800 to-red-700 shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-6">
          
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <FaGraduationCap className="text-white text-4xl group-hover:scale-110 transform transition duration-300" />
            <span className="text-3xl font-extrabold tracking-wide text-white group-hover:text-yellow-300 transition duration-300">
              KES' Alumni
            </span>
          </Link>
          
          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="flex items-center text-gray-200 hover:text-yellow-300 transition duration-200"
                >
                  <FaUser className="mr-2" />
                  <span className="font-medium">Profile</span>
                </Link>
                <button 
                  onClick={logout}
                  className="flex items-center text-gray-200 hover:text-red-300 transition duration-200"
                >
                  <FaSignOutAlt className="mr-2" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
