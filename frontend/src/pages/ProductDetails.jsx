import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import RelatedProducts from '../components/RelatedProducts';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function ProductDetails() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');

  useEffect(() => {
    const foundProduct = products.find((item) => item._id === productId);
    if (foundProduct) {
      setProductData(foundProduct);
      setImage(foundProduct.image1);
    }
  }, [productId, products]);

  if (!productData) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white text-lg">
        Loading product details...
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!size) {
      toast.error('Please select a size before adding to cart.');
      return;
    }
    addToCart(productData._id, size);
    toast.success('Added to cart!');
  };

  return (
    <div className="w-full pt-20 md:pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-10 py-10"
      >
        {/* Images */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row gap-6 w-full lg:w-1/2"
        >
          <div className="flex lg:flex-col gap-4">
            {[productData.image1, productData.image2, productData.image3, productData.image4]
              .filter(Boolean)
              .map((img, idx) => (
                <div
                  key={idx}
                  className="w-[60px] h-[80px] md:w-[100px] md:h-[110px] bg-slate-300 border border-[#80808049] rounded-md overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setImage(img)}
                    className="w-full h-full object-cover cursor-pointer rounded-md"
                  />
                </div>
              ))}
          </div>

          <div className="flex-1 overflow-hidden">
            <img
              src={image}
              alt={productData.name}
              className="w-full h-[95%] object-cover rounded-lg"
            />
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full lg:w-1/2 flex flex-col gap-4 text-white"
        >
          <h1 className="text-2xl md:text-3xl font-bold">{productData.name.toUpperCase()}</h1>

          <div className="flex items-center gap-1">
            <FaStar className="text-[18px] md:text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[18px] md:text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[18px] md:text-[20px] fill-[#FFD700]" />
            <FaStar className="text-[18px] md:text-[20px] fill-[#FFD700]" />
            <FaStarHalfAlt className="text-[18px] md:text-[20px] fill-[#FFD700]" />
            <span className="text-xs md:text-sm text-gray-300 ml-2">(125)</span>
          </div>

          <p className="text-lg font-medium">
            Price: {currency} {productData.price}
          </p>

          <p className="text-sm md:text-base text-gray-200 max-w-[500px]">
            {productData.description || 'GOOD LOOK! AMAZING PRODUCT.'}
          </p>

          <div className="flex flex-col gap-2 my-2">
            <p className="text-lg font-semibold">Select Size</p>
            <div className="flex gap-2 flex-wrap">
              {productData.sizes.map((item, index) => (
                <button
                  key={index}
                  className={`border py-2 px-4 bg-[#768c9f] rounded-md ${
                    item === size ? 'bg-[#072643] text-[#2f97f1] text-[18px]' : ''
                  }`}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-base cursor-pointer bg-[#495b61c9] py-2 px-6 rounded-2xl mt-3 border border-[#80808049] text-white shadow-md shadow-black w-fit hover:bg-slate-500"
            onClick={handleAddToCart}
          >
            Add To Cart
          </motion.button>

          <div className="text-sm md:text-base text-white space-y-1 mt-4">
            <p>✅ 100% Original Product.</p>
            <p>💰 Cash on delivery is available on this product.</p>
            <p>🔁 Easy return and exchange policy within 7 days.</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[1400px] mx-auto px-2 md:px-4 py-10"
      >
        <div className="flex gap-4 mb-6">
          <p className="border px-4 py-2 md:px-5 md:py-3 text-sm md:text-base text-white cursor-pointer">Description</p>
          <p className="border px-4 py-2 md:px-5 md:py-3 text-sm md:text-base text-white cursor-pointer">Reviews (124)</p>
        </div>

        <div className="w-full max-w-[1000px] bg-[#3336397c] border text-white text-sm md:text-base px-4 md:px-6 py-4 md:py-6 rounded-md">
          <p>
            Upgrade your wardrobe with this stylish slim-fit cotton shirt, available now on <strong>Vastra</strong>. Crafted from breathable, high-quality fabric, it offers all-day comfort and effortless style. Easy to maintain and perfect for any setting, this shirt is a must-have essential for those who value both fashion and function.
          </p>
        </div>

        {/* Related Products */}
        <RelatedProducts
          subCategory={productData.subCategory}
          currentProductId={productData._id}
        />
      </motion.div>
    </div>
  );
}

export default ProductDetails;
