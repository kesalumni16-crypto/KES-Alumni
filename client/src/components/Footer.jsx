import React from 'react';

const Footer = () => (
  <footer className="bg-gray-800 text-white py-6 mt-8">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
      <div className="mb-2 md:mb-0">
        <span className="font-bold">Alumni Portal</span> &copy; {new Date().getFullYear()} All rights reserved.
      </div>
      <div className="flex space-x-4">
        <a href="/" className="hover:underline">Home</a>
        <a href="/profile" className="hover:underline">Profile</a>
        <a href="/about" className="hover:underline">About</a>
        <a href="/contact" className="hover:underline">Contact</a>
      </div>
    </div>
  </footer>
);

export default Footer;
