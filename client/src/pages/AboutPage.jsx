/* ----------  AboutPage.jsx  ---------- */
import React from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic,
  FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaBriefcase, FaEye
} from 'react-icons/fa';

/* ----------  THEME  ---------- */
const ACCENT   = '#991b1b';                          // primary red
const GRADIENT = 'linear-gradient(135deg,#991b1b,#ef4444)';
const BG_CREAM = '#faf7f5';                          // site-wide neutral

/* ----------  DATA  ---------- */
// — (place your unchanged institutions, timeline, keyFeatures & achievements arrays here)

/* ----------  PAGE  ---------- */
const AboutPage = () => (
  <div className="min-h-screen" style={{ backgroundColor: BG_CREAM }}>
    {/* ================= HERO ================ */}
    <section className="py-16 text-white" style={{ background: GRADIENT }}>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Kandivli Education Society
        </h1>
        <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto">
          Shaping minds, building futures since 1936 – 89 years of excellence
        </p>

        <Metrics />
      </div>
    </section>

    <main className="container mx-auto px-6 py-12 space-y-12">
      {/* ============== HERITAGE ============== */}
      <SectionCard>
        <SectionHeader icon={<FaCalendarAlt className="text-3xl" style={{ color: ACCENT }} />}>
          Our Rich Heritage
        </SectionHeader>
        {/* existing prose content stays here */}
      </SectionCard>

      {/* ============== TIMELINE ============== */}
      <SectionCard>
        <SectionTitle>Journey Through Time</SectionTitle>
        <Timeline />
      </SectionCard>

      {/* ============= INSTITUTIONS =========== */}
      <SectionTitle>Our Institutions</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {institutions.map(obj => <InstitutionCard key={obj.name} {...obj} />)}
      </div>

      {/* ============ ACHIEVEMENTS ============ */}
      <SectionCard>
        <SectionTitle>Our Achievements</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map(a => (
            <MiniCard key={a.title} icon={a.icon} {...a} />
          ))}
        </div>
      </SectionCard>

      {/* ============ KEY FEATURES ============ */}
      <SectionCard>
        <SectionTitle>Why Choose KES</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {keyFeatures.map(f => <FeatureRow key={f} text={f} />)}
        </div>
      </SectionCard>

      {/* ============== CONTACT =============== */}
      <section className="p-8 rounded-lg shadow-lg text-white" style={{ background: GRADIENT }}>
        <SectionTitle light>Get in Touch</SectionTitle>
        <ContactColumns />
        <QuoteBox />
      </section>

      {/* ========== VISION / MISSION ========= */}
      <div className="grid gap-8 md:grid-cols-2">
        <VisionMission
          icon={<FaEye className="text-blue-600 mr-3" />}
          title="Our Vision"
          text="To be a globally recognized educational institution …"
        />
        <VisionMission
          icon={<FaAward className="text-green-600 mr-3" />}
          title="Our Mission"
          text="To provide accessible, quality education …"
        />
      </div>
    </main>

    <Footer />
  </div>
);

/* ----------  REUSABLE SUB-COMPONENTS  ---------- */

// slim card wrapper
const SectionCard = ({ children }) => (
  <section className="bg-white p-8 rounded-lg shadow">{children}</section>
);

// centre title
const SectionTitle = ({ children, light }) => (
  <h2 className={`text-3xl font-bold mb-8 text-center ${light ? 'text-white' : 'text-gray-800'}`}>
    {children}
  </h2>
);

// header with leading icon
const SectionHeader = ({ icon, children }) => (
  <div className="flex items-center mb-6">
    {icon}
    <h2 className="ml-4 text-3xl font-bold text-gray-800">{children}</h2>
  </div>
);

// institution card
function InstitutionCard({ name, year, description, logo, icon, students, programs }) {
  return (
    <article className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <Logo logo={logo} fallback={icon} />
        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge>{`Est. ${year}`}</Badge>
            <Badge color="blue">{students}</Badge>
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{name}</h3>
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-1">
            {programs.map(p => (
              <span
                key={p}
                className="bg-gray-100 text-xs text-gray-700 px-2 py-1 rounded"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

// timeline component
const Timeline = () => (
  <div className="relative">
    <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-red-200" />
    <ul className="space-y-8">
      {timeline.map((t, i) => (
        <li
          key={t.year}
          className={`relative flex items-start ${i % 2 ? 'md:flex-row-reverse' : ''}`}
        >
          <span className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[${ACCENT}] text-white border-4 border-white shadow">
            {i + 1}
          </span>

          <article className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 ? 'md:pl-8' : 'md:pr-8'}`}>
            <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge>{t.year}</Badge>
                <Badge color="blue">{t.milestone}</Badge>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{t.title}</h3>
              <p className="text-sm text-gray-600">{t.description}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

// small feature row
const FeatureRow = ({ text }) => (
  <div className="flex items-start">
    <span className="bg-red-100 p-2 rounded-full mr-4 mt-1">
      <FaAward className="text-red-600 text-sm" />
    </span>
    <p className="text-gray-700">{text}</p>
  </div>
);

// metric chips
const Metrics = () => {
  const stats = [
    ['89', 'Years of Excellence'],
    ['50,000+', 'Alumni Worldwide'],
    ['20,000+', 'Current Students'],
    ['8+', 'Institutions']
  ];
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-8 text-red-100">
      {stats.map(([num, label]) => (
        <div key={label} className="text-center">
          <div className="text-3xl font-bold">{num}</div>
          <div className="text-sm">{label}</div>
        </div>
      ))}
    </div>
  );
};

// generic small card
const MiniCard = ({ icon, title, description }) => (
  <div className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
    <div className="mb-4 flex justify-center">{icon}</div>
    <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

// vision / mission card
const VisionMission = ({ icon, title, text }) => (
  <div className="bg-white p-8 rounded-lg shadow">
    <h3 className="text-2xl font-bold mb-4 flex items-center">
      {icon}
      {title}
    </h3>
    <p className="text-gray-700">{text}</p>
  </div>
);

// contact columns & quote
const ContactColumns = () => {
  const cols = [
    {
      icon: <FaMapMarkerAlt className="text-2xl" />,
      title: 'Visit Us',
      lines: [
        'Kandivali Education Society',
        'Akurli Road, Kandivali (East)',
        'Mumbai – 400101',
        'Maharashtra, India'
      ]
    },
    {
      icon: <FaPhone className="text-2xl" />,
      title: 'Call Us',
      lines: [
        'Main Office: +91-22-2867-2643',
        'Admissions: +91-22-2867-2644',
        'Alumni: +91-22-2867-2645',
        'Fax: +91-22-2867-2646'
      ]
    },
    {
      icon: <FaEnvelope className="text-2xl" />,
      title: 'Email Us',
      lines: [
        'info@kes.edu.in',
        'alumni@kes.edu.in',
        'admissions@kes.edu.in',
        'principal@kes.edu.in'
      ]
    }
  ];
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {cols.map(c => (
        <div key={c.title} className="text-center">
          <Circle>{c.icon}</Circle>
          <h3 className="text-lg font-semibold mb-2">{c.title}</h3>
          <p className="text-sm text-red-100 leading-relaxed whitespace-pre-line">{c.lines.join('\n')}</p>
        </div>
      ))}
    </div>
  );
};

const QuoteBox = () => (
  <div className="mt-8 p-6 bg-white/10 rounded-lg border border-white/20 text-center">
    <p className="font-medium text-lg mb-2">
      “Education is the most powerful weapon which you can use to change the world.”
    </p>
    <p className="text-sm text-red-100">— Nelson Mandela</p>
  </div>
);

/* ----------  TINY HELPERS  ---------- */
const Badge = ({ children, color = 'red' }) => (
  <span className={`bg-${color}-100 text-${color}-800 text-xs font-semibold px-2 py-1 rounded-full`}>
    {children}
  </span>
);

const Logo = ({ logo, fallback }) => (
  <div className="relative w-16 h-16">
    <img
      src={logo}
      alt="logo"
      className="w-16 h-16 rounded-lg object-cover shadow"
      onError={e => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextSibling.style.display = 'flex';
      }}
    />
    <div className="hidden w-16 h-16 rounded-lg bg-gray-100 items-center justify-center">
      {fallback}
    </div>
  </div>
);

const Circle = ({ children }) => (
  <div className="bg-white/20 w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
    {children}
  </div>
);

export default AboutPage;
