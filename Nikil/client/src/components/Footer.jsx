import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaTimes, FaFacebookF, FaLinkedinIn, FaInstagram, FaYoutube, FaTwitter } from 'react-icons/fa';
import kessocietylogo from '../assets/kessocietylogo.svg';

const Footer = () => {
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">KES Alumni Portal – Terms and Conditions</h2>
          <button
            onClick={() => setShowTerms(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
  <div className="p-6 text-gray-800 text-sm max-w-none">
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

          <p className="text-sm text-gray-600 mt-6">
            These Terms and the Privacy Policy constitute the entire agreement between you and KES regarding the Services.
            If any provision is found unenforceable, the remainder will remain in effect.
          </p>
        </div>
      </div>
    </div>
  );

  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">KES Alumni Portal – Privacy Policy</h2>
          <button
            onClick={() => setShowPrivacy(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-6 text-gray-800 text-sm max-w-none">
          <p className="text-sm text-gray-600 mb-4">Last updated: January 2025</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Policy</h3>
          <p className="mb-4">This Privacy Policy explains how Kandivli Education Society (KES) collects, uses, and protects your personal information when you use the KES Alumni Portal.</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Information We Collect</h3>
          <ul className="mb-4 list-disc pl-6">
            <li>Personal details (name, email, phone, address, education, etc.) provided during registration or profile updates.</li>
            <li>Usage data, device information, and cookies for analytics and security.</li>
            <li>Content you submit, such as posts, messages, or event participation.</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">How We Use Your Information</h3>
          <ul className="mb-4 list-disc pl-6">
            <li>To verify alumni status and manage your account.</li>
            <li>To communicate with you about events, updates, and opportunities.</li>
            <li>To improve portal features, security, and user experience.</li>
            <li>For analytics, fundraising, and institutional engagement.</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Sharing and Protection</h3>
          <ul className="mb-4 list-disc pl-6">
            <li>We do not sell your personal data.</li>
            <li>Data may be shared with trusted service providers for portal operation, subject to confidentiality agreements.</li>
            <li>We use industry-standard security measures to protect your data.</li>
            <li>Members can manage profile visibility and communication preferences.</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Rights</h3>
          <ul className="mb-4 list-disc pl-6">
            <li>You may access, update, or delete your profile information at any time.</li>
            <li>You may opt out of non-essential communications.</li>
            <li>Contact us for questions or requests regarding your data.</li>
          </ul>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Contact</h3>
          <div className="mb-4">
            <p><strong>Institution:</strong> Kandivli Education Society (KES)</p>
            <p><strong>Address:</strong> Kandivali, Mumbai, Maharashtra, India</p>
            <p><strong>Email:</strong> alumni@kes.edu.in</p>
            <p><strong>Phone:</strong> +91-22-XXXX-XXXX</p>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            This Privacy Policy may be updated periodically. Continued use of the Portal constitutes acceptance of the revised policy.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <footer className="bg-gray-800 text-white py-12 mt-8">
      <div className="container mx-auto px-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-12 w-12 flex items-center justify-center">
                <img src={kessocietylogo} alt="KES Society Logo" className="h-10 w-10" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">KES' Alumni Portal</h3>
                <p className="text-sm text-gray-300">Kandivli Education Society</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-1">
              Connecting KES alumni worldwide since 1936. Join our community
            </p>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              of over 20,000 graduates and stay connected.
            </p>
            <div className="text-sm text-gray-400">
              <p>Established: 1936 | Serving: 20,000+ Students</p>
            </div>
          </div>
          {/* Social Media Section Centered */}
          <div className="flex flex-col items-start self-start justify-center w-full lg:ml-8">
            <h4 className="text-lg font-semibold mb-4">Social Media</h4>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="https://x.com/kes_college?s=08" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit px-3 py-2 transition duration-300">
                  <FaTwitter className="text-lg text-gray-300 hover:text-white" />
                  <span className="text-gray-300 hover:text-white">Twitter (X)</span>
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCVMTXOdY3ymsNJLwv_jUW-Q" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit px-3 py-2 transition duration-300">
                  <FaYoutube className="text-lg text-gray-300 hover:text-white" />
                  <span className="text-gray-300 hover:text-white">Youtube</span>
                </a>
              </li>
              <li>
                <a href="https://www.facebook.com/kesshroffcollegeofficial/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit px-3 py-2 transition duration-300">
                  <FaFacebookF className="text-lg text-gray-300 hover:text-white" />
                  <span className="text-gray-300 hover:text-white">Facebook</span>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/kesshroffcollege/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit px-3 py-2 transition duration-300">
                  <FaLinkedinIn className="text-lg text-gray-300 hover:text-white" />
                  <span className="text-gray-300 hover:text-white">LinkedIn</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/kesshroffcollege/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 w-fit px-3 py-2 transition duration-300">
                  <FaInstagram className="text-lg text-gray-300 hover:text-white" />
                  <span className="text-gray-300 hover:text-white">Instagram</span>
                </a>
              </li>
            </ul>
          </div>
          {/* Contact Info shifted right */}
          <div className="col-span-1 lg:col-start-4 w-full">
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-[#b22234] mt-1 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">
                    KES Shroff College,
                    Bhulabhai Desai Rd,
                  </p>
                  <p className="text-gray-300">Kandivli (w), Mumbai 400067</p>
                </div>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-[#b22234] mr-3" />
                <a href="mailto:alumni@kes.edu.in" className="text-gray-300 hover:text-white transition duration-300">
                  principal@kessc.edu.in, office@kessc.edu.in
                </a>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-[#b22234] mr-3" />
                <a href="tel:+912222222222" className="text-gray-300 hover:text-white transition duration-300">
                  022-35069777
                </a>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Kandivli Education Society. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <button
                onClick={() => setShowTerms(true)}
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Terms & Conditions
              </button>
              <button
                onClick={() => setShowPrivacy(true)}
                className="text-gray-400 hover:text-white transition duration-300"
              >
                Privacy Policy
              </button>
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
  {/* Terms & Privacy Modals */}
  {showTerms && <TermsModal />}
  {showPrivacy && <PrivacyModal />}
    </footer>
  );
};

export default Footer;