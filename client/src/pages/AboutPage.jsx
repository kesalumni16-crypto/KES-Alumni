/* ----------  AboutPage.jsx  ---------- */
import React, { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaBriefcase, FaEye, FaChevronDown, FaExternalLinkAlt,
  FaStar, FaTrophy, FaGlobe, FaRocket
} from 'react-icons/fa';

/* ----------  Enhanced Data with more details  ---------- */
const institutions = [
  {
    name: 'Sardar Vallabhbhai Patel High School (SVP)',
    year: '1936',
    description: 'Begun with 13 pupils; today educates 4,500+ students in SSC & CBSE divisions with modern infrastructure and experienced faculty.',
    icon: <FaGraduationCap />,
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    students: '4,500+',
    programs: ['SSC', 'CBSE', 'State Board'],
    achievements: ['100% Pass Rate', 'State Topper 2024', 'Smart School Award']
  },
  {
    name: 'Shri T.P. Bhatia Junior College of Science',
    year: '1976',
    description: 'State-board science college with modern labs, research facilities, and industry partnerships; enrollment 2,500+.',
    icon: <FaAward />,
    logo: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    students: '2,500+',
    programs: ['HSC Science', 'Biotechnology', 'Computer Science'],
    achievements: ['NAAC B+ Grade', '95% College Admission', 'Research Excellence']
  },
  {
    name: 'SVP Night School',
    year: '1970',
    description: 'Evening secondary section enabling working youth to complete schooling with flexible timings and personalized support.',
    icon: <FaUsers />,
    logo: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg',
    students: '800+',
    programs: ['Evening SSC', 'Part-time Courses'],
    achievements: ['Adult Education Award', 'Community Impact', 'Skill Development']
  },
  {
    name: 'KES Sangeet Mahavidyalaya',
    year: '1984',
    description: 'Affiliated to Gandharva Mahavidyalaya; offers vocal, instrumental & dance diplomas with renowned faculty.',
    icon: <FaMusic />,
    logo: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    students: '1,200+',
    programs: ['Classical Music', 'Dance', 'Fine Arts'],
    achievements: ['Cultural Excellence', 'National Performers', 'Heritage Preservation']
  },
  {
    name: 'B.K. Shroff & M.H. Shroff College (Degree)',
    year: '1989',
    description: 'Mumbai-University-affiliated; NAAC "A" grade; 9,000+ learners across arts & commerce with excellent placement record.',
    icon: <FaBuilding />,
    logo: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    students: '9,000+',
    programs: ['BA', 'BCom', 'BMS', 'BAF', 'MA', 'MCom'],
    achievements: ['NAAC A Grade', 'Best College Award', '90% Placement Rate']
  },
  {
    name: "KES' Shri J.H. Patel Law College",
    year: '2012',
    description: 'BCI-approved institute offering 3-yr LL.B. & 5-yr BA LL.B.; 300 seats with moot court and legal aid clinic.',
    icon: <FaBuilding />,
    logo: 'https://images.pexels.com/photos/4427611/pexels-photo-4427611.jpeg',
    students: '300',
    programs: ['LL.B.', 'BA LL.B.'],
    achievements: ['Moot Court Champions', 'Legal Aid Clinic', 'Bar Council Recognition']
  },
  {
    name: 'KES Cambridge International Junior College',
    year: '2009',
    description: 'Delivers Cambridge "A-Level" curriculum; pathway to 125+ countries with international faculty and global recognition.',
    icon: <FaGraduationCap />,
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    students: '600+',
    programs: ['Cambridge A-Levels'],
    achievements: ['Cambridge Excellence', 'Global University Admission', 'International Recognition']
  },
  {
    name: "Pre-Primary Teachers' Training Institute",
    year: '1995',
    description: 'Trains early-childhood educators using modern pedagogy with hands-on experience and continuous professional development.',
    icon: <FaUsers />,
    logo: 'https://images.pexels.com/photos/861308/pexels-photo-861308.jpeg',
    students: '300+',
    programs: ['ECCEd', 'Diploma in Early Childhood Ed.'],
    achievements: ['Teacher Excellence', 'Innovation in Education', 'Child Development Research']
  },
  {
    name: 'KES Institute of Management Studies & Research',
    year: '2005',
    description: 'AICTE-approved MBA & PGDM programmes with industry tie-ups, case studies, and corporate mentorship; 1,500+ students.',
    icon: <FaBriefcase />,
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
  { icon: <FaUsers />, title: 'Student Community', value: '20,000+', desc: 'Active learners across institutions' },
  { icon: <FaGlobe />, title: 'Global Alumni', value: '50,000+', desc: 'Graduates in 25+ countries' },
  { icon: <FaTrophy />, title: 'Placement Success', value: '85%', desc: 'Rate with Fortune 500 companies' },
  { icon: <FaStar />, title: 'Academic Standards', value: 'NAAC A', desc: 'Grade for educational quality' }
];

const achievements = [
  {
    title: 'NAAC "A" Accreditation',
    description: 'Shroff College reaccredited with CGPA 3.22/4 (2023), demonstrating academic excellence.',
    icon: <FaTrophy />,
    year: '2023'
  },
  {
    title: 'NIRF Recognition',
    description: 'Ranked in NIRF-2024 college band 151-200, national recognition for quality education.',
    icon: <FaStar />,
    year: '2024'
  },
  {
    title: 'Alumni Leadership',
    description: 'Graduates heading TCS, Deloitte & HSBC divisions, showcasing career success.',
    icon: <FaRocket />,
    year: 'Ongoing'
  },
  {
    title: 'Global Partnerships',
    description: 'MoUs with University of Leeds & Centennial College, expanding international opportunities.',
    icon: <FaGlobe />,
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroSection />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        {/* Heritage Section */}
        <Section id="heritage" title="Our Rich Heritage">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                Founded in <span className="font-bold" style={{ color: 'var(--primary)' }}>1936</span> by visionary community leaders in Kandivali,
                KES began with just <span className="font-bold" style={{ color: 'var(--primary)' }}>13 students</span>. Today, our society
                educates <span className="font-bold" style={{ color: 'var(--primary)' }}>20,000+</span> learners each year, staying true
                to our mission of affordable, holistic education that transforms lives and communities.
              </p>
              <p className="text-lg leading-relaxed text-gray-700">
                The society was formally registered in <span className="font-bold" style={{ color: 'var(--primary)' }}>1947</span>. Over
                nearly nine decades, it has grown from a single high school into a comprehensive network of
                <span className="font-bold" style={{ color: 'var(--primary)' }}> nine distinguished institutions</span> spanning primary to
                postgraduate study, fine arts, teacher training, and professional management.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {keyFeatures.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </Section>

        {/* Timeline Section */}
        <Section id="timeline" title="Journey Through Time">
          <Timeline />
        </Section>

        {/* Institutions Section */}
        <Section id="institutions" title="Our Institutions">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutions.map((institution, index) => (
              <InstitutionCard 
                key={index} 
                {...institution} 
                isExpanded={expandedCard === index}
                onToggle={() => setExpandedCard(expandedCard === index ? null : index)}
              />
            ))}
          </div>
        </Section>

        {/* Achievements Section */}
        <Section id="achievements" title="Key Achievements">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <AchievementCard key={index} {...achievement} />
            ))}
          </div>
        </Section>

        {/* Contact Section */}
        <ContactSection />

        {/* Vision Mission Section */}
        <div className="grid lg:grid-cols-2 gap-12">
          <VisionMissionCard
            icon={<FaEye />}
            title="Our Vision"
            text="To be a globally recognized institution that nurtures innovative thinkers, ethical leaders, and responsible citizens who contribute positively to society and drive meaningful change."
          />
          <VisionMissionCard
            icon={<FaTrophy />}
            title="Our Mission"
            text="To deliver accessible, quality education that combines academic excellence with character development, fostering lifelong learning and empowering students to achieve their full potential."
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

/* ----------  Enhanced Components  ---------- */

const HeroSection = () => (
  <section className="relative overflow-hidden bg-white py-24 lg:py-32">
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-60"></div>
    <div 
      className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
      style={{ backgroundColor: 'var(--primary)' }}
    ></div>
    
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h1 
        className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight"
        style={{ color: 'var(--primary)' }}
      >
        About Kandivli Education Society
      </h1>
      
      <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto mb-12 leading-relaxed">
        Shaping minds, building futures since 1936 — 89 years of educational excellence
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {[
          { value: '89', label: 'Years of Excellence' },
          { value: '50,000+', label: 'Alumni Worldwide' },
          { value: '20,000+', label: 'Current Students' },
          { value: '9', label: 'Institutions' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div 
              className="text-3xl lg:text-4xl font-bold mb-2"
              style={{ color: 'var(--primary)' }}
            >
              {stat.value}
            </div>
            <div className="text-sm font-medium text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Section = ({ id, title, children }) => (
  <section id={id} data-animate className="space-y-12">
    <div className="text-center">
      <h2 
        className="text-3xl lg:text-4xl font-bold mb-4"
        style={{ color: 'var(--primary)' }}
      >
        {title}
      </h2>
      <div 
        className="w-24 h-1 mx-auto rounded-full"
        style={{ backgroundColor: 'var(--primary)' }}
      ></div>
    </div>
    {children}
  </section>
);

const FeatureCard = ({ icon, title, value, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
    <div 
      className="flex items-center justify-center w-12 h-12 rounded-lg mb-4 text-white"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      {React.cloneElement(icon, { className: 'w-6 h-6' })}
    </div>
    <div 
      className="text-2xl font-bold mb-1"
      style={{ color: 'var(--primary)' }}
    >
      {value}
    </div>
    <div className="text-sm font-medium text-gray-900 mb-1">{title}</div>
    <div className="text-xs text-gray-600">{desc}</div>
  </div>
);

const Timeline = () => (
  <div className="relative">
    <div 
      className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-0.5"
      style={{ backgroundColor: 'var(--primary)', opacity: 0.3 }}
    ></div>
    
    <div className="space-y-12">
      {timeline.map((item, index) => (
        <div key={index} className={`relative flex items-start ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
          <div 
            className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center z-10 text-white font-bold text-sm"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {index + 1}
          </div>
          
          <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <span 
                  className="px-3 py-1 text-white text-sm font-medium rounded-full"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  {item.year}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {item.milestone}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const InstitutionCard = ({ name, year, description, logo, icon, students, programs, achievements, isExpanded, onToggle }) => (
  <div 
    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 cursor-pointer"
    onClick={onToggle}
  >
    {/* Image Header */}
    <div className="h-48 bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center overflow-hidden">
      <img
        src={logo}
        alt={name}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.style.display = 'none';
          e.target.nextSibling.style.display = 'flex';
        }}
      />
      <div className="hidden w-full h-full items-center justify-center">
        {React.cloneElement(icon, { 
          className: 'w-16 h-16',
          style: { color: 'var(--primary)' }
        })}
      </div>
    </div>
    
    <div className="p-6">
      <div className="flex items-center gap-2 mb-3">
        <span 
          className="px-3 py-1 text-white text-xs font-medium rounded-full"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          Est. {year}
        </span>
        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
          {students} Students
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">{name}</h3>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {programs.map((program, idx) => (
          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-medium">
            {program}
          </span>
        ))}
      </div>
      
      {isExpanded && achievements && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
            <FaStar className="w-4 h-4 mr-2" style={{ color: 'var(--primary)' }} />
            Key Achievements
          </h4>
          <div className="space-y-2">
            {achievements.map((achievement, idx) => (
              <div key={idx} className="text-sm text-gray-600 flex items-start">
                <div 
                  className="w-2 h-2 rounded-full mr-3 mt-2"
                  style={{ backgroundColor: 'var(--primary)' }}
                ></div>
                {achievement}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <span 
          className="text-sm font-medium"
          style={{ color: 'var(--primary)' }}
        >
          {isExpanded ? 'Show Less' : 'View Details'}
        </span>
        <FaChevronDown 
          className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--primary)' }}
        />
      </div>
    </div>
  </div>
);

const AchievementCard = ({ icon, title, description, year }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 text-center">
    <div 
      className="flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto text-white"
      style={{ backgroundColor: 'var(--primary)' }}
    >
      {React.cloneElement(icon, { className: 'w-8 h-8' })}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
    <span 
      className="text-sm font-medium px-3 py-1 rounded-full"
      style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'white'
      }}
    >
      {year}
    </span>
  </div>
);

const ContactSection = () => (
  <section 
    className="rounded-3xl overflow-hidden shadow-2xl"
    style={{ backgroundColor: 'var(--primary)' }}
  >
    <div className="px-8 py-16 lg:px-16 lg:py-24 text-white text-center relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-32 -translate-y-32"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full translate-x-32 translate-y-32"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get in Touch</h2>
        <div className="w-24 h-1 bg-white mx-auto rounded-full mb-16"></div>
        
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {[
            {
              icon: <FaMapMarkerAlt />,
              title: 'Visit Us',
              details: ['Kandivli Education Society', 'Akurli Road, Kandivali (East)', 'Mumbai 400 101, Maharashtra']
            },
            {
              icon: <FaPhone />,
              title: 'Call Us',
              details: ['Office: +91-22-2867-2643', 'Admissions: +91-22-2867-2644', 'Alumni: +91-22-2867-2645']
            },
            {
              icon: <FaEnvelope />,
              title: 'Email Us',
              details: ['info@kes.edu.in', 'alumni@kes.edu.in', 'admissions@kes.edu.in']
            }
          ].map((contact, index) => (
            <div key={index} className="group">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 mx-auto group-hover:bg-white/30 transition-all duration-300">
                {React.cloneElement(contact.icon, { className: 'w-8 h-8' })}
              </div>
              <h3 className="text-xl font-bold mb-4">{contact.title}</h3>
              <div className="space-y-2">
                {contact.details.map((detail, idx) => (
                  <p key={idx} className="text-white/90 text-sm">{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/20">
          <blockquote className="text-xl font-medium italic mb-4">
            "Education is the most powerful weapon which you can use to change the world."
          </blockquote>
          <cite className="text-white/80">— Nelson Mandela</cite>
        </div>
      </div>
    </div>
  </section>
);

const VisionMissionCard = ({ icon, title, text }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
    <div className="flex items-center mb-6">
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-lg mr-4 text-white"
        style={{ backgroundColor: 'var(--primary)' }}
      >
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 leading-relaxed text-lg">{text}</p>
  </div>
);

export default AboutPage;
