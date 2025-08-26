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
      <div className="relative min-h-[500px] sm:min-h-[500px] md:min-h-[750px] lg:min-h-[850px] flex items-center justify-center overflow-hidden">
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
        {/* Professional dark overlay for visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/60 to-deloitte-deep-green/40"></div>
        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 py-16 max-w-3xl text-white flex flex-col justify-center animate-fade-in-up">
          <h1 className="text-3xl md:text-6xl font-black mb-6 leading-tight">
            Welcome to the <span className="text-deloitte-green">Alumni Portal</span>
          </h1>
          <p className="text-xl mb-8 text-gray-200 font-light leading-relaxed">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities from KES Institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link
                to="/profile"
                className="btn-primary text-center hover-lift"
              >
                View Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary text-center hover-lift"
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
                <Link
                  to="/login"
                  className="btn-secondary text-center hover-lift border-white text-white hover:bg-white hover:text-deloitte-deep-green"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-deloitte-light-gray section-padding">
        <div className="container-professional">
          <h2 className="text-4xl font-black text-center text-deloitte-black mb-4">
            Why Join Our Alumni Network?
          </h2>
          <p className="text-center text-deloitte-dark-gray mb-12 text-lg max-w-2xl mx-auto">
            Discover the benefits of being part of our thriving alumni community
          </p>
          <div className="grid-3 grid-professional">
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
    <div className="card-professional text-center hover-lift animate-fade-in-up">
      <div className="card-content">
        <h3 className="text-xl font-bold text-deloitte-black mb-3">{title}</h3>
        <p className="text-professional">{description}</p>
      </div>
    </div>
  );
};

export default WelcomePage;
