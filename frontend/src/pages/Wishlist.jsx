import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaHeart, FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import toast from 'react-hot-toast';

function Wishlist() {
  const navigate = useNavigate();
  const { wishlist, products, toggleWishlist } = useContext(shopDataContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p._id));

  const handleRemove = async (productId, productName) => {
    try {
      await toggleWishlist(productId);
      toast.success(`💔 "${productName}" removed from wishlist`);
    } catch {
      toast.error('Failed to remove from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    // For wishlist quick-add, we navigate to product details to pick a size
    navigate(`/productdetails/${product._id}`);
    toast('Select a size to add to cart 👆', { icon: '👕' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -50, scale: 0.9, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-28 pb-24 px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaHeart className="text-red-500 text-3xl" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
              My Wishlist
            </h1>
          </div>
          <p className="text-slate-400 text-base md:text-lg">
            {wishlistProducts.length > 0
              ? `${wishlistProducts.length} item${wishlistProducts.length !== 1 ? 's' : ''} saved for later`
              : 'Your wishlist is waiting to be filled'}
          </p>
        </motion.div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-24"
          >
            <div className="relative inline-block mb-8">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-red-500/20 to-pink-500/20 flex items-center justify-center mx-auto border border-red-500/20">
                <FaHeart className="text-5xl text-red-400/50" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold border border-slate-600">
                0
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-300 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-slate-500 mb-10 max-w-md mx-auto">
              Tap the ❤️ heart on any product to save it here. Come back anytime to shop your saved items.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/collections')}
              className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl font-semibold text-white shadow-lg shadow-blue-500/30 transition-all"
            >
              Browse Collections
            </motion.button>
          </motion.div>
        ) : (
          <>
            {/* Wishlist Grid */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            >
              <AnimatePresence>
                {wishlistProducts.map((product) => (
                  <motion.div
                    key={product._id}
                    variants={itemVariants}
                    exit="exit"
                    layout
                    className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 border border-slate-700/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                  >
                    {/* Product Image */}
                    <div
                      className="relative overflow-hidden cursor-pointer h-[260px]"
                      onClick={() => navigate(`/productdetails/${product._id}`)}
                    >
                        <img
                        src={product.image1}
                        alt={product.name}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                      {/* Remove Button */}
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemove(product._id, product.name);
                        }}
                        className="absolute top-3 right-3 w-9 h-9 bg-red-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                        title="Remove from wishlist"
                      >
                        <FaTrashAlt className="text-white text-sm" />
                      </motion.button>

                      {/* Category Badge */}
                      <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold bg-blue-600/80 backdrop-blur-sm text-white rounded-full">
                        {product.category} · {product.subCategory}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3
                        className="text-white font-bold text-lg line-clamp-1 cursor-pointer hover:text-blue-300 transition-colors mb-1"
                        onClick={() => navigate(`/productdetails/${product._id}`)}
                      >
                        {product.name}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-3">{product.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-blue-400 font-bold text-xl">₹{product.price}</span>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleAddToCart(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-blue-500/20"
                        >
                          <FaShoppingCart className="text-xs" />
                          Add to Cart
                        </motion.button>
                      </div>

                      {/* Sizes */}
                      {product.sizes && product.sizes.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {product.sizes.map((size) => (
                            <span
                              key={size}
                              className="px-2 py-0.5 text-xs bg-slate-700/60 text-slate-300 rounded-md border border-slate-600/40"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Bottom Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/collections')}
                className="px-8 py-3 border border-blue-500/40 text-blue-300 hover:bg-blue-600/20 rounded-2xl font-semibold transition-all"
              >
                Continue Shopping
              </motion.button>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default Wishlist;
