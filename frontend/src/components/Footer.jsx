import React from 'react';
import { useNavigate } from 'react-router-dom';
import Vogo from '../assets/vogo.png';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="relative bg-[#020617] text-white pt-12 pb-8 px-6 mb-[75px] md:mb-0 border-t border-slate-800">
      {/* Premium Top Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-32 bg-blue-500/10 blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
        
        {/* Logo and Description */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left lg:col-span-2 pr-0 lg:pr-12">
          <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <img src={Vogo} alt="Vastra Logo" className="w-8 h-8 object-contain" />
            <div className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Vastra
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed max-w-md">
            Vastra blends tradition with modern elegance. Discover curated collections of ethnic and contemporary wear crafted to celebrate your unique style.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="text-base font-semibold text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Company</div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-blue-400 transition-colors inline-block relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-blue-400 transition-colors inline-block relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/collections')} className="hover:text-blue-400 transition-colors inline-block relative group">
                Collections
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-blue-400 transition-colors inline-block relative group">
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="text-base font-semibold text-white mb-5" style={{ fontFamily: 'Poppins, sans-serif' }}>Get in Touch</div>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex items-center gap-4 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                <FaPhoneAlt size={12} />
              </div>
              +91-7046053000
            </li>
            <li className="flex items-center gap-4 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                <FaEnvelope size={12} />
              </div>
              support@vastra.in
            </li>
            <li className="flex items-center gap-4 hover:text-white transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-blue-400 shrink-0">
                <FaMapMarkerAlt size={12} />
              </div>
              Surat, Gujarat, India
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} <span className="text-white font-medium">Vastra</span>. All Rights Reserved.
        </p>
        <p className="text-xs text-slate-600 bg-slate-900/50 px-4 py-1.5 rounded-full border border-slate-800/50">
          Crafted with passion for fashion
        </p>
      </div>
    </footer>
  );
}

export default Footer;
