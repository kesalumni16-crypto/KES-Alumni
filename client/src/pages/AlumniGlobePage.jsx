import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import {
  FaGlobe, FaSearch, FaMapMarkerAlt, FaUsers, FaBuilding,
  FaGraduationCap, FaFilter, FaTimes, FaLinkedin, FaEnvelope,
  FaPhone, FaBriefcase, FaHeart, FaUserPlus, FaChevronRight,
  FaMapPin, FaCity, FaFlag, FaNetworkWired, FaHandshake,
  FaCalendarAlt, FaChartBar, FaUserFriends, FaCompass
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AlumniGlobePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState('all');

  // Mock alumni data by location
  const alumniByLocation = [
    {
      id: 1,
      country: 'India',
      city: 'Mumbai',
      continent: 'Asia',
      count: 2500,
      featured: [
        {
          name: 'Amit Sharma',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          batch: '2015',
          department: 'Computer Science',
        },
        {
          name: 'Priya Patel',
          title: 'Product Manager',
          company: 'Innovation Labs',
          batch: '2016',
          department: 'Business',
        },
      ],
    },
    {
      id: 2,
      country: 'United States',
      city: 'San Francisco',
      continent: 'North America',
      count: 850,
      featured: [
        {
          name: 'Rajesh Kumar',
          title: 'VP Engineering',
          company: 'Silicon Valley Tech',
          batch: '2012',
          department: 'Computer Science',
        },
      ],
    },
    {
      id: 3,
      country: 'United Kingdom',
      city: 'London',
      continent: 'Europe',
      count: 420,
      featured: [
        {
          name: 'Neha Gupta',
          title: 'Financial Analyst',
          company: 'Global Finance',
          batch: '2014',
          department: 'Economics',
        },
      ],
    },
    {
      id: 4,
      country: 'India',
      city: 'Bangalore',
      continent: 'Asia',
      count: 1800,
      featured: [
        {
          name: 'Vikram Singh',
          title: 'Data Scientist',
          company: 'AI Solutions',
          batch: '2017',
          department: 'Computer Science',
        },
      ],
    },
    {
      id: 5,
      country: 'Australia',
      city: 'Sydney',
      continent: 'Oceania',
      count: 320,
      featured: [
        {
          name: 'Anjali Desai',
          title: 'Marketing Director',
          company: 'Brand Hub',
          batch: '2013',
          department: 'Marketing',
        },
      ],
    },
    {
      id: 6,
      country: 'Singapore',
      city: 'Singapore',
      continent: 'Asia',
      count: 680,
      featured: [
        {
          name: 'Arjun Mehta',
          title: 'Investment Banker',
          company: 'Finance Group',
          batch: '2011',
          department: 'Finance',
        },
      ],
    },
    {
      id: 7,
      country: 'Canada',
      city: 'Toronto',
      continent: 'North America',
      count: 560,
      featured: [
        {
          name: 'Kavita Reddy',
          title: 'Healthcare Consultant',
          company: 'MedTech Solutions',
          batch: '2015',
          department: 'Healthcare',
        },
      ],
    },
    {
      id: 8,
      country: 'UAE',
      city: 'Dubai',
      continent: 'Asia',
      count: 720,
      featured: [
        {
          name: 'Rohit Agarwal',
          title: 'Business Development',
          company: 'Global Ventures',
          batch: '2016',
          department: 'Business',
        },
      ],
    },
  ];

  // Mock regional chapters
  const regionalChapters = [
    {
      id: 1,
      name: 'Mumbai Chapter',
      members: 2500,
      coordinator: 'Amit Sharma',
      nextEvent: 'Annual Reunion - Dec 2025',
      description: 'Connect with alumni in Mumbai and surrounding areas',
    },
    {
      id: 2,
      name: 'Bay Area Chapter',
      members: 850,
      coordinator: 'Rajesh Kumar',
      nextEvent: 'Tech Meetup - Jan 2025',
      description: 'Silicon Valley and Bay Area alumni network',
    },
    {
      id: 3,
      name: 'London Chapter',
      members: 420,
      coordinator: 'Neha Gupta',
      nextEvent: 'Networking Evening - Feb 2025',
      description: 'Alumni across UK and Europe',
    },
    {
      id: 4,
      name: 'Bangalore Chapter',
      members: 1800,
      coordinator: 'Vikram Singh',
      nextEvent: 'Tech Summit - Jan 2025',
      description: 'India\'s tech hub alumni community',
    },
  ];

  // Mock events
  const upcomingEvents = [
    {
      id: 1,
      title: 'Global Alumni Virtual Meet',
      date: 'Dec 15, 2025',
      location: 'Online',
      attendees: 500,
      type: 'Virtual',
    },
    {
      id: 2,
      title: 'Mumbai Alumni Reunion',
      date: 'Dec 20, 2025',
      location: 'Mumbai, India',
      attendees: 300,
      type: 'In-person',
    },
    {
      id: 3,
      title: 'Career Networking Event',
      date: 'Jan 10, 2026',
      location: 'Bangalore, India',
      attendees: 200,
      type: 'Hybrid',
    },
  ];

  const continents = [
    { id: 'all', name: 'All Locations', icon: <FaGlobe /> },
    { id: 'Asia', name: 'Asia', icon: <FaMapPin /> },
    { id: 'North America', name: 'North America', icon: <FaMapPin /> },
    { id: 'Europe', name: 'Europe', icon: <FaMapPin /> },
    { id: 'Oceania', name: 'Oceania', icon: <FaMapPin /> },
  ];

  const filteredAlumni = alumniByLocation.filter(location => {
    if (selectedContinent !== 'all' && location.continent !== selectedContinent) return false;
    if (searchTerm && !location.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !location.country.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalAlumni = alumniByLocation.reduce((sum, loc) => sum + loc.count, 0);
  const totalCountries = new Set(alumniByLocation.map(loc => loc.country)).size;
  const totalCities = alumniByLocation.length;

  const handleConnect = (name) => {
    if (!user) {
      toast.error('Please login to connect with alumni');
      return;
    }
    toast.info(`Connection request sent to ${name}`);
  };

  const handleJoinChapter = (chapterName) => {
    if (!user) {
      toast.error('Please login to join chapters');
      return;
    }
    toast.success(`Request to join ${chapterName} submitted`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setDepartmentFilter('');
    setYearFilter('');
    setSelectedContinent('all');
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <FaGlobe className="text-6xl mx-auto mb-6 animate-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Alumni Globe</h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8">
              Connect with KES alumni worldwide
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by location, name, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-custom"
                  />
                </div>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition duration-300 font-medium">
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
          <StatCard icon={<FaUsers />} value={totalAlumni.toLocaleString()} label="Global Alumni" color="blue" />
          <StatCard icon={<FaFlag />} value={`${totalCountries}+`} label="Countries" color="green" />
          <StatCard icon={<FaCity />} value={`${totalCities}+`} label="Cities" color="purple" />
          <StatCard icon={<FaNetworkWired />} value="12+" label="Chapters" color="orange" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'map', label: 'Global Map', icon: <FaGlobe /> },
                { id: 'chapters', label: 'Regional Chapters', icon: <FaUsers /> },
                { id: 'events', label: 'Events', icon: <FaCalendarAlt /> },
                { id: 'statistics', label: 'Statistics', icon: <FaChartBar /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
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

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Continent Filter */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-wrap gap-3">
                {continents.map((continent) => (
                  <button
                    key={continent.id}
                    onClick={() => setSelectedContinent(continent.id)}
                    className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                      selectedContinent === continent.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-secondary text-custom hover:bg-blue-100'
                    }`}
                  >
                    <span className="mr-2">{continent.icon}</span>
                    {continent.name}
                  </button>
                ))}
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 ml-auto"
                >
                  <FaTimes className="mr-2" />
                  Clear
                </button>
              </div>
            </div>

            {/* Map Visualization Placeholder */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
                <div className="text-center">
                  <FaGlobe className="text-6xl text-blue-400 mx-auto mb-4" />
                  <p className="text-xl text-blue-600 font-semibold mb-2">Interactive World Map</p>
                  <p className="text-gray-600">Explore alumni locations around the globe</p>
                  <p className="text-sm text-gray-500 mt-4">Map visualization coming soon</p>
                </div>
              </div>
            </div>

            {/* Location Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAlumni.map((location) => (
                <LocationCard
                  key={location.id}
                  location={location}
                  onConnect={handleConnect}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chapters Tab */}
        {activeTab === 'chapters' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-custom mb-4">Regional Alumni Chapters</h3>
              <p className="text-gray-600">
                Join your local chapter to connect with alumni in your area, attend events, and participate in community initiatives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regionalChapters.map((chapter) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  onJoin={() => handleJoinChapter(chapter.name)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-xl font-semibold text-custom mb-4">Upcoming Global Events</h3>
              <p className="text-gray-600">
                Connect with alumni at events happening around the world. From virtual meetups to in-person reunions.
              </p>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-custom mb-6">Alumni Distribution</h3>

              <div className="space-y-4">
                {continents.slice(1).map((continent) => {
                  const continentCount = alumniByLocation
                    .filter(loc => loc.continent === continent.id)
                    .reduce((sum, loc) => sum + loc.count, 0);
                  const percentage = ((continentCount / totalAlumni) * 100).toFixed(1);

                  return (
                    <div key={continent.id}>
                      <div className="flex justify-between mb-2">
                        <span className="text-custom font-medium">{continent.name}</span>
                        <span className="text-gray-600">{continentCount.toLocaleString()} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-custom mb-6">Top Cities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alumniByLocation
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 6)
                  .map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold text-custom">{location.city}</p>
                          <p className="text-sm text-gray-600">{location.country}</p>
                        </div>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{location.count}</span>
                    </div>
                  ))}
              </div>
            </div>
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
    blue: 'bg-blue-600',
    green: 'bg-green-600',
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

// Location Card Component
const LocationCard = ({ location, onConnect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-custom mb-1">{location.city}</h3>
          <div className="flex items-center text-gray-600">
            <FaMapMarkerAlt className="mr-2 text-blue-500" />
            <span>{location.country}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{location.count}</div>
          <div className="text-xs text-gray-500">Alumni</div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <p className="text-sm font-medium text-custom mb-3">Featured Alumni:</p>
        <div className="space-y-3">
          {location.featured.map((alumni, index) => (
            <div key={index} className="bg-secondary rounded-lg p-3">
              <p className="font-semibold text-custom text-sm">{alumni.name}</p>
              <p className="text-xs text-gray-600">{alumni.title}</p>
              <p className="text-xs text-gray-500">{alumni.company}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Batch {alumni.batch}</span>
                <button
                  onClick={() => onConnect(alumni.name)}
                  className="text-blue-600 hover:text-blue-700 text-xs flex items-center"
                >
                  <FaUserPlus className="mr-1" />
                  Connect
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full mt-4 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
        <FaUsers className="mr-2" />
        View All Alumni
      </button>
    </div>
  );
};

// Chapter Card Component
const ChapterCard = ({ chapter, onJoin }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-custom mb-2">{chapter.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{chapter.description}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <FaUsers className="text-blue-600 text-xl" />
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <FaUserFriends className="mr-2 text-gray-400" />
          <span>{chapter.members.toLocaleString()} members</span>
        </div>
        <div className="flex items-center">
          <FaCompass className="mr-2 text-gray-400" />
          <span>Led by {chapter.coordinator}</span>
        </div>
        <div className="flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-400" />
          <span>{chapter.nextEvent}</span>
        </div>
      </div>

      <button
        onClick={onJoin}
        className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        <FaHandshake className="mr-2" />
        Join Chapter
      </button>
    </div>
  );
};

// Event Card Component
const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-semibold text-custom mb-2">{event.title}</h3>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  {event.location}
                </div>
                <div className="flex items-center">
                  <FaUsers className="mr-2 text-gray-400" />
                  {event.attendees} attending
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              event.type === 'Virtual'
                ? 'bg-blue-100 text-blue-700'
                : event.type === 'In-person'
                ? 'bg-green-100 text-green-700'
                : 'bg-purple-100 text-purple-700'
            }`}>
              {event.type}
            </span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              <FaCalendarAlt className="mr-2" />
              Register
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition duration-300">
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlumniGlobePage;
