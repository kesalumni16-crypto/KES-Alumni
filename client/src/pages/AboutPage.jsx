import React from 'react';
import Footer from '../components/Footer';
import { FaGraduationCap, FaUsers, FaAward, FaBuilding, FaMusic, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const AboutPage = () => {
  const institutions = [
    {
      name: "Sardar Vallabhbhai Patel High School (SVP)",
      year: "1936",
      description: "The flagship institution of KES, established as the foundation school. Now serves over 4,500 students with excellence in secondary education.",
      icon: <FaGraduationCap className="text-red-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "4,500+",
      programs: ["SSC", "CBSE", "State Board"]
    },
    {
      name: "Shri T.P. Bhatia Junior College of Science",
      year: "1976", 
      description: "Premier science college affiliated with Maharashtra State Board, known for exceptional faculty and modern laboratories serving 2,500+ students.",
      icon: <FaAward className="text-blue-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "2,500+",
      programs: ["HSC Science", "Biotechnology", "Computer Science"]
    },
    {
      name: "SVP Night School",
      year: "1970",
      description: "Evening education facility for working professionals and students seeking flexible learning schedules while maintaining their careers.",
      icon: <FaUsers className="text-green-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "800+",
      programs: ["Evening Classes", "Part-time Courses", "Adult Education"]
    },
    {
      name: "KES Sangeet Mahavidyalaya",
      year: "1984",
      description: "Affiliated to Gandharva Mahavidyalaya, offering comprehensive courses in Indian classical music, dance, and fine arts.",
      icon: <FaMusic className="text-purple-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "1,200+",
      programs: ["Classical Music", "Dance", "Fine Arts", "Cultural Studies"]
    },
    {
      name: "B.K. Shroff College of Arts & M.H. Shroff College of Commerce",
      year: "1989",
      description: "University of Mumbai affiliated degree college offering undergraduate and postgraduate programs to over 9,000 students.",
      icon: <FaBuilding className="text-orange-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "9,000+",
      programs: ["BA", "BCom", "MA", "MCom", "BMS", "BAF"]
    },
    {
      name: "KES Cambridge International Junior College",
      year: "2009",
      description: "International curriculum college offering Cambridge 'A-level' programs with global recognition and modern teaching methodologies.",
      icon: <FaGraduationCap className="text-indigo-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "600+",
      programs: ["Cambridge A-Levels", "International Curriculum", "Global Certification"]
    },
    {
      name: "KES Pre-Primary Teachers Training Institute",
      year: "1995",
      description: "Specialized institute for training early childhood educators and pre-primary teachers with modern pedagogical approaches.",
      icon: <FaUsers className="text-pink-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "300+",
      programs: ["Teacher Training", "Early Childhood Education", "Pedagogy"]
    },
    {
      name: "KES Institute of Management Studies & Research",
      year: "2005",
      description: "Management institute offering MBA and professional development programs with industry partnerships and placement assistance.",
      icon: <FaBriefcase className="text-teal-600 text-2xl" />,
      logo: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop",
      students: "1,500+",
      programs: ["MBA", "PGDM", "Executive Programs", "Professional Courses"]
    }
  ];

  const timeline = [
    {
      year: "1936",
      title: "Foundation",
      description: "Kandivli Education Society established with Sardar Vallabhbhai Patel High School, starting with just 13 students.",
      milestone: "Birth of KES"
    },
    {
      year: "1947",
      title: "Official Registration",
      description: "KES officially registered as an educational society, marking the beginning of formal institutional growth.",
      milestone: "Legal Foundation"
    },
    {
      year: "1970",
      title: "Evening Education",
      description: "SVP Night School established to serve working professionals and adult learners.",
      milestone: "Inclusive Education"
    },
    {
      year: "1976",
      title: "Science Excellence",
      description: "Shri T.P. Bhatia Junior College of Science founded, establishing KES as a leader in science education.",
      milestone: "Academic Expansion"
    },
    {
      year: "1984",
      title: "Cultural Heritage",
      description: "KES Sangeet Mahavidyalaya established, preserving and promoting Indian classical arts and culture.",
      milestone: "Arts & Culture"
    },
    {
      year: "1989",
      title: "Higher Education",
      description: "B.K. Shroff College of Arts & M.H. Shroff College of Commerce established, offering degree programs.",
      milestone: "University Affiliation"
    },
    {
      year: "1995",
      title: "Teacher Training",
      description: "Pre-Primary Teachers Training Institute launched to develop quality educators for early childhood education.",
      milestone: "Educational Excellence"
    },
    {
      year: "2005",
      title: "Management Studies",
      description: "Institute of Management Studies & Research established, entering professional education sector.",
      milestone: "Professional Growth"
    },
    {
      year: "2009",
      title: "International Standards",
      description: "Cambridge International Junior College launched, bringing global education standards to local students.",
      milestone: "Global Recognition"
    },
    {
      year: "2025",
      title: "Digital Innovation",
      description: "Alumni Portal launched, connecting over 50,000 alumni worldwide through digital platform.",
      milestone: "Digital Transformation"
    }
  ];

  const keyFeatures = [
    "Over 20,000 students currently enrolled across 8+ institutions",
    "50,000+ alumni network spanning across 6 continents",
    "Wide range of programs: Arts, Science, Commerce, Management, Music, Teacher Training",
    "University of Mumbai affiliation for degree programs",
    "Cambridge International certification for global standards",
    "Modern infrastructure with digital classrooms and laboratories",
    "Experienced faculty with industry expertise",
    "Strong placement record with 85%+ job placement rate",
    "Active alumni network in 25+ countries",
    "Scholarship programs for deserving students"
  ];

  const achievements = [
    {
      title: "Educational Excellence",
      description: "Consistently ranked among top educational institutions in Mumbai",
      icon: <FaAward className="text-yellow-600 text-2xl" />
    },
    {
      title: "Alumni Success",
      description: "Alumni holding leadership positions in Fortune 500 companies globally",
      icon: <FaUsers className="text-blue-600 text-2xl" />
    },
    {
      title: "Industry Recognition",
      description: "Multiple awards for innovation in education and student development",
      icon: <FaBuilding className="text-green-600 text-2xl" />
    },
    {
      title: "Global Reach",
      description: "International partnerships and student exchange programs",
      icon: <FaGraduationCap className="text-purple-600 text-2xl" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-red-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Kandivli Education Society</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto">
              Shaping Minds, Building Futures Since 1936 - A Legacy of 89 Years in Education
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-red-100">
              <div className="text-center">
                <div className="text-3xl font-bold">89</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50,000+</div>
                <div className="text-sm">Alumni Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">20,000+</div>
                <div className="text-sm">Current Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">8+</div>
                <div className="text-sm">Institutions</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        
        {/* History Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="flex items-center mb-6">
            <FaCalendarAlt className="text-red-600 text-3xl mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">Our Rich Heritage</h2>
          </div>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="mb-6">
              Founded in <strong>1936</strong> in Kandivali, Mumbai, Kandivli Education Society (KES) began as a visionary initiative by community leaders who recognized the need for quality, affordable education in the rapidly growing suburb of Kandivali. What started with just <strong>13 students</strong> in a modest building has evolved into one of Mumbai's most respected educational institutions, now serving over <strong>20,000 students</strong> across multiple campuses.
            </p>
            <p className="mb-6">
              The society was officially registered in <strong>1947</strong>, coinciding with India's independence, symbolizing a new era of educational empowerment. Over the decades, KES has continuously expanded its offerings, adapting to changing educational needs while maintaining its core values of academic excellence, character building, and social responsibility.
            </p>
            <p className="mb-6">
              Today, KES operates <strong>8 major institutions</strong> spanning from pre-primary to postgraduate education, including specialized programs in arts, commerce, science, management, and teacher training. Our alumni network of over <strong>50,000 graduates</strong> spans across <strong>25+ countries</strong>, with many holding leadership positions in multinational corporations, government organizations, and entrepreneurial ventures.
            </p>
            <p>
              KES remains committed to its founding principles of providing holistic education that combines academic rigor with ethical values, preparing students not just for successful careers but for meaningful contributions to society.
            </p>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Journey Through Time</h2>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-red-200"></div>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-red-600 rounded-full border-4 border-white shadow-lg z-10 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{index + 1}</span>
                  </div>
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-center mb-3">
                        <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full mr-3">
                          {item.year}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {item.milestone}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Institutions Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Institutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {institutions.map((institution, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start mb-4">
                  <div className="mr-4 mt-1">
                    <img 
                      src={institution.logo} 
                      alt={`${institution.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover shadow-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-16 h-16 rounded-lg bg-gray-100 items-center justify-center hidden">
                      {institution.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2 flex-wrap gap-2">
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">
                        Est. {institution.year}
                      </span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                        {institution.students}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                      {institution.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      {institution.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {institution.programs.map((program, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                <div className="mb-4 flex justify-center">
                  {achievement.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h3>
                <p className="text-gray-600 text-sm">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose KES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="bg-red-100 rounded-full p-2 mr-4 mt-1 flex-shrink-0">
                  <FaAward className="text-red-600 text-sm" />
                </div>
                <p className="text-gray-700 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Visit Us</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Kandivali Education Society<br />
                Akurli Road, Kandivali (East)<br />
                Mumbai - 400101<br />
                Maharashtra, India
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Call Us</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                Main Office: +91-22-2867-2643<br />
                Admissions: +91-22-2867-2644<br />
                Alumni Relations: +91-22-2867-2645<br />
                Fax: +91-22-2867-2646
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Email Us</h3>
              <p className="text-red-100 text-sm leading-relaxed">
                General: info@kes.edu.in<br />
                Alumni: alumni@kes.edu.in<br />
                Admissions: admissions@kes.edu.in<br />
                Principal: principal@kes.edu.in
              </p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-white bg-opacity-10 rounded-lg border border-white border-opacity-20 text-center">
            <p className="text-white font-medium text-lg mb-2">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <p className="text-red-100 text-sm">
              - Nelson Mandela | Inspiring KES's mission since 1936
            </p>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaEye className="mr-3 text-blue-600" />
              Our Vision
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To be a globally recognized educational institution that nurtures innovative thinkers, ethical leaders, and responsible citizens who contribute meaningfully to society while preserving cultural values and promoting inclusive growth.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
              <FaAward className="mr-3 text-green-600" />
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed">
              To provide accessible, quality education that combines academic excellence with character development, fostering creativity, critical thinking, and lifelong learning while maintaining strong connections with our alumni community.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;