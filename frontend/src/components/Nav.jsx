import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/vogo.png";
import { IoSearchOutline } from "react-icons/io5";
import { IoMdHome, IoMdAlbums, IoMdContacts, IoMdCart } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart, MdOutlineAdminPanelSettings, MdClose } from "react-icons/md";
import { IoShirtOutline } from "react-icons/io5";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { AnimatePresence } from "framer-motion";
import { MdOutlineLogout, MdOutlineHistory, MdOutlineFavoriteBorder, MdOutlineInfo } from "react-icons/md";



// ─── REUSABLE DROPDOWN ITEM ──────────────────────────────────────────────────
const DropdownItem = ({ icon: Icon, label, onClick, danger, accent }) => (
  <motion.li
    whileHover={{ x: 4, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`
      flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 group
      ${danger ? 'text-red-400 hover:text-red-300' : accent ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'}
    `}
  >
    <div className={`
      w-7 h-7 rounded-md flex items-center justify-center transition-colors shrink-0
      ${danger ? 'bg-red-500/10 group-hover:bg-red-500/20' : accent ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}
    `}>
      <Icon className="w-4 h-4" />
    </div>
    <span className="text-[13px] font-medium tracking-wide">{label}</span>
  </motion.li>
);

function Nav() {
  const { user, setUser, admin } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCardCount } = useContext(shopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const [showOutfitCreator, setShowOutfitCreator] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const iconButtonClass = "w-9 h-9 rounded-full flex items-center justify-center border border-slate-700/50 bg-slate-900/40 text-slate-300 hover:text-blue-300 hover:border-blue-500/50 transition-all";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      setShowProfile(false);
      setUser(null);
      setAdmin(null);
      toast.success("Logout successful!");
      navigate("/login"); // Navigate to login page instead of home
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <>
    <div className="w-screen fixed top-0 z-20 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl border-b border-slate-800/50 backdrop-blur-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="h-[64px] px-6 flex items-center justify-between relative">

        {/* Premium Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 md:gap-3 cursor-pointer relative"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
            <img src={logo} alt="logo" className="w-[24px] md:w-[32px] relative drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>
          <div className="text-[20px] md:text-[24px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Vastra
          </div>
        </motion.div>

        {/* Premium Center Nav */}
        <ul className="hidden md:flex gap-2 text-[14px] font-semibold text-slate-300">
          {[
            { label: "Home", path: "/" },
            { label: "Collections", path: "/collections" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contects" },
          ].map(({ label, path }) => (
            <motion.li
              key={label}
              onClick={() => navigate(path)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:text-white group"
            >
              <span className="relative z-10">{label}</span>
              <motion.div
                className="absolute inset-0 bg-blue-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.05 }}
              />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-3/4 transition-all duration-300" />
            </motion.li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center justify-end gap-5">

          {/* Premium Search */}
          <motion.div
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            {showSearch ? (
              <button className={`${iconButtonClass} relative`} onClick={() => setShowSearch(false)}>
                <MdClose className="w-5 h-5 text-blue-400" />
              </button>
            ) : (
              <button className={`${iconButtonClass} relative`} onClick={() => setShowSearch(true)}>
                <IoSearchOutline className="w-[22px] h-[22px]" />
              </button>
            )}
          </motion.div>

          {/* Premium Profile */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative group">
            {!user ? (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <button className={`${iconButtonClass} relative`} onClick={() => setShowProfile((prev) => !prev)}>
                  <FaCircleUser className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full" />
                <div className="w-10 h-10 bg-blue-600/20 text-white rounded-full flex items-center justify-center uppercase text-sm font-bold cursor-pointer shadow-lg shadow-blue-500/30 border border-blue-400/30 relative hover:shadow-blue-500/50 transition-all" onClick={() => setShowProfile((prev) => !prev)}>
                  {user.name?.charAt(0)}
                </div>
              </div>
            )}

            {/* Premium Dropdown */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[125%] right-0 w-48 bg-slate-900/95 border border-slate-800/60 rounded-2xl z-50 shadow-2xl shadow-black/60 backdrop-blur-2xl overflow-hidden p-2"
                >
                  {/* Glassmorphism Shine */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                  
                  <ul className="flex flex-col gap-1">
                    <DropdownItem 
                      icon={MdOutlineHistory} 
                      label="Orders" 
                      onClick={() => { navigate('/order'); setShowProfile(false); }} 
                    />
                    <DropdownItem 
                      icon={MdOutlineFavoriteBorder} 
                      label="Wishlist" 
                      onClick={() => { navigate('/wishlist'); setShowProfile(false); }} 
                    />

                    {admin && (
                      <DropdownItem 
                        icon={MdOutlineAdminPanelSettings} 
                        label="Admin Panel" 
                        accent 
                        onClick={() => { navigate('/admin'); setShowProfile(false); }} 
                      />
                    )}

                    <DropdownItem 
                      icon={MdOutlineInfo} 
                      label="About" 
                      onClick={() => { navigate("/about"); setShowProfile(false); }} 
                    />

                    <div className="h-px bg-slate-800/60 my-1 mx-2" />

                    {!user ? (
                      <DropdownItem 
                        icon={FaCircleUser} 
                        label="Login" 
                        onClick={() => { navigate("/login"); setShowProfile(false); }} 
                      />
                    ) : (
                      <DropdownItem 
                        icon={MdOutlineLogout} 
                        label="Logout" 
                        danger 
                        onClick={handleLogout} 
                      />
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Premium Cart */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative cursor-pointer group">
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <button className={`${iconButtonClass} relative hidden md:flex`} onClick={() => navigate('/cart')}>
              <MdOutlineShoppingCart className="w-6 h-6" />
            </button>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full text-[10px] hidden md:flex shadow-lg shadow-blue-500/50 border border-slate-900"
            >
              {getCardCount()}
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 80 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full bg-gradient-to-r from-[#0f2847] via-[#1a3a5f] to-[#0f2847] flex items-center justify-center border-b border-blue-900/30 overflow-hidden"
          >
            <input
              type="text"
              placeholder="Search products (Press Enter to search)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && location.pathname !== '/collections') {
                  navigate('/collections');
                }
              }}
              autoFocus
              className="w-[90%] sm:w-[70%] md:w-[50%] h-[50px] bg-gradient-to-r from-[#0a1929] to-[#0f2847] border-2 border-blue-700/40 rounded-full px-6 placeholder:text-blue-300/60 text-blue-100 text-[16px] sm:text-[18px] outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-900/30 transition-all"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>

    {/* Bottom Nav */}
    <div className="w-full h-[90px] flex items-center justify-between px-6 text-xs fixed bottom-0 left-0 bg-gradient-to-r from-[#0a1929] via-[#0f2847] to-[#0a1929] border-t border-blue-900/30 md:hidden z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {[
        { Icon: IoMdHome, label: "Home", path: "/" },
        { Icon: IoMdAlbums, label: "Collections", path: "/collections" },
        { Icon: IoMdContacts, label: "Contact", path: "/contects" },
      ].map(({ Icon, label, path }) => (
        <motion.button whileTap={{ scale: 0.9 }} key={label} className="text-blue-300 flex flex-col items-center justify-center gap-1 font-medium" onClick={() => navigate(path)}>
          <Icon className="w-6 h-6" /> {label}
        </motion.button>
      ))}

      <motion.button whileTap={{ scale: 0.9 }} className="relative text-blue-300 flex flex-col items-center justify-center gap-1 font-medium" onClick={() => navigate('/cart')}>
        <div className="relative">
          <IoMdCart className="w-6 h-6" />
          <span className="absolute -top-1.5 -right-2 w-[16px] h-[16px] flex items-center justify-center font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full text-[9px] shadow-lg border border-slate-900">
            {getCardCount()}
          </span>
        </div>
        <span>Cart</span>
      </motion.button>
    </div>
    </>
  );
}

export default Nav;
