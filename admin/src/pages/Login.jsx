import { useState, useContext } from "react";
import axios from "axios";
import Vogo from "../assets/vogo.png";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOutline } from "react-icons/io5";
import { authDataContext } from "../context/AuthContext";
import { motion } from 'framer-motion';
import { adminDataContext } from "../context/AdminContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <img className="w-[40px]" src={Vogo} alt="Logo" />
        <h1 className="text-[22px] text-cyan-300 font-sans">Vastra</h1>
      </div>

      {/* Title */}
      <div className="w-full h-[100px] flex items-center justify-center flex-col gap-[10px]">
        <span className="text-[25px] font-semibold">Login</span>
        <span className="text-[16px]">Welcome back to Vastra , For Admin Login</span>
      </div>

      {/* Form Card */}
      <div className="max-w-[600px] w-[90%] h-[300px] bg-[#00000025] border border-[#96969635] backdrop-blur-2xl rounded-lg shadow-lg flex items-center justify-center">
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full h-[50px] bg-[#333381] rounded-lg flex items-center justify-center mt-[20px] text-[17px] font-semibold"
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
