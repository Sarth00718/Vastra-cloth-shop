import { useState, useContext } from "react";
import axios from "axios";
import Vogo from "../assets/vogo.png";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import { motion } from 'framer-motion';
import { adminDataContext } from "../context/AdminContext";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { serverurl } = useContext(authDataContext);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { admin, getAdmin } = useContext(adminDataContext);


  const AdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${serverurl}/api/auth/adminlogin`,
        { email, password },
        { withCredentials: true }
      );
      console.log(res.data);
      localStorage.setItem("token", res.data.token);

      toast.success("Login successful!");
      getAdmin();
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh]  text-white flex flex-col items-center justify-start">
      {/* Header */}
      <div
        className="w-full h-[90px] flex items-center justify-start px-[30px] gap-[10px] cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img className="w-[45px] drop-shadow-[0_0_10px_rgba(33,150,243,0.6)]" src={Vogo} alt="Logo" />
        <h1 className="text-[26px] text-blue-300 font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>Vastra</h1>
      </div>

      {/* Title */}
      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[28px] font-bold text-blue-100" style={{ fontFamily: 'Poppins, sans-serif' }}>Admin Login</span>
        <span className="text-[17px] text-blue-200/80">Welcome back to Vastra Admin Panel</span>
      </div>

      {/* Form Card */}
      <div className="max-w-[600px] w-[90%] h-[300px] bg-gradient-to-br from-[#0d1f3c]/40 to-[#1a2f4d]/40 border border-blue-700/30 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-blue-900/30 flex items-center justify-center">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-[90%] h-[90%] flex flex-col items-center justify-start gap-[20px]"
          onSubmit={AdminLogin} >

          <div className="w-[87%] flex flex-col items-center mt-[33px] justify-center gap-[15px]">
            <input
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="w-full h-[50px] border-2 border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#fffffc7] px-[20px] font-semibold"
            />
            <div className="w-full relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
                className="w-full h-[50px] border-2 border-[#96969635] backdrop-blur-sm rounded-lg shadow-lg bg-transparent placeholder-[#fffffc7] px-[20px] font-semibold pr-[50px]"
              />
              {showPassword ? (
                <IoEye
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoEyeOutline
                  className="absolute top-4 right-4 text-white cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(33, 150, 243, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full h-[50px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-bold shadow-lg shadow-blue-900/40"
            >
              Login
            </motion.button>

          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default Login;
