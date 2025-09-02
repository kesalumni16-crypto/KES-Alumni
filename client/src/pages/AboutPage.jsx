import React from 'react';
import Footer from '../components/Footer';
import {
  FaGraduationCap,
  FaUsers,
  FaAward,
  FaBuilding,
  FaMusic,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaEye
} from 'react-icons/fa';

/* ---------- THEME ---------- */
const ACCENT   = '#991b1b';                         // primary red
const GRADIENT = 'linear-gradient(135deg,#991b1b,#ef4444)';

/* ---------- DATA ---------- */
const institutions = [/* … unchanged list … */];
const timeline     = [/* … unchanged list … */];
const keyFeatures  = [/* … unchanged list … */];
const achievements = [/* … unchanged list … */];

const AboutPage = () => (
  <div className="min-h-screen bg-[#faf7f5]"> {/* subtle cream */}
    {/* ---------- HERO ---------- */}
    <section className="py-16 text-white" style={{ background: GRADIENT }}>
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          About Kandivli Education Society
        </h1>
        <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto">
          Shaping minds, building futures since 1936 — 89 years of excellence
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-8 text-red-100">
          {[
            ['89',        'Years of Excellence'],
            ['50,000+',   'Alumni Worldwide'],
            ['20,000+',   'Current Students'],
            ['8+',        'Institutions']
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
      {/* ---------- HERITAGE ---------- */}
      <SectionCard>
        <Header icon={<FaCalendarAlt className="text-3xl text-[${ACCENT}]" />}>
          Our Rich Heritage
        </Header>

        {/* prose truncated for brevity */}
      </SectionCard>

      {/* ---------- TIMELINE ---------- */}
      <SectionCard>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Journey Through Time
        </h2>

        <div className="relative">
          <span className="absolute left-4 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-red-200" />
          <ul className="space-y-8">
            {timeline.map((t, i) => (
              <li
                key={t.year}
                className={`relative flex items-start ${i % 2 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* node */}
                <span className="absolute left-0 md:left-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[${ACCENT}] text-white border-4 border-white shadow">
                  {i + 1}
                </span>

                {/* card */}
                <article
                  className={`ml-12 md:ml-0 md:w-1/2 ${i % 2 ? 'md:pl-8' : 'md:pr-8'}`}
                >
                  <div className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-lg transition">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge>{t.year}</Badge>
                      <Badge color="blue">{t.milestone}</Badge>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{t.title}</h3>
                    <p className="text-gray-600 text-sm">{t.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </SectionCard>

      {/* ---------- INSTITUTIONS ---------- */}
      <SectionTitle>Our Institutions</SectionTitle>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {institutions.map(
          ({ name, year, logo, description, students, programs, icon }) => (
            <article
              key={name}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition hover:-translate-y-1"
            >
              <div className="flex items-start gap-4 mb-4">
                <Logo logo={logo} fallback={icon} />
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge>Est. {year}</Badge>
                    <Badge color="blue">{students}</Badge>
                  </div>
                  <h3 className="font-bold text-lg text-gray-800">{name}</h3>
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
          )
        )}
      </div>

      {/* ---------- ACHIEVEMENTS ---------- */}
      <SectionCard>
        <SectionTitle>Our Achievements</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {achievements.map(({ title, description, icon }) => (
            <div
              key={title}
              className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="mb-4 flex justify-center">{icon}</div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">{title}</h3>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ---------- KEY FEATURES ---------- */}
      <SectionCard>
        <SectionTitle>Why Choose KES</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          {keyFeatures.map(f => (
            <Feature key={f}>{f}</Feature>
          ))}
        </div>
      </SectionCard>

      {/* ---------- CONTACT ---------- */}
      <section
        className="p-8 rounded-lg shadow-lg text-white"
        style={{ background: GRADIENT }}
      >
        <SectionTitle light>Get in Touch</SectionTitle>
        {/* three-column contact boxes … unchanged … */}
      </section>

      {/* ---------- VISION / MISSION ---------- */}
      <div className="grid gap-8 md:grid-cols-2">
        <VisionCard
          icon={<FaEye className="text-blue-600 mr-3" />}
          title="Our Vision"
        >
          To be a globally recognized educational institution …
        </VisionCard>
        <VisionCard
          icon={<FaAward className="text-green-600 mr-3" />}
          title="Our Mission"
        >
          To provide accessible, quality education …
        </VisionCard>
      </div>
    </main>

    <Footer />
  </div>
);

/* ---------- HELPERS ---------- */
const SectionCard = ({ children }) => (
  <section className="bg-white p-8 rounded-lg shadow">{children}</section>
);

const SectionTitle = ({ children, light }) => (
  <h2
    className={`text-3xl font-bold mb-8 text-center ${
      light ? 'text-white' : 'text-gray-800'
    }`}
  >
    {children}
  </h2>
);

const Header = ({ icon, children }) => (
  <div className="flex items-center mb-6">
    {icon}
    <h2 className="text-3xl font-bold text-gray-800 ml-4">{children}</h2>
  </div>
);

const Badge = ({ children, color = 'red' }) => (
  <span
    className={`bg-${color}-100 text-${color}-800 text-xs font-semibold px-2 py-1 rounded-full`}
  >
    {children}
  </span>
);

const Logo = ({ logo, fallback }) => (
  <div className="relative w-16 h-16">
    <img
      src={logo}
      alt="logo"
      className="w-16 h-16 object-cover rounded-lg shadow"
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

const Feature = ({ children }) => (
  <div className="flex items-start">
    <div className="bg-red-100 p-2 rounded-full mr-4 mt-1">
      <FaAward className="text-red-600 text-sm" />
    </div>
    <p className="text-gray-700">{children}</p>
  </div>
);

const VisionCard = ({ icon, title, children }) => (
  <div className="bg-white p-8 rounded-lg shadow">
    <h3 className="text-2xl font-bold mb-4 flex items-center">
      {icon}
      {title}
    </h3>
    <p className="text-gray-700">{children}</p>
  </div>
);

export default AboutPage;
