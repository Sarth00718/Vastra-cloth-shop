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
      console.log(error);
      toast.error("Google login failed. Please try again.");
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
        className="w-full h-[90px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[40px]" src={Vogo} alt="Logo" />
        <h1 className="text-[22px] text-cyan-300 font-sans">Vastra</h1>
      </div>

      {/* Title */}
      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[25px] font-semibold">Login </span>
        <span className="text-[16px]">Welcome back to Vastra</span>
      </div>

      {/* Form Card */}
      <div className="max-w-[600px] w-[90%] h-[400px] bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
        <form
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
          onSubmit={handleLogin}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-[90%] h-[50px] bg-[#2a3e78] rounded-lg flex items-center justify-center gap-[10px] py-[20px] cursor-pointer"
            onClick={googlelogin}
          >
            <img src={google} alt="Google icon" className="w-[20px]" />
            Login with Google
          </motion.div>

          <div className="w-[100%] h-[20px] flex justify-center items-center gap-[10px]">
            <div className="w-[40%] h-[1px] bg-[rgb(52,88,85)]" />
            OR
            <div className="w-[40%] h-[1px] bg-[rgb(52,88,85)]" />
          </div>

          <div className="w-[87%] flex flex-col items-center justify-center gap-[15px]">
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
              className="w-full h-[50px] bg-[#333381] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Login
            </motion.button>

            <p className="flex gap-[10px]">
              Don't have an account?
              <span
                className="text-[#5555f6cf] text-[17px] font-semibold cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </span>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Login;
