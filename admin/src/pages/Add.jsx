import React, { useState, useContext } from 'react';
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

      await axios.post(`${serverurl}/api/product/addProduct`, formData, { withCredentials: true,
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
    <div className='w-full min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-gray-200 flex flex-col items-center overflow-x-hidden relative font-poppins'>
      <Nav />
      <Sidebar />

      <div
        className="w-[82%] flex flex-col justify-start absolute right-0 mt-[70px] py-[40px] px-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">
          Add Product Page
        </h2>
        <motion.form onSubmit={handleSubmit} className="w-full flex flex-col gap-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}>
          {/* Upload Images */}
          <div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">Upload Images</p>
            <div className='flex flex-wrap gap-4'>
              {[image1, image2, image3, image4].map((img, idx) => (
                <label key={idx} className='cursor-pointer'>
                  <img
                    src={img ? URL.createObjectURL(img) : upload}
                    alt="product"
                    className='w-[100px] h-[100px] object-cover rounded-lg border-2 border-gray-500 hover:border-cyan-400 transition'
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
          <div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">Product Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter the product title"
              className="w-full max-w-md bg-slate-700 border border-gray-500 text-white rounded-md px-4 py-2 placeholder-gray-400 focus:border-cyan-400"
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">Product Description</p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter the product description"
              className="w-full max-w-md bg-slate-700 border border-gray-500 text-white rounded-md px-4 py-2 placeholder-gray-400 focus:border-cyan-400 resize-none"
            />
          </div>

          {/* Category & Sub-Category */}
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-xl font-semibold text-cyan-300 mb-2">Product Category</p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                className="bg-slate-700 border border-gray-500 text-white rounded-md px-4 py-2 focus:border-cyan-400"
              >
                <option>Men</option>
                <option>Women</option>
                <option>Kids</option>
              </select>
            </div>

            <div>
              <p className="text-xl font-semibold text-cyan-300 mb-2">Sub-Category</p>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                required
                className="bg-slate-700 border border-gray-500 text-white rounded-md px-4 py-2 focus:border-cyan-400"
              >
                <option>Topwear</option>
                <option>Bottomwear</option>
                <option>Winterwear</option>
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">Product Price</p>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="₹ 2000"
              className="w-full max-w-md bg-slate-700 border border-gray-500 text-white rounded-md px-4 py-2 placeholder-gray-400 focus:border-cyan-400"
            />
          </div>

          {/* Sizes */}
          <div>
            <p className="text-xl font-semibold text-cyan-300 mb-2">Select Sizes</p>
            <div className="flex gap-3 flex-wrap">
              {sizeOptions.map((size) => (
                <div
                  key={size}
                  onClick={() =>
                    setSizes((prev) =>
                      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
                    )
                  }
                  className={`px-4 py-2 rounded-lg border-2 cursor-pointer ${sizes.includes(size)
                    ? "border-cyan-400 bg-cyan-200 text-black"
                    : "border-gray-500 bg-slate-700 text-white"
                    } hover:border-cyan-400 transition`}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>

          {/* Bestseller */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="bestseller"
              checked={bestseller}
              onChange={(e) => setBestSeller(e.target.checked)}
              className="w-5 h-5 cursor-pointer accent-cyan-500"
            />
            <label htmlFor="bestseller" className="text-lg text-cyan-300">Add to BestSeller</label>
          </div>

          {/* Submit */}
          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-cyan-700 hover:bg-cyan-600 text-white font-semibold px-6 py-2 rounded-md transition"
            >
              Add Product
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}

export default Add;
