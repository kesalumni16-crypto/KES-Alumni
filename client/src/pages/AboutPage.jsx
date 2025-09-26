/* ----------  AboutPage.jsx - Enhanced Version with Toggle ---------- */
import React, { useState, useEffect, useRef } from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaBriefcase, FaEye, FaChevronDown, FaExternalLinkAlt,
  FaStar, FaMedal, FaGlobe, FaBookOpen, FaUser, FaHandshake, 
  FaHeart, FaLightbulb
} from 'react-icons/fa';

/* ----------  Enhanced Data with more details  ---------- */
const institutions = [
  {
    id: 1,
    name: 'Sardar Vallabhbhai Patel High School (SVP)',
    year: '1936',
    description: 'Begun with 13 pupils; today educates 4,500+ students in SSC & CBSE divisions with modern infrastructure and experienced faculty.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    students: '4,500+',
    programs: ['SSC', 'CBSE', 'State Board'],
    achievements: ['100% Pass Rate', 'State Topper 2024', 'Smart School Award'],
    rating: 4.8,
    type: 'institution'
  },
  {
    id: 2,
    name: 'Shri T.P. Bhatia Junior College of Science',
    year: '1976',
    description: 'State-board science college with modern labs, research facilities, and industry partnerships; enrollment 2,500+.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    students: '2,500+',
    programs: ['HSC Science', 'Biotechnology', 'Computer Science'],
    achievements: ['NAAC B+ Grade', '95% College Admission', 'Research Excellence'],
    rating: 4.6,
    type: 'institution'
  },
  {
    id: 3,
    name: 'SVP Night School',
    year: '1970',
    description: 'Evening secondary section enabling working youth to complete schooling with flexible timings and personalized support.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg',
    students: '800+',
    programs: ['Evening SSC', 'Part-time Courses'],
    achievements: ['Adult Education Award', 'Community Impact', 'Skill Development'],
    rating: 4.4,
    type: 'institution'
  },
  {
    id: 4,
    name: 'KES Sangeet Mahavidyalaya',
    year: '1984',
    description: 'Affiliated to Gandharva Mahavidyalaya; offers vocal, instrumental & dance diplomas with renowned faculty.',
    icon: <FaMusic style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    students: '1,200+',
    programs: ['Classical Music', 'Dance', 'Fine Arts'],
    achievements: ['Cultural Excellence', 'National Performers', 'Heritage Preservation'],
    rating: 4.9,
    type: 'institution'
  },
  {
    id: 5,
    name: 'B.K. Shroff & M.H. Shroff College (Degree)',
    year: '1989',
    description: 'Mumbai-University-affiliated; NAAC "A" grade; 9,000+ learners across arts & commerce with excellent placement record.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    students: '9,000+',
    programs: ['BA', 'BCom', 'BMS', 'BAF', 'MA', 'MCom'],
    achievements: ['NAAC A Grade', 'Best College Award', '90% Placement Rate'],
    rating: 4.7,
    type: 'institution'
  },
  {
    id: 6,
    name: "KES' Shri J.H. Patel Law College",
    year: '2012',
    description: 'BCI-approved institute offering 3-yr LL.B. & 5-yr BA LL.B.; 300 seats with moot court and legal aid clinic.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/4427611/pexels-photo-4427611.jpeg',
    students: '300',
    programs: ['LL.B.', 'BA LL.B.'],
    achievements: ['Moot Court Champions', 'Legal Aid Clinic', 'Bar Council Recognition'],
    rating: 4.5,
    type: 'institution'
  },
  {
    id: 7,
    name: 'KES Cambridge International Junior College',
    year: '2009',
    description: 'Delivers Cambridge "A-Level" curriculum; pathway to 125+ countries with international faculty and global recognition.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    students: '600+',
    programs: ['Cambridge A-Levels'],
    achievements: ['Cambridge Excellence', 'Global University Admission', 'International Recognition'],
    rating: 4.8,
    type: 'institution'
  },
  {
    id: 8,
    name: "Pre-Primary Teachers' Training Institute",
    year: '1995',
    description: 'Trains early-childhood educators using modern pedagogy with hands-on experience and continuous professional development.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/861308/pexels-photo-861308.jpeg',
    students: '300+',
    programs: ['ECCEd', 'Diploma in Early Childhood Ed.'],
    achievements: ['Teacher Excellence', 'Innovation in Education', 'Child Development Research'],
    rating: 4.6,
    type: 'institution'
  },
  {
    id: 9,
    name: 'KES Institute of Management Studies & Research',
    year: '2005',
    description: 'AICTE-approved MBA & PGDM programmes with industry tie-ups, case studies, and corporate mentorship; 1,500+ students.',
    icon: <FaBriefcase style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    students: '1,500+',
    programs: ['MBA', 'PGDM', 'Executive Courses'],
    achievements: ['AICTE Approved', 'Industry Partnerships', 'Entrepreneurship Hub'],
    rating: 4.7,
    type: 'institution'
  }
];

/* ----------  Founders Data  ---------- */
/* ----------  Real Founders Data Based on Authentic KES History  ---------- */
const founders = [
  {
    id: 1,
    name: 'Shri Jamanadas Adukia',
    year: '1936',
    description: 'Co-founder and visionary leader who established KES with the noble objective of providing vernacular education to Gujarati families in Kandivali, starting with just 13 students.',
    icon: <FaUser style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    role: 'Co-Founding Visionary',
    legacy: 'Educational Pioneer',
    achievements: ['Founded KES in 1936', 'Established Shree Kandivali Vidyalaya', 'Vernacular Education Advocate'],
    impact: 'Co-founded KES with revolutionary vision of accessible education for Gujarati community in Kandivali',
    rating: 5.0,
    type: 'founder'
  },
  {
    id: 2,
    name: 'Shri Gokaldas Ranchoddas',
    year: '1936',
    description: 'Co-founder and philanthropist who joined hands with other visionary businessmen to establish educational opportunities during British rule, believing in the power of education.',
    icon: <FaLightbulb style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg',
    role: 'Co-Founding Philanthropist',
    legacy: 'Community Development',
    achievements: ['Co-established KES Society', 'Local Business Leader', 'Educational Philanthropist'],
    impact: 'Contributed to founding KES as part of the original trio of visionary leaders in 1936',
    rating: 5.0,
    type: 'founder'
  },
  {
    id: 3,
    name: 'Shri Lavji Meghji',
    year: '1936',
    description: 'Co-founder and community leader who worked alongside fellow businessmen to create educational infrastructure, focusing on serving the local Gujarati community needs.',
    icon: <FaHandshake style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg',
    role: 'Co-Founding Community Leader',
    legacy: 'Social Reform',
    achievements: ['Founding Member of KES', 'Community Welfare Advocate', 'Educational Access Pioneer'],
    impact: 'Third founding member who helped establish KES educational foundation in Kandivali',
    rating: 5.0,
    type: 'founder'
  },
  {
    id: 4,
    name: 'Shri T.P. Bhatia',
    year: '1976-2004',
    description: 'Honored with college naming in 2004, recognized for significant contributions to science education. The junior college was renamed as Shri T.P. Bhatia Junior College of Science.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1181317/pexels-photo-1181317.jpeg',
    role: 'Science Education Patron',
    legacy: 'Scientific Excellence',
    achievements: ['Science Education Advancement', 'College Naming Honor', 'Educational Infrastructure Development'],
    impact: 'Honored through college naming for contributions to science education at KES',
    rating: 4.8,
    type: 'founder'
  },
  {
    id: 5,
    name: 'Shri B.K. Shroff & Smt. M.H. Shroff',
    year: '1989-2008',
    description: 'Honored patrons whose legacy is preserved through the college naming. B.K. Shroff College of Arts and M.H. Shroff College of Commerce were named in their honor in 2008.',
    icon: <FaHeart style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
    role: 'Higher Education Patrons',
    legacy: 'Arts & Commerce Education',
    achievements: ['Higher Education Support', 'Arts & Commerce Development', 'Educational Philanthropy'],
    impact: 'Honored through college naming for significant contributions to higher education at KES',
    rating: 4.7,
    type: 'founder'
  },
  {
    id: 6,
    name: 'Shri Jayantilal H. Patel',
    year: '2012-2017',
    description: 'Legal education pioneer honored through the naming of KES Law College as "KES\' Shri Jayantilal H. Patel Law College" in 2017, recognizing contributions to legal education.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg',
    role: 'Legal Education Advocate',
    legacy: 'Justice & Legal Education',
    achievements: ['Legal Education Development', 'Law College Establishment Support', 'Professional Education Advancement'],
    impact: 'Honored through law college naming for contributions to legal education and justice',
    rating: 4.6,
    type: 'founder'
  },
  {
    id: 7,
    name: 'Current Leadership Collective',
    year: '1936-Present',
    description: 'Current managing committee led by President Shri Mahesh Shah, Vice President Shri Mahesh Chandrana, Secretary Shri Rajnibhai Ghelani, and dedicated trustees continuing the 89-year legacy.',
    icon: <FaBriefcase style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    role: 'Modern Leadership',
    legacy: 'Institutional Excellence',
    achievements: ['89-Year Legacy Continuation', 'Modern Educational Innovation', 'Global Recognition Achievement'],
    impact: 'Leading KES into the digital era with 20,000+ students and 50,000+ global alumni network',
    rating: 4.8,
    type: 'founder'
  }
];


const timeline = [
  { year: '1936', milestone: 'Birth of KES', title: 'Foundation', description: 'Started with 13 students at SVP School, laying the foundation for quality education.', color: '#86BC25' },
  { year: '1947', milestone: 'Legal Registration', title: 'Trust Registered', description: 'Society registered under the Societies Act, formalizing our commitment to education.', color: '#67991D' },
  { year: '1961', milestone: 'Technical Wing', title: 'SVP Technical Section', description: 'Vocational stream added to prepare students for technical careers.', color: '#86BC25' },
  { year: '1970', milestone: 'Inclusivity', title: 'Night School', description: 'Evening classes for working youth, ensuring education accessibility for all.', color: '#67991D' },
  { year: '1976', milestone: 'Academic Expansion', title: 'Science Jr. College', description: 'T.P. Bhatia Science college launched, focusing on scientific excellence.', color: '#86BC25' },
  { year: '1984', milestone: 'Cultural Heritage', title: 'Sangeet Mahavidyalaya', description: 'Institute for classical music & dance, preserving cultural traditions.', color: '#67991D' },
  { year: '1989', milestone: 'Degree College', title: 'Arts & Commerce', description: 'B.K./M.H. Shroff College inaugurated, expanding higher education opportunities.', color: '#86BC25' },
  { year: '2005', milestone: 'Professional Studies', title: 'Management Institute', description: 'MBA & PGDM programmes introduced, focusing on industry-ready professionals.', color: '#67991D' },
  { year: '2009', milestone: 'Global Reach', title: 'Cambridge A-Levels', description: 'International Junior College established, connecting students globally.', color: '#86BC25' },
  { year: '2012', milestone: 'Legal Studies', title: 'Law College', description: 'Shri J.H. Patel Law College opened, training future legal professionals.', color: '#67991D' },
  { year: '2025', milestone: 'Digital Era', title: 'Alumni Portal', description: 'Digital platform linking 50,000+ alumni worldwide, fostering global community.', color: '#86BC25' }
];

const keyFeatures = [
  { icon: <FaUsers />, text: '20,000+ students across nine institutions', category: 'Scale' },
  { icon: <FaGraduationCap />, text: '50,000+ alumni on six continents', category: 'Network' },
  { icon: <FaAward />, text: 'SSC, HSC, Cambridge A-Level & University degrees', category: 'Programs' },
  { icon: <FaBuilding />, text: 'NAAC "A" grade for Shroff College; ISO 9001-certified processes', category: 'Quality' },
  { icon: <FaBriefcase />, text: 'Smart classrooms, e-library & state-of-the-art labs', category: 'Infrastructure' },
  { icon: <FaUsers />, text: '85% placement rate with Fortune 500 recruiters', category: 'Careers' },
  { icon: <FaAward />, text: '₹1 crore+ in annual scholarships', category: 'Support' },
  { icon: <FaGraduationCap />, text: 'MoUs with universities in the UK, Canada & Singapore', category: 'Global' },
  { icon: <FaBuilding />, text: '24×7 digital alumni portal & mobile app (2025)', category: 'Technology' },
  { icon: <FaBriefcase />, text: 'Active NSS, NCC & community-service units', category: 'Community' }
];

const achievements = [
  {
    title: 'NAAC "A" Accreditation',
    description: 'Shroff College reaccredited with CGPA 3.22/4 (2023), demonstrating academic excellence.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    year: '2023',
    category: 'Academic Excellence',
    impact: 'High'
  },
  {
    title: 'NIRF Listed',
    description: 'Ranked in NIRF-2024 college band 151-200, national recognition for quality education.',
    icon: <FaMedal style={{ color: 'var(--primary)' }} />,
    year: '2024',
    category: 'National Recognition',
    impact: 'High'
  },
  {
    title: 'Alumni Leadership',
    description: 'Graduates heading TCS, Deloitte & HSBC divisions, showcasing career success.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    year: 'Ongoing',
    category: 'Career Success',
    impact: 'Medium'
  },
  {
    title: 'Global Partnerships',
    description: 'MoUs with University of Leeds & Centennial College, expanding international opportunities.',
    icon: <FaGlobe style={{ color: 'var(--primary)' }} />,
    year: '2024',
    category: 'International Relations',
    impact: 'High'
  }
];

/* ----------  Enhanced AboutPage Component with Toggle Feature  ---------- */
const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const observerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  
  // Toggle state for institutions/founders
  const [activeTab, setActiveTab] = useState('institutions');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentData, setCurrentData] = useState(institutions);

  // Handle toggle between institutions and founders
  const handleToggle = async (tabName) => {
    if (tabName === activeTab || isTransitioning) return;
    
    setIsTransitioning(true);
    setExpandedCard(null); // Close any expanded cards
    
    // Start fade out animation
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Switch data and tab
    setCurrentData(tabName === 'institutions' ? institutions : founders);
    setActiveTab(tabName);
    
    // Complete transition
    await new Promise(resolve => setTimeout(resolve, 100));
    setIsTransitioning(false);
  };

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addListener(handleChange);
    
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Enhanced Intersection Observer with performance optimizations
  useEffect(() => {
    setIsMounted(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        const updates = {};
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updates[entry.target.id] = true;
          }
        });
        
        if (Object.keys(updates).length > 0) {
          setIsVisible(prev => ({ ...prev, ...updates }));
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px -100px 0px' // Start animation earlier, end later
      }
    );

    observerRef.current = observer;

    // Use requestAnimationFrame to batch DOM queries
    requestAnimationFrame(() => {
      const elements = document.querySelectorAll('[data-animate]');
      elements.forEach((el) => observer.observe(el));
    });

    return () => observer.disconnect();
  }, []);

  // Memoized animation classes
  const getAnimationClass = (elementId, baseClass = '') => {
    if (reducedMotion) return baseClass;
    return `${baseClass} ${isVisible[elementId] ? 'animate-fade-in-up' : 'opacity-0 translate-y-10'}`;
  };

  return (
    <div 
      className={`min-h-screen relative ${isMounted ? 'mounted' : ''}`}
      style={{ 
        background: `
          radial-gradient(circle at 20% 80%, rgba(134,188,37,0.08) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(134,188,37,0.08) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(103,153,29,0.05) 0%, transparent 50%),
          linear-gradient(135deg, var(--accent) 0%, rgba(134,188,37,0.02) 100%)
        `,
        backgroundAttachment: 'fixed',
        color: 'var(--text)'
      }}
    >
      {/* Enhanced CSS Styles */}
      <style jsx>{`
        .mounted {
          opacity: 1;
          transition: opacity 0.3s ease-in-out;
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        
        .glass-morphism {
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(134,188,37,0.1);
        }
        
        .glass-morphism-strong {
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 12px 40px rgba(134,188,37,0.15);
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(134,188,37,0.2);
        }
        
        /* Toggle Button Styles */
        .toggle-section {
          background: linear-gradient(135deg, 
            rgba(134,188,37,0.05) 0%, 
            rgba(255,255,255,0.95) 50%, 
            rgba(134,188,37,0.05) 100%);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          border: 1px solid rgba(134,188,37,0.15);
          box-shadow: 0 20px 40px rgba(134,188,37,0.1);
        }
        
        .toggle-buttons {
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(15px);
          border-radius: 16px;
          padding: 8px;
          border: 1px solid rgba(134,188,37,0.2);
          box-shadow: 0 8px 25px rgba(134,188,37,0.15);
          display: inline-flex;
          margin-bottom: 2rem;
        }
        
        .toggle-btn {
          position: relative;
          padding: 16px 32px;
          border-radius: 12px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
          background: transparent;
          color: #666;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .toggle-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #86BC25 0%, #67991D 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
          z-index: 0;
        }
        
        .toggle-btn.active::before {
          opacity: 1;
        }
        
        .toggle-btn.active {
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(134,188,37,0.3);
        }
        
        .toggle-btn:not(.active):hover {
          background: rgba(134,188,37,0.1);
          color: #86BC25;
          transform: translateY(-1px);
        }
        
        .toggle-btn span {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .cards-container {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 1;
          transform: translateY(0);
        }
        
        .cards-container.transitioning {
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(134,188,37,0.3); }
          50% { box-shadow: 0 0 30px rgba(134,188,37,0.5); }
        }
        
        /* Mobile-first responsive improvements */
        @media (max-width: 768px) {
          .hover-lift:hover {
            transform: none;
          }
          
          .glass-morphism {
            backdrop-filter: blur(15px);
            -webkit-backdrop-filter: blur(15px);
          }
          
          .toggle-btn {
            padding: 12px 20px;
            font-size: 14px;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* Decorative Background Elements with Performance Optimization */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(134,188,37,0.03) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px',
          willChange: 'transform',
          transform: 'translateZ(0)' // Force hardware acceleration
        }}
      />

      {/* Enhanced Hero Section */}
      <EnhancedHeroSection />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 sm:space-y-16 relative z-10">
        {/* Heritage Section */}
        <section 
          id="heritage" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('heritage')}`}
        >
          <EnhancedSectionCard className="glass-morphism-strong">
            <SectionHeader
              icon={<FaCalendarAlt style={{ color: 'var(--primary)', fontSize: '2rem' }} />}
            >
              Our Rich Heritage
            </SectionHeader>
            <div className="prose prose-lg max-w-none" style={{ color: 'var(--text)' }}>
              <p className="text-base sm:text-lg leading-relaxed mb-4">
                Founded in <strong style={{ color: 'var(--primary)' }}>1936</strong> by visionary community leaders in Kandivali,
                KES began with just <strong style={{ color: 'var(--primary)' }}>13 students</strong>. Today, our society
                educates <strong style={{ color: 'var(--primary)' }}>20,000+</strong> learners each year, staying true
                to our mission of affordable, holistic education that transforms lives and communities.
              </p>
              <p className="text-base sm:text-lg leading-relaxed mb-4">
                The society was formally registered in <strong style={{ color: 'var(--primary)' }}>1947</strong>. Over
                nearly nine decades, it has grown from a single high school into a comprehensive network of
                <strong style={{ color: 'var(--primary)' }}> nine distinguished institutions</strong> spanning primary to
                postgraduate study, fine arts, teacher training, and professional management.
              </p>
              <p className="text-base sm:text-lg leading-relaxed">
                Our engaged alumni family of <strong style={{ color: 'var(--primary)' }}>50,000+</strong> graduates now supports
                scholarships, placements, and community projects across <strong style={{ color: 'var(--primary)' }}>25 countries</strong>,
                creating a global network of educational excellence and social impact.
              </p>
            </div>
          </EnhancedSectionCard>
        </section>

        {/* Timeline Section */}
        <section 
          id="timeline" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('timeline')}`}
        >
          <EnhancedSectionCard className="glass-morphism-strong">
            <SectionTitle>Journey Through Time</SectionTitle>
            <EnhancedTimeline />
          </EnhancedSectionCard>
        </section>

        {/* Enhanced Institutions/Founders Toggle Section */}
        <section 
          id="institutions-founders" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('institutions-founders')}`}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--primary)' }}>
              Discover Our Legacy
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Explore our distinguished institutions and the visionary founders who shaped 89 years of educational excellence
            </p>
            
            {/* Toggle Buttons */}
            <div className="toggle-buttons">
              <button
                className={`toggle-btn ${activeTab === 'institutions' ? 'active' : ''}`}
                onClick={() => handleToggle('institutions')}
                disabled={isTransitioning}
              >
                <span>
                  <FaBuilding />
                  Our Institutions
                </span>
              </button>
              <button
                className={`toggle-btn ${activeTab === 'founders' ? 'active' : ''}`}
                onClick={() => handleToggle('founders')}
                disabled={isTransitioning}
              >
                <span>
                  <FaUsers />
                  Our Founders
                </span>
              </button>
            </div>
          </div>

          {/* Cards Grid with Transition */}
          <div className={`cards-container ${isTransitioning ? 'transitioning' : ''}`}>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentData.map((item, index) => (
                <EnhancedInstitutionCard 
                  key={`${activeTab}-${item.id}`}
                  {...item} 
                  isExpanded={expandedCard === index}
                  onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                  delay={index * 100}
                  reducedMotion={reducedMotion}
                  activeTab={activeTab}
                />
              ))}
            </div>
          </div>

          {/* Statistics Footer */}
          <div className="mt-12 text-center">
            <div className="toggle-section p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                    {activeTab === 'institutions' ? '9' : '6+'}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {activeTab === 'institutions' ? 'Institutions' : 'Visionaries'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                    89
                  </div>
                  <div className="text-gray-600 text-sm">Years Legacy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                    20,000+
                  </div>
                  <div className="text-gray-600 text-sm">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: 'var(--primary)' }}>
                    50,000+
                  </div>
                  <div className="text-gray-600 text-sm">Alumni</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Achievements Section */}
        <section 
          id="achievements" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('achievements')}`}
        >
          <EnhancedSectionCard className="glass-morphism-strong">
            <SectionTitle>Our Achievements</SectionTitle>
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {achievements.map((a, index) => (
                <EnhancedMiniCard key={a.title} {...a} delay={index * 150} reducedMotion={reducedMotion} />
              ))}
            </div>
          </EnhancedSectionCard>
        </section>

        {/* Key Features Section */}
        <section 
          id="features" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('features')}`}
        >
          <EnhancedSectionCard className="glass-morphism-strong">
            <SectionTitle>Why Choose KES</SectionTitle>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
              {keyFeatures.map((f, index) => (
                <EnhancedFeatureRow key={f.text} {...f} delay={index * 100} reducedMotion={reducedMotion} />
              ))}
            </div>
          </EnhancedSectionCard>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('contact')}`}
        >
          <EnhancedContactSection />
        </section>

        {/* Vision/Mission Section */}
        <section 
          id="vision" 
          data-animate 
          className={`transition-all duration-1000 ${getAnimationClass('vision')}`}
        >
          <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
            <EnhancedVMCard
              icon={<FaEye style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />}
              title="Our Vision"
              text="To be a globally recognized institution that nurtures innovative thinkers, ethical leaders, and responsible citizens who contribute positively to society and drive meaningful change."
              className="glass-morphism hover-lift"
            />
            <EnhancedVMCard
              icon={<FaAward style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />}
              title="Our Mission"
              text="To deliver accessible, quality education that combines academic excellence with character development, fostering lifelong learning and empowering students to achieve their full potential."
              className="glass-morphism hover-lift"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

/* ----------  Enhanced Components with Performance Optimizations  ---------- */

const EnhancedHeroSection = React.memo(() => (
  <section 
    className="py-16 sm:py-20 relative overflow-hidden" 
    style={{ 
      background: `
        radial-gradient(ellipse at top left, rgba(134,188,37,0.12) 0%, transparent 60%),
        radial-gradient(ellipse at bottom right, rgba(103,153,29,0.08) 0%, transparent 60%),
        var(--accent)
      `
    }}
  >
    {/* Enhanced Background Pattern */}
    <div 
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage: `
          radial-gradient(circle at 4px 4px, var(--primary) 1px, transparent 0),
          radial-gradient(circle at 2px 2px, var(--primary-dark) 0.5px, transparent 0)
        `,
        backgroundSize: '60px 60px, 30px 30px',
        willChange: 'transform',
        transform: 'translateZ(0)'
      }}
    />
    
    <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up"
          style={{ color: 'var(--primary)' }}
        >
          About The Kandivli Education Society
        </h1>
        <p
          className="text-lg sm:text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed animate-fade-in-up"
          style={{ 
            color: 'var(--text)',
            animationDelay: '0.2s'
          }}
        >
          Shaping minds, building futures since 1936
        </p>
        <div 
          className="text-base sm:text-lg font-semibold mb-8 sm:mb-12 animate-fade-in-up"
          style={{ 
            color: 'var(--primary)',
            animationDelay: '0.4s'
          }}
        >
          89 Years of Educational Excellence
        </div>

        {/* Enhanced Stats with Mobile-First Design */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {[
            ['89', 'Years of Excellence', 'Educational legacy'],
            ['50,000+', 'Alumni Worldwide', 'Global network'],
            ['20,000+', 'Current Students', 'Active learners'],
            ['9', 'Institutions', 'Educational centers']
          ].map(([num, label, desc], index) => (
            <div 
              key={label} 
              className={`text-center p-4 sm:p-6 rounded-xl transition-all duration-300 hover-lift glass-morphism animate-scale-in`}
              style={{
                animationDelay: `${0.6 + index * 0.1}s`
              }}
            >
              <div 
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--primary)' }}
              >
                {num}
              </div>
              <div 
                className="text-xs sm:text-sm font-semibold mb-1"
                style={{ color: 'var(--secondary)' }}
              >
                {label}
              </div>
              <div 
                className="text-xs hidden sm:block"
                style={{ color: 'var(--text)' }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
));

const EnhancedSectionCard = React.memo(({ children, className = '' }) => (
  <section
    className={`p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl ${className}`}
  >
    {children}
  </section>
));

const SectionHeader = React.memo(({ icon, children }) => (
  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start mb-6 sm:mb-8 text-center sm:text-left">
    <div 
      className="p-3 sm:p-4 rounded-full mb-4 sm:mb-0 sm:mr-4 glass-morphism pulse-glow"
    >
      {icon}
    </div>
    <h2
      className="text-2xl sm:text-3xl md:text-4xl font-bold"
      style={{ color: 'var(--primary)' }}
    >
      {children}
    </h2>
  </div>
));

const SectionTitle = React.memo(({ children, light = false }) => (
  <h2
    className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-12 text-center"
    style={{ color: light ? 'var(--accent)' : 'var(--primary)' }}
  >
    {children}
  </h2>
));

const EnhancedInstitutionCard = React.memo(({
  name, year, description, logo, icon, students, programs, achievements = [], 
  isExpanded, onToggle, delay = 0, reducedMotion, rating, activeTab, role, legacy, impact
}) => (
  <article
    className={`group p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer glass-morphism hover-lift ${!reducedMotion ? 'animate-fade-in-up' : ''}`}
    style={{
      animationDelay: `${delay}ms`
    }}
    onClick={onToggle}
  >
    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
      <div className="mx-auto sm:mx-0">
        <EnhancedLogo logo={logo} fallback={icon} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
          <Badge variant="year">{`Est. ${year}`}</Badge>
          {activeTab === 'institutions' && students && (
            <Badge variant="students">{students}</Badge>
          )}
          {activeTab === 'founders' && role && (
            <Badge variant="milestone">{role}</Badge>
          )}
          {rating && (
            <div className="flex items-center gap-1">
              <FaStar style={{ color: '#fbbf24', fontSize: '0.8rem' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--primary)' }}>
                {rating}
              </span>
            </div>
          )}
        </div>
        
        <h3 
          className="font-bold text-lg sm:text-xl mb-3 group-hover:text-green-600 transition-colors duration-300" 
          style={{ color: 'var(--primary)' }}
        >
          {name}
        </h3>
        
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text)' }}>
          {description}
        </p>
        
        {/* Show impact for founders, programs for institutions */}
        {activeTab === 'founders' && impact && (
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--primary)' }}>Impact:</p>
            <p className="text-xs italic" style={{ color: 'var(--text)' }}>{impact}</p>
          </div>
        )}
        
        <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
          {programs && programs.slice(0, 3).map(p => (
            <span
              key={p}
              className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 glass-morphism"
              style={{
                color: 'var(--primary)',
              }}
            >
              {p}
            </span>
          ))}
          {programs && programs.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--primary)' }}>
              +{programs.length - 3} more
            </span>
          )}
        </div>

        {/* Expandable achievements section */}
        {isExpanded && achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t animate-fade-in-up" style={{ borderColor: 'rgba(134,188,37,0.2)' }}>
            <h4 className="font-semibold mb-2 text-sm sm:text-base" style={{ color: 'var(--primary)' }}>
              {activeTab === 'institutions' ? 'Key Achievements:' : 'Legacy Contributions:'}
            </h4>
            <div className="flex flex-wrap gap-1 sm:gap-2">
              {achievements.map(achievement => (
                <span
                  key={achievement}
                  className="px-2 py-1 rounded text-xs glass-morphism"
                  style={{
                    color: 'var(--primary-dark)',
                  }}
                >
                  {achievement}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <FaExternalLinkAlt 
            className="text-xs opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: 'var(--primary)' }}
          />
          <FaChevronDown 
            className={`text-sm transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: 'var(--primary)' }}
          />
        </div>
      </div>
    </div>
  </article>
));

const EnhancedTimeline = React.memo(() => (
  <div className="relative">
    {/* Enhanced timeline line */}
    <div
      className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full pulse-glow"
      style={{ 
        background: `
          linear-gradient(to bottom, 
            var(--primary) 0%, 
            var(--primary-dark) 50%, 
            var(--primary) 100%
          )
        `,
        opacity: 0.4
      }}
    />
    
    <ul className="space-y-8 sm:space-y-12">
      {timeline.map((t, i) => (
        <li
          key={t.year}
          className={`relative flex items-start ${i % 2 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Enhanced timeline marker */}
          <div
            className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-full text-white border-4 border-white shadow-lg z-10 transition-all duration-300 hover:scale-110 pulse-glow"
            style={{ 
              background: `
                linear-gradient(135deg, 
                  ${t.color} 0%, 
                  var(--primary-dark) 100%
                )
              `
            }}
          >
            <span className="text-xs sm:text-sm font-bold">{i + 1}</span>
          </div>

          <article
            className={`ml-16 sm:ml-20 md:ml-0 md:w-1/2 ${i % 2 ? 'md:pl-8 md:pr-0' : 'md:pr-8 md:pl-0'} animate-fade-in-up`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover-lift glass-morphism">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                <Badge variant="year">{t.year}</Badge>
                <Badge variant="milestone">{t.milestone}</Badge>
              </div>
              
              <h3 
                className="font-bold text-lg sm:text-xl mb-3" 
                style={{ color: 'var(--primary)' }}
              >
                {t.title}
              </h3>
              
              <p 
                className="text-sm leading-relaxed" 
                style={{ color: 'var(--text)' }}
              >
                {t.description}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
));

const EnhancedMiniCard = React.memo(({ icon, title, description, year, category, impact, delay = 0, reducedMotion }) => (
  <div
    className={`group text-center p-6 sm:p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl glass-morphism hover-lift ${!reducedMotion ? 'animate-scale-in' : ''}`}
    style={{
      animationDelay: `${delay}ms`
    }}
  >
    <div className="mb-4 sm:mb-6 flex justify-center p-3 sm:p-4 rounded-full transition-all duration-300 group-hover:scale-110 glass-morphism pulse-glow">
      {React.cloneElement(icon, { 
        style: { color: 'var(--primary)', fontSize: '1.5rem' }
      })}
    </div>
    
    <h3 
      className="font-bold text-base sm:text-lg mb-3" 
      style={{ color: 'var(--primary)' }}
    >
      {title}
    </h3>
    
    <p 
      className="text-sm mb-3 leading-relaxed" 
      style={{ color: 'var(--text)' }}
    >
      {description}
    </p>
    
    <div className="flex flex-wrap justify-center gap-2 text-xs">
      {year && (
        <Badge variant="year">{year}</Badge>
      )}
      {category && (
        <Badge variant="milestone">{category}</Badge>
      )}
      {impact && (
        <span
          className={`px-2 py-1 rounded-full ${impact === 'High' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}
        >
          {impact} Impact
        </span>
      )}
    </div>
  </div>
));

const EnhancedFeatureRow = React.memo(({ icon, text, category, delay = 0, reducedMotion }) => (
  <div 
    className={`flex items-start group p-3 sm:p-4 rounded-xl transition-all duration-300 hover:shadow-md glass-morphism hover-lift ${!reducedMotion ? 'animate-fade-in-up' : ''}`}
    style={{ 
      animationDelay: `${delay}ms`
    }}
  >
    <div className="p-2 sm:p-3 rounded-full mr-3 sm:mr-4 mt-1 transition-all duration-300 group-hover:scale-110 glass-morphism">
      {React.cloneElement(icon, { 
        style: { color: 'var(--primary)', fontSize: '0.9rem' }
      })}
    </div>
    <div className="flex-1">
      <p 
        className="leading-relaxed transition-colors duration-300 text-sm sm:text-base" 
        style={{ color: 'var(--text)' }}
      >
        {text}
      </p>
      {category && (
        <span 
          className="text-xs mt-1 inline-block"
          style={{ color: 'var(--primary)', opacity: 0.8 }}
        >
          {category}
        </span>
      )}
    </div>
  </div>
));

const EnhancedContactSection = React.memo(() => (
  <section
    className="p-8 sm:p-12 rounded-2xl shadow-2xl relative overflow-hidden glass-morphism-strong"
    style={{ 
      background: `
        linear-gradient(135deg, 
          var(--primary) 0%, 
          var(--primary-dark) 50%, 
          var(--primary) 100%
        )
      `,
      color: 'var(--accent)'
    }}
  >
    {/* Enhanced background pattern */}
    <div 
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `
          radial-gradient(circle at 2px 2px, white 1px, transparent 0),
          radial-gradient(circle at 4px 4px, white 0.5px, transparent 0)
        `,
        backgroundSize: '40px 40px, 20px 20px'
      }}
    />
    
    <div className="relative z-10">
      <SectionTitle light>Get in Touch</SectionTitle>
      
      <div className="grid gap-6 sm:gap-8 md:gap-10 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-10">
        {[
          {
            icon: <FaMapMarkerAlt style={{ fontSize: '2rem' }} />,
            title: 'Visit Us',
            lines: [
              'Kandivli Education Society',
              'Akurli Road, Kandivali (East)',
              'Mumbai 400 101, Maharashtra',
              'India'
            ]
          },
          {
            icon: <FaPhone style={{ fontSize: '2rem' }} />,
            title: 'Call Us',
            lines: [
              'Office: +91-22-2867-2643',
              'Admissions: +91-22-2867-2644',
              'Alumni: +91-22-2867-2645',
              'Mon-Sat: 9AM-6PM'
            ]
          },
          {
            icon: <FaEnvelope style={{ fontSize: '2rem' }} />,
            title: 'Email Us',
            lines: [
              'info@kes.edu.in',
              'alumni@kes.edu.in',
              'admissions@kes.edu.in',
              'careers@kes.edu.in'
            ]
          }
        ].map((c, index) => (
          <div key={c.title} className={`text-center group animate-fade-in-up`} style={{ animationDelay: `${index * 0.2}s` }}>
            <div className="w-16 sm:w-20 h-16 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 glass-morphism pulse-glow">
              {c.icon}
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{c.title}</h3>
            <div className="space-y-1">
              {c.lines.map((line, idx) => (
                <p key={idx} className="text-sm opacity-90">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 sm:p-8 rounded-xl text-center glass-morphism">
        <blockquote className="text-lg sm:text-xl font-medium mb-4 italic">
          "Education is the most powerful weapon which you can use to change the world."
        </blockquote>
        <cite className="text-sm opacity-80">— Nelson Mandela</cite>
      </div>
    </div>
  </section>
));

const EnhancedVMCard = React.memo(({ icon, title, text, className = '' }) => (
  <div className={`group p-8 sm:p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ${className}`}>
    <div className="flex items-center mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 rounded-full mr-3 sm:mr-4 transition-all duration-300 group-hover:scale-110 glass-morphism pulse-glow">
        {icon}
      </div>
      <h3 
        className="text-xl sm:text-2xl font-bold" 
        style={{ color: 'var(--primary)' }}
      >
        {title}
      </h3>
    </div>
    <p 
      className="text-base sm:text-lg leading-relaxed" 
      style={{ color: 'var(--text)' }}
    >
      {text}
    </p>
  </div>
));

/* ----------  Enhanced Atoms with Performance Optimizations  ---------- */
const Badge = React.memo(({ children, variant = 'primary' }) => {
  const variants = {
    primary: {
      background: `
        linear-gradient(135deg, 
          rgba(134,188,37,0.25) 0%, 
          rgba(134,188,37,0.15) 100%
        )
      `,
      color: 'var(--primary)',
      border: '1px solid rgba(134,188,37,0.3)'
    },
    year: {
      background: `
        linear-gradient(135deg, 
          rgba(134,188,37,0.2) 0%, 
          rgba(134,188,37,0.1) 100%
        )
      `,
      color: 'var(--primary)',
      border: '1px solid rgba(134,188,37,0.25)'
    },
    students: {
      background: `
        linear-gradient(135deg, 
          rgba(255,255,255,0.9) 0%, 
          rgba(255,255,255,0.7) 100%
        )
      `,
      color: 'var(--primary)',
      border: '1px solid rgba(134,188,37,0.2)'
    },
    milestone: {
      background: `
        linear-gradient(135deg, 
          rgba(134,188,37,0.2) 0%, 
          rgba(134,188,37,0.15) 100%
        )
      `,
      color: 'var(--primary-dark)',
      border: '1px solid rgba(134,188,37,0.3)'
    }
  };

  return (
    <span
      className="text-xs font-semibold px-2 sm:px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 glass-morphism"
      style={variants[variant]}
    >
      {children}
    </span>
  );
});

const EnhancedLogo = React.memo(({ logo, fallback }) => (
  <div 
    className="relative w-16 sm:w-20 h-16 sm:h-20 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl glass-morphism"
  >
    <img
      src={logo}
      alt="Institution logo"
      className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
      loading="lazy"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <div className="hidden w-full h-full items-center justify-center transition-all duration-300 glass-morphism">
      {React.cloneElement(fallback, { 
        style: { color: 'var(--primary)', fontSize: '1.5rem' }
      })}
    </div>
  </div>
));

export default AboutPage;
