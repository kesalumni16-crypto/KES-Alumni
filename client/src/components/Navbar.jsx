import { Link } from 'react-router-dom';
import kessocietylogo from '../assets/kessocietylogo.svg';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
  <nav className="bg-white shadow-lg border-b-4" style={{ borderBottomColor: '#800000' }}>
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div className="flex flex-col sm:flex-row justify-start items-center py-4 w-full">
        {/* Logo Section */}
        <Link 
          to="/" 
          className="flex items-center space-x-2 sm:space-x-4 group w-full sm:w-auto"
        >
          <img src={kessocietylogo} alt="KES Society Logo" className="h-12 w-10 sm:h-16 sm:w-12 object-contain" />
          <div className="flex flex-col justify-center">
            <span
              className="text-xl sm:text-3xl font-serif font-normal text-black tracking-wide"
              style={{ letterSpacing: '1px' }}
            >
              KES' ALUMNI
            </span>
            <span className="text-xs sm:text-sm font-serif text-black mt-1">
              Kandivli Education Society
            </span>
          </div>
        </Link>
        {/* Authenticated Alumni Buttons */}
        {user && (
          <div className="flex flex-row gap-4 ml-auto mt-4 sm:mt-0">
            <button
              onClick={logout}
              className="bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#a83232] transition duration-150"
            >
              Logout
            </button>
            <button
              onClick={() => navigate('/profile', { state: { editProfile: true } })}
              className="bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#a83232] transition duration-150"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  </nav>
  );
};

export default Navbar;