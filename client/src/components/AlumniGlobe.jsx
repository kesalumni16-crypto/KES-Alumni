import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { 
  FaGlobe, FaUsers, FaMapMarkerAlt, FaFilter, FaSearch, FaEye,
  FaGraduationCap, FaBriefcase, FaBuilding, FaChartBar, FaUser
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icon
const createCustomIcon = (color = '#E67E22') => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          background-color: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const AlumniGlobe = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    department: '',
    graduationYear: '',
    country: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]); // World center
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    fetchLocations();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [locations, filters]);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alumni-globe/locations`, {
        headers,
        params: { visibility: token ? 'alumni_only' : 'public' },
      });
      
      setLocations(response.data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load alumni locations');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/alumni-globe/stats`);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...locations];

    if (filters.search) {
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        location.city?.toLowerCase().includes(filters.search.toLowerCase()) ||
        location.country?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.department) {
      filtered = filtered.filter(location =>
        location.department?.toLowerCase().includes(filters.department.toLowerCase())
      );
    }

    if (filters.graduationYear) {
      filtered = filtered.filter(location =>
        location.graduationYear?.toString() === filters.graduationYear
      );
    }

    if (filters.country) {
      filtered = filtered.filter(location =>
        location.country?.toLowerCase().includes(filters.country.toLowerCase())
      );
    }

    setFilteredLocations(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', department: '', graduationYear: '', country: '' });
  };

  const focusOnLocation = (location) => {
    setMapCenter([location.latitude, location.longitude]);
    setMapZoom(10);
    setSelectedLocation(location);
  };

  // Get unique values for filter dropdowns
  const uniqueDepartments = [...new Set(locations.map(l => l.department).filter(Boolean))];
  const uniqueYears = [...new Set(locations.map(l => l.graduationYear).filter(Boolean))].sort((a, b) => b - a);
  const uniqueCountries = [...new Set(locations.map(l => l.country).filter(Boolean))].sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-custom">Loading alumni globe...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-custom flex items-center">
                <FaGlobe className="text-primary mr-3" />
                Alumni Globe
              </h1>
              <p className="text-gray-600 mt-2">Discover where our alumni are making their mark around the world</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300"
              >
                <FaFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={<FaUsers className="text-blue-600 text-2xl" />}
              title="Alumni on Map"
              value={stats.totalWithLocations}
              subtitle="Verified locations"
              color="blue"
            />
            <StatCard
              icon={<FaGlobe className="text-green-600 text-2xl" />}
              title="Countries"
              value={stats.countries.length}
              subtitle="Global presence"
              color="green"
            />
            <StatCard
              icon={<FaMapMarkerAlt className="text-purple-600 text-2xl" />}
              title="Cities"
              value={stats.cities.length}
              subtitle="Urban centers"
              color="purple"
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search alumni, city, country..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Departments</option>
                  {uniqueDepartments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Graduation Year</label>
                <select
                  value={filters.graduationYear}
                  onChange={(e) => handleFilterChange('graduationYear', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Years</option>
                  {uniqueYears.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Country</label>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Countries</option>
                  {uniqueCountries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredLocations.length} of {locations.length} alumni
              </div>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Map */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-96 md:h-[600px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <MapController center={mapCenter} zoom={mapZoom} />
              {filteredLocations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                  icon={createCustomIcon()}
                >
                  <Popup>
                    <AlumniPopup location={location} />
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Alumni List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-custom mb-6 flex items-center">
            <FaUsers className="mr-2 text-primary" />
            Alumni Locations ({filteredLocations.length})
          </h2>
          
          {filteredLocations.length === 0 ? (
            <div className="text-center py-8">
              <FaMapMarkerAlt className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500">No alumni found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLocations.map((location) => (
                <AlumniLocationCard
                  key={location.id}
                  location={location}
                  onFocus={() => focusOnLocation(location)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Map controller component to handle center and zoom changes
const MapController = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div>{icon}</div>
        <div className="text-right">
          <p className="text-2xl font-bold text-custom">{value}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-custom">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

const AlumniPopup = ({ location }) => {
  return (
    <div className="p-2 min-w-[200px]">
      <div className="flex items-center mb-2">
        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
          {location.profilePhoto ? (
            <img
              src={location.profilePhoto}
              alt={location.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-custom">{location.name}</h3>
          <p className="text-xs text-gray-500">Class of {location.graduationYear}</p>
        </div>
      </div>
      
      <div className="space-y-1 text-sm">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-xs" />
          {location.city}, {location.country}
        </div>
        <div className="flex items-center text-gray-600">
          <FaGraduationCap className="mr-2 text-xs" />
          {location.department}
        </div>
        {location.jobTitle && (
          <div className="flex items-center text-gray-600">
            <FaBriefcase className="mr-2 text-xs" />
            {location.jobTitle}
            {location.company && ` at ${location.company}`}
          </div>
        )}
      </div>
    </div>
  );
};

const AlumniLocationCard = ({ location, onFocus }) => {
  return (
    <div className="bg-secondary rounded-lg p-4 hover:bg-orange-100 transition-all duration-300 cursor-pointer border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
            {location.profilePhoto ? (
              <img
                src={location.profilePhoto}
                alt={location.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <FaUser className="text-gray-400" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-custom">{location.name}</h3>
            <p className="text-xs text-gray-500">Class of {location.graduationYear}</p>
          </div>
        </div>
        <button
          onClick={onFocus}
          className="flex items-center px-2 py-1 bg-primary text-white rounded text-xs hover:bg-primary-dark transition duration-300"
        >
          <FaEye className="mr-1" />
          View
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <FaMapMarkerAlt className="mr-2 text-xs" />
          {location.city}, {location.country}
        </div>
        <div className="flex items-center text-gray-600">
          <FaGraduationCap className="mr-2 text-xs" />
          {location.department}
        </div>
        {location.jobTitle && (
          <div className="flex items-center text-gray-600">
            <FaBriefcase className="mr-2 text-xs" />
            <span className="truncate">
              {location.jobTitle}
              {location.company && ` at ${location.company}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlumniGlobe;