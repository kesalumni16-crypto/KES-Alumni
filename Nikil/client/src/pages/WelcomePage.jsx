import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const WelcomePage = () => {
  const { user } = useAuth();

  // Slideshow images
  const images = [
    "/images/WhatsApp Image 2025-08-16 at 12.28.05 PM.jpeg",
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
      <div className="relative min-h-[350px] sm:min-h-[500px] md:min-h-[750px] lg:min-h-[850px] flex items-center justify-center overflow-hidden">
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
        <div className="absolute inset-0 bg-black/70 sm:bg-black/60 md:bg-black/50"></div>
        {/* Content */}
        <div className="relative z-10 px-4 sm:px-8 md:px-16 py-8 sm:py-16 max-w-full sm:max-w-2xl text-white flex flex-col justify-center items-center">
          <h1 className="text-xl sm:text-2xl md:text-5xl font-extrabold mb-4 sm:mb-6 text-center">
            Welcome to the <span> KES' Alumni Portal</span>
          </h1>
          <p className="text-base sm:text-lg mb-6 sm:mb-8 text-gray-200 text-center">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {user ? (
              <Link
                to="/profile"
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition duration-300 flex items-center justify-center w-full sm:w-auto"
              >
                View Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-[#b22234] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c1444a] transition duration-300 flex items-center justify-center w-full sm:w-auto"
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
                <Link
                  to="/login"
                  className="bg-[#b22234] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#c1444a] transition duration-300 flex items-center justify-center w-full sm:w-auto"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Features Section */}
      <div className="bg-white py-8 sm:py-16 px-4 sm:px-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#800000] mb-12">
            Why Join Our Alumni Network?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
  <h3 className="text-xl font-semibold text-[#800000] mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default WelcomePage;
