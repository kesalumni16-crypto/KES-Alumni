import { useState, useEffect, useMemo, useRef } from 'react';
import Footer from '../components/Footer';
import {
  FaGlobe, FaSearch, FaMapMarkerAlt, FaUsers, FaBuilding,
  FaGraduationCap, FaTimes, FaUserPlus, FaChevronRight,
  FaMapPin, FaCity, FaFlag, FaNetworkWired, FaHandshake,
  FaCalendarAlt, FaChartBar, FaUserFriends, FaCompass,
  FaFilter, FaSpinner, FaExternalLinkAlt, FaEnvelope,
  FaLinkedin, FaPhone, FaExpand, FaCompress, FaDownload,
  FaShare, FaPrint
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced custom marker with pulsing animation
const createCustomIcon = (count, isActive = false) => {
  const size = Math.min(40 + Math.log(count) * 5, 65);
  const pulseClass = isActive ? 'marker-pulse' : '';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="${pulseClass}" style="
        background: linear-gradient(135deg, #86BC25 0%, #6a9a1e 100%);
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.min(12 + count / 200, 18)}px;
        border: 3px solid white;
        box-shadow: 0 4px 16px rgba(134, 188, 37, 0.5);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
      " 
      onmouseover="this.style.transform='scale(1.2)'; this.style.boxShadow='0 8px 24px rgba(134, 188, 37, 0.7)'" 
      onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 16px rgba(134, 188, 37, 0.5)'">
        ${count}
        <div style="
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid #86BC25;
          opacity: 0.3;
          animation: ${isActive ? 'pulse 2s infinite' : 'none'};
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Map bounds controller component
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);
  
  return null;
};

const AlumniGlobePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('map');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [expandedLocation, setExpandedLocation] = useState(null);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapStyle, setMapStyle] = useState('default');
  const [showConnectionLines, setShowConnectionLines] = useState(true);
  const mapRef = useRef(null);

  // Mock alumni data
  const alumniByLocation = [
    {
      id: 1, country: 'India', city: 'Mumbai', continent: 'Asia', count: 2500,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      featured: [
        { name: 'Amit Sharma', title: 'Senior Software Engineer', company: 'Tech Corp', 
          batch: '2015', department: 'Computer Science', email: 'amit.sharma@example.com', 
          linkedin: 'linkedin.com/in/amitsharma' },
        { name: 'Priya Patel', title: 'Product Manager', company: 'Innovation Labs', 
          batch: '2016', department: 'Business', email: 'priya.patel@example.com', 
          linkedin: 'linkedin.com/in/priyapatel' },
      ],
    },
    {
      id: 2, country: 'United States', city: 'San Francisco', continent: 'North America', count: 850,
      coordinates: { lat: 37.7749, lng: -122.4194 },
      featured: [
        { name: 'Rajesh Kumar', title: 'VP Engineering', company: 'Silicon Valley Tech', 
          batch: '2012', department: 'Computer Science', email: 'rajesh.kumar@example.com', 
          linkedin: 'linkedin.com/in/rajeshkumar' },
      ],
    },
    {
      id: 3, country: 'United Kingdom', city: 'London', continent: 'Europe', count: 420,
      coordinates: { lat: 51.5074, lng: -0.1278 },
      featured: [
        { name: 'Neha Gupta', title: 'Financial Analyst', company: 'Global Finance', 
          batch: '2014', department: 'Economics', email: 'neha.gupta@example.com', 
          linkedin: 'linkedin.com/in/nehagupta' },
      ],
    },
    {
      id: 4, country: 'India', city: 'Bangalore', continent: 'Asia', count: 1800,
      coordinates: { lat: 12.9716, lng: 77.5946 },
      featured: [
        { name: 'Vikram Singh', title: 'Data Scientist', company: 'AI Solutions', 
          batch: '2017', department: 'Computer Science', email: 'vikram.singh@example.com', 
          linkedin: 'linkedin.com/in/vikramsingh' },
      ],
    },
    {
      id: 5, country: 'Australia', city: 'Sydney', continent: 'Oceania', count: 320,
      coordinates: { lat: -33.8688, lng: 151.2093 },
      featured: [
        { name: 'Anjali Desai', title: 'Marketing Director', company: 'Brand Hub', 
          batch: '2013', department: 'Marketing', email: 'anjali.desai@example.com', 
          linkedin: 'linkedin.com/in/anjalidesai' },
      ],
    },
    {
      id: 6, country: 'Singapore', city: 'Singapore', continent: 'Asia', count: 680,
      coordinates: { lat: 1.3521, lng: 103.8198 },
      featured: [
        { name: 'Arjun Mehta', title: 'Investment Banker', company: 'Finance Group', 
          batch: '2011', department: 'Finance', email: 'arjun.mehta@example.com', 
          linkedin: 'linkedin.com/in/arjunmehta' },
      ],
    },
    {
      id: 7, country: 'Canada', city: 'Toronto', continent: 'North America', count: 560,
      coordinates: { lat: 43.6532, lng: -79.3832 },
      featured: [
        { name: 'Kavita Reddy', title: 'Healthcare Consultant', company: 'MedTech Solutions', 
          batch: '2015', department: 'Healthcare', email: 'kavita.reddy@example.com', 
          linkedin: 'linkedin.com/in/kavitareddy' },
      ],
    },
    {
      id: 8, country: 'UAE', city: 'Dubai', continent: 'Asia', count: 720,
      coordinates: { lat: 25.2048, lng: 55.2708 },
      featured: [
        { name: 'Rohit Agarwal', title: 'Business Development', company: 'Global Ventures', 
          batch: '2016', department: 'Business', email: 'rohit.agarwal@example.com', 
          linkedin: 'linkedin.com/in/rohitagarwal' },
      ],
    },
  ];

  const regionalChapters = [
    { id: 1, name: 'Mumbai Chapter', members: 2500, coordinator: 'Amit Sharma',
      coordinatorEmail: 'mumbai@kesalumni.org', nextEvent: 'Annual Reunion - Dec 20, 2025',
      description: 'Connect with alumni in Mumbai and surrounding areas', established: '1995',
      activities: ['Monthly Meetups', 'Career Mentoring', 'Social Events'] },
    { id: 2, name: 'Bay Area Chapter', members: 850, coordinator: 'Rajesh Kumar',
      coordinatorEmail: 'bayarea@kesalumni.org', nextEvent: 'Tech Meetup - Jan 15, 2026',
      description: 'Silicon Valley and Bay Area alumni network', established: '2005',
      activities: ['Tech Talks', 'Startup Support', 'Networking'] },
    { id: 3, name: 'London Chapter', members: 420, coordinator: 'Neha Gupta',
      coordinatorEmail: 'london@kesalumni.org', nextEvent: 'Networking Evening - Feb 10, 2026',
      description: 'Alumni across UK and Europe', established: '2010',
      activities: ['Quarterly Dinners', 'Professional Development', 'Cultural Events'] },
    { id: 4, name: 'Bangalore Chapter', members: 1800, coordinator: 'Vikram Singh',
      coordinatorEmail: 'bangalore@kesalumni.org', nextEvent: 'Tech Summit - Jan 25, 2026',
      description: 'India\'s tech hub alumni community', established: '2000',
      activities: ['Innovation Workshops', 'Hackathons', 'Mentorship Programs'] },
  ];

  const upcomingEvents = [
    { id: 1, title: 'Global Alumni Virtual Meet', date: 'Dec 15, 2025', time: '6:00 PM IST',
      location: 'Online (Zoom)', attendees: 500, registered: 342, type: 'Virtual',
      description: 'Join alumni from around the world for networking and updates',
      speakers: ['Dr. Rajesh Sharma', 'Prof. Anita Desai'],
      agenda: ['Keynote Address', 'Alumni Achievements', 'Networking Session'] },
    { id: 2, title: 'Mumbai Alumni Reunion', date: 'Dec 20, 2025', time: '3:00 PM IST',
      location: 'KES Campus, Mumbai, India', attendees: 300, registered: 245, type: 'In-person',
      description: 'Annual reunion with campus tours and dinner',
      speakers: ['Principal Dr. Kumar', 'Alumni Board'],
      agenda: ['Campus Tour', 'Dinner & Networking', 'Awards Ceremony'] },
    { id: 3, title: 'Career Networking Event', date: 'Jan 10, 2026', time: '5:00 PM IST',
      location: 'Bangalore Tech Hub / Virtual', attendees: 200, registered: 156, type: 'Hybrid',
      description: 'Connect with industry leaders and explore opportunities',
      speakers: ['Senior Executives from Top Companies'],
      agenda: ['Industry Insights', 'Job Fair', 'One-on-One Mentoring'] },
  ];

  const continents = [
    { id: 'all', name: 'All Locations', icon: <FaGlobe /> },
    { id: 'Asia', name: 'Asia', icon: <FaMapPin /> },
    { id: 'North America', name: 'North America', icon: <FaMapPin /> },
    { id: 'Europe', name: 'Europe', icon: <FaMapPin /> },
    { id: 'Oceania', name: 'Oceania', icon: <FaMapPin /> },
  ];

  const mapStyles = [
    { id: 'default', name: 'Default', url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' },
    { id: 'dark', name: 'Dark', url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' },
    { id: 'satellite', name: 'Satellite', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' },
  ];

  // Get unique departments and batches
  const departments = useMemo(() => {
    const depts = new Set();
    alumniByLocation.forEach(loc => loc.featured.forEach(alumni => depts.add(alumni.department)));
    return Array.from(depts).sort();
  }, []);

  const batches = useMemo(() => {
    const batchYears = new Set();
    alumniByLocation.forEach(loc => loc.featured.forEach(alumni => batchYears.add(alumni.batch)));
    return Array.from(batchYears).sort((a, b) => b - a);
  }, []);

  // Enhanced filtering
  const filteredAlumni = useMemo(() => {
    return alumniByLocation.filter(location => {
      if (selectedContinent !== 'all' && location.continent !== selectedContinent) return false;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const cityMatch = location.city.toLowerCase().includes(searchLower);
        const countryMatch = location.country.toLowerCase().includes(searchLower);
        const alumniMatch = location.featured.some(alumni => 
          alumni.name.toLowerCase().includes(searchLower) ||
          alumni.company.toLowerCase().includes(searchLower)
        );
        if (!cityMatch && !countryMatch && !alumniMatch) return false;
      }

      if (departmentFilter) {
        const hasDept = location.featured.some(alumni => alumni.department === departmentFilter);
        if (!hasDept) return false;
      }

      if (batchFilter) {
        const hasBatch = location.featured.some(alumni => alumni.batch === batchFilter);
        if (!hasBatch) return false;
      }

      return true;
    });
  }, [selectedContinent, searchTerm, departmentFilter, batchFilter]);

  const totalAlumni = alumniByLocation.reduce((sum, loc) => sum + loc.count, 0);
  const totalCountries = new Set(alumniByLocation.map(loc => loc.country)).size;
  const totalCities = alumniByLocation.length;

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      if (filteredAlumni.length === 0) {
        toast.info('No results found. Try different search terms.');
      } else {
        toast.success(`Found ${filteredAlumni.length} location(s)`);
      }
    }, 800);
  };

  const handleConnect = (alumni) => {
    if (!user) {
      toast.error('Please login to connect with alumni');
      return;
    }
    toast.success(`Connection request sent to ${alumni.name}`, { duration: 3000, icon: '🤝' });
  };

  const handleJoinChapter = (chapterName) => {
    if (!user) {
      toast.error('Please login to join chapters');
      return;
    }
    toast.success(`Request to join ${chapterName} submitted`, { duration: 3000, icon: '✅' });
  };

  const handleRegisterEvent = (eventTitle) => {
    if (!user) {
      toast.error('Please login to register for events');
      return;
    }
    toast.success(`Registered for ${eventTitle}`, { duration: 3000, icon: '🎉' });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedContinent('all');
    setDepartmentFilter('');
    setBatchFilter('');
    setShowAdvancedFilters(false);
    setSelectedLocation(null);
    setMapCenter([20, 0]);
    setMapZoom(2);
    toast.info('Filters cleared');
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location.id);
    setMapCenter([location.coordinates.lat, location.coordinates.lng]);
    setMapZoom(10);
    setTimeout(() => {
      const element = document.getElementById(`location-${location.id}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
  };

  const exportData = () => {
    const data = filteredAlumni.map(loc => ({
      city: loc.city,
      country: loc.country,
      continent: loc.continent,
      count: loc.count,
    }));
    const csv = [
      ['City', 'Country', 'Continent', 'Alumni Count'],
      ...data.map(item => [item.city, item.country, item.continent, item.count])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alumni-locations.csv';
    a.click();
    toast.success('Data exported successfully');
  };

  const shareMap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Alumni Globe',
        text: `Explore ${totalAlumni} alumni across ${totalCities} cities worldwide!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f0f8e8' }}>
      {/* Hero Section */}
      <div className="py-16 md:py-20" style={{ backgroundColor: '#f0f8e8' }}>
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in" style={{ color: '#86BC25' }}>
              Alumni Globe
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 mb-4 font-medium">
              Connecting alumni worldwide since 1936
            </p>
            <p className="text-lg md:text-xl mb-8 font-semibold" style={{ color: '#86BC25' }}>
              {totalAlumni.toLocaleString()}+ Members • {totalCountries} Countries • {totalCities} Cities
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard value={totalAlumni.toLocaleString()} label="Alumni Worldwide" 
              sublabel="Global network" icon={<FaUsers className="text-4xl mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value={`${totalCountries}+`} label="Countries" sublabel="International presence"
              icon={<FaFlag className="text-4xl mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value={`${totalCities}+`} label="Cities" sublabel="Urban chapters"
              icon={<FaCity className="text-4xl mb-3" style={{ color: '#86BC25' }} />} />
            <StatCard value={`${regionalChapters.length}+`} label="Chapters" sublabel="Active communities"
              icon={<FaNetworkWired className="text-4xl mb-3" style={{ color: '#86BC25' }} />} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" />
                  <input
                    type="text"
                    placeholder="Search by location, name, company, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 text-gray-800 bg-white transition-all"
                    style={{ outlineColor: '#86BC25' }}
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center min-w-[120px] shadow-md hover:shadow-lg"
                  style={{ backgroundColor: '#86BC25' }}
                >
                  {isSearching ? <FaSpinner className="animate-spin" /> : <><FaSearch className="mr-2" /> Search</>}
                </button>
              </div>

              {/* Advanced Filters Toggle */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-opacity"
                  style={{ color: '#86BC25' }}
                >
                  <FaFilter />
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </button>
                {(departmentFilter || batchFilter || selectedContinent !== 'all' || searchTerm) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <FaTimes /> Clear All
                  </button>
                )}
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200 animate-fade-in">
                  <select
                    value={departmentFilter}
                    onChange={(e) => setDepartmentFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                  </select>
                  <select
                    value={batchFilter}
                    onChange={(e) => setBatchFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 bg-white text-gray-800"
                  >
                    <option value="">All Batches</option>
                    {batches.map(batch => <option key={batch} value={batch}>Batch {batch}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto scrollbar-hide">
              {[
                { id: 'map', label: 'Global Map', icon: <FaGlobe />, count: filteredAlumni.length },
                { id: 'chapters', label: 'Regional Chapters', icon: <FaUsers />, count: regionalChapters.length },
                { id: 'events', label: 'Events', icon: <FaCalendarAlt />, count: upcomingEvents.length },
                { id: 'statistics', label: 'Statistics', icon: <FaChartBar /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold whitespace-nowrap transition-all duration-300 relative ${
                    activeTab === tab.id ? 'border-b-3' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  style={activeTab === tab.id ? { 
                    color: '#86BC25', 
                    borderBottomWidth: '3px',
                    borderBottomColor: '#86BC25',
                    backgroundColor: '#f0f8e8'
                  } : {}}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold bg-white border border-gray-200 shadow-sm">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="space-y-8">
            {/* Continent Filter */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Filter by Continent</h3>
                <div className="flex gap-2">
                  <button
                    onClick={exportData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    <FaDownload /> Export
                  </button>
                  <button
                    onClick={shareMap}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  >
                    <FaShare /> Share
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {continents.map((continent) => {
                  const count = continent.id === 'all' 
                    ? totalAlumni 
                    : alumniByLocation.filter(loc => loc.continent === continent.id).reduce((sum, loc) => sum + loc.count, 0);
                  
                  return (
                    <button
                      key={continent.id}
                      onClick={() => setSelectedContinent(continent.id)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all duration-300 font-semibold ${
                        selectedContinent === continent.id
                          ? 'text-white shadow-lg transform scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                      }`}
                      style={selectedContinent === continent.id ? { backgroundColor: '#86BC25' } : {}}
                    >
                      <span>{continent.icon}</span>
                      <span>{continent.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedContinent === continent.id ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        {count.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Map */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FaGlobe className="text-green-600" />
                    Interactive Alumni Map
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredAlumni.length} locations • Click markers to explore
                  </p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={mapStyle}
                    onChange={(e) => setMapStyle(e.target.value)}
                    className="px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    {mapStyles.map(style => (
                      <option key={style.id} value={style.id}>{style.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: '#86BC25' }}
                  >
                    {isMapExpanded ? <FaCompress size={20} /> : <FaExpand size={20} />}
                  </button>
                </div>
              </div>
              
              <div className={`${isMapExpanded ? 'h-[80vh]' : 'h-[600px]'} transition-all duration-300`}>
                <MapContainer
                  ref={mapRef}
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url={mapStyles.find(s => s.id === mapStyle)?.url || mapStyles[0].url}
                  />
                  <MapController center={mapCenter} zoom={mapZoom} />
                  
                  {filteredAlumni.map((location) => (
                    <Marker
                      key={location.id}
                      position={[location.coordinates.lat, location.coordinates.lng]}
                      icon={createCustomIcon(location.count, selectedLocation === location.id)}
                      eventHandlers={{
                        click: () => handleMarkerClick(location),
                      }}
                    >
                      <Popup className="custom-popup" maxWidth={320}>
                        <div className="p-3">
                          <h4 className="text-lg font-bold mb-2 flex items-center gap-2" style={{ color: '#86BC25' }}>
                            <FaMapMarkerAlt />
                            {location.city}, {location.country}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 flex items-center gap-2">
                            <FaUsers className="text-green-600" />
                            <strong>{location.count}</strong> alumni in this location
                          </p>
                          
                          <div className="space-y-2 mb-4">
                            <p className="text-xs font-semibold text-gray-700">Featured Alumni:</p>
                            {location.featured.slice(0, 2).map((alumni, idx) => (
                              <div key={idx} className="text-xs bg-gradient-to-r from-gray-50 to-green-50 p-3 rounded-lg">
                                <p className="font-bold text-gray-900">{alumni.name}</p>
                                <p className="text-gray-600 mt-1">{alumni.title}</p>
                                <p className="text-gray-500">{alumni.company}</p>
                                <p className="text-green-600 mt-1">Class of {alumni.batch}</p>
                              </div>
                            ))}
                          </div>
                          
                          <button
                            onClick={() => {
                              setExpandedLocation(location.id);
                              setTimeout(() => {
                                const element = document.getElementById(`location-${location.id}`);
                                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }, 100);
                            }}
                            className="w-full px-4 py-3 text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-md"
                            style={{ backgroundColor: '#86BC25' }}
                          >
                            <FaChevronRight />
                            View Full Details
                          </button>
                        </div>
                      </Popup>
                      
                      <Circle
                        center={[location.coordinates.lat, location.coordinates.lng]}
                        radius={location.count * 50}
                        pathOptions={{
                          fillColor: '#86BC25',
                          fillOpacity: 0.15,
                          color: '#86BC25',
                          weight: 1,
                          opacity: showConnectionLines ? 0.3 : 0,
                        }}
                      />
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Enhanced Legend */}
              <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: '#86BC25' }}></div>
                        <div className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: '#86BC25', opacity: 0.2 }}></div>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Alumni Location</p>
                        <p className="text-xs text-gray-600">Size = alumni count</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1 bg-gradient-to-r from-green-500/30 to-green-500/10 rounded-full"></div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">Coverage Area</p>
                        <p className="text-xs text-gray-600">Alumni reach</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showConnectionLines}
                        onChange={(e) => setShowConnectionLines(e.target.checked)}
                        className="rounded"
                      />
                      Show Coverage
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Showing {filteredAlumni.length} location{filteredAlumni.length !== 1 ? 's' : ''}
                  </h3>
                  <p className="text-gray-600 mt-2 flex items-center gap-2">
                    <FaUsers className="text-green-600" />
                    {filteredAlumni.reduce((sum, loc) => sum + loc.count, 0).toLocaleString()} total alumni
                  </p>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-sm font-semibold hover:opacity-80 flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ color: '#86BC25' }}
                >
                  Back to top ↑
                </button>
              </div>
            </div>

            {/* Location Cards Grid */}
            {filteredAlumni.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAlumni.map((location) => (
                  <div key={location.id} id={`location-${location.id}`}>
                    <EnhancedLocationCard
                      location={location}
                      onConnect={handleConnect}
                      isExpanded={expandedLocation === location.id}
                      isSelected={selectedLocation === location.id}
                      onToggleExpand={() => setExpandedLocation(expandedLocation === location.id ? null : location.id)}
                      onViewOnMap={() => handleMarkerClick(location)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No locations found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-8 py-3 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
                  style={{ backgroundColor: '#86BC25' }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.5); opacity: 0; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .marker-pulse::after {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          border: 2px solid #86BC25;
          animation: pulse 2s infinite;
        }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(134, 188, 37, 0.3);
          border: 2px solid #86BC25;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border-left: 1px solid #86BC25;
          border-bottom: 1px solid #86BC25;
        }
      `}</style>
    </div>
  );
};

// Enhanced Stat Card
const StatCard = ({ value, label, sublabel, icon }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-200">
    {icon}
    <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#86BC25' }}>{value}</div>
    <div className="text-sm font-semibold text-gray-800 mb-1">{label}</div>
    <div className="text-xs text-gray-600">{sublabel}</div>
  </div>
);

// Enhanced Location Card
const EnhancedLocationCard = ({ location, onConnect, isExpanded, isSelected, onToggleExpand, onViewOnMap }) => (
  <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 group ${
    isSelected ? 'ring-4 ring-green-300 scale-105' : ''
  }`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors">
          {location.city}
        </h3>
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-2" style={{ color: '#86BC25' }} />
          <span>{location.country}</span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-3xl font-bold" style={{ color: '#86BC25' }}>{location.count}</div>
        <div className="text-xs text-gray-500 font-semibold">Alumni</div>
      </div>
    </div>

    <div className="border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-800">Featured Alumni:</p>
        <button
          onClick={onToggleExpand}
          className="text-xs font-semibold hover:opacity-80 transition-opacity"
          style={{ color: '#86BC25' }}
        >
          {isExpanded ? 'Show Less' : 'Show All'} ({location.featured.length})
        </button>
      </div>
      
      <div className="space-y-3">
        {(isExpanded ? location.featured : location.featured.slice(0, 2)).map((alumni, index) => (
          <div key={index} className="bg-gradient-to-r from-gray-50 to-green-50 rounded-lg p-4 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm mb-1">{alumni.name}</p>
                <p className="text-xs text-gray-600">{alumni.title}</p>
                <p className="text-xs text-gray-500">{alumni.company}</p>
              </div>
              <span className="px-2 py-1 rounded-full text-xs font-bold bg-white border-2 border-green-200 text-green-700">
                '{alumni.batch.slice(-2)}
              </span>
            </div>
            
            {isExpanded && (
              <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-200">
                {alumni.email && (
                  <a href={`mailto:${alumni.email}`} className="text-xs flex items-center gap-1 text-gray-600 hover:text-green-700 transition-colors">
                    <FaEnvelope />
                  </a>
                )}
                {alumni.linkedin && (
                  <a href={`https://${alumni.linkedin}`} target="_blank" rel="noopener noreferrer" 
                     className="text-xs flex items-center gap-1 text-gray-600 hover:text-blue-700 transition-colors">
                    <FaLinkedin />
                  </a>
                )}
                <button
                  onClick={() => onConnect(alumni)}
                  className="ml-auto text-xs flex items-center font-bold px-3 py-1 rounded-lg hover:bg-white transition-colors shadow-sm"
                  style={{ color: '#86BC25' }}
                >
                  <FaUserPlus className="mr-1" /> Connect
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>

    <div className="flex gap-2 mt-4">
      <button 
        onClick={onViewOnMap}
        className="flex-1 flex items-center justify-center px-4 py-3 border-2 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
        style={{ borderColor: '#86BC25', color: '#86BC25' }}
      >
        <FaMapMarkerAlt className="mr-2" /> View on Map
      </button>
      <button 
        className="flex-1 flex items-center justify-center px-4 py-3 text-white rounded-lg font-semibold hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
        style={{ backgroundColor: '#86BC25' }}
      >
        <FaUsers className="mr-2" /> View All
      </button>
    </div>
  </div>
);

export default AlumniGlobePage;
