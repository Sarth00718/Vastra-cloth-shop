import { useState, useEffect, useContext, useMemo } from 'react';
import Nav from '../../components/admin/Nav';
import Sidebar from '../../components/admin/Sidebar';
import axios from 'axios';
import { authDataContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MdSearch, MdDelete, MdStar, MdStarBorder, MdGridView, MdTableRows } from 'react-icons/md';

function Lists() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [page, setPage] = useState(1);
  const [removing, setRemoving] = useState(null);
  const { serverurl } = useContext(authDataContext);
  const PER_PAGE = 12;

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverurl}/api/product/list`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const products = response.data.data || response.data.products || [];
      setList(products);
    } catch (error) {
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

  const paginated = filteredList.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filteredList.length / PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <Nav />
      <Sidebar />
      <div className="pl-[240px] pt-[75px] pr-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
              <p className="text-slate-400 text-sm mt-1">{filteredList.length} of {list.length} products</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
              >
                <MdGridView className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2.5 rounded-xl transition-colors ${viewMode === 'table' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
              >
                <MdTableRows className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1 min-w-0">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
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
                <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="text-5xl">🛍️</div>
              <p className="text-slate-300 font-semibold">No products found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginated.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all group"
                >
                  <div className="relative">
                    <img
                      src={item.image1}
                      alt={item.name}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.bestseller && (
                      <span className="absolute top-2 left-2 flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/20 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                        <MdStar className="w-3 h-3" /> Best
                      </span>
                    )}
                    <button
                      onClick={() => removeProduct(item._id)}
                      disabled={removing === item._id}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500/20 hover:bg-red-500 border border-red-500/30 text-red-400 hover:text-white rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                    >
                      {removing === item._id
                        ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        : <MdDelete className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="text-white text-sm font-medium truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-slate-400 text-xs">{item.category} · {item.subCategory}</p>
                      <p className="text-green-300 text-sm font-semibold">₹{item.price}</p>
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {item.sizes?.slice(0, 5).map(s => (
                        <span key={s} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{s}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Table view
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700 bg-slate-800/60">
                      <th className="text-left px-5 py-4">Product</th>
                      <th className="text-left px-4 py-4">Category</th>
                      <th className="text-left px-4 py-4">Price</th>
                      <th className="text-left px-4 py-4">Sizes</th>
                      <th className="text-left px-4 py-4">Best</th>
                      <th className="text-left px-4 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((item, i) => (
                      <tr key={item._id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.image1} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-slate-200 font-medium">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-400">{item.category} / {item.subCategory}</td>
                        <td className="px-4 py-4 text-green-300 font-semibold">₹{item.price}</td>
                        <td className="px-4 py-4">
                          <div className="flex gap-1">
                            {item.sizes?.map(s => (
                              <span key={s} className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {item.bestseller
                            ? <MdStar className="w-5 h-5 text-yellow-400" />
                            : <MdStarBorder className="w-5 h-5 text-slate-600" />
                          }
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => removeProduct(item._id)}
                            disabled={removing === item._id}
                            className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-lg text-xs transition-all"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Previous
              </button>
              <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Lists;
