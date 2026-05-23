import { useState, useEffect, useContext, useMemo } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { MdSearch, MdFileDownload, MdRefresh } from 'react-icons/md';
import { SiHackthebox } from 'react-icons/si';

const STATUS_OPTIONS = ['All', 'Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

const STATUS_COLORS = {
  'Order Placed': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Packing': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Shipped': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  'Out for delivery': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
  'Delivered': 'text-green-400 bg-green-500/10 border-green-500/30',
};

function exportCSV(orders) {
  const headers = ['Order ID', 'Customer', 'Amount', 'Payment Method', 'Payment Status', 'Status', 'Date'];
  const rows = orders.map(o => [
    o._id,
    `${o.address?.firstName || ''} ${o.address?.lastName || ''}`.trim(),
    o.amount,
    o.paymentMethod,
    o.payment ? 'Paid' : 'Pending',
    o.status,
    new Date(o.date).toLocaleDateString(),
  ]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `orders_${Date.now()}.csv`; a.click();
  URL.revokeObjectURL(url);
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const { serverurl } = useContext(authDataContext);
  const PER_PAGE = 10;

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const result = await axios.post(`${serverurl}/api/order/allorder`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = result.data.orders || result.data;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch orders.');
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (orderId, status) => {
    try {
      await axios.post(`${serverurl}/api/order/updatestatus`, { orderId, status }, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      toast.success('Order status updated!');
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch {
      toast.error('Failed to update order status.');
    }
  };

  useEffect(() => { fetchAllOrders(); }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (statusFilter !== 'All') result = result.filter(o => o.status === statusFilter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o =>
        o._id?.toLowerCase().includes(q) ||
        `${o.address?.firstName} ${o.address?.lastName}`.toLowerCase().includes(q) ||
        o.address?.phone?.includes(q)
      );
    }
    return result;
  }, [orders, statusFilter, searchQuery]);

  const paginatedOrders = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const totalPages = Math.ceil(filteredOrders.length / PER_PAGE);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <Nav />
      <Sidebar />
      <div className="pl-[240px] pt-[75px] pr-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Orders Management</h1>
              <p className="text-slate-400 text-sm mt-1">{filteredOrders.length} orders</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchAllOrders}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm transition-colors border border-slate-700"
              >
                <MdRefresh className="w-4 h-4" /> Refresh
              </button>
              <button
                onClick={() => exportCSV(filteredOrders)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm transition-colors"
              >
                <MdFileDownload className="w-4 h-4" /> Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, phone..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 placeholder-slate-500"
              />
            </div>

            {/* Status tabs */}
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    statusFilter === s
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-28 bg-slate-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="text-5xl">📦</div>
              <p className="text-slate-300 font-semibold">No orders found</p>
              <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {paginatedOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 hover:border-slate-600 transition-colors"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center shrink-0">
                      <SiHackthebox className="w-5 h-5 text-blue-400" />
                    </div>

                    {/* Items + Address */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mb-2">
                        {order.items?.map((item, idx) => (
                          <span key={idx} className="text-cyan-300 text-sm font-medium">
                            {item.name} ×{item.quantity}
                            <span className="text-slate-400 ml-1">({item.size})</span>
                          </span>
                        ))}
                      </div>
                      <div className="text-slate-400 text-xs leading-relaxed">
                        <p className="text-slate-300 font-medium">{order.address?.firstName} {order.address?.lastName}</p>
                        <p>{order.address?.street}, {order.address?.city}, {order.address?.state}</p>
                        <p>{order.address?.phone}</p>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col gap-1 text-xs text-slate-400 shrink-0">
                      <p>Items: <span className="text-slate-200">{order.items?.length}</span></p>
                      <p>Method: <span className="text-slate-200">{order.paymentMethod}</span></p>
                      <p>Payment: <span className={order.payment ? 'text-green-400' : 'text-yellow-400'}>{order.payment ? 'Paid ✓' : 'Pending'}</span></p>
                      <p>Date: <span className="text-slate-200">{new Date(order.date).toLocaleDateString()}</span></p>
                      <p className="text-base font-bold text-white mt-1">₹{order.amount?.toLocaleString('en-IN')}</p>
                    </div>

                    {/* Status selector */}
                    <div className="shrink-0 flex flex-col justify-center">
                      <select
                        value={order.status}
                        onChange={e => statusHandler(order._id, e.target.value)}
                        className="bg-slate-900 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-600 hover:border-slate-500 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[150px]"
                      >
                        {STATUS_OPTIONS.filter(s => s !== 'All').map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span className={`mt-2 px-2 py-0.5 rounded-full text-xs font-medium text-center border ${STATUS_COLORS[order.status] || ''}`}>
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>
              <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm disabled:opacity-40 hover:bg-slate-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
