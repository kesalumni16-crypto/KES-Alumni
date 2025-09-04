import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { 
  FaGlobe, FaBriefcase, FaNewspaper, FaArrowLeft, FaClock, FaEnvelope, 
  FaCheckCircle, FaBell, FaHeart, FaRocket, FaUsers, FaCalendarAlt,
  FaMapMarkerAlt, FaGraduationCap, FaStar, FaSpinner
} from 'react-icons/fa';
import toast from 'react-hot-toast';

// Constants
const LAUNCH_MONTHS_OFFSET = 3;
const NEWSLETTER_STORAGE_KEY = 'comingSoon_newsletter_signup';

const ComingSoonPage = () => {
  const { section } = useParams();
  
  // State management
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [newsletterState, setNewsletterState] = useState({
    email: '',
    isSubmitting: false,
    isSubscribed: false,
    error: null
  });

  // Memoized launch date calculation
  const launchDate = useMemo(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + LAUNCH_MONTHS_OFFSET);
    return date;
  }, []);

  // Check if user has already subscribed
  useEffect(() => {
    const hasSubscribed = localStorage.getItem(`${NEWSLETTER_STORAGE_KEY}_${section}`);
    if (hasSubscribed) {
      setNewsletterState(prev => ({ ...prev, isSubscribed: true }));
    }
  }, [section]);

  // Countdown timer effect
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
      } else {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [launchDate]);

  // Memoized section information
  const sectionInfo = useMemo(() => {
    const sections = {
      'alumni-globe': {
        title: 'Alumni Globe',
        icon: <FaGlobe className="text-6xl text-blue-600" />,
        description: 'Connect with alumni worldwide through our interactive global network',
        features: [
          {
            icon: <FaMapMarkerAlt className="text-blue-600" />,
            title: 'Interactive World Map',
            description: 'Explore alumni locations worldwide with our dynamic mapping system'
          },
          {
            icon: <FaUsers className="text-blue-600" />,
            title: 'Global Networking',
            description: 'Connect with alumni across different countries and industries'
          },
          {
            icon: <FaGraduationCap className="text-blue-600" />,
            title: 'Regional Chapters',
            description: 'Join regional alumni chapters and participate in local activities'
          },
          {
            icon: <FaCalendarAlt className="text-blue-600" />,
            title: 'International Events',
            description: 'Attend global meetups and international alumni gatherings'
          }
        ],
        color: 'blue',
        gradient: 'from-blue-800 via-blue-700 to-blue-600',
        accentColor: 'blue-600'
      },
      'career': {
        title: 'Career Center',
        icon: <FaBriefcase className="text-6xl text-green-600" />,
        description: 'Your gateway to career opportunities and professional development',
        features: [
          {
            icon: <FaBriefcase className="text-green-600" />,
            title: 'Exclusive Job Board',
            description: 'Access job opportunities shared exclusively by alumni network'
          },
          {
            icon: <FaUsers className="text-green-600" />,
            title: 'Mentorship Programs',
            description: 'Get guidance from experienced alumni in your field'
          },
          {
            icon: <FaRocket className="text-green-600" />,
            title: 'Skill Development',
            description: 'Participate in workshops and training programs'
          },
          {
            icon: <FaGlobe className="text-green-600" />,
            title: 'Industry Networks',
            description: 'Connect with professionals across various industries'
          }
        ],
        color: 'green',
        gradient: 'from-green-800 via-green-700 to-green-600',
        accentColor: 'green-600'
      },
      'news-events': {
        title: 'News & Events',
        icon: <FaNewspaper className="text-6xl text-purple-600" />,
        description: 'Stay updated with the latest news, events, and alumni achievements',
        features: [
          {
            icon: <FaNewspaper className="text-purple-600" />,
            title: 'Latest Updates',
            description: 'Stay informed about KES news and important announcements'
          },
          {
            icon: <FaStar className="text-purple-600" />,
            title: 'Success Stories',
            description: 'Read inspiring stories of alumni achievements and milestones'
          },
          {
            icon: <FaCalendarAlt className="text-purple-600" />,
            title: 'Upcoming Events',
            description: 'Never miss reunions, workshops, and networking events'
          },
          {
            icon: <FaHeart className="text-purple-600" />,
            title: 'Photo Galleries',
            description: 'Browse memories and moments from various alumni gatherings'
          }
        ],
        color: 'purple',
        gradient: 'from-purple-800 via-purple-700 to-purple-600',
        accentColor: 'purple-600'
      }
    };

    return sections[section] || {
      title: 'Coming Soon',
      icon: <FaClock className="text-6xl text-gray-600" />,
      description: 'Something exciting is coming your way',
      features: [],
      color: 'gray',
      gradient: 'from-gray-800 via-gray-700 to-gray-600',
      accentColor: 'gray-600'
    };
  }, [section]);

  // Newsletter signup handler
  const handleNewsletterSignup = useCallback(async (e) => {
    e.preventDefault();
    
    if (!newsletterState.email || !isValidEmail(newsletterState.email)) {
      setNewsletterState(prev => ({ 
        ...prev, 
        error: 'Please enter a valid email address' 
      }));
      return;
    }

    setNewsletterState(prev => ({ 
      ...prev, 
      isSubmitting: true, 
      error: null 
    }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save subscription status
      localStorage.setItem(`${NEWSLETTER_STORAGE_KEY}_${section}`, 'true');
      
      setNewsletterState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubscribed: true
      }));

      toast.success('Successfully subscribed! We\'ll notify you when it\'s ready.');
    } catch (error) {
      setNewsletterState(prev => ({
        ...prev,
        isSubmitting: false,
        error: 'Something went wrong. Please try again.'
      }));
      toast.error('Failed to subscribe. Please try again.');
    }
  }, [newsletterState.email, section]);

  // Email validation helper
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle email input change
  const handleEmailChange = useCallback((e) => {
    setNewsletterState(prev => ({
      ...prev,
      email: e.target.value,
      error: null
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <HeroSection sectionInfo={sectionInfo} />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Enhanced Countdown Timer */}
        <CountdownSection timeLeft={timeLeft} sectionInfo={sectionInfo} />

        {/* Enhanced Features Preview */}
        {sectionInfo.features.length > 0 && (
          <FeaturesSection features={sectionInfo.features} color={sectionInfo.color} />
        )}

        {/* Progress Indicator */}
        <ProgressSection sectionInfo={sectionInfo} />

        {/* Enhanced Newsletter Signup */}
        <NewsletterSection
          newsletterState={newsletterState}
          sectionInfo={sectionInfo}
          onEmailChange={handleEmailChange}
          onSubmit={handleNewsletterSignup}
        />

        {/* FAQ Section */}
        <FAQSection sectionInfo={sectionInfo} />
      </div>

      <Footer />
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ sectionInfo }) => (
  <div className={`bg-gradient-to-r ${sectionInfo.gradient} text-white py-20 relative overflow-hidden`}>
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
    </div>
    
    <div className="container mx-auto px-6 relative">
      <div className="text-center">
        <div className="mb-8 transform hover:scale-110 transition-transform duration-300">
          {sectionInfo.icon}
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          {sectionInfo.title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 max-w-4xl mx-auto mb-10 leading-relaxed">
          {sectionInfo.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-800 rounded-xl hover:bg-gray-100 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <FaArrowLeft className="mr-3" />
            Back to Home
          </Link>
          
          <div className="flex items-center text-gray-200">
            <FaBell className="mr-2" />
            <span className="text-sm">Get notified when it's ready</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Enhanced Countdown Section
const CountdownSection = ({ timeLeft, sectionInfo }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center border border-gray-100">
    <div className="mb-8">
      <FaRocket className={`text-4xl text-${sectionInfo.color}-600 mx-auto mb-4`} />
      <h2 className="text-4xl font-bold text-gray-800 mb-4">Launching Soon</h2>
      <p className="text-gray-600 max-w-2xl mx-auto">
        We're putting the finishing touches on something amazing. Here's how much time is left!
      </p>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <TimeUnit 
          key={unit} 
          value={value} 
          unit={unit} 
          color={sectionInfo.accentColor}
        />
      ))}
    </div>
  </div>
);

// Time Unit Component
const TimeUnit = ({ value, unit, color }) => (
  <div className={`bg-gradient-to-br from-${color.split('-')[0]}-50 to-${color.split('-')[0]}-100 rounded-xl p-6 border border-${color.split('-')[0]}-200 transform hover:scale-105 transition-all duration-300`}>
    <div className={`text-4xl md:text-5xl font-bold text-${color} mb-2 tabular-nums`}>
      {value.toString().padStart(2, '0')}
    </div>
    <div className="text-gray-600 text-sm uppercase tracking-wider font-medium">
      {unit}
    </div>
  </div>
);

// Enhanced Features Section
const FeaturesSection = ({ features, color }) => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100">
    <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">What to Expect</h2>
    <p className="text-gray-600 text-center mb-12 max-w-3xl mx-auto">
      Here are some of the exciting features we're preparing for you
    </p>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {features.map((feature, index) => (
        <FeatureCard key={index} feature={feature} index={index} />
      ))}
    </div>
  </div>
);

// Feature Card Component
const FeatureCard = ({ feature, index }) => (
  <div className="group p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-100">
    <div className="flex items-start space-x-4">
      <div className="p-3 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-all duration-300">
        {feature.icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {feature.description}
        </p>
      </div>
    </div>
  </div>
);

// Progress Section
const ProgressSection = ({ sectionInfo }) => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-12">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Development Progress</h2>
      <p className="text-gray-600">We're making great progress on your new {sectionInfo.title.toLowerCase()}</p>
    </div>
    
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProgressItem
          icon={<FaRocket />}
          title="Design & Planning"
          progress={100}
          status="Completed"
          color="green"
        />
        <ProgressItem
          icon={<FaClock />}
          title="Development"
          progress={75}
          status="In Progress"
          color="blue"
        />
        <ProgressItem
          icon={<FaCheckCircle />}
          title="Testing & Launch"
          progress={25}
          status="Starting Soon"
          color="orange"
        />
      </div>
    </div>
  </div>
);

// Progress Item Component
const ProgressItem = ({ icon, title, progress, status, color }) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    orange: 'text-orange-600 bg-orange-100'
  };

  return (
    <div className="bg-white rounded-xl p-6 text-center">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`bg-${color}-600 h-2 rounded-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600">{status}</p>
      <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
    </div>
  );
};

// Enhanced Newsletter Section
const NewsletterSection = ({ newsletterState, sectionInfo, onEmailChange, onSubmit }) => {
  if (newsletterState.isSubscribed) {
    return <SubscriptionSuccess sectionInfo={sectionInfo} />;
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </div>
      
      <div className="relative">
        <FaEnvelope className="text-5xl mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Get Notified When We Launch</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Be the first to know when {sectionInfo.title.toLowerCase()} goes live. 
          We'll send you an exclusive early access invitation!
        </p>
        
        <form onSubmit={onSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterState.email}
                onChange={onEmailChange}
                disabled={newsletterState.isSubmitting}
                className={`w-full px-4 py-4 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${
                  newsletterState.error ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {newsletterState.error && (
                <p className="text-red-400 text-sm mt-2 text-left">{newsletterState.error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={newsletterState.isSubmitting}
              className="px-8 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {newsletterState.isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Subscribing...
                </>
              ) : (
                <>
                  <FaBell className="mr-2" />
                  Notify Me
                </>
              )}
            </button>
          </div>
        </form>
        
        <p className="text-gray-400 text-sm mt-6">
          Don't worry, we won't spam you. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
};

// Subscription Success Component
const SubscriptionSuccess = ({ sectionInfo }) => (
  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-8 mb-12 text-center">
    <FaCheckCircle className="text-5xl mx-auto mb-6" />
    <h2 className="text-3xl font-bold mb-4">You're All Set!</h2>
    <p className="text-green-100 mb-6 max-w-2xl mx-auto">
      Thank you for subscribing! We'll send you an email as soon as {sectionInfo.title.toLowerCase()} is ready.
    </p>
    <div className="flex items-center justify-center text-green-200">
      <FaHeart className="mr-2" />
      <span>We appreciate your patience</span>
    </div>
  </div>
);

// FAQ Section
const FAQSection = ({ sectionInfo }) => {
  const faqs = [
    {
      question: `When will ${sectionInfo.title} be available?`,
      answer: "We're targeting a launch in the next 3 months. You'll be notified as soon as it's ready!"
    },
    {
      question: "Will this be free for all alumni?",
      answer: "Yes! This feature will be completely free for all verified KES alumni members."
    },
    {
      question: "How do I get early access?",
      answer: "Simply subscribe to our newsletter above, and you'll receive early access before the official launch."
    },
    {
      question: "Can I suggest features?",
      answer: "Absolutely! We'd love to hear your suggestions. Contact us through the main portal."
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-6 max-w-3xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
            <h3 className="font-semibold text-gray-800 mb-3">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComingSoonPage;
