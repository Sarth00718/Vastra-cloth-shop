import React from 'react';
import { motion } from 'framer-motion';
import Titles from '../components/Titles';
import { useNavbarHeight } from '../hooks/useNavbarHeight';
import { MdVerifiedUser, MdLock, MdVisibility, MdDescription, MdNotificationsActive, MdAssignmentInd } from 'react-icons/md';

function PrivacyPolicy() {
  const navbarPadding = useNavbarHeight();

  const sections = [
    {
      icon: MdVerifiedUser,
      title: "1. Information We Collect",
      content: "When you visit Vastra or make a purchase, we collect personal information provided directly by you, such as your name, email address, shipping address, phone number, and payment details. We also automatically gather device information, including IP address, browser type, and browsing patterns to optimize your shopping experience."
    },
    {
      icon: MdVisibility,
      title: "2. How We Use Your Information",
      content: "We use your data to process orders, manage deliveries, send order updates, and provide customer support. With your permission, we may also send promotional emails regarding new arrivals, special discounts, and seasonal offers tailored to your fashion preferences."
    },
    {
      icon: MdLock,
      title: "3. Data Security & Protection",
      content: "Your privacy is paramount. Vastra employs industry-standard SSL encryption and secure payment gateways to safeguard your transactions and personal details. We do not store sensitive payment card details on our servers."
    },
    {
      icon: MdAssignmentInd,
      title: "4. Sharing Your Data",
      content: "We never sell or rent your personal information to third parties. We share data strictly with trusted service providers necessary to operate our platform—such as logistics partners for shipping and payment processors for transaction fulfillment."
    },
    {
      icon: MdDescription,
      title: "5. Cookies & Tracking Technologies",
      content: "We use cookies to keep track of your shopping cart, remember your preferences, and analyze website traffic. You can choose to disable cookies through your browser settings, though some interactive features of our store may be limited."
    },
    {
      icon: MdNotificationsActive,
      title: "6. Your Rights & Contact",
      content: "You have the right to access, update, or request deletion of your personal data at any time. For privacy-related inquiries, please contact our support team at support@vastra.in."
    }
  ];

  return (
    <div className={`overflow-x-hidden min-h-screen ${navbarPadding} pb-16`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-3">
            <Titles text1="PRIVACY" text2="POLICY" />
          </div>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            At Vastra, we are committed to protecting your personal information and ensuring a safe, secure shopping experience.
          </p>
          <p className="text-xs text-blue-400 font-medium mt-3">
            Last Updated: August 2026
          </p>
        </motion.div>

        {/* Policy Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 backdrop-blur-xl shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-base font-semibold text-white tracking-wide">
                      {sec.title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {sec.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Commitment Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-900/40 via-slate-900/80 to-blue-900/40 border border-blue-500/30 rounded-2xl p-8 text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-blue-500/5 blur-2xl pointer-events-none" />
          <h3 className="text-lg font-bold text-white mb-2">Have questions about your privacy?</h3>
          <p className="text-sm text-slate-300 max-w-lg mx-auto mb-5">
            Our support team is available 24/7 to answer any questions or concerns you might have regarding how your data is handled.
          </p>
          <a
            href="mailto:support@vastra.in"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/25"
          >
            Contact Privacy Team
          </a>
        </motion.div>

      </div>
    </div>
  );
}

export default PrivacyPolicy;
