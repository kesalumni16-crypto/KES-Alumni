import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaGlobe, FaBriefcase, FaNewspaper, FaArrowLeft, FaClock, FaEnvelope, FaCheck } from 'react-icons/fa';

// Move constants outside component to prevent recalculation
const LAUNCH_DATE = new Date();
LAUNCH_DATE.setMonth(LAUNCH_DATE.getMonth() + 3);

const SECTION_CONFIGS = {
  'alumni-globe': {
    title: 'Alumni Globe',
    icon: <FaGlobe className="text-6xl text-blue-600" />,
    description: 'Connect with alumni worldwide through our interactive global network',
    features: [
      'Interactive world map showing alumni locations',
      'Global networking opportunities',
      'Regional alumni chapters',
      'International events and meetups'
    ],
    gradientClass: 'bg-gradient-to-r from-blue-800 via-blue-700 to-blue-600',
    accentClass: 'bg-blue-100',
    dotClass: 'bg-blue-600',
    ringClass: 'focus:ring-blue-500'
  },
  'career': {
    title: 'Career Center',
    icon: <FaBriefcase className="text-6xl text-green-600" />,
    description: 'Your gateway to career opportunities and professional development',
    features: [
      'Job board with exclusive alumni opportunities',
      'Career mentorship programs',
      'Professional development workshops',
      'Industry networking events'
    ],
    gradientClass: 'bg-gradient-to-r from-green-800 via-green-700 to-green-600',
    accentClass: 'bg-green-100',
    dotClass: 'bg-green-600',
    ringClass: 'focus:ring-green-500'
  },
  'news-events': {
    title: 'News & Events',
    icon: <FaNewspaper className="text-6xl text-purple-600" />,
    description: 'Stay updated with the latest news, events, and alumni achievements',
    features: [
      'Latest KES news and updates',
      'Alumni success stories',
      'Upcoming events and reunions',
      'Photo galleries and memories'
    ],
    gradientClass: 'bg-gradient-to-r from-purple-800 via-purple-700 to-purple-600',
    accentClass: 'bg-purple-100',
    dotClass: 'bg-purple-600',
    ringClass: 'focus:ring-purple-500'
  }
};

const ComingSoonPage = () => {
  const { section } = useParams();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Memoize section info to prevent recalculation
  const sectionInfo = useMemo(() => {
    return SECTION_CONFIGS[section] || {
      title: 'Page Not Found',
      icon: <FaClock className="text-6xl text-gray-600" />,
      description: 'The section you\'re looking for doesn\'t exist',
      features: [],
      gradientClass: 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600',
      accentClass: 'bg-gray-100',
      dotClass: 'bg-gray-600',
      ringClass: 'focus:ring-gray-500'
    };
  }, [section]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = LAUNCH_DATE.getTime() - now;
      
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Here you would typically make an API call to subscribe the email
      console.log('Email submitted:', email);
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const CountdownCard = ({ value, label }) => (
    <div className="bg-red-50 rounded-lg p-4 transform transition-transform hover:scale-105">
      <div className="text-3xl font-bold text-red-600" aria-label={`${value} ${label}`}>
        {value}
      </div>
      <div className="text-gray-600 text-sm">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className={`${sectionInfo.gradientClass} text-white py-16`}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="mb-6" aria-hidden="true">
              {sectionInfo.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{sectionInfo.title}</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8">
              {sectionInfo.description}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
              aria-label="Go back to home page"
            >
              <FaArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Countdown Timer */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Launching Soon</h2>
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
            role="timer"
            aria-live="polite"
            aria-label="Time remaining until launch"
          >
            <CountdownCard value={timeLeft.days} label="Days" />
            <CountdownCard value={timeLeft.hours} label="Hours" />
            <CountdownCard value={timeLeft.minutes} label="Minutes" />
            <CountdownCard value={timeLeft.seconds} label="Seconds" />
          </div>
        </div>

        {/* Features Preview */}
        {sectionInfo.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectionInfo.features.map((feature, index) => (
                <div key={index} className="flex items-start group">
                  <div className={`${sectionInfo.accentClass} rounded-full p-2 mr-4 mt-1 group-hover:shadow-md transition-shadow`}>
                    <div className={`w-2 h-2 ${sectionInfo.dotClass} rounded-full`}></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8 text-center">
          <FaEnvelope className="text-4xl mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold mb-4">Get Notified When We Launch</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Be the first to know when {sectionInfo.title.toLowerCase()} goes live. We'll send you an email as soon as it's ready!
          </p>
          
          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 ${sectionInfo.ringClass} disabled:bg-gray-200 disabled:cursor-not-allowed`}
                  aria-label="Email address for notifications"
                />
                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    'Notify Me'
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-sm mt-2" role="alert">
                  {error}
                </p>
              )}
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center text-green-400 mb-4">
                <FaCheck className="text-2xl mr-2" />
                <span className="text-xl font-semibold">Successfully Subscribed!</span>
              </div>
              <p className="text-gray-300">
                Thank you for subscribing! We'll notify you as soon as {sectionInfo.title.toLowerCase()} is ready.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="mt-4 text-blue-400 hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Subscribe another email
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
