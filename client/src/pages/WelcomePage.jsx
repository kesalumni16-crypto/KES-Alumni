import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const WelcomePage = () => {
  const { user } = useAuth();

  // Slideshow images
  const images = [
    "/images/WhatsApp Image 2025-08-16 at 12.28.24 PM.jpeg",
    "/images/WhatsApp Image 2025-08-16 at 12.29.38 PM.jpeg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // 2 sec auto-slide
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Slideshow as complete background */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Slide ${index + 1}`}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
        {/* Stronger dark overlay for visibility */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/50"></div>
        {/* Content */}
        <div className="relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 py-8 sm:py-12 md:py-16 max-w-4xl text-white flex flex-col justify-center text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 leading-tight">
            Welcome to the <span className="text-yellow-400">Alumni Portal</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-200 leading-relaxed max-w-2xl">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start">
            {user ? (
              <Link
                to="/profile"
                className="w-full sm:w-auto bg-yellow-400 text-red-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300 flex items-center justify-center text-base sm:text-lg"
              >
                View Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto bg-yellow-400 text-red-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300 flex items-center justify-center text-base sm:text-lg"
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto bg-transparent border-2 border-yellow-400 text-yellow-400 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-yellow-500 hover:text-red-900 transition duration-300 flex items-center justify-center text-base sm:text-lg"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            Why Join Our Alumni Network?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard 
              title="Connect with Alumni" 
              description="Build meaningful connections with alumni from various batches and departments."
            />
            <FeatureCard 
              title="Access Resources" 
              description="Get exclusive access to resources, job opportunities, and mentorship programs."
            />
            <FeatureCard 
              title="Stay Updated" 
              description="Stay informed about the latest events, reunions, and news from your alma mater."
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-gray-50 p-6 sm:p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">{title}</h3>
      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{description}</p>
    </div>
  );
};

export default WelcomePage;
