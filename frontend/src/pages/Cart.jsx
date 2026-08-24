import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdShoppingCartCheckout, MdLocalShipping } from 'react-icons/md';
import { shopDataContext } from '../context/ShopContext';
import Titles from '../components/Titles';
import CartTotal from '../components/CartTotal';
import toast from 'react-hot-toast';

function Cart() {
  const { products, currency, cartItem, updateQuantity, delivery_fee, getCartAmount } = useContext(shopDataContext);
  const [cartData, setCartData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const temp = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const quantity = cartItem[productId][size];
        if (quantity > 0) temp.push({ id: productId, size, quantity });
      }
    }
    setCartData(temp);
  }, [cartItem]);

  const handleRemove = (item, name) => {
    updateQuantity(item.id, item.size, 0);
    toast.success(`${name} removed from cart`);
  };

  const handleQtyChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      handleRemove(item, '');
    } else {
      updateQuantity(item.id, item.size, newQty);
    }
  };

  const subtotal = getCartAmount();
  const freeShippingThreshold = 999;
  const remainingForFreeShipping = freeShippingThreshold - subtotal;

  return (
    <motion.div
      className="w-full min-h-screen px-4 md:px-8 pb-28 md:pb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="text-center pt-24 pb-6">
        <Titles text1="YOUR" text2="CART" />
        {cartData.length > 0 && (
          <p className="text-slate-400 text-sm mt-1">{cartData.length} item{cartData.length !== 1 ? 's' : ''}</p>
        )}
      </div>

      {/* Free shipping banner */}
      {subtotal > 0 && remainingForFreeShipping > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-5 flex items-center gap-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm"
        >
          <MdLocalShipping className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-blue-300">
            Add <span className="font-bold text-white">₹{remainingForFreeShipping}</span> more for free delivery!
          </span>
          <div className="flex-1 h-1.5 bg-slate-700 rounded-full ml-2">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
              style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
            />
          </div>
        </motion.div>
      )}

      {subtotal > 0 && remainingForFreeShipping <= 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-5 flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm"
        >
          <MdLocalShipping className="w-5 h-5 text-green-400" />
          <span className="text-green-300 font-medium">You've unlocked free delivery!</span>
        </motion.div>
      )}

      {/* Layout */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartData.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-5"
            >
              <div className="text-7xl">🛒</div>
              <p className="text-white text-xl font-semibold">Your cart is empty</p>
              <p className="text-slate-400 text-sm">Explore our collections and find something you love</p>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/collections')}
                className="mt-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
              >
                Browse Collections
              </motion.button>
            </motion.div>
          ) : (
            <AnimatePresence>
              {cartData.map((item, index) => {
                const productData = products.find(p => p._id === item.id);
                if (!productData) return null;

                return (
                  <motion.div
                    key={`${item.id}-${item.size}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, height: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-slate-600 transition-colors"
                  >
                    {/* Image */}
                    <div
                      className="w-24 h-24 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-700 cursor-pointer shrink-0"
                      onClick={() => navigate(`/productdetails/${item.id}`)}
                    >
                      <img
                        src={productData.image1}
                        alt={productData.name}
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <p
                        className="text-white font-medium text-sm md:text-base truncate cursor-pointer hover:text-blue-300 transition-colors"
                        onClick={() => navigate(`/productdetails/${item.id}`)}
                      >
                        {productData.name}
                      </p>
                      <div className="flex items-center justify-center sm:justify-start gap-3 mt-1.5">
                        <span className="text-blue-300 font-semibold text-sm">{currency} {productData.price}</span>
                        <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-md border border-slate-600">
                          Size: {item.size}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs mt-1">
                        Subtotal: {currency} {productData.price * item.quantity}
                      </p>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-slate-700 rounded-xl p-1">
                        <button
                          onClick={() => handleQtyChange(item, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-600 text-white transition-colors"
                        >
                          <FiMinus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-white text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleQtyChange(item, +1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-600 text-white transition-colors"
                        >
                          <FiPlus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(item, productData.name)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors border border-red-500/20"
                      >
                        <RiDeleteBin6Line className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Sidebar Summary */}
        {cartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-[340px] shrink-0"
          >
            <CartTotal />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/placeorder')}
              className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all text-sm tracking-wide"
            >
              <MdShoppingCartCheckout className="w-5 h-5" />
              PROCEED TO CHECKOUT
            </motion.button>
            <button
              onClick={() => navigate('/collections')}
              className="w-full mt-3 text-slate-400 hover:text-white text-sm py-2 transition-colors"
            >
              ← Continue Shopping
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;
