import React from 'react';
import NewsFeed from '../components/NewsFeed';
import Footer from '../components/Footer';

const NewsEventsPage = () => {
  return (
    <div className="min-h-screen bg-secondary">
      <NewsFeed />
      <Footer />
    </div>
  );
};

export default NewsEventsPage;