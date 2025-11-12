import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { 
  FaUserPlus, FaSignInAlt, FaUsers, FaBookOpen, FaBell, 
  FaTimes, FaPlay, FaVolumeUp, FaVolumeMute 
} from 'react-icons/fa';
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

  // Video popup state
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [imageErrors, setImageErrors] = useState(new Set());
  const [isVisible, setIsVisible] = useState(true);
  
  // Refs
  const heroRef = useRef(null);

  // Show video popup after a delay when page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideoPopup(true);
    }, 2000); // Show popup after 2 seconds

    return () => clearTimeout(timer);
  }, []);

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
    }, 4000);

    return () => clearInterval(interval);
  }, [prefersReducedMotion, isVisible, imagesLoaded, images.length]);

  // Handle image errors
  const handleImageError = useCallback((index) => {
    setImageErrors(prev => new Set([...prev, index]));
  }, []);

  // Close video popup
  const handleClosePopup = () => {
    setShowVideoPopup(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setVideoPlaying(false);
    }
  };

  // Toggle video play/pause
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setVideoPlaying(!videoPlaying);
    }
  };

  // Toggle video mute
  const toggleVideoMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoMuted;
      setVideoMuted(!videoMuted);
    }
  };

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showVideoPopup) {
        handleClosePopup();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showVideoPopup]);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showVideoPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showVideoPopup]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Video Popup Modal */}
      {showVideoPopup && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
          onClick={handleClosePopup}
        >
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-4xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClosePopup}
              className="absolute -top-12 right-0 text-white hover:text-red-500 transition-colors duration-300 flex items-center gap-2 text-lg font-semibold"
              aria-label="Close video popup"
            >
              <FaTimes size={24} />
              <span className="hidden sm:inline">Close</span>
            </button>

            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              {/* Video Element */}
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                muted={videoMuted}
                autoPlay
                onPlay={() => setVideoPlaying(true)}
                onPause={() => setVideoPlaying(false)}
                poster="/images/video-poster.jpg" // Optional: Add a poster image
              >
                {/* Replace with your actual video source */}
                <source src="/images/KES Alumni-1920x1080-30.mp4" type="video/mp4" />
                <source src="/videos/alumni-welcome.webm" type="video/webm" />
                {/* YouTube embed alternative */}
                Your browser does not support the video tag.
              </video>

              {/* Custom Video Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleVideoPlay}
                      className="hover:scale-110 transition-transform"
                      aria-label={videoPlaying ? "Pause video" : "Play video"}
                    >
                      <FaPlay size={20} />
                    </button>
                    <button
                      onClick={toggleVideoMute}
                      className="hover:scale-110 transition-transform"
                      aria-label={videoMuted ? "Unmute video" : "Mute video"}
                    >
                      {videoMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                    </button>
                  </div>
                  <div className="text-sm font-semibold">
                    <span className="hidden sm:inline">Welcome to KES Alumni Portal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Description */}
            <div className="mt-4 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                Welcome to KES Alumni Network
              </h3>
              <p className="text-gray-300 text-lg">
                Join 50,000+ alumni connecting across the globe
              </p>
            </div>

            {/* Skip Video Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleClosePopup}
                className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105"
              >
                Continue to Portal
              </button>
            </div>
          </div>
        </div>
      )}

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
          <h1 className="text-3xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in">
            Welcome to the <span className="text-primary">Alumni Portal</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed max-w-2xl animate-fade-in-delay">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fade-in-delay-2">
            {/* Watch Video Button */}
            <button
              onClick={() => setShowVideoPopup(true)}
              className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center justify-center text-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <FaPlay className="mr-3" /> Watch Welcome Video
            </button>

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

      {/* Additional Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-fade-in-delay-2 {
          animation: fade-in 0.8s ease-out 0.4s both;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-fade-in-delay,
          .animate-fade-in-delay-2,
          .animate-scale-in {
            animation: none;
          }
        }
      `}</style>
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
