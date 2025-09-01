import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaUserPlus, FaSignInAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useMemo, useRef } from 'react';

const images = [
  {
    src: "/images/WhatsApp Image 2025-08-16 at 12.28.05 PM.jpeg",
    alt: "Alumni networking event group photo",
  },
  {
    src: "/images/WhatsApp Image 2025-08-16 at 12.28.24 PM.jpeg",
    alt: "Campus seminar with alumni speaker",
  },
  {
    src: "/images/WhatsApp Image 2025-08-16 at 12.29.38 PM.jpeg",
    alt: "Reunion celebration on campus",
  },
];

const WelcomePage = () => {
  const { user } = useAuth();

  // Reduced motion preference
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(true); // pause/play control
  const heroRef = useRef(null); // for IntersectionObserver

  // Auto-advance slides (disabled when reduced motion or paused)
  useEffect(() => {
    if (!playing || prefersReducedMotion) return;
    const id = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, 4000);
    return () => clearInterval(id);
  }, [playing, prefersReducedMotion]);

  // Pause carousel when hero is not visible
  useEffect(() => {
    if (!heroRef.current || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        // Pause when off-screen, resume when on-screen (unless user paused manually)
        if (!entry.isIntersecting) setPlaying(false);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );
    obs.observe(heroRef.current);
    return () => obs.disconnect();
  }, []);

  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
  const goNext = () =>
    setCurrentIndex((i) => (i + 1) % images.length);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section / Carousel */}
      <section
        ref={heroRef}
        className="relative min-h-[500px] sm:min-h-[500px] md:min-h-[750px] lg:min-h-[850px] flex items-center justify-center overflow-hidden"
        role="region"
        aria-label="Featured alumni photos"
        aria-roledescription="carousel"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, index) => (
            <picture key={index} className="absolute inset-0">
              {/* Example art-direction hook; add <source> when alternate crops are available */}
              {/* <source srcSet={`${img.srcSmall} 1x, ${img.srcSmall2x} 2x`} media="(max-width: 640px)" /> */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                // Example resolution switching; replace with real variants when available
                srcSet={`${img.src} 800w, ${img.src} 1200w`}
                sizes="(max-width: 640px) 100vw, 100vw"
                className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </picture>
          ))}
        </div>

        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-black/60 md:bg-black/50" />

        {/* Controls (skip if reduced motion to avoid auto-play UX) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="px-3 py-2 rounded bg-white/80 text-gray-900 hover:bg-white"
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            className="px-3 py-2 rounded bg-white/80 text-gray-900 hover:bg-white"
            aria-pressed={!prefersReducedMotion && playing}
            aria-label={(!prefersReducedMotion && playing) ? 'Pause slide rotation' : 'Play slide rotation'}
            disabled={prefersReducedMotion}
            title={prefersReducedMotion ? 'Motion reduced by preference' : undefined}
          >
            {(!prefersReducedMotion && playing) ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            onClick={goNext}
            className="px-3 py-2 rounded bg-white/80 text-gray-900 hover:bg-white"
            aria-label="Next slide"
          >
            ›
          </button>
        </div>

        {/* Live status for screen readers */}
        <div className="sr-only" role="status" aria-live="polite">
          Slide {currentIndex + 1} of {images.length}
        </div>

        {/* Content */}
        <div className="relative z-10 px-8 md:px-16 py-16 max-w-2xl text-white flex flex-col justify-center">
          <h1 className="text-2xl md:text-5xl font-extrabold mb-6">
            Welcome to the <span className="text-yellow-400">Alumni Portal</span>
          </h1>
          <p className="text-lg mb-8 text-gray-200">
            Connect with fellow alumni, share experiences, and stay updated with the latest events and opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {user ? (
              <Link
                to="/profile"
                className="bg-yellow-400 text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300 flex items-center justify-center"
              >
                View Profile
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-red-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition duration-300 flex items-center justify-center"
                >
                  <FaUserPlus className="mr-2" /> Register
                </Link>
                <Link
                  to="/login"
                  className="bg-transparent border border-yellow-400 text-yellow-400 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 hover:text-red-900 transition duration-300 flex items-center justify-center"
                >
                  <FaSignInAlt className="mr-2" /> Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
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

      <Footer />
    </div>
  );
};

const FeatureCard = ({ title, description }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 text-center">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default WelcomePage;
