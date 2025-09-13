/* ----------  AboutPage.jsx  ---------- */
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaBriefcase, FaEye, FaChevronDown, FaExternalLinkAlt
} from 'react-icons/fa';

/* ----------  Enhanced Data with more details  ---------- */
const institutions = [
  {
    name: 'Sardar Vallabhbhai Patel High School (SVP)',
    year: '1936',
    description: 'Begun with 13 pupils; today educates 4,500+ students in SSC & CBSE divisions with modern infrastructure and experienced faculty.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    students: '4,500+',
    programs: ['SSC', 'CBSE', 'State Board'],
    achievements: ['100% Pass Rate', 'State Topper 2024', 'Smart School Award']
  },
  {
    name: 'Shri T.P. Bhatia Junior College of Science',
    year: '1976',
    description: 'State-board science college with modern labs, research facilities, and industry partnerships; enrollment 2,500+.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    students: '2,500+',
    programs: ['HSC Science', 'Biotechnology', 'Computer Science'],
    achievements: ['NAAC B+ Grade', '95% College Admission', 'Research Excellence']
  },
  {
    name: 'SVP Night School',
    year: '1970',
    description: 'Evening secondary section enabling working youth to complete schooling with flexible timings and personalized support.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg',
    students: '800+',
    programs: ['Evening SSC', 'Part-time Courses'],
    achievements: ['Adult Education Award', 'Community Impact', 'Skill Development']
  },
  {
    name: 'KES Sangeet Mahavidyalaya',
    year: '1984',
    description: 'Affiliated to Gandharva Mahavidyalaya; offers vocal, instrumental & dance diplomas with renowned faculty.',
    icon: <FaMusic style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    students: '1,200+',
    programs: ['Classical Music', 'Dance', 'Fine Arts'],
    achievements: ['Cultural Excellence', 'National Performers', 'Heritage Preservation']
  },
  {
    name: 'B.K. Shroff & M.H. Shroff College (Degree)',
    year: '1989',
    description: 'Mumbai-University-affiliated; NAAC "A" grade; 9,000+ learners across arts & commerce with excellent placement record.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    students: '9,000+',
    programs: ['BA', 'BCom', 'BMS', 'BAF', 'MA', 'MCom'],
    achievements: ['NAAC A Grade', 'Best College Award', '90% Placement Rate']
  },
  {
    name: "KES' Shri J.H. Patel Law College",
    year: '2012',
    description: 'BCI-approved institute offering 3-yr LL.B. & 5-yr BA LL.B.; 300 seats with moot court and legal aid clinic.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/4427611/pexels-photo-4427611.jpeg',
    students: '300',
    programs: ['LL.B.', 'BA LL.B.'],
    achievements: ['Moot Court Champions', 'Legal Aid Clinic', 'Bar Council Recognition']
  },
  {
    name: 'KES Cambridge International Junior College',
    year: '2009',
    description: 'Delivers Cambridge "A-Level" curriculum; pathway to 125+ countries with international faculty and global recognition.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    students: '600+',
    programs: ['Cambridge A-Levels'],
    achievements: ['Cambridge Excellence', 'Global University Admission', 'International Recognition']
  },
  {
    name: "Pre-Primary Teachers' Training Institute",
    year: '1995',
    description: 'Trains early-childhood educators using modern pedagogy with hands-on experience and continuous professional development.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/861308/pexels-photo-861308.jpeg',
    students: '300+',
    programs: ['ECCEd', 'Diploma in Early Childhood Ed.'],
    achievements: ['Teacher Excellence', 'Innovation in Education', 'Child Development Research']
  },
  {
    name: 'KES Institute of Management Studies & Research',
    year: '2005',
    description: 'AICTE-approved MBA & PGDM programmes with industry tie-ups, case studies, and corporate mentorship; 1,500+ students.',
    icon: <FaBriefcase style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    students: '1,500+',
    programs: ['MBA', 'PGDM', 'Executive Courses'],
    achievements: ['AICTE Approved', 'Industry Partnerships', 'Entrepreneurship Hub']
  }
];

const timeline = [
  { year: '1936', milestone: 'Birth of KES', title: 'Foundation', description: 'Started with 13 students at SVP School, laying the foundation for quality education.' },
  { year: '1947', milestone: 'Legal Registration', title: 'Trust Registered', description: 'Society registered under the Societies Act, formalizing our commitment to education.' },
  { year: '1961', milestone: 'Technical Wing', title: 'SVP Technical Section', description: 'Vocational stream added to prepare students for technical careers.' },
  { year: '1970', milestone: 'Inclusivity', title: 'Night School', description: 'Evening classes for working youth, ensuring education accessibility for all.' },
  { year: '1976', milestone: 'Academic Expansion', title: 'Science Jr. College', description: 'T.P. Bhatia Science college launched, focusing on scientific excellence.' },
  { year: '1984', milestone: 'Cultural Heritage', title: 'Sangeet Mahavidyalaya', description: 'Institute for classical music & dance, preserving cultural traditions.' },
  { year: '1989', milestone: 'Degree College', title: 'Arts & Commerce', description: 'B.K./M.H. Shroff College inaugurated, expanding higher education opportunities.' },
  { year: '2005', milestone: 'Professional Studies', title: 'Management Institute', description: 'MBA & PGDM programmes introduced, focusing on industry-ready professionals.' },
  { year: '2009', milestone: 'Global Reach', title: 'Cambridge A-Levels', description: 'International Junior College established, connecting students globally.' },
  { year: '2012', milestone: 'Legal Studies', title: 'Law College', description: 'Shri J.H. Patel Law College opened, training future legal professionals.' },
  { year: '2025', milestone: 'Digital Era', title: 'Alumni Portal', description: 'Digital platform linking 50,000+ alumni worldwide, fostering global community.' }
];

const keyFeatures = [
  { icon: <FaUsers />, text: '20,000+ students across nine institutions' },
  { icon: <FaGraduationCap />, text: '50,000+ alumni on six continents' },
  { icon: <FaAward />, text: 'SSC, HSC, Cambridge A-Level & University degrees' },
  { icon: <FaBuilding />, text: 'NAAC "A" grade for Shroff College; ISO 9001-certified processes' },
  { icon: <FaBriefcase />, text: 'Smart classrooms, e-library & state-of-the-art labs' },
  { icon: <FaUsers />, text: '85% placement rate with Fortune 500 recruiters' },
  { icon: <FaAward />, text: '₹1 crore+ in annual scholarships' },
  { icon: <FaGraduationCap />, text: 'MoUs with universities in the UK, Canada & Singapore' },
  { icon: <FaBuilding />, text: '24×7 digital alumni portal & mobile app (2025)' },
  { icon: <FaBriefcase />, text: 'Active NSS, NCC & community-service units' }
];

const achievements = [
  {
    title: 'NAAC "A" Accreditation',
    description: 'Shroff College reaccredited with CGPA 3.22/4 (2023), demonstrating academic excellence.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    year: '2023'
  },
  {
    title: 'NIRF Listed',
    description: 'Ranked in NIRF-2024 college band 151-200, national recognition for quality education.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    year: '2024'
  },
  {
    title: 'Alumni Leadership',
    description: 'Graduates heading TCS, Deloitte & HSBC divisions, showcasing career success.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    year: 'Ongoing'
  },
  {
    title: 'Global Partnerships',
    description: 'MoUs with University of Leeds & Centennial College, expanding international opportunities.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    year: '2024'
  }
];

/* ----------  Enhanced AboutPage Component  ---------- */
const AboutPage = () => {
  const [isVisible, setIsVisible] = useState({});
  const [expandedCard, setExpandedCard] = useState(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="min-h-screen relative" 
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
      {/* Decorative Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(circle at 2px 2px, rgba(134,188,37,0.03) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Enhanced Hero Section */}
      <HeroSection />

      <main className="container mx-auto px-6 py-12 space-y-16 relative z-10">
        {/* Heritage Section */}
        <div id="heritage" data-animate className={`transition-all duration-1000 ${isVisible.heritage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <EnhancedSectionCard>
            <SectionHeader
              icon={<FaCalendarAlt style={{ color: 'var(--primary)', fontSize: '2rem' }} />}
            >
              Our Rich Heritage
            </SectionHeader>
            <div className="prose prose-lg max-w-none" style={{ color: 'var(--text)' }}>
              <p className="text-lg leading-relaxed">
                Founded in <strong style={{ color: 'var(--primary)' }}>1936</strong> by visionary community leaders in Kandivali,
                KES began with just <strong style={{ color: 'var(--primary)' }}>13 students</strong>. Today, our society
                educates <strong style={{ color: 'var(--primary)' }}>20,000+</strong> learners each year, staying true
                to our mission of affordable, holistic education that transforms lives and communities.
              </p>
              <p className="text-lg leading-relaxed">
                The society was formally registered in <strong style={{ color: 'var(--primary)' }}>1947</strong>. Over
                nearly nine decades, it has grown from a single high school into a comprehensive network of
                <strong style={{ color: 'var(--primary)' }}> nine distinguished institutions</strong> spanning primary to
                postgraduate study, fine arts, teacher training, and professional management.
              </p>
              <p className="text-lg leading-relaxed">
                Our engaged alumni family of <strong style={{ color: 'var(--primary)' }}>50,000+</strong> graduates now supports
                scholarships, placements, and community projects across <strong style={{ color: 'var(--primary)' }}>25 countries</strong>,
                creating a global network of educational excellence and social impact.
              </p>
            </div>
          </EnhancedSectionCard>
        </div>

        {/* Timeline Section */}
        <div id="timeline" data-animate className={`transition-all duration-1000 ${isVisible.timeline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <EnhancedSectionCard>
            <SectionTitle>Journey Through Time</SectionTitle>
            <EnhancedTimeline />
          </EnhancedSectionCard>
        </div>

        {/* Institutions Section */}
        <div id="institutions" data-animate className={`transition-all duration-1000 ${isVisible.institutions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <SectionTitle>Our Institutions</SectionTitle>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {institutions.map((obj, index) => (
              <EnhancedInstitutionCard 
                key={obj.name} 
                {...obj} 
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
                delay={index * 100}
              />
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div id="achievements" data-animate className={`transition-all duration-1000 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <EnhancedSectionCard>
            <SectionTitle>Our Achievements</SectionTitle>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {achievements.map((a, index) => (
                <EnhancedMiniCard key={a.title} {...a} delay={index * 150} />
              ))}
            </div>
          </EnhancedSectionCard>
        </div>

        {/* Key Features Section */}
        <div id="features" data-animate className={`transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <EnhancedSectionCard>
            <SectionTitle>Why Choose KES</SectionTitle>
            <div className="grid gap-6 md:grid-cols-2">
              {keyFeatures.map((f, index) => (
                <EnhancedFeatureRow key={f.text} {...f} delay={index * 100} />
              ))}
            </div>
          </EnhancedSectionCard>
        </div>

        {/* Contact Section */}
        <div id="contact" data-animate className={`transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <EnhancedContactSection />
        </div>

        {/* Vision/Mission Section */}
        <div id="vision" data-animate className={`transition-all duration-1000 ${isVisible.vision ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid gap-8 md:grid-cols-2">
            <EnhancedVMCard
              icon={<FaEye style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />}
              title="Our Vision"
              text="To be a globally recognized institution that nurtures innovative thinkers, ethical leaders, and responsible citizens who contribute positively to society and drive meaningful change."
            />
            <EnhancedVMCard
              icon={<FaAward style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />}
              title="Our Mission"
              text="To deliver accessible, quality education that combines academic excellence with character development, fostering lifelong learning and empowering students to achieve their full potential."
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ----------  Enhanced Components  ---------- */

const HeroSection = () => (
  <section 
    className="py-20 relative overflow-hidden" 
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
        backgroundSize: '60px 60px, 30px 30px'
      }}
    />
    
    <div className="container mx-auto px-6 text-center relative z-10">
      <div className="max-w-5xl mx-auto">
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ color: 'var(--primary)' }}
        >
          About Kandivli Education Society
        </h1>
        <p
          className="text-xl md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-8 leading-relaxed"
          style={{ color: 'var(--text)' }}
        >
          Shaping minds, building futures since 1936
        </p>
        <div 
          className="text-lg font-semibold mb-12"
          style={{ color: 'var(--primary)' }}
        >
          89 Years of Educational Excellence
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {[
            ['89', 'Years of Excellence', 'Educational legacy'],
            ['50,000+', 'Alumni Worldwide', 'Global network'],
            ['20,000+', 'Current Students', 'Active learners'],
            ['9', 'Institutions', 'Educational centers']
          ].map(([num, label, desc], index) => (
            <div 
              key={label} 
              className="text-center p-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg backdrop-blur-sm"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(134,188,37,0.15) 0%, 
                    rgba(255,255,255,0.8) 50%, 
                    rgba(134,188,37,0.1) 100%
                  )
                `,
                border: '1px solid rgba(134,188,37,0.2)',
                boxShadow: '0 8px 32px rgba(134,188,37,0.1)'
              }}
            >
              <div 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: 'var(--primary)' }}
              >
                {num}
              </div>
              <div 
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--secondary)' }}
              >
                {label}
              </div>
              <div 
                className="text-xs"
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
);

const EnhancedSectionCard = ({ children, className = '' }) => (
  <section
    className={`p-10 rounded-2xl shadow-xl backdrop-blur-lg transition-all duration-300 hover:shadow-2xl ${className}`}
    style={{
      background: `
        linear-gradient(135deg, 
          rgba(255,255,255,0.98) 0%, 
          rgba(255,255,255,0.95) 50%, 
          rgba(134,188,37,0.02) 100%
        )
      `,
      border: '1px solid rgba(134,188,37,0.15)',
      boxShadow: '0 20px 40px rgba(134,188,37,0.1)',
      color: 'var(--text)'
    }}
  >
    {children}
  </section>
);

const SectionHeader = ({ icon, children }) => (
  <div className="flex items-center justify-center md:justify-start mb-8">
    <div 
      className="p-4 rounded-full mr-4 backdrop-blur-sm" 
      style={{ 
        background: `
          linear-gradient(135deg, 
            rgba(134,188,37,0.2) 0%, 
            rgba(134,188,37,0.1) 100%
          )
        `,
        border: '1px solid rgba(134,188,37,0.3)'
      }}
    >
      {icon}
    </div>
    <h2
      className="text-3xl md:text-4xl font-bold text-center md:text-left"
      style={{ color: 'var(--primary)' }}
    >
      {children}
    </h2>
  </div>
);

const SectionTitle = ({ children, light = false }) => (
  <h2
    className="text-3xl md:text-4xl font-bold mb-12 text-center"
    style={{ color: light ? 'var(--accent)' : 'var(--primary)' }}
  >
    {children}
  </h2>
);

const EnhancedInstitutionCard = ({
  name, year, description, logo, icon, students, programs, achievements = [], 
  isExpanded, onToggle, delay = 0
}) => (
  <article
    className="group p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer backdrop-blur-sm"
    style={{
      background: `
        linear-gradient(135deg, 
          rgba(255,255,255,0.98) 0%, 
          rgba(255,255,255,0.92) 50%, 
          rgba(134,188,37,0.03) 100%
        )
      `,
      border: '1px solid rgba(134,188,37,0.15)',
      boxShadow: '0 10px 30px rgba(134,188,37,0.1)',
      animationDelay: `${delay}ms`
    }}
    onClick={onToggle}
  >
    <div className="flex items-start gap-6">
      <EnhancedLogo logo={logo} fallback={icon} />
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="year">{`Est. ${year}`}</Badge>
          <Badge variant="students">{students}</Badge>
        </div>
        
        <h3 
          className="font-bold text-xl mb-3 group-hover:text-green-600 transition-colors duration-300" 
          style={{ color: 'var(--primary)' }}
        >
          {name}
        </h3>
        
        <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text)' }}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {programs.map(p => (
            <span
              key={p}
              className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(134,188,37,0.15) 0%, 
                    rgba(134,188,37,0.1) 100%
                  )
                `,
                color: 'var(--primary)',
                border: '1px solid rgba(134,188,37,0.2)'
              }}
            >
              {p}
            </span>
          ))}
        </div>

        {/* Expandable achievements section */}
        {isExpanded && achievements.length > 0 && (
          <div className="mt-4 pt-4 border-t animate-fadeIn" style={{ borderColor: 'rgba(134,188,37,0.2)' }}>
            <h4 className="font-semibold mb-2" style={{ color: 'var(--primary)' }}>
              Key Achievements:
            </h4>
            <div className="flex flex-wrap gap-1">
              {achievements.map(achievement => (
                <span
                  key={achievement}
                  className="px-2 py-1 rounded text-xs backdrop-blur-sm"
                  style={{
                    backgroundColor: 'rgba(134,188,37,0.2)',
                    color: 'var(--primary-dark)',
                    border: '1px solid rgba(134,188,37,0.3)'
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
);

const EnhancedTimeline = () => (
  <div className="relative">
    {/* Enhanced timeline line */}
    <div
      className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 rounded-full"
      style={{ 
        background: `
          linear-gradient(to bottom, 
            var(--primary) 0%, 
            var(--primary-dark) 50%, 
            var(--primary) 100%
          )
        `,
        opacity: 0.4,
        boxShadow: '0 0 10px rgba(134,188,37,0.3)'
      }}
    />
    
    <ul className="space-y-12">
      {timeline.map((t, i) => (
        <li
          key={t.year}
          className={`relative flex items-start ${i % 2 ? 'md:flex-row-reverse' : ''}`}
        >
          {/* Enhanced timeline marker */}
          <div
            className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-12 h-12 flex items-center justify-center rounded-full text-white border-4 border-white shadow-lg z-10 transition-all duration-300 hover:scale-110"
            style={{ 
              background: `
                linear-gradient(135deg, 
                  var(--primary) 0%, 
                  var(--primary-dark) 100%
                )
              `,
              boxShadow: '0 8px 25px rgba(134,188,37,0.4)'
            }}
          >
            <span className="text-sm font-bold">{i + 1}</span>
          </div>

          <article
            className={`ml-20 md:ml-0 md:w-1/2 ${i % 2 ? 'md:pl-12' : 'md:pr-12'}`}
          >
            <div
              className="p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
              style={{
                background: `
                  linear-gradient(135deg, 
                    rgba(255,255,255,0.98) 0%, 
                    rgba(255,255,255,0.92) 50%, 
                    rgba(134,188,37,0.03) 100%
                  )
                `,
                border: '1px solid rgba(134,188,37,0.15)',
                boxShadow: '0 15px 35px rgba(134,188,37,0.1)'
              }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="year">{t.year}</Badge>
                <Badge variant="milestone">{t.milestone}</Badge>
              </div>
              
              <h3 
                className="font-bold text-xl mb-3" 
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
);

const EnhancedMiniCard = ({ icon, title, description, year, delay = 0 }) => (
  <div
    className="group text-center p-8 rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
    style={{
      background: `
        linear-gradient(135deg, 
          rgba(255,255,255,0.98) 0%, 
          rgba(255,255,255,0.92) 50%, 
          rgba(134,188,37,0.03) 100%
        )
      `,
      border: '1px solid rgba(134,188,37,0.15)',
      boxShadow: '0 10px 30px rgba(134,188,37,0.1)',
      animationDelay: `${delay}ms`
    }}
  >
    <div 
      className="mb-6 flex justify-center p-4 rounded-full transition-all duration-300 group-hover:scale-110 backdrop-blur-sm"
      style={{ 
        background: `
          linear-gradient(135deg, 
            rgba(134,188,37,0.2) 0%, 
            rgba(134,188,37,0.1) 100%
          )
        `,
        border: '1px solid rgba(134,188,37,0.3)'
      }}
    >
      {React.cloneElement(icon, { 
        style: { color: 'var(--primary)', fontSize: '2rem' }
      })}
    </div>
    
    <h3 
      className="font-bold text-lg mb-3" 
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
    
    {year && (
      <div 
        className="text-xs font-semibold"
        style={{ color: 'var(--primary-dark)' }}
      >
        {year}
      </div>
    )}
  </div>
);

const EnhancedFeatureRow = ({ icon, text, delay = 0 }) => (
  <div 
    className="flex items-start group p-4 rounded-xl transition-all duration-300 hover:shadow-md backdrop-blur-sm"
    style={{ 
      animationDelay: `${delay}ms`,
      background: 'rgba(134,188,37,0.02)',
      border: '1px solid rgba(134,188,37,0.1)'
    }}
  >
    <div
      className="p-3 rounded-full mr-4 mt-1 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm"
      style={{
        background: `
          linear-gradient(135deg, 
            rgba(134,188,37,0.25) 0%, 
            rgba(134,188,37,0.15) 100%
          )
        `,
        border: '1px solid rgba(134,188,37,0.3)'
      }}
    >
      {React.cloneElement(icon, { 
        style: { color: 'var(--primary)', fontSize: '1rem' }
      })}
    </div>
    <p 
      className="leading-relaxed transition-colors duration-300" 
      style={{ color: 'var(--text)' }}
    >
      {text}
    </p>
  </div>
);

const EnhancedContactSection = () => (
  <section
    className="p-12 rounded-2xl shadow-2xl relative overflow-hidden backdrop-blur-lg"
    style={{ 
      background: `
        linear-gradient(135deg, 
          var(--primary) 0%, 
          var(--primary-dark) 50%, 
          var(--primary) 100%
        )
      `,
      color: 'var(--accent)',
      boxShadow: '0 25px 50px rgba(134,188,37,0.4)'
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
      
      <div className="grid gap-10 md:grid-cols-3 mb-10">
        {[
          {
            icon: <FaMapMarkerAlt style={{ fontSize: '2.5rem' }} />,
            title: 'Visit Us',
            lines: [
              'Kandivli Education Society',
              'Akurli Road, Kandivali (East)',
              'Mumbai 400 101, Maharashtra',
              'India'
            ]
          },
          {
            icon: <FaPhone style={{ fontSize: '2.5rem' }} />,
            title: 'Call Us',
            lines: [
              'Office: +91-22-2867-2643',
              'Admissions: +91-22-2867-2644',
              'Alumni: +91-22-2867-2645',
              'Mon-Sat: 9AM-6PM'
            ]
          },
          {
            icon: <FaEnvelope style={{ fontSize: '2.5rem' }} />,
            title: 'Email Us',
            lines: [
              'info@kes.edu.in',
              'alumni@kes.edu.in',
              'admissions@kes.edu.in',
              'careers@kes.edu.in'
            ]
          }
        ].map(c => (
          <div key={c.title} className="text-center group">
            <div
              className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 backdrop-blur-sm"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 25px rgba(255,255,255,0.1)'
              }}
            >
              {c.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{c.title}</h3>
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

      <div
        className="p-8 rounded-xl text-center backdrop-blur-sm"
        style={{
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(255,255,255,0.1)'
        }}
      >
        <blockquote className="text-xl font-medium mb-4 italic">
          "Education is the most powerful weapon which you can use to change the world."
        </blockquote>
        <cite className="text-sm opacity-80">— Nelson Mandela</cite>
      </div>
    </div>
  </section>
);

const EnhancedVMCard = ({ icon, title, text }) => (
  <div
    className="group p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 backdrop-blur-sm"
    style={{
      background: `
        linear-gradient(135deg, 
          rgba(255,255,255,0.98) 0%, 
          rgba(255,255,255,0.92) 50%, 
          rgba(134,188,37,0.03) 100%
        )
      `,
      border: '1px solid rgba(134,188,37,0.15)',
      boxShadow: '0 15px 40px rgba(134,188,37,0.1)'
    }}
  >
    <div className="flex items-center mb-6">
      <div 
        className="p-4 rounded-full mr-4 transition-all duration-300 group-hover:scale-110 backdrop-blur-sm"
        style={{ 
          background: `
            linear-gradient(135deg, 
              rgba(134,188,37,0.2) 0%, 
              rgba(134,188,37,0.1) 100%
            )
          `,
          border: '1px solid rgba(134,188,37,0.3)'
        }}
      >
        {icon}
      </div>
      <h3 
        className="text-2xl font-bold" 
        style={{ color: 'var(--primary)' }}
      >
        {title}
      </h3>
    </div>
    <p 
      className="text-lg leading-relaxed" 
      style={{ color: 'var(--text)' }}
    >
      {text}
    </p>
  </div>
);

/* ----------  Enhanced Atoms  ---------- */
const Badge = ({ children, variant = 'primary' }) => {
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
      className="text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm"
      style={variants[variant]}
    >
      {children}
    </span>
  );
};

const EnhancedLogo = ({ logo, fallback }) => (
  <div 
    className="relative w-20 h-20 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm" 
    style={{ 
      border: '1px solid rgba(134,188,37,0.2)',
      boxShadow: '0 8px 25px rgba(134,188,37,0.1)'
    }}
  >
    <img
      src={logo}
      alt="Institution logo"
      className="w-20 h-20 object-cover transition-all duration-300 hover:scale-110"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <div
      className="hidden w-20 h-20 items-center justify-center transition-all duration-300"
      style={{ 
        background: `
          linear-gradient(135deg, 
            rgba(134,188,37,0.15) 0%, 
            rgba(134,188,37,0.1) 100%
          )
        `
      }}
    >
      {React.cloneElement(fallback, { 
        style: { color: 'var(--primary)', fontSize: '2rem' }
      })}
    </div>
  </div>
);

export default AboutPage;
