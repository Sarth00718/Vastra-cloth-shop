import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdOutlineMail, 
  MdOutlinePhoneInTalk, 
  MdOutlineLocationOn, 
  MdOutlineAccessTime,
  MdSend, 
  MdCheckCircle,
  MdHelpOutline,
  MdKeyboardArrowDown
} from 'react-icons/md';
import { FaPaperPlane, FaStore, FaUser, FaTag, FaCommentAlt } from 'react-icons/fa';
import Titles from '../components/Titles';
import contactImage from '../assets/image.png';
import { sendContactMessage } from '../services/contactService';
import toast from 'react-hot-toast';

const FAQ_ITEMS = [
  {
    q: 'How long will it take to receive a response to my message?',
    a: 'Our dedicated customer support team reviews all incoming inquiries and typically responds within 2 to 24 business hours.',
  },
  {
    q: 'Can I track or modify an existing order via the Contact form?',
    a: 'Yes! Please include your Order ID in the subject or message body so we can quickly look up your order details and assist you.',
  },
  {
    q: 'What are your store operating hours?',
    a: 'Our physical store in Surat is open Monday through Saturday from 9:00 AM to 8:00 PM IST. Our online support operates 24/7.',
  },
  {
    q: 'Do you offer international shipping or custom tailoring?',
    a: 'We currently ship nationwide across India with free shipping on orders above ₹999. For custom sizing or bulk inquiries, reach out to us directly!',
  },
];

function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.message.trim().length < 10) {
      toast.error('Please write a slightly longer message (at least 10 characters)');
      return;
    }

    try {
      setLoading(true);
      const res = await sendContactMessage(formData);
      if (res.success) {
        toast.success(res.message || 'Message sent successfully!');
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        toast.error(res.message || 'Failed to send message.');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to send email. Please check your connection.';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="w-full min-h-screen pt-24 px-4 sm:px-6 lg:px-12 mb-16 text-slate-100 max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ─── HEADER / TITLE SECTION ───────────────────────────────────────── */}
      <div className="text-center mb-12">
        <Titles text1="GET IN" text2="TOUCH" />
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base mt-3 leading-relaxed">
          Have a question about our clothing collections, orders, or custom fitting? Send us a message and our team will get back to you immediately.
        </p>
      </div>

      {/* ─── QUICK INFO HIGHLIGHT CARDS ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          {
            icon: MdOutlineLocationOn,
            title: 'Our Headquarters',
            desc: 'Varachha Main Road, Surat City, Gujarat, India - 395006',
            color: 'from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400',
          },
          {
            icon: MdOutlinePhoneInTalk,
            title: 'Call Us Directly',
            desc: '+91 70460 53000\nMon-Sat from 9am to 8pm IST',
            color: 'from-purple-500/20 to-pink-500/10 border-purple-500/30 text-purple-400',
          },
          {
            icon: MdOutlineMail,
            title: 'Email Support',
            desc: 'admin@vastra.com\nsupport@vastra.com',
            color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400',
          },
          {
            icon: MdOutlineAccessTime,
            title: 'Customer Service Hours',
            desc: 'Available 24/7 for Online Assistance',
            color: 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400',
          },
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} border backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden`}
            >
              <div>
                <div className="p-3 rounded-xl bg-slate-900/70 border border-white/10 shadow-inner w-fit mb-4 text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base sm:text-lg text-white mb-2 leading-tight tracking-wide">
                  {card.title}
                </h3>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm whitespace-pre-line leading-relaxed">
                {card.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── MAIN CONTENT: FORM & STORE PREVIEW ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-20">
        
        {/* Contact Form (LHS) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
            <FaPaperPlane className="text-blue-400 w-5 h-5" /> Send Us A Message
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            Fill out the form below. We promise to reply promptly with helpful solutions.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-8 text-center flex flex-col items-center gap-4 my-6"
            >
              <MdCheckCircle className="w-16 h-16 text-emerald-400 animate-bounce" />
              <h3 className="text-xl font-bold text-emerald-300">Message Delivered Successfully!</h3>
              <p className="text-slate-300 text-sm max-w-md">
                Thank you for contacting Vastra. An automated confirmation email has been dispatched to your email address, and our support staff will get in touch shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-600/30 text-sm"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MdOutlineMail className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Phone & Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <MdOutlinePhoneInTalk className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                    Inquiry Subject <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <FaTag className="absolute left-3.5 top-3.5 text-slate-500 text-sm" />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="e.g. Order Status, Sizing Inquiry"
                      required
                      className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Your Message <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <FaCommentAlt className="absolute left-3.5 top-4 text-slate-500 text-sm" />
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry in detail..."
                    required
                    className="w-full bg-slate-950/70 border border-slate-700/70 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <MdSend className="w-5 h-5" />
                    <span>Submit & Send Message</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Store & Map Preview (RHS) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          {/* Store Image Container */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden p-5 shadow-2xl backdrop-blur-xl">
            <div className="relative rounded-2xl overflow-hidden mb-4 group">
              <img
                src={contactImage}
                alt="Vastra Flagship Store"
                className="w-full h-56 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 text-white">
                <FaStore className="text-blue-400 text-lg" />
                <span className="font-semibold text-base">Vastra Flagship Store</span>
              </div>
            </div>

            <div className="space-y-3 px-2 text-sm text-slate-300">
              <p className="leading-relaxed">
                Visit our physical store to experience our latest ethnic & modern fashion lines in person. Our tailoring experts are ready to assist you.
              </p>
              <div className="h-px bg-slate-800 my-3" />
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>📍 Varachha, Surat</span>
                <span className="text-emerald-400 font-medium">● Open Today till 8 PM</span>
              </div>
            </div>
          </div>

          {/* Embedded Interactive Map Card */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden p-3 shadow-2xl backdrop-blur-xl h-64 relative">
            <iframe
              title="Vastra Store Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14878.694723048997!2d72.8427!3d21.2185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e59045b36bd%3A0x6b3014a51e600551!2sVarachha%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: '1rem', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </motion.div>

      </div>

      {/* ─── FREQUENTLY ASKED QUESTIONS ──────────────────────────────────── */}
      <div className="mb-20 bg-slate-900/50 border border-slate-800/80 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-2xl border border-blue-500/20">
            <MdHelpOutline className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Quick answers to common inquiries</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 max-w-4xl">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-800/80 rounded-2xl bg-slate-950/40 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex justify-between items-center gap-4 font-semibold text-slate-200 hover:text-white text-sm sm:text-base transition-colors"
                >
                  <span>{item.q}</span>
                  <MdKeyboardArrowDown
                    className={`w-5 h-5 text-blue-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-slate-800/50 pt-3"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>


    </motion.div>
  );
}

export default Contacts;
