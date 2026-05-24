import { useState, useContext, useCallback } from 'react';
import Nav from '../../components/admin/Nav';
import Sidebar from '../../components/admin/Sidebar';
import { authDataContext } from '../../context/AuthContext';
import { userDataContext } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdCloudUpload, MdClose } from 'react-icons/md';
import adminApi from '../../services/admin/adminApi';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];

const INITIAL_STATE = {
  name: '', description: '', category: 'Men',
  subCategory: 'Topwear', price: '', bestseller: false,
};

function ImageSlot({ index, image, onSet, onClear }) {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) onSet(file);
  }, [onSet]);

  return (
    <div
      className={`relative w-24 h-24 rounded-xl border-2 border-dashed transition-all ${
        image ? 'border-blue-500/50' : 'border-slate-600 hover:border-slate-500'
      }`}
      onDragOver={e => e.preventDefault()}
      onDrop={handleDrop}
    >
      {image ? (
        <>
          <img src={URL.createObjectURL(image)} alt="" className="w-full h-full object-cover rounded-xl" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <MdClose className="w-3 h-3" />
          </button>
        </>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1">
          <MdCloudUpload className="w-6 h-6 text-slate-500" />
          <span className="text-[10px] text-slate-600">Image {index + 1}</span>
          <input type="file" accept="image/*" hidden onChange={e => e.target.files[0] && onSet(e.target.files[0])} />
        </label>
      )}
    </div>
  );
}

function Add() {
  const { user } = useContext(userDataContext);
  const { serverurl } = useContext(authDataContext);
  const [images, setImages] = useState([null, null, null, null]);
  const [form, setForm] = useState(INITIAL_STATE);
  const [sizes, setSizes] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const setImage = (idx, file) => setImages(prev => { const n = [...prev]; n[idx] = file; return n; });
  const clearImage = (idx) => setImages(prev => { const n = [...prev]; n[idx] = null; return n; });
  const toggleSize = (s) => setSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim()) return 'Product name is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || Number(form.price) <= 0) return 'Valid price is required';
    if (sizes.length === 0) return 'Select at least one size';
    if (images.filter(Boolean).length < 4) return 'All 4 product images are required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      images.forEach((img, i) => { if (img) formData.append(`image${i + 1}`, img); });
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('category', form.category);
      formData.append('price', form.price);
      formData.append('subCategory', form.subCategory);
      formData.append('bestseller', form.bestseller);
      formData.append('sizes', JSON.stringify(sizes));

      await adminApi.post('/api/product/addproduct', formData);
      toast.success('✅ Product added successfully!');

      // Reset
      setForm(INITIAL_STATE);
      setSizes([]);
      setImages([null, null, null, null]);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <Nav />
      <Sidebar />
      <div className="pl-[240px] pt-[75px] pr-6 pb-12">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-white mb-1">Add Product</h1>
            <p className="text-slate-400 text-sm mb-8">Fill in the product details below</p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Images */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <p className="text-sm font-semibold text-slate-300 mb-1">Product Images</p>
              <p className="text-slate-500 text-xs mb-4">Upload or drag & drop 4 images (required)</p>
              <div className="flex gap-4 flex-wrap">
                {images.map((img, idx) => (
                  <ImageSlot key={idx} index={idx} image={img} onSet={(f) => setImage(idx, f)} onClear={() => clearImage(idx)} />
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <label className="text-sm font-semibold text-slate-300 block mb-2">Product Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Classic Slim-Fit Cotton Shirt"
                className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Description */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <label className="text-sm font-semibold text-slate-300 block mb-2">Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe the product — fabric, fit, features..."
                className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
              />
            </div>

            {/* Category, Subcategory, Price */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}
                  className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Sub-Category *</label>
                <select name="subCategory" value={form.subCategory} onChange={handleChange}
                  className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 cursor-pointer">
                  {SUBCATEGORIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-300 block mb-2">Price (₹) *</label>
                <input
                  name="price" type="number" value={form.price} onChange={handleChange}
                  placeholder="e.g. 1299" min={1}
                  className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
              <label className="text-sm font-semibold text-slate-300 block mb-3">Available Sizes *</label>
              <div className="flex gap-3 flex-wrap">
                {SIZES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`min-w-[52px] px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all ${
                      sizes.includes(s)
                        ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg shadow-blue-500/20'
                        : 'border-slate-600 bg-slate-700/50 text-slate-400 hover:border-slate-500 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Bestseller toggle */}
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-4">
              <div
                onClick={() => setForm(f => ({ ...f, bestseller: !f.bestseller }))}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${form.bestseller ? 'bg-blue-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.bestseller ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <div>
                <p className="text-slate-200 text-sm font-medium">Mark as Bestseller</p>
                <p className="text-slate-500 text-xs">Featured prominently on the homepage</p>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding Product...</>
              ) : (
                '+ Add Product'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </div>
  );
}

export default Add;
