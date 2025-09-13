/* ----------  AboutPage.jsx  ---------- */
import React from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaBriefcase, FaEye
} from 'react-icons/fa';

/* ----------  theme constants  ---------- */
const GRADIENT = 'linear-gradient(135deg, var(--primary), var(--primary-dark))'; // green gradient based on your colors

/* ----------  data (updated Aug-2025)  ---------- */
const institutions = [
  {
    name: 'Sardar Vallabhbhai Patel High School (SVP)',
    year: '1936',
    description:
      'Begun with 13 pupils; today educates 4,500+ students in SSC & CBSE divisions.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg',
    students: '4,500+',
    programs: ['SSC', 'CBSE', 'State Board']
  },
  {
    name: 'Shri T.P. Bhatia Junior College of Science',
    year: '1976',
    description:
      'State-board science college with modern labs; enrolment 2,500+.',
    icon: <FaAward style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg',
    students: '2,500+',
    programs: ['HSC Science', 'Biotechnology', 'Computer Science']
  },
  {
    name: 'SVP Night School',
    year: '1970',
    description:
      'Evening secondary section enabling working youth to complete schooling.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg',
    students: '800+',
    programs: ['Evening SSC', 'Part-time Courses']
  },
  {
    name: 'KES Sangeet Mahavidyalaya',
    year: '1984',
    description:
      'Affiliated to Gandharva Mahavidyalaya; offers vocal, instrumental & dance diplomas.',
    icon: <FaMusic style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg',
    students: '1,200+',
    programs: ['Classical Music', 'Dance', 'Fine Arts']
  },
  {
    name: 'B.K. Shroff & M.H. Shroff College (Degree)',
    year: '1989',
    description:
      'Mumbai-University-affiliated; NAAC "A"; 9,000+ learners across arts & commerce.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg',
    students: '9,000+',
    programs: ['BA', 'BCom', 'BMS', 'BAF', 'MA', 'MCom']
  },
  {
    name: "KES' Shri J.H. Patel Law College",
    year: '2012',
    description:
      'BCI-approved institute offering 3-yr LL.B. & 5-yr BA LL.B.; 300 seats.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/4427611/pexels-photo-4427611.jpeg',
    students: '300',
    programs: ['LL.B.', 'BA LL.B.']
  },
  {
    name: 'KES Cambridge International Junior College',
    year: '2009',
    description:
      'Delivers Cambridge "A-Level" curriculum; pathway to 125+ countries.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
    students: '600+',
    programs: ['Cambridge A-Levels']
  },
  {
    name: "Pre-Primary Teachers' Training Institute",
    year: '1995',
    description:
      'Trains early-childhood educators using modern pedagogy.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/861308/pexels-photo-861308.jpeg',
    students: '300+',
    programs: ['ECCEd', 'Diploma in Early Childhood Ed.']
  },
  {
    name: 'KES Institute of Management Studies & Research',
    year: '2005',
    description:
      'AICTE-approved MBA & PGDM programmes with industry tie-ups; 1,500+ students.',
    icon: <FaBriefcase style={{ color: 'var(--primary)' }} />,
    logo: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg',
    students: '1,500+',
    programs: ['MBA', 'PGDM', 'Executive Courses']
  }
];

const timeline = [
  { year: '1936', milestone: 'Birth of KES', title: 'Foundation', description: 'Started with 13 students at SVP School.' },
  { year: '1947', milestone: 'Legal Registration', title: 'Trust Registered', description: 'Society registered under the Societies Act.' },
  { year: '1961', milestone: 'Technical Wing', title: 'SVP Technical Section', description: 'Vocational stream added.' },
  { year: '1970', milestone: 'Inclusivity', title: 'Night School', description: 'Evening classes for working youth.' },
  { year: '1976', milestone: 'Academic Expansion', title: 'Science Jr. College', description: 'T.P. Bhatia Science college launched.' },
  { year: '1984', milestone: 'Cultural Heritage', title: 'Sangeet Mahavidyalaya', description: 'Institute for classical music & dance.' },
  { year: '1989', milestone: 'Degree College', title: 'Arts & Commerce', description: 'B.K./M.H. Shroff College inaugurated.' },
  { year: '2005', milestone: 'Professional Studies', title: 'Management Institute', description: 'MBA & PGDM programmes introduced.' },
  { year: '2009', milestone: 'Global Reach', title: 'Cambridge A-Levels', description: 'International Junior College established.' },
  { year: '2012', milestone: 'Legal Studies', title: 'Law College', description: 'Shri J.H. Patel Law College opened.' },
  { year: '2025', milestone: 'Digital Era', title: 'Alumni Portal', description: 'Platform links 50,000+ alumni worldwide.' }
];

const keyFeatures = [
  '20,000+ students across nine institutions',
  '50,000+ alumni on six continents',
  'SSC, HSC, Cambridge A-Level & University degrees',
  'NAAC "A" grade for Shroff College; ISO 9001-certified processes',
  'Smart classrooms, e-library & state-of-the-art labs',
  '85 %+ placement rate with Fortune 500 recruiters',
  '₹1 crore+ in annual scholarships',
  'MoUs with universities in the UK, Canada & Singapore',
  '24×7 digital alumni portal & mobile app (2025)',
  'Active NSS, NCC & community-service units'
];

const achievements = [
  {
    title: 'NAAC "A" Accreditation',
    description: 'Shroff College reaccredited with CGPA 3.22/4 (2023).',
    icon: <FaAward style={{ color: 'var(--primary)' }} />
  },
  {
    title: 'NIRF Listed',
    description: 'Ranked in NIRF-2024 college band 151-200.',
    icon: <FaBuilding style={{ color: 'var(--primary)' }} />
  },
  {
    title: 'Alumni Leadership',
    description: 'Graduates heading TCS, Deloitte & HSBC divisions.',
    icon: <FaUsers style={{ color: 'var(--primary)' }} />
  },
  {
    title: 'Global Partnerships',
    description: 'MoUs with Univ. of Leeds & Centennial College.',
    icon: <FaGraduationCap style={{ color: 'var(--primary)' }} />
  }
];

/* ----------  AboutPage Component  ---------- */
const AboutPage = () => (
  <div className="min-h-screen" style={{ backgroundColor: 'var(--accent)', color: 'var(--text)' }}>
    {/* ------- HERO ------- */}
    <section className="py-16 text-white" style={{ background: GRADIENT }}>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Kandivli Education Society
        </h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto">
          Shaping minds, building futures since 1936 — 89 years of excellence
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-white/90">
          {[
            ['89', 'Years of Excellence'],
            ['50,000+', 'Alumni Worldwide'],
            ['20,000+', 'Current Students'],
            ['9', 'Institutions']
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold">{num}</div>
              <div className="text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <main className="container mx-auto px-6 py-12 space-y-12">
      {/* ------- HERITAGE ------- */}
      <SectionCard>
        <SectionHeader
          icon={<FaCalendarAlt style={{ color: 'var(--primary)', fontSize: '1.75rem' }} />}
        >
          Our Rich Heritage
        </SectionHeader>
        <div className="prose prose-lg max-w-none" style={{ color: 'var(--secondary)' }}>
          <p>
            Founded in <strong>1936</strong> by community leaders in Kandivali,
            KES began with just <strong>13 students</strong>. Today the society
            educates <strong>20,000+</strong> learners each year, staying true
            to its mission of affordable, holistic education.
          </p>
          <p>
            The society was formally registered in <strong>1947</strong>. Over
            the decades it has grown from a single high-school into a network of
            <strong> nine institutions </strong> spanning primary to
            postgraduate study, fine arts, teacher training and professional
            management.
          </p>
          <p>
            An engaged alumni family of <strong>50,000+</strong> now supports
            scholarships, placements and community projects across 25 countries.
          </p>
        </div>
      </SectionCard>

      {/* ------- TIMELINE ------- */}
      <SectionCard>
        <SectionTitle>Journey Through Time</SectionTitle>
        <Timeline />
      </SectionCard>

      {/* ------- INSTITUTIONS ------- */}
      <SectionTitle>Our Institutions</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {institutions.map(obj => (
          <InstitutionCard key={obj.name} {...obj} />
        ))}
      </div>

      {/* ------- ACHIEVEMENTS ------- */}
      <SectionCard>
        <SectionTitle>Our Achievements</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map(a => (
            <MiniCard key={a.title} {...a} />
          ))}
        </div>
      </SectionCard>

      {/* ------- KEY FEATURES ------- */}
      <SectionCard>
        <SectionTitle>Why Choose KES</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {keyFeatures.map(f => (
            <FeatureRow key={f} text={f} />
          ))}
        </div>
      </SectionCard>

      {/* ------- CONTACT ------- */}
      <section
        className="p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--primary)', color: 'var(--accent)', backdropFilter: 'blur(8px)' }}
      >
        <SectionTitle light>Get in Touch</SectionTitle>
        <ContactCols />
        <QuoteBox />
      </section>

      {/* ------- VISION / MISSION ------- */}
      <div className="grid gap-8 md:grid-cols-2">
        <VMCard
          icon={<FaEye style={{ color: 'var(--accent)', marginRight: '0.75rem' }} />}
          title="Our Vision"
          text={`To be a globally recognised institution that nurtures innovative thinkers,
                ethical leaders and responsible citizens.`}
        />
        <VMCard
          icon={<FaAward style={{ color: 'var(--primary)', marginRight: '0.75rem' }} />}
          title="Our Mission"
          text={`To deliver accessible, quality education combining academic excellence
                with character development and lifelong learning.`}
        />
      </div>
    </main>

    <Footer />
  </div>
);

/* ----------  UI HELPERS  ---------- */
const SectionCard = ({ children }) => (
  <section
    className="p-8 rounded-lg shadow-lg"
    style={{
      backgroundColor: 'var(--accent, #fff)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,0,0,0.1)',
      color: 'var(--secondary)'
    }}
  >
    {children}
  </section>
);

const SectionHeader = ({ icon, children }) => (
  <div className="flex items-center mb-6">
    {icon}
    <h2
      className="ml-4 text-3xl font-bold"
      style={{ color: 'var(--primary)' }}
    >
      {children}
    </h2>
  </div>
);

const SectionTitle = ({ children, light }) => (
  <h2
    className={`text-3xl font-bold mb-8 text-center`}
    style={{ color: light ? 'var(--accent)' : 'var(--secondary)' }}
  >
    {children}
  </h2>
);

const InstitutionCard = ({
  name,
  year,
  description,
  logo,
  icon,
  students,
  programs
}) => (
  <article
    className="p-6 rounded-lg shadow-lg hover:shadow-xl transition hover:-translate-y-1"
    style={{
      backgroundColor: 'var(--accent, #fff)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0,0,0,0.1)',
      color: 'var(--secondary)'
    }}
  >
    <div className="flex items-start gap-4">
      <Logo logo={logo} fallback={icon} />
      <div className="flex-1">
        <div className="flex flex-wrap gap-2 mb-2">
          <Badge>{`Est. ${year}`}</Badge>
          <Badge color="accent">{students}</Badge>
        </div>
        <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--primary)' }}>
          {name}
        </h3>
        <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>
          {description}
        </p>
        <div className="flex flex-wrap gap-1">
          {programs.map(p => (
            <span
              key={p}
              className="px-2 py-1 rounded text-xs"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--primary)'
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  </article>
);

const Timeline = () => (
  <div className="relative">
    <span
      className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1"
      style={{ backgroundColor: 'rgba(134,188,37,0.4)' }}
    />
    <ul className="space-y-8">
      {timeline.map((t, i) => (
        <li
          key={t.year}
          className={`relative flex items-start ${i % 2 ? 'md:flex-row-reverse' : ''}`}
        >
          <span
            className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full text-white border-4 border-white shadow"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {i + 1}
          </span>

          <article
            className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 ? 'md:pl-8' : 'md:pr-8'}`}
          >
            <div
              className="p-6 rounded-lg shadow hover:shadow-lg transition"
              style={{
                backgroundColor: 'var(--accent, #fff)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(0,0,0,0.1)',
                color: 'var(--text)'
              }}
            >
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge>{t.year}</Badge>
                <Badge color="accent">{t.milestone}</Badge>
              </div>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--primary)' }}>
                {t.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--text)' }}>
                {t.description}
              </p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

const MiniCard = ({ icon, title, description }) => (
  <div
    className="p-6 rounded-lg hover:bg-green-100/50 transition text-center"
    style={{
      backgroundColor: 'var(--accent)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(0,0,0,0.1)',
      color: 'var(--secondary)'
    }}
  >
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--primary)' }}>
      {title}
    </h3>
    <p className="text-sm" style={{ color: 'var(--text)' }}>
      {description}
    </p>
  </div>
);

const FeatureRow = ({ text }) => (
  <div className="flex items-start">
    <span
      className="p-2 rounded-full mr-4 mt-1 border"
      style={{
        backgroundColor: 'rgba(134,188,37,0.3)',
        borderColor: 'rgba(134,188,37,0.5)',
        backdropFilter: 'blur(6px)'
      }}
    >
      <FaAward style={{ color: 'var(--primary)', fontSize: '0.875rem' }} />
    </span>
    <p style={{ color: 'var(--text)' }}>{text}</p>
  </div>
);

const ContactCols = () => {
  const cols = [
    {
      icon: <FaMapMarkerAlt style={{ fontSize: '2rem', color: 'var(--primary)' }} />,
      title: 'Visit Us',
      lines: [
        'Kandivali Education Society',
        'Akurli Road, Kandivali (East)',
        'Mumbai 400 101, Maharashtra'
      ]
    },
    {
      icon: <FaPhone style={{ fontSize: '2rem', color: 'var(--primary)' }} />,
      title: 'Call Us',
      lines: [
        'Office +91-22-2867-2643',
        'Admissions +91-22-2867-2644',
        'Alumni +91-22-2867-2645'
      ]
    },
    {
      icon: <FaEnvelope style={{ fontSize: '2rem', color: 'var(--primary)' }} />,
      title: 'Email Us',
      lines: [
        'info@kes.edu.in',
        'alumni@kes.edu.in',
        'admissions@kes.edu.in'
      ]
    }
  ];
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {cols.map(c => (
        <div key={c.title} className="text-center">
          <Circle>{c.icon}</Circle>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--accent)' }}>
            {c.title}
          </h3>
          <p className="text-sm whitespace-pre-line" style={{ color: 'var(--accent)' }}>
            {c.lines.join('\n')}
          </p>
        </div>
      ))}
    </div>
  );
};

const QuoteBox = () => (
  <div
    className="mt-8 p-6 rounded-lg text-center"
    style={{
      backgroundColor: 'var(--accent, #fff)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(0,0,0,0.1)',
      color: 'var(--primary-dark)'
    }}
  >
    <p className="font-medium text-lg mb-2">
      "Education is the most powerful weapon which you can use to change the
      world."
    </p>
    <p style={{ color: 'var(--primary)' }}>— Nelson Mandela</p>
  </div>
);

const VMCard = ({ icon, title, text }) => (
  <div
    className="p-8 rounded-lg shadow-lg"
    style={{
      backgroundColor: 'var(--accent, #fff)',
      backdropFilter: 'blur(6px)',
      border: '1px solid rgba(0,0,0,0.1)'
    }}
  >
    <h3 className="text-2xl font-bold mb-4 flex items-center" style={{ color: 'var(--primary)' }}>
      {icon}
      {title}
    </h3>
    <p style={{ color: 'var(--text)' }}>{text}</p>
  </div>
);

/* ----------  atoms  ---------- */
const Badge = ({ children, color = 'primary' }) => {
  const baseBg = 'rgba(134,188,37,0.2)';
  const baseText = 'var(--primary)';
  const accentBg = 'rgba(255,255,255,0.5)';
  const accentText = 'var(--accent)';
  return (
    <span
      className="text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm border"
      style={{
        backgroundColor: color === 'accent' ? accentBg : baseBg,
        color: color === 'accent' ? accentText : baseText,
        borderColor: 'rgba(255,255,255,0.1)'
      }}
    >
      {children}
    </span>
  );
};

const Logo = ({ logo, fallback }) => (
  <div className="relative w-16 h-16 rounded-lg shadow border" style={{ borderColor: 'rgba(0,0,0,0.1)' }}>
    <img
      src={logo}
      alt="logo"
      className="w-16 h-16 object-cover rounded-lg"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <div
      className="hidden w-16 h-16 rounded-lg bg-secondary/80 backdrop-blur-sm border border-white/20 items-center justify-center"
      style={{ backgroundColor: 'var(--secondary)', display: 'flex' }}
    >
      {fallback}
    </div>
  </div>
);

const Circle = ({ children }) => (
  <div
    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border"
    style={{
      backgroundColor: 'var(--accent, #fff)',
      borderColor: 'var(--primary)',
      borderWidth: 1,
      backdropFilter: 'blur(8px)'
    }}
  >
    {children}
  </div>
);

export default AboutPage;
