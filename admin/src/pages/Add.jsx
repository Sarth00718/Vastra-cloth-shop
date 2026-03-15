import { useState, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import upload from '../assets/upload.png';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Add() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Men");
  const [price, setPrice] = useState("");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);
  const { serverurl } = useContext(authDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      [image1, image2, image3, image4].forEach((img, i) => formData.append(`image${i + 1}`, img));
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));

      await axios.post(`${serverurl}/api/product/addproduct`, formData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      toast.success("Product added successfully!");

      // Reset form
      setName(""); setDescription(""); setPrice(""); setCategory("Men");
      setSubCategory("Topwear"); setBestSeller(false); setSizes([]);
      setImage1(null); setImage2(null); setImage3(null); setImage4(null);
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product. Please try again.");
    }
  };

  const sizeOptions = ["S", "M", "L", "XL", "XXL"];

  return (
    <div className='w-full min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-gray-200 font-poppins'>
      <Nav />
      <Sidebar />

      <div className="pl-[18%] pt-[95px] pr-6 md:pr-12 pb-12 min-h-screen">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-8">
              Add Product Page
            </h2>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-6"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Upload Images */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <p className="text-lg font-semibold text-cyan-300 mb-4">Upload Images</p>
              <div className='flex flex-wrap gap-4'>
                {[image1, image2, image3, image4].map((img, idx) => (
                  <label key={idx} className='cursor-pointer group'>
                    <img
                      src={img ? URL.createObjectURL(img) : upload}
                      alt="product"
                      className='w-[100px] h-[100px] object-cover rounded-lg border-2 border-slate-600 group-hover:border-cyan-400 transition-all duration-300 shadow-lg'
                    />
                    <input
                      type="file"
                      hidden
                      required
                      onChange={(e) => [setImage1, setImage2, setImage3, setImage4][idx](e.target.files[0])}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Product Name */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <p className="text-lg font-semibold text-cyan-300 mb-3">Product Name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter the product title"
                className="w-full max-w-lg bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <p className="text-lg font-semibold text-cyan-300 mb-3">Product Description</p>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Enter the product description"
                rows="4"
                className="w-full max-w-lg bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none resize-none"
              />
            </div>

            {/* Category & Sub-Category */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <p className="text-lg font-semibold text-cyan-300 mb-3">Product Category</p>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none cursor-pointer"
                  >
                    <option>Men</option>
                    <option>Women</option>
                    <option>Kids</option>
                  </select>
                </div>

                <div className="flex-1">
                  <p className="text-lg font-semibold text-cyan-300 mb-3">Sub-Category</p>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    required
                    className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none cursor-pointer"
                  >
                    <option>Topwear</option>
                    <option>Bottomwear</option>
                    <option>Winterwear</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <p className="text-lg font-semibold text-cyan-300 mb-3">Product Price</p>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="₹ 2000"
                className="w-full max-w-xs bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 placeholder-gray-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all outline-none"
              />
            </div>

            {/* Sizes */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <p className="text-lg font-semibold text-cyan-300 mb-4">Select Sizes</p>
              <div className="flex gap-3 flex-wrap">
                {sizeOptions.map((size) => (
                  <div
                    key={size}
                    onClick={() =>
                      setSizes((prev) =>
                        prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                      )
                    }
                    className={`px-5 py-2.5 rounded-lg border-2 cursor-pointer font-semibold transition-all duration-300 ${sizes.includes(size)
                      ? "border-cyan-400 bg-cyan-500 text-white shadow-lg shadow-cyan-500/30"
                      : "border-slate-600 bg-slate-700/80 text-white hover:border-cyan-400 hover:bg-slate-600"
                      }`}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Bestseller */}
            <div className="bg-slate-800/40 rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="bestseller"
                  checked={bestseller}
                  onChange={(e) => setBestSeller(e.target.checked)}
                  className="w-5 h-5 cursor-pointer accent-cyan-500"
                />
                <label htmlFor="bestseller" className="text-lg text-cyan-300 font-medium cursor-pointer">Add to BestSeller</label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/30 border border-cyan-400/20"
              >
                Add Product
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default Add;
