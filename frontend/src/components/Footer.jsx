import React from 'react';
import { useNavigate } from 'react-router-dom';
import Vogo from '../assets/vogo.png';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="bg-gradient-to-r from-[#0A1626] via-[#0a1c34] to-[#0A1626]  text-white py-12 px-6 mb-[75px] md:mb-0">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        {/* Logo and Description */}
        <div className="flex flex-col items-center">
          <img src={Vogo} alt="Vastra Logo" className="w-14 h-14 mb-4" />
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
            Vastra blends tradition with modern elegance. Discover curated collections of ethnic and contemporary wear crafted to celebrate your unique style.
          </p>
        </div>

        {/* Company Links */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <button onClick={() => navigate('/')} className="hover:text-white transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/about')} className="hover:text-white transition">
                About Us
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/collections')} className="hover:text-white transition">
                Collections
              </button>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Get in Touch</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2 justify-center">
              <FaPhoneAlt className="text-cyan-400" /> +91-7046053000
            </li>
            <li className="flex items-center gap-2 justify-center">
              <FaEnvelope className="text-cyan-400" /> support@vastra.in
            </li>
            <li className="flex items-center gap-2 justify-center">
              <FaMapMarkerAlt className="text-cyan-400" /> Surat, Gujarat, India
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
        © 2025 <span className="text-cyan-400 font-semibold">vastra.in</span> — All Rights Reserved
      </div>
    </footer>
  );
}

export default Footer;
