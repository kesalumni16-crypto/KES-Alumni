import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUserPlus, FaSignInAlt, FaUsers, FaBookOpen, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef, useCallback } from 'react';

const WelcomePage = () => {
  const { user } = useAuth();
  
  // Slideshow images with proper alt text
  const images = [
    {
      src: "/images/WhatsApp Image 2025-08-16 at 12.28.05 PM.jpeg",
      alt: "Alumni networking event with graduates connecting and sharing experiences"
    },
    {
      src: "/images/WhatsApp Image 2025-08-16 at 12.28.24 PM.jpeg", 
      alt: "Campus seminar featuring successful alumni as guest speakers"
    },
    {
      src: "/images/WhatsApp Image 2025-08-16 at 12.29.38 PM.jpeg",
      alt: "Annual reunion celebration with alumni from various graduating classes"
    }
  ];

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isVisible, setIsVisible] = useState(true);
  
  // Refs
  const heroRef = useRef(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Preload images
  useEffect(() => {
    const imagePromises = images.map((image, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(index);
        img.onerror = () => {
          setImageErrors(prev => new Set([...prev, index]));
          resolve(index);
        };
        img.src = image.src;
      });
    });

    Promise.all(imagePromises).then(() => {
      setImagesLoaded(true);
    });
  }, []);

  // Intersection Observer for performance
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (prefersReducedMotion || !isVisible || !imagesLoaded) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4 seconds per slide

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isVisible, imagesLoaded, images.length]);

  // Handle image errors
  const handleImageError = useCallback((index) => {
    setImageErrors(prev => new Set([...prev, index]));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section / Auto Slideshow */}
      <section 
        ref={heroRef}
        className="relative min-h-[500px] sm:min-h-[500px] md:min-h-[750px] lg:min-h-[850px] flex items-center justify-center overflow-hidden"
        role="region"
        aria-label="Alumni showcase slideshow"
        aria-live="polite"
      >
        {/* Loading state */}
        {!imagesLoaded && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-5">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
              <p>Loading images...</p>
            </div>
          </div>
        )}

        {/* Background Slideshow */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((image, index) => (
            <div key={index} className="absolute inset-0">
              {!imageErrors.has(index) ? (
                <img
                  src={image.src}
                  alt={image.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
                  }`}
                  onError={() => handleImageError(index)}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-6xl mb-4">🎓</div>
                    <p>Alumni Image {index + 1}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dark overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>

        {/* Screen reader announcements */}
        <div 
          className="sr-only" 
          aria-live="polite" 
          aria-atomic="true"
          role="status"
        >
          {imagesLoaded && !prefersReducedMotion && `Slide ${currentIndex + 1} of ${images.length}: ${images[currentIndex]?.alt}`}
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-8 md:px-16 py-16 max-w-4xl text-white flex flex-col justify-center">
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome to the <span className="text-primary">Alumni Portal</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-2xl">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {user ? (
              <Link
                to="/profile"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center text-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent"
              >
                View Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-all duration-300 flex items-center justify-center text-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  <FaUserPlus className="mr-3" /> Register Now
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border-2 border-accent text-primary px-8 py-4 rounded-lg font-semibold hover:bg-accent hover:text-white transition-all duration-300 flex items-center justify-center text-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  <FaSignInAlt className="mr-3" /> Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-secondary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text mb-6">
              Why Join Our Alumni Network?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the benefits of staying connected with your alma mater and fellow graduates
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard 
              icon={<FaUsers />}
              title="Connect with Alumni" 
              description="Build meaningful connections with alumni from various batches and departments. Network, collaborate, and grow together."
            />
            <FeatureCard 
              icon={<FaBookOpen />}
              title="Access Resources" 
              description="Get exclusive access to resources, job opportunities, mentorship programs, and career development tools."
            />
            <FeatureCard 
              icon={<FaBell />}
              title="Stay Updated" 
              description="Stay informed about the latest events, reunions, news from your alma mater, and achievements of fellow alumni."
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ title, description, icon }) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center group hover:-translate-y-2 border border-gray-100">
      <div className="text-5xl text-primary mb-6 group-hover:scale-110 transition-transform duration-300 flex justify-center">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-text mb-4 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed text-lg">
        {description}
      </p>
    </div>
  );
};

export default WelcomePage;
