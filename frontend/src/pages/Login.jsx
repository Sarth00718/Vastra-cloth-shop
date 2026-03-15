import React, { useState, useContext } from "react";
import axios from "axios";
import Vogo from "../assets/vogo.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const { serverurl } = useContext(authDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let { getCurrentUser } = useContext(userDataContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverurl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("token", res.data.token);
      console.log(res.data);
      toast.success("Login successful!");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Login failed. Please check your credentials."
      );
    }
  };

  const googlelogin = async () => {
    try {
      const res = await signInWithPopup(auth, provider);
      let user = res.user;
      let name = user.displayName;
      let email = user.email;

      const reslt = await axios.post(
        serverurl + "/api/auth/googlelogin",
        { name, email },
        { withCredentials: true }
      );
      console.log(reslt.data);
      localStorage.setItem("token", reslt.data.token);
      toast.success("Google login successful!");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked. Please allow popups for this site.");
      } else if (error.response) {
        toast.error(error.response.data.message || "Server error. Please try again.");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Google login failed. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-[100vw] min-h-[100vh] text-white flex flex-col items-center justify-start relative"
    >
      {/* Premium Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-blue-950/20 pointer-events-none" />
      
      {/* Header */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="w-full h-[100px] flex items-center justify-start px-[30px] gap-[12px] cursor-pointer relative z-10"
        onClick={() => navigate("/")}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          <img className="w-[50px] relative drop-shadow-[0_0_20px_rgba(59,130,246,0.8)]" src={Vogo} alt="Logo" />
        </div>
        <h1 className="text-[32px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}>
          Vastra
        </h1>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-full h-[120px] flex items-center justify-center flex-col gap-[12px] relative z-10"
      >
        <h2 className="text-[36px] font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Welcome Back
        </h2>
        <p className="text-[18px] text-slate-300 font-medium">Sign in to continue your journey</p>
      </motion.div>

      {/* Form Card */}
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
        className="max-w-[600px] w-[90%] h-[420px] relative z-10"
      >
        {/* Premium Card with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-2xl" />
        <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 border border-slate-700/50 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden">
          {/* Top Shine Effect */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          {/* Side Glow */}
          <div className="absolute top-1/2 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative flex items-center justify-center h-full p-8">
            <form
              className="w-full flex flex-col items-center justify-start gap-[18px]"
              onSubmit={handleLogin}
            >
              {/* Google Login Button */}
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-[56px] bg-gradient-to-r from-white/10 to-white/5 hover:from-white/15 hover:to-white/10 border border-white/20 rounded-xl flex items-center justify-center gap-[12px] cursor-pointer shadow-lg shadow-black/20 font-semibold text-[15px] backdrop-blur-sm transition-all duration-300"
                onClick={googlelogin}
              >
                <img src={google} alt="Google" className="w-[24px]" />
                Continue with Google
              </motion.div>

              {/* Divider */}
              <div className="w-full h-[20px] flex justify-center items-center gap-[12px] text-slate-400 text-sm font-medium">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
                OR
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
              </div>

              {/* Form Inputs */}
              <div className="w-full flex flex-col items-center justify-center gap-[14px]">
                <motion.input
                  type="email"
                  placeholder="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  className="w-full h-[54px] bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500/50 backdrop-blur-sm rounded-xl px-[20px] font-medium text-[15px] placeholder:text-slate-500 transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                />

                <div className="w-full relative">
                  <motion.input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                    className="w-full h-[54px] bg-slate-900/50 border border-slate-700/50 hover:border-slate-600 focus:border-blue-500/50 backdrop-blur-sm rounded-xl px-[20px] pr-[50px] font-medium text-[15px] placeholder:text-slate-500 transition-all duration-300"
                    whileFocus={{ scale: 1.01 }}
                  />
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 hover:text-white cursor-pointer transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <IoEye size={20} /> : <IoEyeOutline size={20} />}
                  </motion.div>
                </div>

                {/* Premium Login Button */}
                <motion.button
                  type="submit"
                  className="w-full h-[54px] bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 hover:from-blue-500 hover:via-blue-400 hover:to-blue-500 rounded-xl flex items-center justify-center mt-[8px] text-[16px] font-bold shadow-lg shadow-blue-500/30 border border-blue-400/20 relative overflow-hidden group"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                </motion.button>

                {/* Sign Up Link */}
                <p className="flex gap-[8px] text-slate-300 text-[15px] mt-2">
                  Don't have an account?
                  <span
                    className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-colors relative group"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                    <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-400 group-hover:w-full transition-all duration-300" />
                  </span>
                </p>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Login;
