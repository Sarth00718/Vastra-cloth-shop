import React, { useState, useContext } from "react";
import Vogo from "../assets/vogo.png";
import google from "../assets/google.png";
import { useNavigate, useLocation } from "react-router-dom";
import { LuEye, LuEyeOff, LuMail, LuLock, LuArrowRight } from "react-icons/lu";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, googleLoginUser } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await loginUser(email, password);
      toast.success("Welcome back! Login successful.");
      
      await getCurrentUser();

      const from = location.state?.from;
      if (data?.user?.role === 'admin') {
        navigate(from || "/admin");
      } else {
        const target = from && !from.startsWith('/admin') ? from : "/";
        navigate(target);
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const { name, email, sub } = userInfo.data;

        const data = await googleLoginUser(name, email, sub);
        toast.success("Google login successful!");

        await getCurrentUser();

        const from = location.state?.from;
        if (data?.user?.role === 'admin') {
          navigate(from || "/admin");
        } else {
          const target = from && !from.startsWith('/admin') ? from : "/";
          navigate(target);
        }
      } catch (error) {
        console.error("Google login error:", error);
        toast.error(error?.response?.data?.message || "Google authentication failed.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (error) => {
      console.error("Google OAuth Error:", error);
      toast.error("Google sign-in was cancelled or encountered an error.");
    },
  });

  const handleGoogleLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      toast.error("Please set VITE_GOOGLE_CLIENT_ID in your frontend/.env file.");
      return;
    }
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-white flex flex-col justify-between relative overflow-hidden font-['Poppins',sans-serif]">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Top Navbar Header */}
      <header className="w-full px-8 py-6 flex items-center justify-between relative z-20">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/30 blur-lg rounded-full group-hover:bg-blue-400/50 transition-all duration-300" />
            <img className="w-10 relative drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" src={Vogo} alt="Vastra Logo" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-blue-300 bg-clip-text text-transparent tracking-tight">
            Vastra
          </span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate("/signup", { state: location.state })}
          className="px-5 py-2 rounded-full border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/80 hover:border-slate-500 text-sm font-medium transition-all duration-300 backdrop-blur-md"
        >
          Create Account
        </motion.button>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Main Glassmorphic Card */}
          <div className="relative rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-2xl p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Ambient Lighting Stripe */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-400" />

            {/* Header Text */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl font-extrabold text-white tracking-tight"
              >
                Welcome Back
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-slate-400 mt-2"
              >
                Sign in to manage your orders & shopping bag
              </motion.p>
            </div>

            {/* Google Login Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className={`w-full py-3.5 px-4 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition-all duration-300 flex items-center justify-center gap-3 font-medium text-sm text-slate-200 shadow-sm ${
                googleLoading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <img src={google} alt="Google" className="w-5 h-5" />
                  <span>Continue with Google</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="flex items-center my-6 gap-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">Or email</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Email Address</label>
                <div className="relative flex items-center">
                  <LuMail className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 tracking-wider uppercase">Password</label>
                </div>
                <div className="relative flex items-center">
                  <LuLock className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3.5 pl-11 pr-12 rounded-2xl bg-slate-950/60 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-200 transition-colors p-1"
                  >
                    {showPassword ? <LuEyeOff className="w-4 h-4" /> : <LuEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={!isLoading ? { scale: 1.01 } : {}}
                whileTap={!isLoading ? { scale: 0.99 } : {}}
                disabled={isLoading}
                className={`w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-300 mt-2 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <LuArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Bottom Redirect Link */}
            <div className="text-center mt-8 pt-6 border-t border-slate-800/80">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup", { state: location.state })}
                  className="font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                >
                  Sign up now
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-slate-500 relative z-20">
        © {new Date().getFullYear()} Vastra Clothing. All rights reserved.
      </footer>
    </div>
  );
}

export default Login;
