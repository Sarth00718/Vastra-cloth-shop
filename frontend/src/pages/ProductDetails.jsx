import { useContext, useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdOutlineShoppingCart, MdArrowBack, MdLocalShipping, MdRefresh, MdVerifiedUser } from 'react-icons/md';
import { shopDataContext } from '../context/ShopContext';
import RelatedProducts from '../components/RelatedProducts';
import toast from 'react-hot-toast';
import Card, { CardSkeleton } from '../components/Card';

function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, wishlist, toggleWishlist, recentlyViewed, addToRecentlyViewed } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);

  useEffect(() => {
    const found = products.find((p) => p._id === productId);
    if (found) {
      setProductData(found);
      setActiveImage(found.image1);
      setSize('');
      addToRecentlyViewed(productId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [productId, products]);

  const handleAddToCart = useCallback(() => {
    if (!size) {
      toast.error('Please select a size first');
      return;
    }
    addToCart(productData._id, size);
    toast.success('Added to cart! 🛒');
  }, [size, productData, addToCart]);

  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
  }, []);

  if (!productData) {
    return (
      <div className="w-full pt-24 px-4">
        <div className="max-w-6xl mx-auto flex gap-10">
          <div className="w-1/2 h-[450px] bg-slate-800 rounded-2xl animate-pulse" />
          <div className="w-1/2 flex flex-col gap-4">
            {[200, 100, 150, 80, 120].map((w, i) => (
              <div key={i} className={`h-6 bg-slate-800 rounded animate-pulse`} style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
  const isWishlisted = wishlist.includes(productData._id);

  const recentProducts = products.filter(
    (p) => recentlyViewed.includes(p._id) && p._id !== productId
  ).slice(0, 4);

  return (
    <div className="w-full pt-20 md:pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
        >
          <MdArrowBack className="w-4 h-4" /> Back
        </button>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col lg:flex-row gap-4 lg:w-1/2"
          >
            {/* Thumbnails */}
            <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-slate-700'
                  }`}
                >
                  <img src={img} alt="" referrerPolicy="no-referrer-when-downgrade" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image with zoom */}
            <div
              className="flex-1 order-1 lg:order-2 rounded-2xl overflow-hidden bg-slate-800 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => { setIsZooming(false); setZoomStyle({}); }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={activeImage}
                  alt={productData.name}
                  referrerPolicy="no-referrer-when-downgrade"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-100"
                  style={isZooming ? zoomStyle : {}}
                />
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-1/2 flex flex-col gap-5 text-white"
          >
            {/* Badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                {productData.category}
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                {productData.subCategory}
              </span>
              {productData.bestseller && (
                <span className="text-xs font-bold uppercase tracking-widest text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                  ⭐ Bestseller
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{productData.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-sm gap-0.5">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
              </div>
              <span className="text-slate-400 text-sm">4.5 (125 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-bold text-blue-300">{currency} {productData.price}</p>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-lg">{productData.description}</p>

            {/* Size selector */}
            <div>
              <p className="text-sm font-semibold text-slate-300 mb-2">
                Select Size {!size && <span className="text-red-400 text-xs ml-1">* required</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] h-[44px] px-3 rounded-xl border-2 font-semibold text-sm transition-all ${
                      s === size
                        ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-lg shadow-blue-500/20'
                        : 'border-slate-700 bg-slate-800/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex gap-3 mt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 transition-colors"
              >
                <MdOutlineShoppingCart className="w-5 h-5" /> Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={async () => {
                  try {
                    const added = await toggleWishlist(productData._id);
                    toast.success(added ? '❤️ Saved to wishlist!' : 'Removed from wishlist');
                  } catch { toast.error('Please log in first'); }
                }}
                className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition-all ${
                  isWishlisted
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-red-500/50 hover:text-red-400'
                }`}
              >
                {isWishlisted ? <FaHeart className="text-lg" /> : <FaRegHeart className="text-lg" />}
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              {[
                { icon: MdVerifiedUser, text: '100% Original Product Guaranteed' },
                { icon: MdLocalShipping, text: 'Free delivery on orders above ₹999' },
                { icon: MdRefresh, text: 'Easy 7-day return & exchange policy' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-slate-400 text-sm">
                  <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Description / Reviews tabs ── */}
        <div className="mt-14">
          <div className="flex gap-4 border-b border-slate-800 mb-6">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-300'
                    : 'border-transparent text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab === 'reviews' ? 'Reviews (125)' : 'Description'}
              </button>
            ))}
          </div>

          {activeTab === 'description' ? (
            <div className="max-w-2xl text-slate-300 text-sm leading-relaxed bg-slate-800/40 p-6 rounded-xl border border-slate-700/50">
              <p>{productData.description}</p>
              <p className="mt-3">Upgrade your wardrobe with this stylish piece, crafted from breathable high-quality fabric for all-day comfort and effortless style. Easy to maintain and perfect for any setting.</p>
            </div>
          ) : (
            <div className="text-slate-400 text-sm">Reviews coming soon...</div>
          )}
        </div>

        {/* ── Related Products ── */}
        <RelatedProducts subCategory={productData.subCategory} currentProductId={productData._id} />

        {/* ── Recently Viewed ── */}
        {recentProducts.length > 0 && (
          <div className="mt-14">
            <h3 className="text-white font-bold text-xl mb-6">Recently Viewed</h3>
            <div className="flex flex-wrap gap-5">
              {recentProducts.map((p) => (
                <Card key={p._id} id={p._id} name={p.name} price={p.price} image={p.image1} sizes={p.sizes} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
