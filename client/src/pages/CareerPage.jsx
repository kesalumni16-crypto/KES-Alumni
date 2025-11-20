import { useState, useMemo } from 'react';
import Footer from '../components/Footer';
import {
  FaBriefcase, FaSearch, FaMapMarkerAlt, FaBuilding, FaClock,
  FaMoneyBillWave, FaFilter, FaTimes, FaBookmark, FaRegBookmark,
  FaChevronRight, FaUsers, FaGraduationCap, FaRocket, FaHandshake,
  FaLightbulb, FaChartLine, FaAward, FaStar, FaUserTie, FaEnvelope,
  FaLinkedin, FaBars
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CareerPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('jobs');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [experienceFilter, setExperienceFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [mentorSearchTerm, setMentorSearchTerm] = useState('');
  const [expertiseFilter, setExpertiseFilter] = useState('');
  const [mentorExperienceFilter, setMentorExperienceFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [showMentorFilters, setShowMentorFilters] = useState(false);

  const jobs = [
    { id: 1, title: 'Senior Software Engineer', company: 'Tech Corp', location: 'Mumbai, Maharashtra', type: 'Full-time', experience: '5-7 years', salary: '₹15-25 LPA', postedBy: 'Alumni Network', postedDate: '2 days ago', description: 'Looking for experienced software engineer to join our growing team.', skills: ['React', 'Node.js', 'AWS', 'MongoDB'] },
    { id: 2, title: 'Product Manager', company: 'Innovation Labs', location: 'Bangalore, Karnataka', type: 'Full-time', experience: '3-5 years', salary: '₹20-30 LPA', postedBy: 'Alumni Network', postedDate: '5 days ago', description: 'Seeking product manager with strong technical background.', skills: ['Product Strategy', 'Agile', 'Data Analysis'] },
    { id: 3, title: 'UX Designer', company: 'Creative Studio', location: 'Pune, Maharashtra', type: 'Full-time', experience: '2-4 years', salary: '₹10-18 LPA', postedBy: 'Alumni Network', postedDate: '1 week ago', description: 'Join our design team to create amazing user experiences.', skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'] },
    { id: 4, title: 'Data Scientist', company: 'Analytics Pro', location: 'Hyderabad, Telangana', type: 'Full-time', experience: '3-6 years', salary: '₹18-28 LPA', postedBy: 'Alumni Network', postedDate: '3 days ago', description: 'Work on cutting-edge ML and AI projects.', skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'] },
    { id: 5, title: 'Marketing Manager', company: 'Brand Solutions', location: 'Delhi, NCR', type: 'Full-time', experience: '4-6 years', salary: '₹12-20 LPA', postedBy: 'Alumni Network', postedDate: '4 days ago', description: 'Lead marketing initiatives for B2B clients.', skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'] },
    { id: 6, title: 'DevOps Engineer', company: 'Cloud Systems', location: 'Chennai, Tamil Nadu', type: 'Full-time', experience: '3-5 years', salary: '₹15-22 LPA', postedBy: 'Alumni Network', postedDate: '6 days ago', description: 'Manage and optimize cloud infrastructure.', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'] },
  ];

  const internships = [
    { id: 1, title: 'Software Development Intern', company: 'StartupHub', location: 'Mumbai, Maharashtra', duration: '3 months', stipend: '₹15,000/month', postedDate: '1 day ago', description: 'Learn and work on real-world projects.' },
    { id: 2, title: 'Marketing Intern', company: 'Brand Agency', location: 'Bangalore, Karnataka', duration: '6 months', stipend: '₹12,000/month', postedDate: '3 days ago', description: 'Get hands-on experience in digital marketing.' },
  ];

  const mentors = [
    { id: 1, name: 'Rajesh Kumar', title: 'Senior VP Engineering', company: 'Tech Giant Corp', expertise: ['Software Architecture', 'Leadership', 'Career Growth'], experience: '15+ years', experienceYears: 15, availability: 'Available', location: 'Bangalore, India', email: 'rajesh.kumar@example.com', linkedin: 'linkedin.com/in/rajeshkumar', rating: 4.9, totalMentees: 45, bio: 'Passionate about helping engineers grow their careers in tech leadership.', sessions: ['1-on-1 Career Guidance', 'Technical Interview Prep', 'System Design'] },
    { id: 2, name: 'Priya Sharma', title: 'Product Director', company: 'Innovation Labs', expertise: ['Product Management', 'Strategy', 'User Research'], experience: '12+ years', experienceYears: 12, availability: 'Limited slots', location: 'Mumbai, India', email: 'priya.sharma@example.com', linkedin: 'linkedin.com/in/priyasharma', rating: 4.8, totalMentees: 38, bio: 'Helping aspiring PMs build successful products.', sessions: ['Product Strategy', 'Roadmap Planning', 'Stakeholder Management'] },
    { id: 3, name: 'Amit Patel', title: 'Marketing Head', company: 'Brand Solutions', expertise: ['Digital Marketing', 'Branding', 'Growth Hacking'], experience: '10+ years', experienceYears: 10, availability: 'Available', location: 'Delhi, India', email: 'amit.patel@example.com', linkedin: 'linkedin.com/in/amitpatel', rating: 4.7, totalMentees: 32, bio: 'Digital marketing strategist with focus on growth.', sessions: ['Digital Strategy', 'SEO/SEM', 'Brand Building'] },
    { id: 4, name: 'Sneha Reddy', title: 'Data Science Manager', company: 'Analytics Corp', expertise: ['Machine Learning', 'Data Science', 'AI'], experience: '8+ years', experienceYears: 8, availability: 'Available', location: 'Hyderabad, India', email: 'sneha.reddy@example.com', linkedin: 'linkedin.com/in/snehareddy', rating: 4.9, totalMentees: 28, bio: 'ML expert helping data scientists accelerate their careers.', sessions: ['ML Fundamentals', 'Career in AI', 'Portfolio Building'] },
    { id: 5, name: 'Vikram Singh', title: 'UX Design Lead', company: 'Creative Agency', expertise: ['UX Design', 'UI Design', 'Design Thinking'], experience: '9+ years', experienceYears: 9, availability: 'Limited slots', location: 'Pune, India', email: 'vikram.singh@example.com', linkedin: 'linkedin.com/in/vikramsingh', rating: 4.6, totalMentees: 25, bio: 'Design leader passionate about creating delightful experiences.', sessions: ['UX Fundamentals', 'Portfolio Reviews', 'Design Career Path'] },
    { id: 6, name: 'Kavita Joshi', title: 'Financial Analyst', company: 'Finance Group', expertise: ['Finance', 'Investment', 'Financial Planning'], experience: '11+ years', experienceYears: 11, availability: 'Available', location: 'Mumbai, India', email: 'kavita.joshi@example.com', linkedin: 'linkedin.com/in/kavitajoshi', rating: 4.8, totalMentees: 30, bio: 'Finance professional helping others navigate their financial careers.', sessions: ['Financial Planning', 'Investment Strategy', 'Career in Finance'] },
  ];

  const expertiseAreas = useMemo(() => {
    const areas = new Set();
    mentors.forEach(mentor => mentor.expertise.forEach(exp => areas.add(exp)));
    return Array.from(areas).sort();
  }, [mentors]);

  const filteredMentors = useMemo(() => {
    return mentors.filter(mentor => {
      if (mentorSearchTerm) {
        const searchLower = mentorSearchTerm.toLowerCase();
        const nameMatch = mentor.name.toLowerCase().includes(searchLower);
        const companyMatch = mentor.company.toLowerCase().includes(searchLower);
        const titleMatch = mentor.title.toLowerCase().includes(searchLower);
        if (!nameMatch && !companyMatch && !titleMatch) return false;
      }
      if (expertiseFilter && !mentor.expertise.includes(expertiseFilter)) return false;
      if (mentorExperienceFilter) {
        const years = mentor.experienceYears;
        if (mentorExperienceFilter === '5-10' && (years < 5 || years > 10)) return false;
        if (mentorExperienceFilter === '10-15' && (years < 10 || years > 15)) return false;
        if (mentorExperienceFilter === '15+' && years < 15) return false;
      }
      if (availabilityFilter && availabilityFilter !== mentor.availability) return false;
      return true;
    });
  }, [mentors, mentorSearchTerm, expertiseFilter, mentorExperienceFilter, availabilityFilter]);

  const toggleSaveJob = (jobId) => {
    const newSaved = new Set(savedJobs);
    if (newSaved.has(jobId)) {
      newSaved.delete(jobId);
      toast.success('Job removed from saved');
    } else {
      newSaved.add(jobId);
      toast.success('Job saved successfully');
    }
    setSavedJobs(newSaved);
  };

  const handleApply = (jobTitle) => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      return;
    }
    toast.info(`Application for ${jobTitle} submitted`);
  };

  const handleConnectMentor = (mentorName) => {
    if (!user) {
      toast.error('Please login to connect with mentors');
      return;
    }
    toast.success(`Mentorship request sent to ${mentorName}`, { icon: '🤝', duration: 3000 });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setExperienceFilter('');
    setJobTypeFilter('');
  };

  const clearMentorFilters = () => {
    setMentorSearchTerm('');
    setExpertiseFilter('');
    setMentorExperienceFilter('');
    setAvailabilityFilter('');
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f8e8' }}>
      {/* Hero Section - Fully Responsive */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24" style={{ backgroundColor: '#f0f8e8' }}>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6" style={{ color: '#86BC25' }}>
              Career Center
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-800 mb-3 sm:mb-4 font-medium px-4">
              Your gateway to opportunities through the alumni network
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-12 font-semibold" style={{ color: '#86BC25' }}>
              250+ Active Opportunities
            </p>
          </div>
        </div>
      </div>

      {/* Stats - Mobile Optimized Grid */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <StatCard value="250+" label="Active Jobs" sublabel="Current openings" icon={<FaBriefcase className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value="150+" label="Companies" sublabel="Hiring partners" icon={<FaUsers className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value={mentors.length} label="Mentors" sublabel="Industry experts" icon={<FaHandshake className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value="30+" label="Internships" sublabel="Learning opportunities" icon={<FaGraduationCap className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3" style={{ color: '#86BC25' }} />} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Jobs/Internships Search Bar - Mobile First */}
        {(activeTab === 'jobs' || activeTab === 'internships') && (
          <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-white"
                    style={{ outlineColor: '#86BC25' }}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="relative flex-1">
                    <FaMapMarkerAlt className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-white"
                      style={{ outlineColor: '#86BC25' }}
                    />
                  </div>
                  <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#86BC25' }}>
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mentorship Search Bar - Mobile Optimized */}
        {activeTab === 'mentorship' && (
          <div className="max-w-5xl mx-auto mb-8 sm:mb-12">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Find Your Perfect Mentor</h3>
                <button
                  onClick={() => setShowMentorFilters(!showMentorFilters)}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold hover:opacity-80"
                  style={{ color: '#86BC25' }}
                >
                  <FaFilter className="text-sm sm:text-base" />
                  <span className="hidden sm:inline">{showMentorFilters ? 'Hide' : 'Show'} Filters</span>
                  <FaBars className="sm:hidden" />
                </button>
              </div>
              <div className="mb-3 sm:mb-4">
                <div className="relative">
                  <FaSearch className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                  <input
                    type="text"
                    placeholder="Search by name, company, or title..."
                    value={mentorSearchTerm}
                    onChange={(e) => setMentorSearchTerm(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-white"
                    style={{ outlineColor: '#86BC25' }}
                  />
                </div>
              </div>
              {showMentorFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 animate-fade-in">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Expertise</label>
                    <select
                      value={expertiseFilter}
                      onChange={(e) => setExpertiseFilter(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800"
                    >
                      <option value="">All Expertise</option>
                      {expertiseAreas.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Experience</label>
                    <select
                      value={mentorExperienceFilter}
                      onChange={(e) => setMentorExperienceFilter(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800"
                    >
                      <option value="">All Experience</option>
                      <option value="5-10">5-10 years</option>
                      <option value="10-15">10-15 years</option>
                      <option value="15+">15+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Availability</label>
                    <select
                      value={availabilityFilter}
                      onChange={(e) => setAvailabilityFilter(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800"
                    >
                      <option value="">All</option>
                      <option value="Available">Available</option>
                      <option value="Limited slots">Limited slots</option>
                    </select>
                  </div>
                </div>
              )}
              {(mentorSearchTerm || expertiseFilter || mentorExperienceFilter || availabilityFilter) && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Showing <strong>{filteredMentors.slice(-5).length}</strong> of {mentors.length} mentors
                  </p>
                  <button
                    onClick={clearMentorFilters}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold text-xs sm:text-sm"
                  >
                    <FaTimes /> Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Navigation - Scrollable on Mobile */}
        <div className="bg-white rounded-xl shadow-md mb-6 sm:mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'jobs', label: 'Jobs', fullLabel: 'Job Opportunities', icon: <FaBriefcase /> },
                { id: 'internships', label: 'Internships', fullLabel: 'Internships', icon: <FaGraduationCap /> },
                { id: 'mentorship', label: 'Mentorship', fullLabel: 'Mentorship', icon: <FaHandshake /> },
                { id: 'resources', label: 'Resources', fullLabel: 'Resources', icon: <FaLightbulb /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id ? 'border-b-3' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={activeTab === tab.id ? { color: '#86BC25', borderBottomWidth: '3px', borderBottomColor: '#86BC25', backgroundColor: '#f0f8e8' } : {}}
                >
                  <span className="mr-1 sm:mr-2 text-sm sm:text-base">{tab.icon}</span>
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-800">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-sm sm:text-base font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#86BC25' }}
                >
                  <FaFilter className="mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <select value={experienceFilter} onChange={(e) => setExperienceFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800">
                    <option value="">Experience Level</option>
                    <option value="0-2">0-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                  <select value={jobTypeFilter} onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800">
                    <option value="">Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                  <button onClick={clearFilters}
                    className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-semibold">
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
            <div className="space-y-3 sm:space-y-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} isSaved={savedJobs.has(job.id)} onToggleSave={() => toggleSaveJob(job.id)} onApply={() => handleApply(job.title)} />
              ))}
            </div>
          </div>
        )}

        {/* Internships Tab */}
        {activeTab === 'internships' && (
          <div className="space-y-3 sm:space-y-4">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} onApply={() => handleApply(internship.title)} />
            ))}
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div>
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FaUserTie style={{ color: '#86BC25' }} />
                <span>Connect with Industry Leaders</span>
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                Get guidance from experienced alumni who have walked the path you're on. Our mentors are here to help you navigate your career journey.
              </p>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {filteredMentors.length > 0 ? (
                filteredMentors.slice(-5).map((mentor) => (
                  <MentorListCard key={mentor.id} mentor={mentor} onConnect={() => handleConnectMentor(mentor.name)} />
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-8 sm:p-12 text-center">
                  <FaSearch className="text-4xl sm:text-5xl md:text-6xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No mentors found</h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Try adjusting your search criteria</p>
                  <button
                    onClick={clearMentorFilters}
                    className="px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base text-white rounded-lg font-semibold hover:opacity-90"
                    style={{ backgroundColor: '#86BC25' }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4 sm:space-y-6">
            <ResourceSection icon={<FaRocket />} title="Career Development"
              resources={['Resume Building Workshop', 'Interview Preparation Guide', 'Salary Negotiation Tips', 'LinkedIn Profile Optimization']} />
            <ResourceSection icon={<FaChartLine />} title="Skill Enhancement"
              resources={['Technical Skills Roadmap', 'Soft Skills Training', 'Certification Courses', 'Industry Trends Report']} />
            <ResourceSection icon={<FaAward />} title="Success Stories"
              resources={['Alumni Career Journeys', 'From Campus to Corporate', 'Entrepreneurship Tales', 'Career Switch Success']} />
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const StatCard = ({ value, label, sublabel, icon }) => (
  <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-3 sm:p-4 md:p-6 text-center hover:shadow-lg transition-shadow duration-300">
    {icon}
    <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2" style={{ color: '#86BC25' }}>{value}</div>
    <div className="text-xs sm:text-sm font-semibold text-gray-800 mb-0.5 sm:mb-1">{label}</div>
    <div className="text-[10px] sm:text-xs text-gray-600">{sublabel}</div>
  </div>
);

const JobCard = ({ job, isSaved, onToggleSave, onApply }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-5 md:p-6">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="flex-1 pr-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-2">{job.title}</h3>
            <div className="flex items-center text-gray-600 mb-2 text-sm sm:text-base">
              <FaBuilding className="mr-1 sm:mr-2 flex-shrink-0" />
              <span className="font-medium truncate">{job.company}</span>
            </div>
          </div>
          <button onClick={onToggleSave} className="text-gray-400 hover:opacity-80 transition-opacity ml-2 flex-shrink-0"
            style={isSaved ? { color: '#86BC25' } : {}}>
            {isSaved ? <FaBookmark className="text-lg sm:text-xl" /> : <FaRegBookmark className="text-lg sm:text-xl" />}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          <div className="flex items-center"><FaMapMarkerAlt className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" /><span className="truncate">{job.location}</span></div>
          <div className="flex items-center"><FaClock className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />{job.experience}</div>
          <div className="flex items-center"><FaMoneyBillWave className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />{job.salary}</div>
        </div>
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed line-clamp-2">{job.description}</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {job.skills.map((skill, index) => (
            <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium" style={{ backgroundColor: '#f0f8e8', color: '#86BC25' }}>{skill}</span>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <span className="text-xs sm:text-sm text-gray-500">{job.postedDate}</span>
          <button onClick={onApply} className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#86BC25' }}>
            Apply Now
            <FaChevronRight className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const InternshipCard = ({ internship, onApply }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 sm:p-5 md:p-6">
    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1 sm:mb-2">{internship.title}</h3>
    <div className="flex items-center text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
      <FaBuilding className="mr-1 sm:mr-2 flex-shrink-0" />
      <span className="font-medium truncate">{internship.company}</span>
    </div>
    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
      <div className="flex items-center"><FaMapMarkerAlt className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" /><span className="truncate">{internship.location}</span></div>
      <div className="flex items-center"><FaClock className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />{internship.duration}</div>
      <div className="flex items-center"><FaMoneyBillWave className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />{internship.stipend}</div>
    </div>
    <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">{internship.description}</p>
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <span className="text-xs sm:text-sm text-gray-500">{internship.postedDate}</span>
      <button onClick={onApply} className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 text-sm sm:text-base text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#86BC25' }}>
        Apply Now
        <FaChevronRight className="ml-2" />
      </button>
    </div>
  </div>
);

const MentorListCard = ({ mentor, onConnect }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 sm:p-5 md:p-6 border-l-4" style={{ borderLeftColor: '#86BC25' }}>
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold flex-shrink-0 mx-auto sm:mx-0"
          style={{ backgroundColor: '#86BC25' }}>
          {mentor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{mentor.name}</h3>
          <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-1">{mentor.title}</p>
          <div className="flex items-center justify-center sm:justify-start text-gray-600 text-xs sm:text-sm mb-2">
            <FaBuilding className="mr-1 sm:mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{mentor.company}</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs sm:text-sm flex-wrap">
            <div className="flex items-center gap-1">
              <FaStar style={{ color: '#FFD700' }} />
              <span className="font-semibold">{mentor.rating}</span>
            </div>
            <span className="text-gray-500">• {mentor.totalMentees} mentees</span>
            <span className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
              mentor.availability === 'Available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
            }`}>
              {mentor.availability}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-3 sm:space-y-4">
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">Expertise:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {mentor.expertise.map((skill, index) => (
              <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium" style={{ backgroundColor: '#f0f8e8', color: '#86BC25' }}>{skill}</span>
            ))}
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{mentor.bio}</p>
        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
          <div><span className="text-gray-500">Experience:</span><span className="font-semibold text-gray-800 ml-1 sm:ml-2">{mentor.experience}</span></div>
          <div><span className="text-gray-500">Location:</span><span className="font-semibold text-gray-800 ml-1 sm:ml-2">{mentor.location}</span></div>
        </div>
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-700 mb-1 sm:mb-2">Mentorship Sessions:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.sessions.map((session, idx) => (
              <span key={idx} className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-[10px] sm:text-xs text-gray-700">{session}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={onConnect} className="flex-1 flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
            style={{ backgroundColor: '#86BC25' }}>
            <FaHandshake className="mr-1 sm:mr-2" /> Request Mentorship
          </button>
          <a href={`mailto:${mentor.email}`} className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#86BC25', color: '#86BC25' }}>
            <FaEnvelope />
          </a>
          <a href={`https://${mentor.linkedin}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ borderColor: '#86BC25', color: '#86BC25' }}>
            <FaLinkedin />
          </a>
        </div>
      </div>
    </div>
  </div>
);

const ResourceSection = ({ icon, title, resources }) => (
  <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-5 md:p-6">
    <div className="flex items-center mb-4 sm:mb-6">
      <div className="text-xl sm:text-2xl p-2 sm:p-3 rounded-lg mr-3 sm:mr-4" style={{ backgroundColor: '#f0f8e8', color: '#86BC25' }}>
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
      {resources.map((resource, index) => (
        <button key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
          <span className="text-xs sm:text-sm md:text-base text-gray-800 font-medium line-clamp-2">{resource}</span>
          <FaChevronRight className="text-gray-400 flex-shrink-0 ml-2" />
        </button>
      ))}
    </div>
  </div>
);

export default CareerPage;
