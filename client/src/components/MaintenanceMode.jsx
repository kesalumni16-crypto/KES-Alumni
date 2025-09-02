import React from 'react';
import { FaTools, FaCog, FaExclamationTriangle } from 'react-icons/fa';

const ACCENT = '#DC2626';

const MaintenanceMode = ({ message }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden border border-white/10 bg-white">
        {/* Header */}
        <header className="p-8 text-center" style={{ backgroundColor: ACCENT }}>
          <div className="relative inline-block">
            {/* Use black for contrast on the bright accent */}
            <FaTools className="text-black text-6xl mx-auto mb-4" aria-hidden="true" />
            <div className="absolute -top-1 -right-2">
              <FaCog
                className="text-black/80 text-2xl motion-safe:animate-spin motion-reduce:animate-none"
                style={{ animationDuration: '3s' }}
                aria-hidden="true"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-black">System Maintenance</h1>
          <p className="text-black/80 mt-1">We’re making improvements</p>
        </header>

        {/* Content */}
        <main className="p-8 text-center">
          <div className="mb-6">
            <FaExclamationTriangle
              className="text-3xl mx-auto mb-4"
              style={{ color: ACCENT }}
              aria-hidden="true"
            />
            <h2 className="text-xl font-semibold text-black mb-3">Temporarily Unavailable</h2>
            <p className="text-black/80 leading-relaxed">
              {message ||
                'Our system is currently under maintenance. We are working to improve your experience and will be back online shortly.'}
            </p>

            {/* Live region for assistive tech */}
            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              Maintenance in progress. Some services are temporarily unavailable.
            </p>
          </div>

          {/* Status list */}
          <div className="bg-white rounded-lg p-5 mb-6 text-left border border-black/10">
            <h3 className="text-sm font-semibold text-black mb-2">What’s happening?</h3>
            <ul className="text-sm text-black/80 space-y-1 list-disc pl-5">
              <li>System updates and improvements</li>
              <li>Database optimization</li>
              <li>Security enhancements</li>
              <li>Performance improvements</li>
            </ul>
          </div>

          {/* ETA and CTA */}
          <div className="text-center">
            <p className="text-sm text-black/70 mb-4">
              Expected downtime: <span className="font-medium text-black">30–60 minutes</span>
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white hover:brightness-95"
              style={{ backgroundColor: ACCENT, color: '#000', boxShadow: 'none' }}
            >
              Check Again
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 text-center border-t border-black/10 bg-white">
          <p className="text-xs text-black/70">
            For urgent matters, contact{' '}
            <a
              href="mailto:admin@kes.edu.in"
              className="hover:underline"
              style={{ color: ACCENT }}
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
