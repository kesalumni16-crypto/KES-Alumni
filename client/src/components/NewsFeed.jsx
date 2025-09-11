import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaNewspaper, FaCalendarAlt, FaUser, FaTag, FaSearch, FaFilter,
  FaChevronLeft, FaChevronRight, FaEye, FaClock, FaThumbtack
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';

const NewsFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    tags: '',
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General' },
    { value: 'events', label: 'Events' },
    { value: 'achievements', label: 'Achievements' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'alumni-spotlight', label: 'Alumni Spotlight' },
    { value: 'career', label: 'Career' },
    { value: 'education', label: 'Education' },
  ];

  useEffect(() => {
    fetchArticles();
  }, [currentPage, filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: {
          page: currentPage,
          limit: 12,
          ...filters,
        },
      });
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast.error('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: '', search: '', tags: '' });
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-custom">Loading news articles...</p>
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
                <FaNewspaper className="text-primary mr-3" />
                News & Events
              </h1>
              <p className="text-gray-600 mt-2">Stay updated with the latest news, events, and announcements</p>
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

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Search</label>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-custom mb-2">Tags</label>
                <input
                  type="text"
                  placeholder="Enter tags (comma-separated)"
                  value={filters.tags}
                  onChange={(e) => handleFilterChange('tags', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
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

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaNewspaper className="text-gray-400 text-6xl mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-custom mb-2">No Articles Found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or check back later for new content.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalArticles > 0 && (
          <div className="bg-white rounded-lg shadow-md p-4 mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-custom">
                Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, pagination.totalArticles)} of {pagination.totalArticles} articles
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition duration-300"
                >
                  <FaChevronLeft className="mr-1" />
                  Previous
                </button>
                <span className="px-3 py-2 text-sm text-custom">
                  Page {currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary transition duration-300"
                >
                  Next
                  <FaChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ArticleCard = ({ article }) => {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image */}
      {article.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
            <FaNewspaper className="text-gray-400 text-4xl" />
          </div>
          
          {/* Pinned indicator */}
          {article.isPinned && (
            <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <FaThumbtack className="mr-1" />
              Pinned
            </div>
          )}
          
          {/* Category badge */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium capitalize">
              {article.category.replace('-', ' ')}
            </span>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-sm text-gray-500">
            <FaCalendarAlt className="mr-2" />
            {formatDate(article.publishedAt)}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-1" />
            {Math.ceil(article.content.split(' ').length / 200)} min read
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-custom mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
          {article.title}
        </h2>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {article.excerpt || truncateText(article.content.replace(/<[^>]*>/g, ''))}
        </p>
        
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 bg-secondary text-primary text-xs rounded-full"
              >
                <FaTag className="mr-1" />
                {tag}
              </span>
            ))}
            {article.tags.length > 3 && (
              <span className="text-xs text-gray-500">+{article.tags.length - 3} more</span>
            )}
          </div>
        )}
        
        {/* Author and Read More */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
              {article.author.profilePhoto ? (
                <img
                  src={article.author.profilePhoto}
                  alt={article.author.fullName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <FaUser className="text-gray-400 text-sm" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-custom">{article.author.fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{article.author.role.toLowerCase()}</p>
            </div>
          </div>
          
          <Link
            to={`/news/${article.id}`}
            className="flex items-center text-primary hover:text-primary-dark font-medium text-sm transition-colors duration-300"
          >
            <FaEye className="mr-1" />
            Read More
          </Link>
        </div>
      </div>
    </article>
  );
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const truncateText = (text, maxLength = 150) => {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export default NewsFeed;