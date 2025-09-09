import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserShield, FaUserTie, FaGraduationCap, FaSearch,
  FaEdit, FaEye, FaChartBar, FaCalendarAlt, FaBuilding, FaBook, FaTimes,
  FaDownload, FaFilter, FaSort, FaUserPlus, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaBriefcase, FaAward, FaHeart, FaGlobe, FaCog,
  FaFileExport, FaPrint, FaSync, FaCheckCircle, FaTimesCircle, FaUser
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    passingYear: '',
    mentorshipAvailable: '',
    currentCity: '',
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect if not admin or superadmin
  useEffect(() => {
    // Access control is now handled by ProtectedRoute component
    // This useEffect is no longer needed but kept for any additional admin-specific logic
  }, [user, navigate]);

  // Fetch data on component mount and when filters change
  useEffect(() => {
    if (user && ['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      fetchUsers();
      fetchStats();
    }
  }, [user, currentPage, searchTerm, filters, sortBy, sortOrder]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://kes-alumni-bhz1.vercel.app/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 12,
          search: searchTerm,
          ...filters,
          sortBy,
          sortOrder,
        },
      });
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://kes-alumni-bhz1.vercel.app/api/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      passingYear: '',
      mentorshipAvailable: '',
      currentCity: '',
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const exportData = async (format) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://kes-alumni-bhz1.vercel.app/api/admin/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { format, ...filters, search: searchTerm },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `alumni_data.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'SUPERADMIN': return 'bg-red-100 text-accent';
      case 'ADMIN': return 'bg-orange-100 text-primary';
      case 'ALUMNI': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'SUPERADMIN': return <FaUserShield className="text-accent" />;
      case 'ADMIN': return <FaUserTie className="text-primary" />;
      case 'ALUMNI': return <FaGraduationCap className="text-green-600" />;
      default: return <FaUsers className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-custom">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <div>
              <h1 className="text-3xl font-bold text-custom flex items-center">
                <FaUserTie className="text-primary mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage alumni network and view analytics</p>
            </div>
            
            <div className="mt-4 lg:mt-0 flex flex-wrap gap-3">
              <button
                onClick={() => exportData('csv')}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
              >
                <FaDownload className="mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => exportData('json')}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
              >
                <FaFileExport className="mr-2" />
                Export JSON
              </button>
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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
                { id: 'users', label: 'User Management', icon: <FaUsers /> },
                { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
                { id: 'reports', label: 'Reports', icon: <FaFileExport /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-orange-50'
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

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab stats={stats} />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            pagination={pagination}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filters={filters}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            handleFilterChange={handleFilterChange}
            clearFilters={clearFilters}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setSelectedUser={setSelectedUser}
            setShowUserModal={setShowUserModal}
            getRoleColor={getRoleColor}
            getRoleIcon={getRoleIcon}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab stats={stats} />
        )}

        {activeTab === 'reports' && (
          <ReportsTab exportData={exportData} />
        )}
      </div>

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-custom">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers className="text-primary text-2xl" />}
          title="Total Alumni"
          value={stats.totalUsers}
          subtitle="Verified members"
          color="primary"
        />
        <StatCard
          icon={<FaUserPlus className="text-green-600 text-2xl" />}
          title="New This Month"
          value={stats.recentRegistrations}
          subtitle="Recent registrations"
          color="green"
        />
        <StatCard
          icon={<FaHeart className="text-purple-600 text-2xl" />}
          title="Mentors"
          value={stats.mentorsCount || 0}
          subtitle="Available mentors"
          color="purple"
        />
        <StatCard
          icon={<FaGlobe className="text-accent text-2xl" />}
          title="Countries"
          value={stats.countriesCount || 0}
          subtitle="Global presence"
          color="accent"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-custom mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            icon={<FaUserPlus />}
            title="Add New Alumni"
            description="Manually add alumni to the system"
            action={() => toast.info('Feature coming soon')}
            color="green"
          />
          <QuickActionCard
            icon={<FaEnvelope />}
            title="Send Announcement"
            description="Send email to all alumni"
            action={() => toast.info('Feature coming soon')}
            color="primary"
          />
          <QuickActionCard
            icon={<FaFileExport />}
            title="Generate Report"
            description="Create detailed analytics report"
            action={() => toast.info('Feature coming soon')}
            color="purple"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-custom mb-4 flex items-center">
          <FaCalendarAlt className="mr-2 text-gray-600" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <ActivityItem
            icon={<FaUserPlus className="text-green-600" />}
            title="New Registration"
            description="5 new alumni registered today"
            time="2 hours ago"
          />
          <ActivityItem
            icon={<FaEdit className="text-primary" />}
            title="Profile Updates"
            description="12 alumni updated their profiles"
            time="4 hours ago"
          />
          <ActivityItem
            icon={<FaHeart className="text-purple-600" />}
            title="Mentorship"
            description="3 new mentorship connections made"
            time="6 hours ago"
          />
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({
  users, pagination, searchTerm, setSearchTerm, filters, showFilters,
  setShowFilters, handleFilterChange, clearFilters, sortBy, setSortBy,
  sortOrder, setSortOrder, currentPage, setCurrentPage, setSelectedUser,
  setShowUserModal, getRoleColor, getRoleIcon
}) => {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="createdAt">Sort by Join Date</option>
              <option value="fullName">Sort by Name</option>
              <option value="passingYear">Sort by Graduation</option>
              <option value="department">Sort by Department</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-4 py-3 bg-secondary border border-gray-300 rounded-lg hover:bg-orange-100 transition duration-300"
            >
              <FaSort className={`transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Roles</option>
                <option value="SUPERADMIN">SuperAdmin</option>
                <option value="ADMIN">Admin</option>
                <option value="ALUMNI">Alumni</option>
              </select>
              <input
                type="text"
                placeholder="Department"
                value={filters.department}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={filters.passingYear}
                onChange={(e) => handleFilterChange('passingYear', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <select
                value={filters.mentorshipAvailable}
                onChange={(e) => handleFilterChange('mentorshipAvailable', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Mentorship</option>
                <option value="true">Available as Mentor</option>
                <option value="false">Not Available</option>
              </select>
              <input
                type="text"
                placeholder="Current City"
                value={filters.currentCity}
                onChange={(e) => handleFilterChange('currentCity', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            onView={() => {
              setSelectedUser(user);
              setShowUserModal(true);
            }}
            getRoleColor={getRoleColor}
            getRoleIcon={getRoleIcon}
          />
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FaUsers className="text-gray-400 text-6xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-custom mb-2">No Users Found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalUsers > 0 && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-custom">
              Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.totalUsers)} of {pagination.totalUsers} users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition duration-300"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-custom">
                Page {currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition duration-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Analytics Tab Component
const AnalyticsTab = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-custom">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Department Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-custom mb-4 flex items-center">
            <FaBuilding className="mr-2 text-primary" />
            Department Distribution
          </h3>
          <div className="space-y-3">
            {stats.departmentStats?.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-custom">{dept.department}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(dept.count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-custom w-8 text-right">{dept.count}</span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No department data available</p>
            )}
          </div>
        </div>

        {/* Graduation Year Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-custom mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            Graduation Years
          </h3>
          <div className="space-y-3">
            {stats.yearStats?.map((year, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-custom">{year.year}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(year.count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-custom w-8 text-right">{year.count}</span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No graduation year data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-custom mb-4 flex items-center">
          <FaGlobe className="mr-2 text-purple-600" />
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.locationStats?.map((location, index) => (
            <div key={index} className="bg-secondary rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-custom">{location.city || 'Unknown City'}</p>
                  <p className="text-sm text-gray-600">{location.country || 'Unknown Country'}</p>
                </div>
                <span className="text-lg font-bold text-purple-600">{location.count}</span>
              </div>
            </div>
          )) || (
            <div className="col-span-full text-center py-8">
              <FaGlobe className="text-gray-400 text-4xl mx-auto mb-4" />
              <p className="text-gray-500">No location data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Reports Tab Component
const ReportsTab = ({ exportData }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-custom mb-6">Generate Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            icon={<FaUsers />}
            title="Alumni Directory"
            description="Complete list of all verified alumni with contact information"
            actions={[
              { label: 'Export CSV', action: () => exportData('csv'), color: 'green' },
              { label: 'Export JSON', action: () => exportData('json'), color: 'primary' },
            ]}
          />
          <ReportCard
            icon={<FaChartBar />}
            title="Analytics Report"
            description="Detailed analytics including demographics and trends"
            actions={[
              { label: 'Generate PDF', action: () => toast.info('Feature coming soon'), color: 'accent' },
              { label: 'View Online', action: () => toast.info('Feature coming soon'), color: 'primary' },
            ]}
          />
          <ReportCard
            icon={<FaHeart />}
            title="Mentorship Report"
            description="List of available mentors and mentorship connections"
            actions={[
              { label: 'Export CSV', action: () => exportData('csv'), color: 'green' },
              { label: 'Email Report', action: () => toast.info('Feature coming soon'), color: 'purple' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

// Utility Components
const StatCard = ({ icon, title, value, subtitle, color }) => {
  const colorClasses = {
    primary: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    accent: 'bg-red-50 border-red-200 hover:bg-red-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-3">
        <div>{icon}</div>
        <div className="text-right">
          <p className="text-2xl font-bold text-custom">{value?.toLocaleString() || '0'}</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-custom">{title}</p>
        <p className="text-xs text-gray-600">{subtitle}</p>
      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, title, description, action, color }) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    primary: 'bg-primary hover:bg-primary-dark',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  return (
    <div className="bg-secondary rounded-lg p-6 hover:bg-orange-100 transition-all duration-300 cursor-pointer" onClick={action}>
      <div className="flex items-center mb-3">
        <div className={`${colorClasses[color]} text-white p-3 rounded-lg mr-4`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-custom">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-center p-4 bg-secondary rounded-lg">
    <div className="mr-4">{icon}</div>
    <div className="flex-1">
      <h4 className="font-medium text-custom">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

const UserCard = ({ user, onView, getRoleColor, getRoleIcon }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          {user.profilePhoto ? (
            <img
              src={user.profilePhoto}
              alt={user.fullName}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400 text-xl" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-custom truncate">{user.fullName}</h3>
          <div className="flex items-center mt-1">
            {getRoleIcon(user.role)}
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <FaEnvelope className="mr-2 text-gray-400" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center">
          <FaGraduationCap className="mr-2 text-gray-400" />
          <span className="truncate">{user.department} • {user.passingYear}</span>
        </div>
        {user.currentJobTitle && (
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-gray-400" />
            <span className="truncate">{user.currentJobTitle}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onView}
          className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
        >
          <FaEye className="mr-2" />
          View Details
        </button>
      </div>
    </div>
  </div>
);

const ReportCard = ({ icon, title, description, actions }) => (
  <div className="bg-secondary rounded-lg p-6">
    <div className="flex items-center mb-4">
      <div className="text-2xl text-gray-600 mr-4">{icon}</div>
      <div>
        <h4 className="font-semibold text-custom">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <div className="space-y-2">
      {actions.map((action, index) => {
        const colorClasses = {
          green: 'bg-green-600 hover:bg-green-700',
          primary: 'bg-primary hover:bg-primary-dark',
          accent: 'bg-accent hover:bg-red-700',
          purple: 'bg-purple-600 hover:bg-purple-700',
        };
        
        return (
          <button
            key={index}
            onClick={action.action}
            className={`w-full px-4 py-2 ${colorClasses[action.color]} text-white rounded-lg transition duration-300`}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  </div>
);

// User Details Modal
const UserDetailsModal = ({ user, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-custom">Alumni Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition duration-300"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div>
              <h4 className="text-lg font-semibold text-custom mb-4 flex items-center">
                <FaUser className="mr-2 text-primary" />
                Personal Information
              </h4>
              <div className="space-y-3">
                <DetailRow label="Full Name" value={user.fullName} />
                <DetailRow label="Email" value={user.email} />
                <DetailRow label="Phone" value={user.phoneNumber} />
                <DetailRow label="Date of Birth" value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'} />
                <DetailRow label="Gender" value={user.gender || 'Not provided'} />
                <DetailRow label="Current City" value={user.currentCity || 'Not provided'} />
                <DetailRow label="Current Country" value={user.currentCountry || 'Not provided'} />
              </div>
            </div>

            {/* Academic Information */}
            <div>
              <h4 className="text-lg font-semibold text-custom mb-4 flex items-center">
                <FaGraduationCap className="mr-2 text-green-600" />
                Academic Information
              </h4>
              <div className="space-y-3">
                <DetailRow label="College" value={user.college} />
                <DetailRow label="Department" value={user.department} />
                <DetailRow label="Course" value={user.course} />
                <DetailRow label="Year of Joining" value={user.yearOfJoining} />
                <DetailRow label="Graduation Year" value={user.passingYear} />
                <DetailRow label="Admission Type" value={user.admissionInFirstYear ? 'Direct (First Year)' : 'Lateral Entry'} />
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h4 className="text-lg font-semibold text-custom mb-4 flex items-center">
                <FaBriefcase className="mr-2 text-purple-600" />
                Professional Information
              </h4>
              <div className="space-y-3">
                <DetailRow label="Job Title" value={user.currentJobTitle || 'Not provided'} />
                <DetailRow label="Company" value={user.currentCompany || 'Not provided'} />
                <DetailRow label="Work Experience" value={user.workExperience || 'Not provided'} />
                <DetailRow label="Skills" value={user.skills || 'Not provided'} />
                <DetailRow label="Mentorship Available" value={user.mentorshipAvailable ? 'Yes' : 'No'} />
                <DetailRow label="Looking for Mentor" value={user.lookingForMentor ? 'Yes' : 'No'} />
              </div>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="text-lg font-semibold text-custom mb-4 flex items-center">
                <FaGlobe className="mr-2 text-accent" />
                Contact & Social
              </h4>
              <div className="space-y-3">
                <DetailRow label="WhatsApp" value={user.whatsappNumber || 'Not provided'} />
                <DetailRow label="LinkedIn" value={user.linkedinProfile || 'Not provided'} />
                <DetailRow label="Personal Website" value={user.personalWebsite || 'Not provided'} />
                <DetailRow label="GitHub" value={user.githubProfile || 'Not provided'} />
                <DetailRow label="Member Since" value={new Date(user.createdAt).toLocaleDateString()} />
                <DetailRow label="Last Updated" value={new Date(user.updatedAt).toLocaleDateString()} />
              </div>
            </div>
          </div>

          {/* Bio Section */}
          {user.bio && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-custom mb-4 flex items-center">
                <FaBook className="mr-2 text-indigo-600" />
                Bio
              </h4>
              <div className="bg-secondary rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-start">
    <span className="text-sm font-medium text-gray-600 w-1/3">{label}:</span>
    <span className="text-sm text-custom w-2/3 text-right break-words">{value}</span>
  </div>
);

export default AdminDashboard;
