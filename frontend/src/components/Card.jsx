import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { shopDataContext } from '../context/ShopContext';

function Card({ name, image, id, price }) {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useContext(shopDataContext);
  const isWishlisted = wishlist.includes(id);

  const handleClick = () => {
    if (!id) {
      toast.error("Product ID is missing!");
      return;
    }
    navigate(`/productdetails/${id}`);
  };

  const handleWishlistToggle = async (e) => {
    e.stopPropagation();
    if (!id) return;
    try {
      const added = await toggleWishlist(id);
      toast.success(added ? '❤️ Added to wishlist!' : '💔 Removed from wishlist');
    } catch {
      toast.error('Please log in to use wishlist');
    }
  };

  return (
    <motion.div
      className="w-[300px] max-w-[90%] h-[420px] backdrop-blur-xl rounded-2xl transition-all flex flex-col p-[12px] cursor-pointer border border-slate-700/40 shadow-2xl relative overflow-hidden group bg-gradient-to-br from-slate-900/80 to-slate-800/80"
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.04, y: -8 }}
    >
      {/* Premium Top Border */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      
      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500 rounded-2xl" />

      {/* Wishlist Button */}
      <motion.button
        className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 backdrop-blur-md border border-slate-600/40 flex items-center justify-center shadow-lg"
        onClick={handleWishlistToggle}
        whileTap={{ scale: 0.85 }}
        whileHover={{ scale: 1.15 }}
        title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500 text-[15px]" />
        ) : (
          <FaRegHeart className="text-slate-300 text-[15px] group-hover:text-red-400 transition-colors" />
        )}
      </motion.button>
      
      {/* Image Container */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          src={image}
          alt={name}
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[320px] object-cover rounded-xl group-hover:scale-110 transition-transform duration-500"
        />
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Content */}
      <div className="mt-4 px-2 relative z-10">
        <h3 className="text-white text-lg font-bold tracking-tight line-clamp-1">{name}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-blue-400 text-base font-bold">₹ {price}</p>
        </div>
      </div>
      
      {/* Bottom Shine */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />
    </motion.div>
  );
}

export default Card;
