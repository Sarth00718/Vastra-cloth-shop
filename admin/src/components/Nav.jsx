import React, { useContext } from "react";
import logo from "../assets/vogo.png";
import { authDataContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { adminDataContext } from "../context/AdminContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Nav() {
  const { serverurl } = useContext(authDataContext);
  const navigate = useNavigate();
  const { getAdmin } = useContext(adminDataContext);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverurl}/api/auth/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      console.log("Logout successful:", result.data);
      toast.success("Logout successful!");
      getAdmin();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed!");
    }
  };

  return (
    <motion.div
      className="w-screen fixed top-0 z-10 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl border-b border-slate-800/50 backdrop-blur-xl"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Top nav bar */}
      <div className="h-[75px] px-[30px] flex items-center justify-between relative">
        {/* Premium Logo */}
        <div
          className="w-[25%] flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full" />
            <motion.img
              src={logo}
              alt="logo"
              className="w-[40px] relative drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
            />
          </div>
          <motion.h1
            className="text-[30px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
            style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            Vastra
          </motion.h1>
        </div>

        {/* Premium Logout Button */}
        <div className="flex-1 flex justify-end">
          <ul className="flex text-[15px] font-bold text-white">
            <motion.li
              onClick={handleLogout}
              className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 py-3 px-7 rounded-xl cursor-pointer shadow-lg shadow-blue-500/30 border border-blue-400/20 overflow-hidden group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Logout</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </motion.li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default Nav;
