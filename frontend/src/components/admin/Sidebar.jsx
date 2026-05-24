import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaListUl } from 'react-icons/fa';
import { MdOutlineReceiptLong, MdDashboard, MdOutlineWeb } from 'react-icons/md';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: MdDashboard, path: '/admin' },
  { label: 'Add Product', icon: IoIosAddCircleOutline, path: '/admin/add' },
  { label: 'Products', icon: FaListUl, path: '/admin/lists' },
  { label: 'Orders', icon: MdOutlineReceiptLong, path: '/admin/orders' },
];

function Sidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <aside className="w-[240px] min-h-screen fixed top-0 left-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/60 z-[5] pt-[75px] flex flex-col">
      {/* Decorative right gradient */}
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/25 to-transparent" />

      <nav className="flex flex-col gap-1 px-3 pt-6 flex-1">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <motion.button
              key={path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(path)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all group w-full text-left ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}`} />
              <span>{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </motion.button>
          );
        })}
      </nav>

      {/* Back to Website Link */}
      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all group w-full text-left"
        >
          <MdOutlineWeb className="w-5 h-5 shrink-0 group-hover:text-blue-400 transition-colors" />
          <span>Back to Website</span>
        </motion.button>
      </div>
    </aside>
  );
}

export default Sidebar;