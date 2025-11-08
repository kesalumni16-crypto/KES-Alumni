import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import {
  FaBriefcase, FaSearch, FaMapMarkerAlt, FaBuilding, FaClock,
  FaMoneyBillWave, FaFilter, FaTimes, FaBookmark, FaRegBookmark,
  FaChevronRight, FaUsers, FaGraduationCap, FaRocket, FaHandshake,
  FaLightbulb, FaChartLine, FaAward, FaHeart
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

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Mumbai, Maharashtra',
      type: 'Full-time',
      experience: '5-7 years',
      salary: '₹15-25 LPA',
      postedBy: 'Alumni Network',
      postedDate: '2 days ago',
      description: 'Looking for experienced software engineer to join our growing team.',
      skills: ['React', 'Node.js', 'AWS', 'MongoDB'],
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Bangalore, Karnataka',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹20-30 LPA',
      postedBy: 'Alumni Network',
      postedDate: '5 days ago',
      description: 'Seeking product manager with strong technical background.',
      skills: ['Product Strategy', 'Agile', 'Data Analysis'],
    },
    {
      id: 3,
      title: 'UX Designer',
      company: 'Creative Studio',
      location: 'Pune, Maharashtra',
      type: 'Full-time',
      experience: '2-4 years',
      salary: '₹10-18 LPA',
      postedBy: 'Alumni Network',
      postedDate: '1 week ago',
      description: 'Join our design team to create amazing user experiences.',
      skills: ['Figma', 'UI/UX', 'User Research', 'Prototyping'],
    },
    {
      id: 4,
      title: 'Data Scientist',
      company: 'Analytics Pro',
      location: 'Hyderabad, Telangana',
      type: 'Full-time',
      experience: '3-6 years',
      salary: '₹18-28 LPA',
      postedBy: 'Alumni Network',
      postedDate: '3 days ago',
      description: 'Work on cutting-edge ML and AI projects.',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    },
    {
      id: 5,
      title: 'Marketing Manager',
      company: 'Brand Solutions',
      location: 'Delhi, NCR',
      type: 'Full-time',
      experience: '4-6 years',
      salary: '₹12-20 LPA',
      postedBy: 'Alumni Network',
      postedDate: '4 days ago',
      description: 'Lead marketing initiatives for B2B clients.',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Analytics'],
    },
    {
      id: 6,
      title: 'DevOps Engineer',
      company: 'Cloud Systems',
      location: 'Chennai, Tamil Nadu',
      type: 'Full-time',
      experience: '3-5 years',
      salary: '₹15-22 LPA',
      postedBy: 'Alumni Network',
      postedDate: '6 days ago',
      description: 'Manage and optimize cloud infrastructure.',
      skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    },
  ];

  // Mock internship data
  const internships = [
    {
      id: 1,
      title: 'Software Development Intern',
      company: 'StartupHub',
      location: 'Mumbai, Maharashtra',
      duration: '3 months',
      stipend: '₹15,000/month',
      postedDate: '1 day ago',
      description: 'Learn and work on real-world projects.',
    },
    {
      id: 2,
      title: 'Marketing Intern',
      company: 'Brand Agency',
      location: 'Bangalore, Karnataka',
      duration: '6 months',
      stipend: '₹12,000/month',
      postedDate: '3 days ago',
      description: 'Get hands-on experience in digital marketing.',
    },
  ];

  // Mock mentorship data
  const mentors = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      title: 'Senior VP Engineering',
      company: 'Tech Giant Corp',
      expertise: ['Software Architecture', 'Leadership', 'Career Growth'],
      experience: '15+ years',
      availability: 'Available',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      title: 'Product Director',
      company: 'Innovation Labs',
      expertise: ['Product Management', 'Strategy', 'User Research'],
      experience: '12+ years',
      availability: 'Limited slots',
    },
    {
      id: 3,
      name: 'Amit Patel',
      title: 'Marketing Head',
      company: 'Brand Solutions',
      expertise: ['Digital Marketing', 'Branding', 'Growth Hacking'],
      experience: '10+ years',
      availability: 'Available',
    },
  ];

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
    toast.info(`Mentorship request sent to ${mentorName}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setExperienceFilter('');
    setJobTypeFilter('');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FaBriefcase className="text-6xl mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Career Center</h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Your gateway to opportunities through the alumni network
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs, companies, or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-custom"
                  />
                </div>
                <div className="relative md:w-64">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-custom"
                  />
                </div>
                <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FaBriefcase />} value="250+" label="Active Jobs" color="green" />
          <StatCard icon={<FaUsers />} value="150+" label="Companies" color="blue" />
          <StatCard icon={<FaHandshake />} value="50+" label="Mentors" color="purple" />
          <StatCard icon={<FaGraduationCap />} value="30+" label="Internships" color="orange" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'jobs', label: 'Job Opportunities', icon: <FaBriefcase /> },
                { id: 'internships', label: 'Internships', icon: <FaGraduationCap /> },
                { id: 'mentorship', label: 'Mentorship', icon: <FaHandshake /> },
                { id: 'resources', label: 'Resources', icon: <FaLightbulb /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 bg-green-50'
                      : 'text-gray-500 hover:text-custom hover:bg-secondary'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-custom">Filters</h3>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center text-green-600 hover:text-green-700"
                >
                  <FaFilter className="mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
              </div>

              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Experience Level</option>
                    <option value="0-2">0-2 years</option>
                    <option value="2-5">2-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Job Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                  </select>
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={savedJobs.has(job.id)}
                  onToggleSave={() => toggleSaveJob(job.id)}
                  onApply={() => handleApply(job.title)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Internships Tab */}
        {activeTab === 'internships' && (
          <div className="space-y-4">
            {internships.map((internship) => (
              <InternshipCard
                key={internship.id}
                internship={internship}
                onApply={() => handleApply(internship.title)}
              />
            ))}
          </div>
        )}

        {/* Mentorship Tab */}
        {activeTab === 'mentorship' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-custom mb-4">Connect with Industry Leaders</h3>
              <p className="text-gray-600 mb-4">
                Get guidance from experienced alumni who have walked the path you're on. Our mentors are here to help you navigate your career journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  onConnect={() => handleConnectMentor(mentor.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <ResourceSection
              icon={<FaRocket />}
              title="Career Development"
              resources={[
                'Resume Building Workshop',
                'Interview Preparation Guide',
                'Salary Negotiation Tips',
                'LinkedIn Profile Optimization',
              ]}
              color="blue"
            />
            <ResourceSection
              icon={<FaChartLine />}
              title="Skill Enhancement"
              resources={[
                'Technical Skills Roadmap',
                'Soft Skills Training',
                'Certification Courses',
                'Industry Trends Report',
              ]}
              color="green"
            />
            <ResourceSection
              icon={<FaAward />}
              title="Success Stories"
              resources={[
                'Alumni Career Journeys',
                'From Campus to Corporate',
                'Entrepreneurship Tales',
                'Career Switch Success',
              ]}
              color="purple"
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label, color }) => {
  const colorClasses = {
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className={`${colorClasses[color]} text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-custom">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

// Job Card Component
const JobCard = ({ job, isSaved, onToggleSave, onApply }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold text-custom mb-2">{job.title}</h3>
              <div className="flex items-center text-gray-600 mb-2">
                <FaBuilding className="mr-2" />
                <span className="font-medium">{job.company}</span>
              </div>
            </div>
            <button
              onClick={onToggleSave}
              className="text-gray-400 hover:text-green-600 transition-colors"
            >
              {isSaved ? <FaBookmark className="text-green-600" /> : <FaRegBookmark />}
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-1 text-gray-400" />
              {job.location}
            </div>
            <div className="flex items-center">
              <FaClock className="mr-1 text-gray-400" />
              {job.experience}
            </div>
            <div className="flex items-center">
              <FaMoneyBillWave className="mr-1 text-gray-400" />
              {job.salary}
            </div>
          </div>

          <p className="text-gray-600 mb-4">{job.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">{job.postedDate}</span>
            <button
              onClick={onApply}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
            >
              Apply Now
              <FaChevronRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Internship Card Component
const InternshipCard = ({ internship, onApply }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <h3 className="text-xl font-semibold text-custom mb-2">{internship.title}</h3>
      <div className="flex items-center text-gray-600 mb-4">
        <FaBuilding className="mr-2" />
        <span className="font-medium">{internship.company}</span>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <FaMapMarkerAlt className="mr-1 text-gray-400" />
          {internship.location}
        </div>
        <div className="flex items-center">
          <FaClock className="mr-1 text-gray-400" />
          {internship.duration}
        </div>
        <div className="flex items-center">
          <FaMoneyBillWave className="mr-1 text-gray-400" />
          {internship.stipend}
        </div>
      </div>

      <p className="text-gray-600 mb-4">{internship.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{internship.postedDate}</span>
        <button
          onClick={onApply}
          className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
        >
          Apply Now
          <FaChevronRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

// Mentor Card Component
const MentorCard = ({ mentor, onConnect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {mentor.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-custom">{mentor.name}</h3>
          <p className="text-sm text-gray-600">{mentor.title}</p>
        </div>
      </div>

      <div className="flex items-center text-gray-600 mb-4">
        <FaBuilding className="mr-2 text-gray-400" />
        <span className="text-sm">{mentor.company}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-custom mb-2">Expertise:</p>
        <div className="flex flex-wrap gap-2">
          {mentor.expertise.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm mb-4">
        <span className="text-gray-600">{mentor.experience}</span>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          mentor.availability === 'Available'
            ? 'bg-green-100 text-green-700'
            : 'bg-orange-100 text-orange-700'
        }`}>
          {mentor.availability}
        </span>
      </div>

      <button
        onClick={onConnect}
        className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
      >
        <FaHandshake className="mr-2" />
        Request Mentorship
      </button>
    </div>
  );
};

// Resource Section Component
const ResourceSection = ({ icon, title, resources, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className={`text-2xl ${colorClasses[color]} p-3 rounded-lg mr-4`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-custom">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {resources.map((resource, index) => (
          <button
            key={index}
            className="flex items-center justify-between p-3 bg-secondary rounded-lg hover:bg-orange-100 transition-all duration-300 text-left"
          >
            <span className="text-custom">{resource}</span>
            <FaChevronRight className="text-gray-400" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CareerPage;
