import React, { useContext, useState } from "react";
import logo from "../../assets/admin/vogo.png";
import { authDataContext } from "../../context/AuthContext";
import { userDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineWeb, MdOutlineLogout, MdOutlineHistory, MdOutlineFavoriteBorder, MdOutlineInfo } from "react-icons/md";

// ─── REUSABLE DROPDOWN ITEM ──────────────────────────────────────────────────
const DropdownItem = ({ icon: Icon, label, onClick, danger, accent }) => (
  <motion.li
    whileHover={{ x: 6, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group
      ${danger ? 'text-red-400 hover:text-red-300' : accent ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'}
    `}
  >
    <div className={`
      w-8 h-8 rounded-lg flex items-center justify-center transition-colors
      ${danger ? 'bg-red-500/10 group-hover:bg-red-500/20' : accent ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}
    `}>
      <Icon className="w-5 h-5" />
    </div>
    <span className="text-[14px] font-medium tracking-wide">{label}</span>
  </motion.li>
);

function Nav() {
  const { user, setUser, admin, setAdmin, getCurrentUser } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const iconButtonClass = "w-10 h-10 rounded-full flex items-center justify-center border border-slate-700/50 bg-slate-900/40 text-slate-300 hover:text-blue-300 hover:border-blue-500/50 transition-all";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      setShowProfile(false);
      setUser(null);
      setAdmin(null);
      toast.success("Logout successful!");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <div className="w-screen fixed top-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl border-b border-slate-800/50 backdrop-blur-xl">
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Top nav bar */}
      <div className="h-[75px] px-[30px] flex items-center justify-between relative">
        {/* Premium Logo */}
        <div
          className="w-[25%] flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/admin')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
            <img
              src={logo}
              alt="logo"
              className="w-[40px] relative drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
            />
          </div>
          <h1
            className="text-[30px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
          >
            Vastra
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          {/* Website Shortcut Button (Keep for convenience) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/40 hover:bg-slate-700/60 rounded-xl border border-slate-700/50 text-slate-300 text-sm font-semibold transition-all"
          >
            <MdOutlineWeb className="w-5 h-5 text-blue-400" />
            Website
          </motion.button>

          {/* Premium Profile Dropdown */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative group">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full" />
              <div 
                className="w-10 h-10 bg-blue-600/20 text-white rounded-full flex items-center justify-center uppercase text-sm font-bold cursor-pointer shadow-lg shadow-blue-500/30 border border-blue-400/30 relative hover:shadow-blue-500/50 transition-all" 
                onClick={() => setShowProfile((prev) => !prev)}
              >
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[125%] right-0 w-56 bg-slate-900/95 border border-slate-800/60 rounded-2xl z-50 shadow-2xl shadow-black/60 backdrop-blur-2xl overflow-hidden p-2"
                >
                  {/* Glassmorphism Shine */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                  
                  <ul className="flex flex-col gap-1">
                    <DropdownItem 
                      icon={MdOutlineLogout} 
                      label="Logout" 
                      danger 
                      onClick={handleLogout} 
                    />
                    
                    <DropdownItem 
                      icon={MdOutlineWeb} 
                      label="Main Website" 
                      accent 
                      onClick={() => { navigate('/'); setShowProfile(false); }} 
                    />

                    <div className="h-px bg-slate-800/60 my-1 mx-2" />

                    <DropdownItem 
                      icon={MdOutlineHistory} 
                      label="Manage Orders" 
                      onClick={() => { navigate('/admin/orders'); setShowProfile(false); }} 
                    />
                    <DropdownItem 
                      icon={MdOutlineFavoriteBorder} 
                      label="Wishlist" 
                      onClick={() => { navigate('/wishlist'); setShowProfile(false); }} 
                    />
                    <DropdownItem 
                      icon={MdOutlineInfo} 
                      label="About" 
                      onClick={() => { navigate("/about"); setShowProfile(false); }} 
                    />
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
