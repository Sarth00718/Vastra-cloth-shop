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
  const { user, getCurrentUser, setUser } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const { showSearch, setShowSearch, search, setSearch, getCardCount } = useContext(shopDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverurl}/api/auth/logout`, { withCredentials: true });
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
    <div className="w-screen fixed top-0 z-20 bg-gradient-to-r from-[#0A1626] via-[#0a1c34] to-[#0A1626] bg-opacity-95 shadow-lg font-poppins">
      <div className="h-[65px] px-6 flex items-center justify-between">

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-[32px]" />
          <h1 className="text-[24px] text-cyan-300 font-bold tracking-wide">Vastra</h1>
        </motion.div>

        {/* Center Nav */}
        <ul className="hidden md:flex gap-6 text-[15px] font-medium text-cyan-200">
          {[
            { label: "Home", path: "/" },
            { label: "Collections", path: "/collections" },
            { label: "About", path: "/about" },
            { label: "Contact", path: "/contects" },
          ].map(({ label, path }) => (
            <motion.li
              key={label}
              onClick={() => navigate(path)}
              whileHover={{ scale: 1.1 }}
              className="hover:text-white hover:bg-cyan-800/30 py-2 px-4 rounded-md cursor-pointer transition"
            >
              {label}
            </motion.li>
          ))}
        </ul>

        {/* Right */}
        <div className="flex items-center justify-end gap-5">

          {/* Search */}
          <motion.div whileTap={{ scale: 0.9 }}>
            {showSearch ? (
              <IoSearchCircleSharp className="w-9 h-9 text-cyan-300 cursor-pointer hover:text-white" onClick={() => setShowSearch(false)} />
            ) : (
              <IoSearchCircleOutline className="w-8 h-8 text-cyan-300 cursor-pointer hover:text-white" onClick={() => { setShowSearch(true); navigate("/collections"); }} />
            )}
          </motion.div>

          {/* Profile */}
          <motion.div whileTap={{ scale: 0.9 }} className="relative">
            {!user ? (
              <FaCircleUser className="w-7 h-7 text-cyan-300 cursor-pointer hover:text-white" onClick={() => setShowProfile((prev) => !prev)} />
            ) : (
              <div className="w-8 h-8 bg-cyan-700 text-white rounded-full flex items-center justify-center uppercase text-sm cursor-pointer hover:bg-cyan-600" onClick={() => setShowProfile((prev) => !prev)}>
                {user.name?.charAt(0)}
              </div>
            )}

            {/* Dropdown */}
            {showProfile && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-[110%] right-0 w-44 bg-[#1b2b42] border border-gray-700 rounded-lg z-50 shadow-lg"
              >
                <ul className="flex flex-col text-white text-[15px]">
                  {!user && (
                    <li className="px-4 py-2 hover:bg-[#233542] cursor-pointer" onClick={() => { navigate("/login"); setShowProfile(false); }}>
                      Login
                    </li>
                  )}
                  {user && (
                    <li className="px-4 py-2 hover:bg-[#233542] cursor-pointer" onClick={handleLogout}>
                      Logout
                    </li>
                  )}
                  <li className="px-4 py-2 hover:bg-[#233542] cursor-pointer" onClick={() => navigate('/order')}>Orders</li>
                  <li className="px-4 py-2 hover:bg-[#233542] cursor-pointer" onClick={() => { navigate("/about"); setShowProfile(false); }}>About</li>
                </ul>
              </motion.div>
            )}
          </motion.div>

          {/* Cart */}
          <motion.div whileTap={{ scale: 0.9 }} className="relative cursor-pointer">
            <MdOutlineShoppingCart className="w-7 h-7 text-cyan-300 hidden md:block hover:text-white" onClick={() => navigate('/cart')} />
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] items-center justify-center font-bold bg-cyan-700 text-white rounded-full text-[10px] hidden md:flex">
              {getCardCount()}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full h-[80px] bg-[#112240] flex items-center justify-center"
        >
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[90%] sm:w-[70%] md:w-[50%] h-[50px] bg-[#0f172a] rounded-full px-6 placeholder:text-gray-400 text-white text-[16px] sm:text-[18px] outline-none"
          />
        </motion.div>
      )}

      {/* Bottom Nav */}
      <div className="w-full h-[90px] flex items-center justify-between px-6 text-xs fixed bottom-0 left-0 bg-[#0a192f] md:hidden z-20">
        {[
          { Icon: IoMdHome, label: "Home", path: "/" },
          { Icon: IoMdAlbums, label: "Collections", path: "/collections" },
          { Icon: IoMdContacts, label: "Contact", path: "/contects" },
        ].map(({ Icon, label, path }) => (
          <motion.button whileTap={{ scale: 0.9 }} key={label} className="text-cyan-300 flex flex-col items-center justify-center gap-1" onClick={() => navigate(path)}>
            <Icon className="w-6 h-6" /> {label}
          </motion.button>
        ))}

        <motion.button whileTap={{ scale: 0.9 }} className="relative text-cyan-300 flex flex-col items-center justify-center gap-1" onClick={() => navigate('/cart')}>
          <IoMdCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[-10px] w-[18px] h-[18px] font-bold bg-cyan-700 text-white rounded-full items-center justify-center text-[9px]">
            {getCardCount()}
          </span>
          Cart
        </motion.button>
      </div>
    </div>
  );
}

export default Nav;
