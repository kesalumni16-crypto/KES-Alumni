import React from 'react';
import Footer from '../components/Footer';
import { FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic, FaCalendarAlt } from 'react-icons/fa';

const AboutPage = () => {
  const institutions = [
    {
      name: "Sardar Vallabhbhai Patel High School (SVP)",
      year: "1936",
      description: "Flagship KES high school, now serving 4,500+ students.",
      icon: <FaGraduationCap className="text-red-600 text-2xl" />
    },
    {
      name: "Shri T.P. Bhatia Junior College of Science",
      year: "1976",
      description: "Science stream, renowned faculty, 2,500+ students.",
      icon: <FaAward className="text-blue-600 text-2xl" />
    },
    {
      name: "SVP Night School",
      year: "1970",
      description: "Evening classes for working students seeking further education.",
      icon: <FaUsers className="text-green-600 text-2xl" />
    },
    {
      name: "KES Sangeet Mahavidyalaya",
      year: "1984",
      description: "Affiliated to Gandharva Mahavidyalaya—courses in classical music & dance, nurturing fine arts.",
      icon: <FaMusic className="text-purple-600 text-2xl" />
    },
    {
      name: "B.K. Shroff College of Arts & M.H. Shroff College of Commerce",
      year: "1989",
      description: "University of Mumbai affiliation, offers undergraduate/postgraduate programs, 9,000+ students.",
      icon: <FaBuilding className="text-orange-600 text-2xl" />
    },
    {
      name: "KES Cambridge International Junior College",
      year: "2009",
      description: "Cambridge 'A-level' program, global recognition.",
      icon: <FaGraduationCap className="text-indigo-600 text-2xl" />
    }
  ];

  const keyFeatures = [
    "Over 20,000 students currently enrolled across all branches",
    "Wide range of academic and professional programs: Arts, Science, Commerce, IT, Management, Law, Music, and more",
    "Reputation for academic excellence and innovative teaching methods",
    "Focus on value-based education, personality development, and professional skills",
    "Modern infrastructure and dedicated faculties"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-green via-highlight-green to-primary-green text-black py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About KES</h1>
            <p className="text-xl md:text-2xl text-gray-800 max-w-3xl mx-auto">
              Kandivli Education Society - Shaping Minds Since 1936
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        
        {/* History Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <FaCalendarAlt className="text-primary-green text-3xl mr-4" />
            <h2 className="text-3xl font-bold text-black">Our Legacy</h2>
          </div>
          <div className="prose prose-lg max-w-none text-black leading-relaxed">
            <p className="mb-6">
              Founded in <strong>1936</strong> in Kandivali, Mumbai, Kandivli Education Society (KES) has grown from humble beginnings into one of the city's premier educational organizations. Established by community leaders to provide high-quality, affordable education to local families, KES began with just <strong>13 students</strong> and has evolved into a network of schools and colleges serving more than <strong>20,000 students</strong>.
            </p>
            <p className="mb-6">
              The society officially registered in <strong>1947</strong> and has continuously expanded its offerings, now spanning pre-primary to postgraduate education, vocational training, and even internationally affiliated programs.
            </p>
            <p>
              KES is deeply committed to fostering academic excellence, ethical values, and holistic development, helping students adapt to changing technology and global trends. It is known for its modern infrastructure, experienced faculty, and balanced curriculum that emphasizes both scholastic achievement and character building.
            </p>
          </div>
        </div>

        {/* Institutions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Major Colleges & Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start mb-4">
                  <div className="mr-4 mt-1">
                    {institution.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="bg-green-100 text-primary-green text-xs font-semibold px-2 py-1 rounded-full">
                        Est. {institution.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2 leading-tight">
                      {institution.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {institution.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Section */}

        {/* Key Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                  <FaAward className="text-primary-green text-sm" />
                </div>
                <p className="text-black leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-green-50 rounded-lg border-l-4 border-primary-green">
            <p className="text-black font-medium text-center text-lg">
              KES continues its legacy in education and community upliftment, helping shape generations of successful professionals and responsible citizens.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;