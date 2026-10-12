import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LuLayoutDashboard, LuCirclePlus, LuPackage, LuShoppingBag, LuGlobe } from 'react-icons/lu';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LuLayoutDashboard, path: '/admin' },
  { label: 'Add Product', icon: LuCirclePlus, path: '/admin/add' },
  { label: 'Products', icon: LuPackage, path: '/admin/lists' },
  { label: 'Orders', icon: LuShoppingBag, path: '/admin/orders' },
];

function SidebarContent({ pathname, onNavigate, onClose }) {
  return (
    <div className="flex flex-col h-full justify-between">
      {/* Decorative gradient border */}
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/20 to-transparent pointer-events-none" />

      {/* Nav items list */}
      <nav className="flex flex-col gap-1.5 px-3 pt-6 flex-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2">
          Admin Menu
        </p>
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <motion.button
              key={path}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate(path)}
              className={`relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all group w-full text-left cursor-pointer ${
                isActive
                  ? 'bg-blue-600/15 text-blue-300 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {/* Active vertical bar indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full" />
              )}
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400 transition-colors'}`} />
              <span>{label}</span>
              {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/80" />}
            </motion.button>
          );
        })}
      </nav>

      {/* Back to Live Storefront footer button */}
      <div className="p-3 border-t border-slate-800/60 mt-auto">
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onNavigate('/')}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all group w-full text-left cursor-pointer"
        >
          <LuGlobe className="w-5 h-5 shrink-0 text-blue-400/80 group-hover:text-blue-400 transition-colors" />
          <span>Back to Website</span>
        </motion.button>
      </div>
    </div>
  );
}

function Sidebar({ isOpen = false, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex w-[240px] fixed top-0 left-0 bottom-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/60 z-20 pt-[64px] flex-col">
        <SidebarContent pathname={pathname} onNavigate={handleNavigate} />
      </aside>

      {/* Mobile Drawer and Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Mobile Slide-in Drawer */}
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 w-[260px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-r border-slate-800/80 z-50 pt-[64px] flex flex-col shadow-2xl md:hidden"
            >
              <SidebarContent pathname={pathname} onNavigate={handleNavigate} onClose={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;