import React from 'react';
import { useNavigate } from 'react-router-dom';
import Vogo from '../assets/vogo.png';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 px-6 mb-[75px] md:mb-0 border-t border-slate-800/50">
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-blue-500/5 blur-3xl" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
        {/* Premium Logo and Description */}
        <div className="flex flex-col items-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <img src={Vogo} alt="Vastra Logo" className="w-16 h-16 relative drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Vastra
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
            Vastra blends tradition with modern elegance. Discover curated collections of ethnic and contemporary wear crafted to celebrate your unique style.
          </p>
        </div>

        {/* Premium Company Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-blue-400 mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Company</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-blue-400 transition-colors relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors relative group">
                About Us
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/collections')} className="hover:text-blue-400 transition-colors relative group">
                Collections
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-blue-400 transition-colors relative group">
                Privacy Policy
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          </ul>
        </div>

        {/* Premium Contact Info */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-bold text-blue-400 mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Get in Touch</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-3 justify-center hover:text-blue-400 transition-colors group">
              <FaPhoneAlt className="text-blue-500 group-hover:scale-110 transition-transform" /> +91-7046053000
            </li>
            <li className="flex items-center gap-3 justify-center hover:text-blue-400 transition-colors group">
              <FaEnvelope className="text-blue-500 group-hover:scale-110 transition-transform" /> support@vastra.in
            </li>
            <li className="flex items-center gap-3 justify-center hover:text-blue-400 transition-colors group">
              <FaMapMarkerAlt className="text-blue-500 group-hover:scale-110 transition-transform" /> Surat, Gujarat, India
            </li>
          </ul>
        </div>
      </div>

      {/* Premium Footer Bottom */}
      <div className="mt-16 pt-8 text-center relative">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <p className="text-sm text-slate-500">
          © 2025 <span className="text-blue-400 font-bold">vastra.in</span> — All Rights Reserved
        </p>
        <p className="text-xs text-slate-600 mt-2">Crafted with passion for fashion</p>
      </div>
    </footer>
  );
}

export default Footer;
