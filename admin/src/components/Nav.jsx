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
      className="w-screen fixed top-0 z-10 bg-gradient-to-r from-[#0A1626] via-[#081c36] to-[#0A1626] shadow-md shadow-black"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Top nav bar */}
      <div className="h-[60px] px-[30px] flex items-center justify-between">
        {/* Logo */}
        <div
          className="w-[25%] flex items-center gap-3 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <motion.img
            src={logo}
            alt="logo"
            className="w-[30px]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          />
          <motion.h1
            className="text-[25px] text-white font-poppins"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Vastra
          </motion.h1>
        </div>

        {/* Logout Button */}
        <div className="flex-1 flex justify-end">
          <ul className="flex text-[15px] font-medium text-white">
            <motion.li
              onClick={handleLogout}
              className="bg-[#052e36c9] hover:bg-gray-700 py-2 px-5 rounded-lg cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Logout
            </motion.li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default Nav;
