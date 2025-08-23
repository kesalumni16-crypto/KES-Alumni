import React, { useState, useEffect } from 'react';
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (showTerms) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showTerms]);

  const TermsModal = () => (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => setShowTerms(false)}
      />

      {/* Modal panel */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-xl flex flex-col max-h-[90vh]">
          {/* Sticky header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center rounded-t-lg z-10">
            <h2 className="text-2xl font-bold text-gray-800">
              KES Alumni Portal – Terms and Conditions
            </h2>
            <button
              onClick={() => setShowTerms(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
              aria-label="Close terms and conditions"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Scrollable content area */}
          <div className="p-6 overflow-y-auto flex-1">
            <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Acceptance of Terms</h3>
            <p className="mb-4">
              By accessing or using the KES Alumni Portal ("Portal"), the website, or related services (together, "Services"),
              the user ("Member," "you") agrees to these Terms & Conditions ("Terms") and our Privacy Policy.
            </p>
            <p className="mb-6">If you do not agree, do not access or use the Services.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Eligibility and Account</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Eligibility:</strong> Membership is limited to alumni, current/former staff, and invited stakeholders of Kandivli Education Society/KES, subject to verification.</li>
              <li><strong>Account Registration:</strong> You must provide accurate, current, and complete information and keep it updated.</li>
              <li><strong>Account Security:</strong> You are responsible for all activities under your account and must keep credentials confidential. Notify us immediately of suspected unauthorized use.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Permitted Use</h3>
            <p className="mb-2"><strong>Personal and Non-Commercial:</strong> The Portal is intended to support alumni networking, mentoring, events, fundraising, and institutional engagement. Use is strictly personal and non-commercial unless expressly authorized in writing.</p>
            <p className="mb-2"><strong>Prohibited Activities:</strong> You must not:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Violate any law or the rights of others.</li>
              <li>Harass, intimidate, defame, or discriminate against any person or group.</li>
              <li>Post or transmit harmful code, spam, or misleading/false information.</li>
              <li>Scrape, harvest, or misuse personal data of members.</li>
              <li>Attempt to bypass security or interfere with the Services' operation.</li>
              <li>Upload content you do not have the right to share (e.g., copyrighted materials, confidential data).</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Member Content and License</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Ownership:</strong> You retain ownership of content you submit ("Member Content").</li>
              <li><strong>License to KES:</strong> By submitting Member Content, you grant KES a worldwide, non-exclusive, royalty-free license to host, use, reproduce, display, and distribute such content solely to operate, promote, and improve the Services and alumni engagement.</li>
              <li><strong>Responsibility:</strong> You are solely responsible for your Member Content. Do not post confidential, sensitive, or infringing material.</li>
              <li><strong>Moderation:</strong> KES may review, remove, or restrict content or accounts at its discretion for violations or risks to Members or the institution.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy and Data Protection</h3>
            <p className="mb-2">We process personal data per our Privacy Policy and applicable data protection laws. Purposes include alumni verification, communications, event management, mentoring, fundraising, analytics, and institutional updates.</p>
            <p className="mb-2">Directories and discoverability settings may allow other Members to view your profile information. You can manage visibility preferences where features permit.</p>
            <p className="mb-4">Do not use member data for unauthorized marketing or scraping.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Communications</h3>
            <p className="mb-4">You consent to receive service, transactional, and alumni-related communications (e.g., newsletters, events, opportunities). You may opt-out of non-essential communications, except those necessary to operate your account or comply with law.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Intellectual Property</h3>
            <p className="mb-2">The Portal, including software, design, trademarks, and content (excluding Member Content), is owned by KES or its licensors and protected by IP laws.</p>
            <p className="mb-4">You may not reproduce, modify, distribute, or create derivative works without prior written consent, except for personal, fair, and non-commercial use permitted by law.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Code of Conduct</h3>
            <ul className="mb-4 list-disc pl-6">
              <li>Treat all Members with respect and professionalism.</li>
              <li>No bullying, hate speech, sexual harassment, or stalking.</li>
              <li>Respect cultural and personal boundaries at events and online.</li>
              <li>Report misconduct via our contact channels. KES may investigate and take appropriate action, including warnings, suspension, or termination.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Disclaimers</h3>
            <p className="mb-2">The Services are provided "as is" and "as available" without warranties of any kind, express or implied (including merchantability, fitness for a particular purpose, non-infringement).</p>
            <p className="mb-4">KES does not guarantee uninterrupted or error-free operation, accuracy of content, or the conduct of Members.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
            <p className="mb-2">To the maximum extent permitted by law, KES and its officers, employees, and agents shall not be liable for indirect, incidental, special, consequential, or punitive damages, loss of data, business, goodwill, or profits arising from or related to the Services or these Terms.</p>
            <p className="mb-4">In no event shall KES's total liability exceed the greater of: (a) the amount paid by you (if any) to use paid features in the 12 months preceding the claim, or (b) INR 10,000.</p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Governing Law and Dispute Resolution</h3>
            <ul className="mb-4 list-disc pl-6">
              <li><strong>Governing Law:</strong> These Terms are governed by the laws of State of Maharashtra, India, without regard to conflict of law principles.</li>
              <li><strong>Jurisdiction:</strong> Courts located in Mumbai, India shall have exclusive jurisdiction.</li>
              <li><strong>Informal Resolution:</strong> Contact our support team to attempt informal resolution before formal action.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact</h3>
            <div className="mb-4">
              <p><strong>Institution:</strong> Kandivli Education Society (KES)</p>
              <p><strong>Address:</strong> Kandivali, Mumbai, Maharashtra, India</p>
              <p><strong>Email:</strong> alumni@kes.edu.in</p>
              <p><strong>Phone:</strong> +91-22-XXXX-XXXX</p>
            </div>

            <p className="text-sm text-gray-600 mt-6 mb-4">
              These Terms and the Privacy Policy constitute the entire agreement between you and KES regarding the Services.
              If any provision is found unenforceable, the remainder will remain in effect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <footer className="bg-gray-800 text-white py-12 mt-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <FaGraduationCap className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">KES Alumni Portal</h3>
                  <p className="text-sm text-gray-300">Kandivli Education Society</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Connecting KES alumni worldwide since 1936. Join our community of over 20,000 graduates 
                and stay connected with your alma mater, fellow alumni, and exciting opportunities.
              </p>
              <div className="text-sm text-gray-400">
                <p>Established: 1936 | Serving: 20,000+ Students</p>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="text-gray-300 hover:text-white transition duration-300">Home</a></li>
                <li><a href="/about" className="text-gray-300 hover:text-white transition duration-300">About Us</a></li>
                <li><a href="/alumni-globe" className="text-gray-300 hover:text-white transition duration-300">Alumni Globe</a></li>
                <li><a href="/career" className="text-gray-300 hover:text-white transition duration-300">Career</a></li>
                <li><a href="/news-events" className="text-gray-300 hover:text-white transition duration-300">News/Events</a></li>
                <li><a href="/profile" className="text-gray-300 hover:text-white transition duration-300">Profile</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <FaMapMarkerAlt className="text-red-400 mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300">Kandivali, Mumbai</p>
                    <p className="text-gray-300">Maharashtra, India</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaEnvelope className="text-red-400 mr-3" />
                  <a href="mailto:alumni@kes.edu.in" className="text-gray-300 hover:text-white transition duration-300">
                    alumni@kes.edu.in
                  </a>
                </div>
                <div className="flex items-center">
                  <FaPhone className="text-red-400 mr-3" />
                  <a href="tel:+912222222222" className="text-gray-300 hover:text-white transition duration-300">
                    +91-22-XXXX-XXXX
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                <span className="font-semibold">KES Alumni Portal</span> &copy; {new Date().getFullYear()} Kandivli Education Society. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
                <button 
                  onClick={() => setShowTerms(true)}
                  className="text-gray-400 hover:text-white transition duration-300"
                >
                  Terms & Conditions
                </button>
                <a href="#privacy" className="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
                <a href="#support" className="text-gray-400 hover:text-white transition duration-300">Support</a>
                <a href="#sitemap" className="text-gray-400 hover:text-white transition duration-300">Sitemap</a>
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-gray-700 text-center">
              <p className="text-xs text-gray-500">
                This portal is exclusively for verified KES alumni, staff, and authorized stakeholders. 
                Unauthorized access or misuse is strictly prohibited and may result in legal action.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Terms Modal */}
      {showTerms && <TermsModal />}
    </>
  );
};

export default Footer;
