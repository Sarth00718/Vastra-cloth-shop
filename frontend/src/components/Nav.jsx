import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import logo from "../assets/vogo.png";
import { IoSearchCircleOutline, IoSearchCircleSharp } from "react-icons/io5";
import { IoMdHome, IoMdAlbums, IoMdContacts, IoMdCart } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { userDataContext } from "../context/UserContext";
import { authDataContext } from "../context/AuthContext";
import { shopDataContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Nav() {
  const { user, setUser } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCardCount } = useContext(shopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/logout`, { withCredentials: true });
      localStorage.removeItem("token");
      setShowProfile(false);
      setUser(null); // Clear user state immediately
      toast.success("Logout successful!");
      navigate("/login"); // Navigate to login page instead of home
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="w-screen fixed top-0 z-20 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl border-b border-slate-800/50 backdrop-blur-xl" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="h-[75px] px-6 flex items-center justify-between relative">

        {/* Premium Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer relative"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
            <img src={logo} alt="logo" className="w-[38px] relative drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
          </div>
          <h1 className="text-[28px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
            Vastra
          </h1>
        </motion.div>

        {/* Premium Center Nav */}
        <ul className="hidden md:flex gap-2 text-[15px] font-semibold text-slate-300">
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
              className="relative px-5 py-2.5 rounded-xl cursor-pointer transition-all duration-300 hover:text-white group"
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
              <IoSearchCircleSharp className="w-9 h-9 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors relative" onClick={() => setShowSearch(false)} />
            ) : (
              <IoSearchCircleOutline className="w-9 h-9 text-slate-400 cursor-pointer hover:text-blue-400 transition-colors relative" onClick={() => { setShowSearch(true); navigate("/collections"); }} />
            )}
          </motion.div>

          {/* Premium Profile */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative group">
            {!user ? (
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <FaCircleUser className="w-8 h-8 text-slate-400 cursor-pointer hover:text-blue-400 transition-colors relative" onClick={() => setShowProfile((prev) => !prev)} />
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
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-[120%] right-0 w-48 bg-gradient-to-b from-slate-900/95 to-slate-950/95 border border-slate-700/50 rounded-2xl z-50 shadow-2xl shadow-black/50 backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                <ul className="flex flex-col text-slate-200 text-[15px] font-medium p-2">
                  {!user && (
                    <li className="px-4 py-3 hover:bg-blue-600/20 cursor-pointer rounded-xl transition-all" onClick={() => { navigate("/login"); setShowProfile(false); }}>
                      Login
                    </li>
                  )}
                  {user && (
                    <li className="px-4 py-3 hover:bg-blue-600/20 cursor-pointer rounded-xl transition-all" onClick={handleLogout}>
                      Logout
                    </li>
                  )}
                  <li className="px-4 py-3 hover:bg-blue-600/20 cursor-pointer rounded-xl transition-all" onClick={() => navigate('/order')}>Orders</li>
                  <li className="px-4 py-3 hover:bg-pink-500/20 cursor-pointer rounded-xl transition-all flex items-center gap-2" onClick={() => { navigate('/wishlist'); setShowProfile(false); }}>
                    ❤️ Wishlist
                  </li>
                  <li className="px-4 py-3 hover:bg-blue-600/20 cursor-pointer rounded-xl transition-all" onClick={() => { navigate("/about"); setShowProfile(false); }}>About</li>
                </ul>
              </motion.div>
            )}
          </motion.div>

          {/* Premium Cart */}
          <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} className="relative cursor-pointer group">
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <MdOutlineShoppingCart className="w-8 h-8 text-slate-400 hidden md:block hover:text-blue-400 transition-colors relative" onClick={() => navigate('/cart')} />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 min-w-[22px] h-[22px] px-1 items-center justify-center font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full text-[11px] hidden md:flex shadow-lg shadow-blue-500/50 border border-blue-400/30"
            >
              {getCardCount()}
            </motion.span>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-[80px] bg-gradient-to-r from-[#0f2847] via-[#1a3a5f] to-[#0f2847] flex items-center justify-center border-b border-blue-900/30"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[90%] sm:w-[70%] md:w-[50%] h-[50px] bg-gradient-to-r from-[#0a1929] to-[#0f2847] border-2 border-blue-700/40 rounded-full px-6 placeholder:text-blue-300/60 text-blue-100 text-[16px] sm:text-[18px] outline-none focus:border-blue-500 focus:shadow-lg focus:shadow-blue-900/30 transition-all"
          />
        </motion.div>
      )}

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
          <IoMdCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[-10px] w-[18px] h-[18px] font-bold bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-full items-center justify-center text-[9px] shadow-lg">
            {getCardCount()}
          </span>
          Cart
        </motion.button>
      </div>
    </div>
  );
}

export default Nav;
