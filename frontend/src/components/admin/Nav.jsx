import { useContext, useState, useRef, useEffect } from "react";
import logo from "../../assets/admin/vogo.png";
import { userDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LuGlobe, 
  LuLogOut, 
  LuMenu, 
  LuX,
  LuLayoutDashboard,
  LuCirclePlus,
  LuPackage,
  LuShoppingBag
} from "react-icons/lu";

// ─── REUSABLE DROPDOWN ITEM ──────────────────────────────────────────────────
const DropdownItem = ({ icon: Icon, label, onClick, danger, accent }) => (
  <li>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        if (onClick) onClick(e);
      }}
      className={`
        w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors duration-150 text-left group
        ${danger 
          ? 'text-red-400 hover:text-red-300 hover:bg-red-500/15' 
          : accent 
          ? 'text-blue-400 font-bold hover:bg-blue-500/15' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800/80 active:bg-slate-800'}
      `}
    >
      <div className={`
        w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 pointer-events-none
        ${danger ? 'bg-red-500/10 group-hover:bg-red-500/20' : accent ? 'bg-blue-500/10 group-hover:bg-blue-500/20' : 'bg-slate-800 group-hover:bg-slate-700'}
      `}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs sm:text-[13px] font-medium tracking-wide pointer-events-none">{label}</span>
    </button>
  </li>
);

function Nav({ onToggleSidebar, isSidebarOpen }) {
  const { user, setUser, setAdmin } = useContext(userDataContext);
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setShowProfile(false);
    try {
      await api.get('/api/auth/logout');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("vastra_guest_cart");
      setUser(null);
      setAdmin(null);
      toast.success("Logout successful!");
      navigate("/login");
    }
  };

  return (
    <header className="w-full h-[64px] fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-slate-950/95 via-slate-900/95 to-slate-950/95 shadow-2xl border-b border-slate-800/50 backdrop-blur-xl">
      {/* Top accent line matching main site */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Content wrapper aligned with main site header height and padding */}
      <div className="h-[64px] px-4 sm:px-6 md:px-8 flex items-center justify-between relative">
        
        {/* Left section: Hamburger (mobile) + Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle button */}
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60 transition-colors focus:outline-none"
          >
            {isSidebarOpen ? <LuX className="w-5 h-5 text-blue-400" /> : <LuMenu className="w-5 h-5 text-blue-400" />}
          </button>

          {/* Logo with blue glow effect identical to main website */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2.5 cursor-pointer relative select-none"
            onClick={() => navigate('/admin')}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full" />
              <img
                src={logo}
                alt="Vastra Logo"
                className="w-[26px] md:w-[30px] relative drop-shadow-[0_0_12px_rgba(59,130,246,0.7)]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[20px] md:text-[22px] font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent"
                style={{ fontFamily: 'Poppins, sans-serif', letterSpacing: '-0.02em' }}
              >
                Vastra
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Admin
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right Section: Shortcut to Live Website + Profile dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Main Website Shortcut Button */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 bg-slate-800/60 hover:bg-slate-700/80 rounded-xl border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-sm"
            title="Open Live Storefront"
          >
            <LuGlobe className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">Live Store</span>
          </motion.button>

          {/* Profile Dropdown */}
          <div ref={profileRef} className="relative">
            {/* Avatar Trigger Button */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowProfile((prev) => !prev)}
              aria-label="Admin account menu"
              aria-expanded={showProfile}
              className="relative flex items-center justify-center cursor-pointer focus:outline-none"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/30 blur-md rounded-full" />
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600/20 text-white rounded-full flex items-center justify-center uppercase text-sm font-bold shadow-lg shadow-blue-500/30 border border-blue-400/30 relative hover:shadow-blue-500/50 transition-all">
                  {user?.name?.charAt(0) || 'A'}
                </div>
              </div>
            </motion.button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute top-[125%] right-0 w-56 bg-slate-900/98 border border-slate-800/80 rounded-2xl z-50 shadow-2xl shadow-black/70 backdrop-blur-2xl overflow-hidden p-2"
                >
                  {/* Subtle top glow */}
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                  
                  <div className="px-3 py-2 border-b border-slate-800/80 mb-1 select-none">
                    <p className="text-white text-xs font-semibold truncate">{user?.name || 'Administrator'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email || 'admin@vastra.com'}</p>
                  </div>

                  <ul className="flex flex-col gap-0.5">
                    <DropdownItem 
                      icon={LuLayoutDashboard} 
                      label="Dashboard" 
                      onClick={() => { setShowProfile(false); navigate('/admin'); }} 
                    />
                    <DropdownItem 
                      icon={LuShoppingBag} 
                      label="Manage Orders" 
                      onClick={() => { setShowProfile(false); navigate('/admin/orders'); }} 
                    />
                    <DropdownItem 
                      icon={LuPackage} 
                      label="Products" 
                      onClick={() => { setShowProfile(false); navigate('/admin/lists'); }} 
                    />
                    <DropdownItem 
                      icon={LuCirclePlus} 
                      label="Add Product" 
                      onClick={() => { setShowProfile(false); navigate('/admin/add'); }} 
                    />

                    <div className="h-px bg-slate-800/60 my-1 mx-2" />

                    <DropdownItem 
                      icon={LuGlobe} 
                      label="Live Store" 
                      accent 
                      onClick={() => { setShowProfile(false); navigate('/'); }} 
                    />

                    <div className="h-px bg-slate-800/60 my-1 mx-2" />

                    <DropdownItem 
                      icon={LuLogOut} 
                      label="Logout" 
                      danger 
                      onClick={handleLogout} 
                    />
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Nav;
