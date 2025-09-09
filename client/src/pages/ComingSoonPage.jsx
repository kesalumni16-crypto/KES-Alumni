import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FaGlobe, FaBriefcase, FaNewspaper, FaArrowLeft, FaClock, FaEnvelope } from 'react-icons/fa';

const ComingSoonPage = () => {
  const { section } = useParams();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set launch date (example: 3 months from now)
  const launchDate = new Date();
  launchDate.setMonth(launchDate.getMonth() + 3);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  // Color mappings for different sections
  const colorMappings = {
    'alumni-globe': {
      gradient: 'from-blue-800 via-blue-700 to-blue-600',
      iconColor: 'text-blue-600',
      featureDot: 'bg-blue-100',
      featureDotInner: 'bg-blue-600'
    },
    'career': {
      gradient: 'from-green-800 via-green-700 to-green-600', 
      iconColor: 'text-green-600',
      featureDot: 'bg-green-100',
      featureDotInner: 'bg-green-600'
    },
    'news-events': {
      gradient: 'from-purple-800 via-purple-700 to-purple-600',
      iconColor: 'text-purple-600', 
      featureDot: 'bg-purple-100',
      featureDotInner: 'bg-purple-600'
    },
    'default': {
      gradient: 'from-gray-800 via-gray-700 to-gray-600',
      iconColor: 'text-gray-600',
      featureDot: 'bg-gray-100', 
      featureDotInner: 'bg-gray-600'
    }
  };

  const getSectionInfo = () => {
    switch (section) {
      case 'alumni-globe':
        return {
          title: 'Alumni Globe',
          icon: <FaGlobe className="text-6xl text-blue-600" />,
          description: 'Connect with alumni worldwide through our interactive global network',
          features: [
            'Interactive world map showing alumni locations',
            'Global networking opportunities',
            'Regional alumni chapters',
            'International events and meetups'
          ],
          colorKey: 'alumni-globe'
        };
      case 'career':
        return {
          title: 'Career Center',
          icon: <FaBriefcase className="text-6xl text-green-600" />,
          description: 'Your gateway to career opportunities and professional development',
          features: [
            'Job board with exclusive alumni opportunities',
            'Career mentorship programs',
            'Professional development workshops',
            'Industry networking events'
          ],
          colorKey: 'career'
        };
      case 'news-events':
        return {
          title: 'News & Events',
          icon: <FaNewspaper className="text-6xl text-purple-600" />,
          description: 'Stay updated with the latest news, events, and alumni achievements',
          features: [
            'Latest KES news and updates',
            'Alumni success stories',
            'Upcoming events and reunions',
            'Photo galleries and memories'
          ],
          colorKey: 'news-events'
        };
      default:
        return {
          title: 'Coming Soon',
          icon: <FaClock className="text-6xl text-gray-600" />,
          description: 'Something exciting is coming your way',
          features: [],
          colorKey: 'default'
        };
    }
  };

  const sectionInfo = getSectionInfo();
  const colors = colorMappings[sectionInfo.colorKey];

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${colors.gradient} text-white py-16`}>
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="mb-6">
              {sectionInfo.icon}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{sectionInfo.title}</h1>
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8">
              {sectionInfo.description}
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-white text-custom rounded-lg hover:bg-secondary transition duration-300 font-medium"
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
          <h2 className="text-3xl font-bold text-custom mb-6">Launching Soon</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{timeLeft.days}</div>
              <div className="text-gray-600 text-sm">Days</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{timeLeft.hours}</div>
              <div className="text-gray-600 text-sm">Hours</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{timeLeft.minutes}</div>
              <div className="text-gray-600 text-sm">Minutes</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-3xl font-bold text-primary">{timeLeft.seconds}</div>
              <div className="text-gray-600 text-sm">Seconds</div>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        {sectionInfo.features.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold text-custom mb-8 text-center">What to Expect</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectionInfo.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className={`${colors.featureDot} rounded-full p-2 mr-4 mt-1`}>
                    <div className={`w-2 h-2 ${colors.featureDotInner} rounded-full`}></div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-8 text-center">
          <FaEnvelope className="text-4xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Get Notified When We Launch</h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Be the first to know when {sectionInfo.title.toLowerCase()} goes live. We'll send you an email as soon as it's ready!
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-custom focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300 font-medium">
              Notify Me
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComingSoonPage;
