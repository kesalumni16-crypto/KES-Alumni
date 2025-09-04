import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FaUsers, FaUserShield, FaUserTie, FaGraduationCap, FaSearch,
  FaEdit, FaEye, FaChartBar, FaCalendarAlt, FaBuilding, FaBook, FaTimes,
  FaDownload, FaFilter, FaSort, FaUserPlus, FaEnvelope, FaPhone,
  FaMapMarkerAlt, FaBriefcase, FaAward, FaHeart, FaGlobe, FaCog,
  FaFileExport, FaPrint, FaSync, FaCheckCircle, FaTimesCircle, FaUser,
  FaSpinner, FaExclamationTriangle, FaRefresh, FaSortUp, FaSortDown
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

// Constants
const ITEMS_PER_PAGE = 12;
const API_BASE_URL = 'https://kes-alumni-bhz1.vercel.app/api';

// Utility Functions
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [state, setState] = useState({
    users: [],
    stats: null,
    loading: true,
    error: null,
    selectedUser: null,
    showUserModal: false,
    showFilters: false,
    activeTab: 'overview'
  });

  const [searchState, setSearchState] = useState({
    searchTerm: '',
    filters: {
      role: '',
      department: '',
      passingYear: '',
      mentorshipAvailable: '',
      currentCity: '',
    },
    sortBy: 'createdAt',
    sortOrder: 'desc',
    currentPage: 1,
  });

  const [pagination, setPagination] = useState(null);

  // Memoized API configuration
  const apiConfig = useMemo(() => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  }), []);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchState(prev => ({ ...prev, searchTerm: term, currentPage: 1 }));
    }, 300),
    []
  );

  // Fetch users with error handling
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`, {
        ...apiConfig,
        params: {
          page: searchState.currentPage,
          limit: ITEMS_PER_PAGE,
          search: searchState.searchTerm,
          ...searchState.filters,
          sortBy: searchState.sortBy,
          sortOrder: searchState.sortOrder,
        },
      });
      
      setState(prev => ({ 
        ...prev, 
        users: response.data.users,
        error: null 
      }));
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch users',
        users: []
      }));
      toast.error('Failed to fetch users');
    }
  }, [apiConfig, searchState]);

  // Fetch stats with error handling
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, apiConfig);
      setState(prev => ({ 
        ...prev, 
        stats: response.data.stats,
        error: null 
      }));
    } catch (error) {
      console.error('Error fetching stats:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to fetch statistics'
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [apiConfig]);

  // Initial data fetch
  useEffect(() => {
    if (user && ['ADMIN', 'SUPERADMIN'].includes(user.role)) {
      fetchUsers();
      fetchStats();
    }
  }, [user, fetchUsers, fetchStats]);

  // Refresh data
  const refreshData = useCallback(() => {
    setState(prev => ({ ...prev, loading: true }));
    fetchUsers();
    fetchStats();
  }, [fetchUsers, fetchStats]);

  // Handle filter changes
  const handleFilterChange = useCallback((key, value) => {
    setSearchState(prev => ({
      ...prev,
      filters: { ...prev.filters, [key]: value },
      currentPage: 1
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchState(prev => ({
      ...prev,
      filters: {
        role: '',
        department: '',
        passingYear: '',
        mentorshipAvailable: '',
        currentCity: '',
      },
      searchTerm: '',
      currentPage: 1
    }));
  }, []);

  // Export data with improved error handling
  const exportData = useCallback(async (format) => {
    const loadingToast = toast.loading(`Exporting ${format.toUpperCase()} file...`);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/export`, {
        ...apiConfig,
        params: { 
          format, 
          ...searchState.filters, 
          search: searchState.searchTerm 
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `alumni_data_${new Date().toISOString().split('T')[0]}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success(`Data exported as ${format.toUpperCase()}`, { id: loadingToast });
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data', { id: loadingToast });
    }
  }, [apiConfig, searchState.filters, searchState.searchTerm]);

  // Memoized utility functions
  const getRoleColor = useCallback((role) => {
    const colorMap = {
      SUPERADMIN: 'bg-red-100 text-red-800',
      ADMIN: 'bg-blue-100 text-blue-800',
      ALUMNI: 'bg-green-100 text-green-800',
    };
    return colorMap[role] || 'bg-gray-100 text-gray-800';
  }, []);

  const getRoleIcon = useCallback((role) => {
    const iconMap = {
      SUPERADMIN: <FaUserShield className="text-red-600" />,
      ADMIN: <FaUserTie className="text-blue-600" />,
      ALUMNI: <FaGraduationCap className="text-green-600" />,
    };
    return iconMap[role] || <FaUsers className="text-gray-600" />;
  }, []);

  // Handle user selection
  const handleUserSelect = useCallback((user) => {
    setState(prev => ({
      ...prev,
      selectedUser: user,
      showUserModal: true
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedUser: null,
      showUserModal: false
    }));
  }, []);

  // Toggle filters
  const toggleFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      showFilters: !prev.showFilters
    }));
  }, []);

  // Handle search input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    debouncedSearch(value);
  }, [debouncedSearch]);

  // Handle sort changes
  const handleSortChange = useCallback((field) => {
    setSearchState(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      currentPage: 1
    }));
  }, []);

  // Tab navigation
  const tabs = useMemo(() => [
    { id: 'overview', label: 'Overview', icon: <FaChartBar /> },
    { id: 'users', label: 'User Management', icon: <FaUsers /> },
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'reports', label: 'Reports', icon: <FaFileExport /> },
  ], []);

  // Loading state
  if (state.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Enhanced Header */}
        <HeaderSection 
          onExport={exportData}
          onToggleFilters={toggleFilters}
          onRefresh={refreshData}
          showFilters={state.showFilters}
        />

        {/* Error Display */}
        {state.error && (
          <ErrorAlert message={state.error} onRetry={refreshData} />
        )}

        {/* Tab Navigation */}
        <TabNavigation 
          tabs={tabs}
          activeTab={state.activeTab}
          onTabChange={(tab) => setState(prev => ({ ...prev, activeTab: tab }))}
        />

        {/* Tab Content */}
        <TabContent
          activeTab={state.activeTab}
          stats={state.stats}
          users={state.users}
          pagination={pagination}
          searchState={searchState}
          showFilters={state.showFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={clearFilters}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
          onPageChange={(page) => setSearchState(prev => ({ ...prev, currentPage: page }))}
          onUserSelect={handleUserSelect}
          onExport={exportData}
          getRoleColor={getRoleColor}
          getRoleIcon={getRoleIcon}
        />
      </div>

      {/* User Details Modal */}
      {state.showUserModal && state.selectedUser && (
        <UserDetailsModal
          user={state.selectedUser}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

// Enhanced Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
      <p className="mt-6 text-gray-600 text-lg">Loading Admin Dashboard...</p>
      <p className="mt-2 text-gray-500 text-sm">Please wait while we fetch the data</p>
    </div>
  </div>
);

// Enhanced Header Section
const HeaderSection = ({ onExport, onToggleFilters, onRefresh, showFilters }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
      <div className="mb-4 lg:mb-0">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
          <FaUserTie className="text-blue-600 mr-3" />
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-2">Manage alumni network and view analytics</p>
      </div>
      
      <div className="flex flex-wrap gap-3">
        <ActionButton
          onClick={onRefresh}
          icon={<FaRefresh />}
          text="Refresh"
          variant="secondary"
        />
        <ActionButton
          onClick={() => onExport('csv')}
          icon={<FaDownload />}
          text="Export CSV"
          variant="success"
        />
        <ActionButton
          onClick={() => onExport('json')}
          icon={<FaFileExport />}
          text="Export JSON"
          variant="primary"
        />
        <ActionButton
          onClick={onToggleFilters}
          icon={<FaFilter />}
          text={showFilters ? 'Hide Filters' : 'Show Filters'}
          variant="secondary"
          active={showFilters}
        />
      </div>
    </div>
  </div>
);

// Reusable Action Button Component
const ActionButton = ({ onClick, icon, text, variant = 'primary', active = false }) => {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: `${active ? 'bg-gray-700' : 'bg-gray-600'} hover:bg-gray-700 text-white`,
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${variants[variant]} shadow-sm hover:shadow-md`}
    >
      <span className="mr-2">{icon}</span>
      {text}
    </button>
  );
};

// Error Alert Component
const ErrorAlert = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <FaExclamationTriangle className="text-red-500 mr-3" />
        <span className="text-red-700 font-medium">{message}</span>
      </div>
      <button
        onClick={onRetry}
        className="text-red-600 hover:text-red-800 underline"
      >
        Retry
      </button>
    </div>
  </div>
);

// Enhanced Tab Navigation
const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="bg-white rounded-xl shadow-lg mb-8 border border-gray-100">
    <div className="border-b border-gray-200">
      <nav className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 ${
              activeTab === tab.id
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

// Main Tab Content Router
const TabContent = ({ activeTab, ...props }) => {
  const components = {
    overview: <OverviewTab stats={props.stats} />,
    users: <UsersTab {...props} />,
    analytics: <AnalyticsTab stats={props.stats} />,
    reports: <ReportsTab onExport={props.onExport} />,
  };

  return components[activeTab] || null;
};

// Loading State Component
const LoadingState = ({ message = "Loading..." }) => (
  <div className="bg-white rounded-lg shadow-md p-8 text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
    <p className="mt-4 text-gray-600">{message}</p>
  </div>
);

// Enhanced Overview Tab
const OverviewTab = ({ stats }) => {
  if (!stats) {
    return <LoadingState message="Loading statistics..." />;
  }

  const statCards = [
    {
      icon: <FaUsers className="text-blue-600 text-2xl" />,
      title: "Total Alumni",
      value: stats.totalUsers,
      subtitle: "Verified members",
      color: "blue",
      trend: "+12% from last month"
    },
    {
      icon: <FaUserPlus className="text-green-600 text-2xl" />,
      title: "New This Month",
      value: stats.recentRegistrations,
      subtitle: "Recent registrations",
      color: "green",
      trend: "This month"
    },
    {
      icon: <FaHeart className="text-purple-600 text-2xl" />,
      title: "Mentors",
      value: stats.mentorsCount || 0,
      subtitle: "Available mentors",
      color: "purple",
      trend: "Active now"
    },
    {
      icon: <FaGlobe className="text-orange-600 text-2xl" />,
      title: "Countries",
      value: stats.countriesCount || 0,
      subtitle: "Global presence",
      color: "orange",
      trend: "Worldwide reach"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <EnhancedStatCard key={index} {...stat} />
        ))}
      </div>

      <QuickActionsSection />
      <RecentActivitySection stats={stats} />
    </div>
  );
};

// Enhanced Stat Card with animations and trends
const EnhancedStatCard = ({ icon, title, value, subtitle, color, trend }) => {
  const colorClasses = {
    blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:from-blue-100 hover:to-blue-150',
    green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:from-green-100 hover:to-green-150',
    purple: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:from-purple-100 hover:to-purple-150',
    orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:from-orange-100 hover:to-orange-150',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-full bg-white shadow-sm">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-900">
            {value?.toLocaleString() || '0'}
          </p>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
        <p className="text-xs text-gray-600 mb-2">{subtitle}</p>
        <p className="text-xs text-gray-500">{trend}</p>
      </div>
    </div>
  );
};

// Quick Actions Section
const QuickActionsSection = () => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
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
        color="blue"
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
);

const QuickActionCard = ({ icon, title, description, action, color }) => {
  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700',
    purple: 'bg-purple-600 hover:bg-purple-700',
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-300 cursor-pointer" onClick={action}>
      <div className="flex items-center mb-3">
        <div className={`${colorClasses[color]} text-white p-3 rounded-lg mr-4`}>
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Section
const RecentActivitySection = ({ stats }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
      <FaCalendarAlt className="mr-2 text-gray-600" />
      Recent Activity
    </h3>
    <div className="space-y-4">
      <ActivityItem
        icon={<FaUserPlus className="text-green-600" />}
        title="New Registration"
        description={`${stats?.recentRegistrations || 0} new alumni registered this month`}
        time="Updated recently"
      />
      <ActivityItem
        icon={<FaEdit className="text-blue-600" />}
        title="Profile Updates"
        description="Alumni updating their profiles regularly"
        time="Ongoing"
      />
      <ActivityItem
        icon={<FaHeart className="text-purple-600" />}
        title="Mentorship"
        description={`${stats?.mentorsCount || 0} mentors available for guidance`}
        time="Active now"
      />
    </div>
  </div>
);

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-center p-4 bg-gray-50 rounded-lg">
    <div className="mr-4">{icon}</div>
    <div className="flex-1">
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

// Enhanced Users Tab
const UsersTab = ({
  users, pagination, searchState, showFilters, onFilterChange, onClearFilters,
  onSearchChange, onSortChange, onPageChange, onUserSelect, getRoleColor, getRoleIcon
}) => {
  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filter Section */}
      <SearchAndFilterSection
        searchState={searchState}
        showFilters={showFilters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
      />

      {/* Users Grid with improved cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <EnhancedUserCard
            key={user.id}
            user={user}
            onView={() => onUserSelect(user)}
            getRoleColor={getRoleColor}
            getRoleIcon={getRoleIcon}
          />
        ))}
      </div>

      {/* Enhanced Empty State */}
      {users.length === 0 && <EmptyState />}

      {/* Enhanced Pagination */}
      {pagination && pagination.totalUsers > 0 && (
        <EnhancedPagination
          pagination={pagination}
          currentPage={searchState.currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

// Search and Filter Section
const SearchAndFilterSection = ({
  searchState, showFilters, onFilterChange, onClearFilters, onSearchChange, onSortChange
}) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex flex-col lg:flex-row gap-4 mb-4">
      <div className="flex-1">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or company..."
            onChange={onSearchChange}
            className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <SortDropdown
          sortBy={searchState.sortBy}
          sortOrder={searchState.sortOrder}
          onSortChange={onSortChange}
        />
      </div>
    </div>

    {/* Advanced Filters */}
    {showFilters && (
      <FilterSection
        filters={searchState.filters}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
      />
    )}
  </div>
);

// Sort Dropdown Component
const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => (
  <div className="flex gap-2">
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="createdAt">Sort by Join Date</option>
      <option value="fullName">Sort by Name</option>
      <option value="passingYear">Sort by Graduation</option>
      <option value="department">Sort by Department</option>
    </select>
    <button
      onClick={() => onSortChange(sortBy)}
      className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition duration-300"
    >
      {sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />}
    </button>
  </div>
);

// Filter Section Component
const FilterSection = ({ filters, onFilterChange, onClearFilters }) => (
  <div className="border-t border-gray-200 pt-4">
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <select
        value={filters.role}
        onChange={(e) => onFilterChange('role', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        onChange={(e) => onFilterChange('department', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="number"
        placeholder="Graduation Year"
        value={filters.passingYear}
        onChange={(e) => onFilterChange('passingYear', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        value={filters.mentorshipAvailable}
        onChange={(e) => onFilterChange('mentorshipAvailable', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Mentorship</option>
        <option value="true">Available as Mentor</option>
        <option value="false">Not Available</option>
      </select>
      <input
        type="text"
        placeholder="Current City"
        value={filters.currentCity}
        onChange={(e) => onFilterChange('currentCity', e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="mt-4 flex justify-end">
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300"
      >
        Clear Filters
      </button>
    </div>
  </div>
);

// Enhanced User Card
const EnhancedUserCard = ({ user, onView, getRoleColor, getRoleIcon }) => (
  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-300">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4 overflow-hidden">
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
          <h3 className="font-semibold text-gray-800 truncate">{user.fullName}</h3>
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
          <FaEnvelope className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center">
          <FaGraduationCap className="mr-2 text-gray-400 flex-shrink-0" />
          <span className="truncate">{user.department} • {user.passingYear}</span>
        </div>
        {user.currentJobTitle && (
          <div className="flex items-center">
            <FaBriefcase className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{user.currentJobTitle}</span>
          </div>
        )}
        {user.currentCity && (
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{user.currentCity}</span>
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <button
          onClick={onView}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <FaEye className="mr-2" />
          View Details
        </button>
      </div>
    </div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="col-span-full bg-white rounded-lg shadow-md p-12 text-center">
    <FaUsers className="text-gray-400 text-6xl mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Users Found</h3>
    <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
  </div>
);

// Enhanced Pagination Component
const EnhancedPagination = ({ pagination, currentPage, onPageChange }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="text-sm text-gray-700">
        Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, pagination.totalUsers)} of {pagination.totalUsers} users
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-300"
        >
          Previous
        </button>
        
        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-2 text-sm rounded-md transition duration-300 ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition duration-300"
        >
          Next
        </button>
      </div>
    </div>
  </div>
);

// Analytics Tab Component
const AnalyticsTab = ({ stats }) => {
  if (!stats) {
    return <LoadingState message="Loading analytics..." />;
  }

  return (
    <div className="space-y-8">
      {/* Department Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaBuilding className="mr-2 text-blue-600" />
            Department Distribution
          </h3>
          <div className="space-y-3">
            {stats.departmentStats?.map((dept, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{dept.department}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(dept.count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{dept.count}</span>
                </div>
              </div>
            )) || (
              <p className="text-gray-500 text-center py-4">No department data available</p>
            )}
          </div>
        </div>

        {/* Graduation Year Analytics */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-green-600" />
            Graduation Years
          </h3>
          <div className="space-y-3">
            {stats.yearStats?.map((year, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{year.year}</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(year.count / stats.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{year.count}</span>
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
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaGlobe className="mr-2 text-purple-600" />
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.locationStats?.map((location, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800">{location.city || 'Unknown City'}</p>
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
const ReportsTab = ({ onExport }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Generate Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard
            icon={<FaUsers />}
            title="Alumni Directory"
            description="Complete list of all verified alumni with contact information"
            actions={[
              { label: 'Export CSV', action: () => onExport('csv'), color: 'green' },
              { label: 'Export JSON', action: () => onExport('json'), color: 'blue' },
            ]}
          />
          <ReportCard
            icon={<FaChartBar />}
            title="Analytics Report"
            description="Detailed analytics including demographics and trends"
            actions={[
              { label: 'Generate PDF', action: () => toast.info('Feature coming soon'), color: 'red' },
              { label: 'View Online', action: () => toast.info('Feature coming soon'), color: 'blue' },
            ]}
          />
          <ReportCard
            icon={<FaHeart />}
            title="Mentorship Report"
            description="List of available mentors and mentorship connections"
            actions={[
              { label: 'Export CSV', action: () => onExport('csv'), color: 'green' },
              { label: 'Email Report', action: () => toast.info('Feature coming soon'), color: 'purple' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

const ReportCard = ({ icon, title, description, actions }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex items-center mb-4">
      <div className="text-2xl text-gray-600 mr-4">{icon}</div>
      <div>
        <h4 className="font-semibold text-gray-800">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
    <div className="space-y-2">
      {actions.map((action, index) => {
        const colorClasses = {
          green: 'bg-green-600 hover:bg-green-700',
          blue: 'bg-blue-600 hover:bg-blue-700',
          red: 'bg-red-600 hover:bg-red-700',
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
          <h3 className="text-xl font-semibold text-gray-800">Alumni Details</h3>
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaUser className="mr-2 text-blue-600" />
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaGlobe className="mr-2 text-orange-600" />
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
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FaBook className="mr-2 text-indigo-600" />
                Bio
              </h4>
              <div className="bg-gray-50 rounded-lg p-4">
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
    <span className="text-sm text-gray-900 w-2/3 text-right break-words">{value}</span>
  </div>
);

export default AdminDashboard;
