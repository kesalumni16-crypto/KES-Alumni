import React from 'react';
import { FaTools, FaCog, FaExclamationTriangle } from 'react-icons/fa';

const MaintenanceMode = ({ message }) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-gray-200 bg-white">
        {/* Header */}
        <header className="p-8 text-center bg-primary">
          <div className="relative inline-block">
            <FaTools className="text-white text-6xl mx-auto mb-4" aria-hidden="true" />
            <div className="absolute -top-1 -right-2">
              <FaCog
                className="text-white/80 text-2xl motion-safe:animate-spin motion-reduce:animate-none"
                style={{ animationDuration: '3s' }}
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">System Maintenance</h1>
          <p className="text-white/90 mt-1">We're making improvements</p>
        </header>

        {/* Content */}
        <main className="p-8 text-center">
          <div className="mb-6">
            <FaExclamationTriangle
              className="text-3xl mx-auto mb-4 text-primary"
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-custom mb-3">Temporarily Unavailable</h2>
            <p className="text-gray-600 leading-relaxed">
              {message ||
                'Our system is currently under maintenance. We are working to improve your experience and will be back online shortly.'}
            </p>

            {/* Live region for assistive tech */}
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              Maintenance in progress. Some services are temporarily unavailable.
            </p>
          </div>

          {/* Status list */}
          <div className="bg-secondary rounded-lg p-5 mb-6 text-left border border-gray-200">
            <h3 className="text-sm font-semibold text-custom mb-2">What's happening?</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>System updates and improvements</li>
              <li>Database optimization</li>
              <li>Security enhancements</li>
              <li>Performance improvements</li>
            </ul>
          </div>

          {/* ETA and CTA */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Expected downtime: <span className="font-medium text-custom">30–60 minutes</span>
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:bg-primary-dark bg-primary text-white"
            >
              Check Again
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 text-center border-t border-gray-200 bg-white">
          <p className="text-xs text-gray-500">
            For urgent matters, contact{' '}
            <a
              href="mailto:admin@kes.edu.in"
              className="hover:underline text-primary hover:opacity-80"
            >
              admin@kes.edu.in
            </a>
            .
          </p>
        </footer>
      </div>
    </div>
  );
};

export default MaintenanceMode;
