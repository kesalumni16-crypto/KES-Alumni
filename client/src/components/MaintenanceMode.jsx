import React from 'react';
import { FaTools, FaCog, FaExclamationTriangle } from 'react-icons/fa';

const MaintenanceMode = ({ message }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-center">
          <div className="relative">
            <FaTools className="text-white text-6xl mx-auto mb-4 animate-bounce" />
            <div className="absolute -top-2 -right-2">
              <FaCog className="text-yellow-300 text-2xl animate-spin" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">System Maintenance</h1>
          <p className="text-orange-100">We're making improvements</p>
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="mb-6">
            <FaExclamationTriangle className="text-yellow-500 text-3xl mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Temporarily Unavailable</h2>
            <p className="text-gray-600 leading-relaxed">
              {message || 'Our system is currently under maintenance. We are working hard to improve your experience and will be back online shortly.'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">What's happening?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• System updates and improvements</li>
              <li>• Database optimization</li>
              <li>• Security enhancements</li>
              <li>• Performance improvements</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Expected downtime: <span className="font-medium text-gray-700">30-60 minutes</span>
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium"
            >
              Check Again
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t">
          <p className="text-xs text-gray-500">
            For urgent matters, contact: <a href="mailto:admin@kes.edu.in" className="text-blue-600 hover:underline">admin@kes.edu.in</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;