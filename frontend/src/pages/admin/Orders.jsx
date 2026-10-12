import { useState, useEffect, useContext, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { authDataContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { LuSearch, LuDownload, LuRefreshCw, LuPackage, LuPhone, LuCircleCheck, LuClock, LuPackageSearch, LuChevronLeft, LuChevronRight } from 'react-icons/lu';

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
    } catch (_error) {
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
    <AdminLayout className="max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Orders <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track customer orders, update delivery statuses, and export fulfillment records ({filteredOrders.length} total).
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchAllOrders}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-slate-700/80 cursor-pointer shadow-sm"
          >
            <LuRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button
            type="button"
            onClick={() => exportCSV(filteredOrders)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-md shadow-blue-600/30"
          >
            <LuDownload className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by customer name, order ID, phone..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setPage(1); }}
            className="w-full bg-slate-800/80 border border-slate-700/80 text-slate-200 pl-11 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder-slate-500 transition-all"
          />
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 flex-wrap items-center">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border border-slate-700/80'
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-slate-800/40 border border-slate-700/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : paginatedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <LuPackageSearch className="w-8 h-8 stroke-[1.75]" />
          </div>
          <p className="text-slate-200 font-semibold text-base">No orders found</p>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search keywords</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {paginatedOrders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 hover:border-slate-700/80 transition-all shadow-lg shadow-black/20"
              >
                {/* Icon */}
                <div className="w-10 h-10 bg-blue-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center shrink-0">
                  <LuPackage className="w-5 h-5 text-blue-400 stroke-[1.75]" />
                </div>

                {/* Items + Address */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2">
                    {order.items?.map((item, idx) => (
                      <span key={idx} className="text-blue-300 text-sm font-medium">
                        {item.name} ×{item.quantity}
                        <span className="text-slate-400 ml-1">({item.size})</span>
                      </span>
                    ))}
                  </div>
                  <div className="text-slate-400 text-xs leading-relaxed">
                    <p className="text-slate-200 font-semibold">{order.address?.firstName} {order.address?.lastName}</p>
                    <p className="text-slate-400 mt-0.5">{order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.pinCode}</p>
                    <p className="text-slate-400 mt-1 flex items-center gap-1.5"><LuPhone className="w-3.5 h-3.5 text-slate-500" /> {order.address?.phone}</p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-1 text-xs text-slate-400 shrink-0 lg:border-l lg:border-slate-800/80 lg:pl-5">
                  <p>Items: <span className="text-slate-200 font-medium">{order.items?.length || 0}</span></p>
                  <p>Method: <span className="text-slate-200 font-medium">{order.paymentMethod}</span></p>
                  <p className="flex items-center gap-1">Payment: <span className={`inline-flex items-center gap-1 font-medium ${order.payment ? 'text-green-400' : 'text-yellow-400'}`}>{order.payment ? <><LuCircleCheck className="w-3.5 h-3.5" /> Paid</> : <><LuClock className="w-3.5 h-3.5" /> Pending</>}</span></p>
                  <p>Date: <span className="text-slate-300">{new Date(order.date).toLocaleDateString()}</span></p>
                  <p className="text-lg font-bold text-white mt-1">₹{order.amount?.toLocaleString('en-IN')}</p>
                </div>

                {/* Status selector */}
                <div className="shrink-0 flex flex-col justify-center gap-2 lg:border-l lg:border-slate-800/80 lg:pl-5">
                  <select
                    value={order.status}
                    onChange={e => statusHandler(order._id, e.target.value)}
                    className="bg-slate-800/90 text-white text-xs px-3 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[150px] transition-all"
                  >
                    {STATUS_OPTIONS.filter(s => s !== 'All').map(s => (
                      <option key={s} value={s} className="bg-slate-900 text-slate-100 py-1">{s}</option>
                    ))}
                  </select>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold text-center border ${STATUS_COLORS[order.status] || ''}`}>
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
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 text-slate-300 rounded-xl text-xs sm:text-sm font-medium disabled:opacity-40 hover:bg-slate-700/80 transition-all border border-slate-700/60 cursor-pointer disabled:cursor-not-allowed"
          >
            <LuChevronLeft className="w-4 h-4" />
            Previous
          </button>
          <span className="text-slate-400 text-xs sm:text-sm font-medium">Page {page} of {totalPages}</span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800/80 text-slate-300 rounded-xl text-xs sm:text-sm font-medium disabled:opacity-40 hover:bg-slate-700/80 transition-all border border-slate-700/60 cursor-pointer disabled:cursor-not-allowed"
          >
            Next
            <LuChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

export default Orders;
