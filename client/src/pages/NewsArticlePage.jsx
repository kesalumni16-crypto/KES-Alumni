import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FaArrowLeft, FaCalendarAlt, FaUser, FaTag, FaClock, FaShare,
  FaFacebook, FaTwitter, FaLinkedin, FaCopy, FaThumbtack
} from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';

const NewsArticlePage = () => {
  const { articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);

  useEffect(() => {
    fetchArticle();
    fetchRelatedArticles();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news/${articleId}`);
      setArticle(response.data.article);
    } catch (error) {
      console.error('Error fetching article:', error);
      toast.error('Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedArticles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/news`, {
        params: { limit: 3 }
      });
      setRelatedArticles(response.data.articles.filter(a => a.id !== parseInt(articleId)));
    } catch (error) {
      console.error('Error fetching related articles:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const shareArticle = (platform) => {
    const url = window.location.href;
    const title = article.title;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-custom">Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-secondary py-8">
        <div className="container mx-auto px-6">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-custom mb-4">Article Not Found</h2>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/news-events"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-6 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            to="/news-events"
            className="inline-flex items-center text-primary hover:text-primary-dark font-medium transition duration-300"
          >
            <FaArrowLeft className="mr-2" />
            Back to News
          </Link>
        </div>

        {/* Article */}
        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Hero Image */}
          {article.imageUrl && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Pinned indicator */}
              {article.isPinned && (
                <div className="absolute top-6 right-6 bg-accent text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
                  <FaThumbtack className="mr-2" />
                  Pinned Article
                </div>
              )}
              
              {/* Category badge */}
              <div className="absolute bottom-6 left-6">
                <span className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium capitalize">
                  {article.category.replace('-', ' ')}
                </span>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <FaCalendarAlt className="mr-2" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2" />
                {Math.ceil(article.content.split(' ').length / 200)} min read
              </div>
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
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
                <span>{article.author.fullName}</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full capitalize">
                  {article.author.role.toLowerCase()}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-custom mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-secondary text-primary text-sm rounded-full"
                  >
                    <FaTag className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
              <span className="text-sm font-medium text-custom flex items-center">
                <FaShare className="mr-2" />
                Share:
              </span>
              <button
                onClick={() => shareArticle('facebook')}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-sm"
              >
                <FaFacebook className="mr-1" />
                Facebook
              </button>
              <button
                onClick={() => shareArticle('twitter')}
                className="flex items-center px-3 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition duration-300 text-sm"
              >
                <FaTwitter className="mr-1" />
                Twitter
              </button>
              <button
                onClick={() => shareArticle('linkedin')}
                className="flex items-center px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition duration-300 text-sm"
              >
                <FaLinkedin className="mr-1" />
                LinkedIn
              </button>
              <button
                onClick={() => shareArticle('copy')}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 text-sm"
              >
                <FaCopy className="mr-1" />
                Copy Link
              </button>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-custom mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link
                  key={relatedArticle.id}
                  to={`/news/${relatedArticle.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {relatedArticle.imageUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedArticle.imageUrl}
                        alt={relatedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <FaCalendarAlt className="mr-2" />
                      {formatDate(relatedArticle.publishedAt)}
                    </div>
                    <h3 className="text-lg font-semibold text-custom group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    {relatedArticle.excerpt && (
                      <p className="text-gray-600 mt-2 text-sm line-clamp-3">
                        {relatedArticle.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default NewsArticlePage;