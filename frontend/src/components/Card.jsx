import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { MdOutlineShoppingCart } from 'react-icons/md';
import { shopDataContext } from '../context/ShopContext';
import toast from 'react-hot-toast';

// ─── SKELETON ────────────────────────────────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="w-[220px] sm:w-[240px] flex flex-col gap-3 animate-pulse">
      <div className="w-full h-[280px] bg-slate-800 rounded-2xl" />
      <div className="h-4 bg-slate-800 rounded w-3/4" />
      <div className="h-4 bg-slate-800 rounded w-1/3" />
    </div>
  );
}

// ─── CARD ────────────────────────────────────────────────────────────────────
function Card({ id, name, price, image, category, subCategory, sizes = [] }) {
  const navigate = useNavigate();
  const { currency, wishlist, toggleWishlist, addToCart } = useContext(shopDataContext);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [hovering, setHovering] = useState(false);
  const isWishlisted = wishlist.includes(id);

  const handleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const added = await toggleWishlist(id);
      toast.success(added ? '❤️ Saved to wishlist!' : 'Removed from wishlist');
    } catch {
      toast.error('Please log in first');
    }
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    if (sizes.length === 1) {
      addToCart(id, sizes[0]);
      toast.success('Added to cart!');
    } else {
      navigate(`/productdetails/${id}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="w-[220px] sm:w-[240px] cursor-pointer group"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onClick={() => navigate(`/productdetails/${id}`)}
    >
      {/* Image Container */}
      <div className="relative w-full h-[280px] rounded-2xl overflow-hidden bg-slate-800 shadow-lg">
        {/* Skeleton shimmer */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-slate-800 animate-pulse" />
        )}
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Overlay actions */}
        <AnimatePresence>
          {hovering && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent pointer-events-none"
            >
              {/* Quick add to cart */}
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ delay: 0.05 }}
                onClick={handleQuickAdd}
                className="absolute bottom-3 left-3 right-3 z-20 pointer-events-auto flex items-center justify-center gap-2 bg-blue-600/95 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors shadow-lg border border-blue-400/40"
              >
                <MdOutlineShoppingCart className="w-4 h-4" />
                {sizes.length === 1 ? 'Add to Cart' : 'Select Size'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-black/40 text-white hover:bg-black/60'
          }`}
        >
          {isWishlisted ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
        </button>

        {/* Category badge */}
        {category && (
          <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-slate-900/70 text-slate-300 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 px-1 flex flex-col gap-1">
        <p className="text-white text-sm font-medium truncate leading-snug">{name}</p>
        <div className="flex items-center justify-between">
          <p className="text-blue-300 font-semibold text-sm">
            {currency} {price}
          </p>
          <div className="flex items-center gap-0.5 text-yellow-400 text-xs">
            <FaStar />
            <span className="text-slate-400">4.5</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Card;
