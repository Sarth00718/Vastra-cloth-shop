import { useState, useContext } from "react";
import Vogo from "../assets/vogo.png";
import google from "../assets/google.png";
import { useNavigate } from "react-router-dom";
import { IoEyeOutline, IoEye } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/Firebase";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Registration() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { serverurl } = useContext(authDataContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  let { getCurrentUser } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverurl}/api/auth/register`,
        { name, email, password },
        { withCredentials: true 
         }
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Registration successful!");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed!");
    }
  };

  const googlesignup = async () => {
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
      localStorage.setItem("token", reslt.data.token);
      toast.success("Google sign-in successful!");
      getCurrentUser();
      navigate("/");
    }
    catch (error) {
      console.error("Google signup error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Sign-up cancelled. Please try again.");
      } else if (error.code === 'auth/popup-blocked') {
        toast.error("Popup blocked. Please allow popups for this site.");
      } else if (error.response) {
        toast.error(error.response.data.message || "Server error. Please try again.");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Google sign-in failed. Please try again.");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[100vw] h-[100vh] text-white flex flex-col items-center justify-start"
    >
      {/* Header */}
      <div
        className="w-full h-[60px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[45px] drop-shadow-[0_0_10px_rgba(33,150,243,0.6)]" src={Vogo} alt="Logo" />
        <h1 className="text-[26px] text-blue-300 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Vastra</h1>
      </div>

      {/* Title Section */}
      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[28px] font-bold text-blue-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Registration</span>
        <span className="text-[17px] text-blue-200/80">Welcome to Vastra, place your order</span>
      </div>

      {/* Form Card */}
      <div className="max-w-[600px] w-[90%] h-[500px] bg-gradient-to-br from-[#0d1f3c]/40 to-[#1a2f4d]/40 border border-blue-700/30 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-blue-900/30 flex items-center justify-center">
        <form
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
          onSubmit={handleSignup}
        >
          <motion.div
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(33, 150, 243, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="w-[90%] h-[50px] bg-gradient-to-r from-blue-700 to-blue-600 rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer shadow-lg shadow-blue-900/30 font-semibold"
            onClick={googlesignup}
          >
            <img src={google} alt="Google icon" className="w-[22px]" />
            Register with Google
          </motion.div>

          <div className="w-[100%] h-[20px] flex justify-center items-center gap-[10px] text-blue-300/70">
            <div className="w-[40%] h-[1px] bg-blue-700/40" />
            OR
            <div className="w-[40%] h-[1px] bg-blue-700/40" />
          </div>

          <div className="w-[87%] flex flex-col items-center justify-center gap-[15px]">
            <motion.input
              type="text"
              placeholder="Username"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
              className="w-full h-[50px] border-2 border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#fffffc7] px-[20px] font-semibold"
              whileFocus={{ scale: 1.02, borderColor: "#22d3ee" }}
            />
            <motion.input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full h-[50px] border-2 border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#fffffc7] px-[20px] font-semibold"
              whileFocus={{ scale: 1.02, borderColor: "#22d3ee" }}
            />
            <div className="w-full relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full h-[50px] border-2 border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#fffffc7] px-[20px] font-semibold pr-[50px]"
                whileFocus={{ scale: 1.02, borderColor: "#22d3ee" }}
              />
              {showPassword ? (
                <motion.div
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => setShowPassword(false)}
                  whileTap={{ scale: 0.8 }}
                >
                  <IoEye />
                </motion.div>
              ) : (
                <motion.div
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => setShowPassword(true)}
                  whileTap={{ scale: 0.8 }}
                >
                  <IoEyeOutline />
                </motion.div>
              )}
            </div>
            <motion.button
              type="submit"
              className="w-full h-[50px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-bold shadow-lg shadow-blue-900/40"
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(33, 150, 243, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Create Account
            </motion.button>
            <p className="flex gap-[10px] text-blue-200">
              Already have an account?
              <span
                className="text-blue-400 text-[17px] font-semibold cursor-pointer hover:text-blue-300 transition-colors"
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Registration;
