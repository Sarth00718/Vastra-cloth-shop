import { useState, useEffect, useContext, useMemo, useRef } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { authDataContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LuSearch, LuTrash2, LuStar, LuLayoutGrid, LuList, LuPackageX, LuCircleCheck } from 'react-icons/lu';

const BATCH_SIZE = 12;

function Lists() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [removing, setRemoving] = useState(null);
  const loaderRef = useRef(null);
  const { serverurl } = useContext(authDataContext);

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverurl}/api/product/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const products = response.data.data || response.data.products || [];
      setList(products);
    } catch (_error) {
      toast.error('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!confirm('Remove this product? This cannot be undone.')) return;
    setRemoving(id);
    try {
      await axios.post(`${serverurl}/api/product/remove/${id}`, {}, { withCredentials: true });
      setList(prev => prev.filter(p => p._id !== id));
      toast.success('Product removed successfully!');
    } catch {
      toast.error('Failed to remove product.');
    } finally {
      setRemoving(null);
    }
  };

  useEffect(() => { fetchList(); }, []);

  const categories = ['All', ...new Set(list.map(p => p.category))];

  const filteredList = useMemo(() => {
    let result = list;
    if (categoryFilter !== 'All') result = result.filter(p => p.category === categoryFilter);
    if (search) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [list, search, categoryFilter]);

  // Reset infinite scroll count when filter or search changes
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [search, categoryFilter]);

  const displayedProducts = useMemo(() => {
    return filteredList.slice(0, visibleCount);
  }, [filteredList, visibleCount]);

  const hasMore = visibleCount < filteredList.length;

  // Infinite Scroll IntersectionObserver
  useEffect(() => {
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filteredList.length));
        }
      },
      { threshold: 0.1, rootMargin: '200px' }
    );

    const currentTarget = loaderRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, filteredList.length, visibleCount]);

  return (
    <AdminLayout className="max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Product <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Catalog</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Showing {displayedProducts.length} of {filteredList.length} products (Total in catalog: {list.length}).
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
            }`}
            title="Grid view"
          >
            <LuLayoutGrid className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-2.5 rounded-xl transition-all cursor-pointer ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
            }`}
            title="Table view"
          >
            <LuList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1 min-w-0">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 text-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                categoryFilter === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-800/40 border border-slate-700/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <LuPackageX className="w-8 h-8 stroke-[1.75]" />
          </div>
          <p className="text-slate-200 font-semibold text-base">No products found</p>
          <p className="text-slate-500 text-sm">Try adjusting your category filter or search keywords</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayedProducts.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % BATCH_SIZE) * 0.02 }}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700/80 transition-all shadow-lg shadow-black/20 group flex flex-col justify-between"
            >
              <div className="relative overflow-hidden bg-slate-950 aspect-[4/5]">
                <img
                  src={item.image1}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {item.bestseller && (
                  <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold text-yellow-300 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded-full backdrop-blur-md">
                    <LuStar className="w-3 h-3 text-yellow-400 fill-yellow-400" /> Bestseller
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => removeProduct(item._id)}
                  disabled={removing === item._id}
                  className="absolute top-2.5 right-2.5 w-8 h-8 bg-slate-900/80 hover:bg-red-500 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
                  title="Delete Product"
                >
                  {removing === item._id
                    ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <LuTrash2 className="w-4 h-4" />
                  }
                </button>
              </div>
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <p className="text-white text-sm font-semibold truncate">{item.name}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{item.category} · {item.subCategory}</p>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                  <p className="text-blue-300 text-sm font-bold">₹{item.price?.toLocaleString('en-IN')}</p>
                  <div className="flex gap-1 flex-wrap">
                    {item.sizes?.slice(0, 4).map(s => (
                      <span key={s} className="text-[10px] bg-slate-800 border border-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* Table view */
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 bg-slate-800/40">
                  <th className="text-left px-5 py-4 font-semibold">Product</th>
                  <th className="text-left px-4 py-4 font-semibold">Category</th>
                  <th className="text-left px-4 py-4 font-semibold">Price</th>
                  <th className="text-left px-4 py-4 font-semibold">Sizes</th>
                  <th className="text-left px-4 py-4 font-semibold">Bestseller</th>
                  <th className="text-left px-4 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.map((item) => (
                  <tr key={item._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={item.image1} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-700" />
                        <span className="text-slate-200 font-medium truncate max-w-xs">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-xs">{item.category} / {item.subCategory}</td>
                    <td className="px-4 py-4 text-blue-300 font-semibold">₹{item.price?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {item.sizes?.map(s => (
                          <span key={s} className="text-[10px] bg-slate-800 border border-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {item.bestseller
                        ? <span className="flex items-center gap-1 text-xs font-medium text-yellow-400"><LuStar className="w-4 h-4 fill-yellow-400" /> Yes</span>
                        : <span className="text-xs text-slate-500">No</span>
                      }
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => removeProduct(item._id)}
                        disabled={removing === item._id}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        {removing === item._id ? 'Removing...' : 'Remove'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Infinite Scroll Sentinel / Status */}
      {hasMore ? (
        <div ref={loaderRef} className="flex items-center justify-center gap-2.5 py-8 text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <span>Loading more products...</span>
        </div>
      ) : filteredList.length > 0 ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium">
            <LuCircleCheck className="w-3.5 h-3.5 text-green-400" />
            <span>All {filteredList.length} products loaded</span>
          </div>
        </div>
      ) : null}
    </AdminLayout>
  );
}

export default Lists;
