import { useState, useContext, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { authDataContext } from '../../context/AuthContext';
import { userDataContext } from '../../context/UserContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LuCloudUpload, LuX, LuPlus } from 'react-icons/lu';
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
        image ? 'border-blue-500/60 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-800/50'
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
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
          >
            <LuX className="w-3.5 h-3.5" />
          </button>
        </>
      ) : (
        <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer gap-1">
          <LuCloudUpload className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
          <span className="text-[10px] text-slate-500 font-medium">Image {index + 1}</span>
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
      toast.success('Product added successfully!');

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
    <AdminLayout className="max-w-5xl">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Add New <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Product</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Upload images and configure details to publish a new product to the catalog.</p>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-6"
      >
        {/* Images Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20">
          <p className="text-sm font-semibold text-slate-200 mb-1">Product Images *</p>
          <p className="text-slate-400 text-xs mb-4">Upload or drag & drop 4 images (all 4 are required)</p>
          <div className="flex gap-4 flex-wrap">
            {images.map((img, idx) => (
              <ImageSlot key={idx} index={idx} image={img} onSet={(f) => setImage(idx, f)} onClear={() => clearImage(idx)} />
            ))}
          </div>
        </div>

        {/* Name Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20">
          <label className="text-sm font-semibold text-slate-200 block mb-2">Product Name *</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Classic Slim-Fit Cotton Shirt"
            className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>

        {/* Description Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20">
          <label className="text-sm font-semibold text-slate-200 block mb-2">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            placeholder="Describe the product — fabric, fit, styling, features..."
            className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
          />
        </div>

        {/* Category, Subcategory, Price */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-200 block mb-2">Category *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900 text-slate-100 py-1">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200 block mb-2">Sub-Category *</label>
            <select
              name="subCategory"
              value={form.subCategory}
              onChange={handleChange}
              className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {SUBCATEGORIES.map(s => <option key={s} value={s} className="bg-slate-900 text-slate-100 py-1">{s}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-200 block mb-2">Price (₹) *</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 1299"
              min={1}
              className="w-full bg-slate-800/80 border border-slate-700/80 text-white rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>

        {/* Sizes Card */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20">
          <label className="text-sm font-semibold text-slate-200 block mb-3">Available Sizes *</label>
          <div className="flex gap-3 flex-wrap">
            {SIZES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`min-w-[52px] px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                  sizes.includes(s)
                    ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-md shadow-blue-500/20'
                    : 'border-slate-700 bg-slate-800/60 text-slate-400 hover:border-slate-600 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller toggle */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/20 flex items-center gap-4">
          <div
            onClick={() => setForm(f => ({ ...f, bestseller: !f.bestseller }))}
            className={`w-11 h-6 rounded-full relative cursor-pointer transition-all ${form.bestseller ? 'bg-blue-600 shadow-sm shadow-blue-500/40' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.bestseller ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <div>
            <p className="text-slate-200 text-sm font-semibold">Mark as Bestseller</p>
            <p className="text-slate-400 text-xs">Featured prominently on the storefront homepage and badges</p>
          </div>
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
        >
          {submitting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Adding Product...</>
          ) : (
            <><LuPlus className="w-5 h-5" /> Add Product</>
          )}
        </motion.button>
      </motion.form>
    </AdminLayout>
  );
}

export default Add;
