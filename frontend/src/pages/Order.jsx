import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { shopDataContext } from '../context/ShopContext';
import Titles from '../components/Titles';
import api from '../services/api';
import toast from 'react-hot-toast';
import { MdRefresh, MdLocalShipping, MdCheckCircle, MdInventory, MdOutlineShoppingCart } from 'react-icons/md';
import { FiPackage } from 'react-icons/fi';

// ─── ORDER TIMELINE ───────────────────────────────────────────────────────────
const STATUS_STEPS = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];

const STATUS_ICONS = {
  'Order Placed': MdOutlineShoppingCart,
  'Packing': MdInventory,
  'Shipped': MdLocalShipping,
  'Out for delivery': FiPackage,
  'Delivered': MdCheckCircle,
};

function OrderTimeline({ status }) {
  const currentIndex = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0 mt-4 mb-2">
      {STATUS_STEPS.map((step, i) => {
        const Icon = STATUS_ICONS[step];
        const isDone = i <= currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative group">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/40'
                    : isDone
                    ? 'bg-green-500/80'
                    : 'bg-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isDone ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <p
                className={`absolute -bottom-5 text-[9px] font-medium whitespace-nowrap hidden sm:block ${
                  isDone ? (isActive ? 'text-blue-400' : 'text-green-400') : 'text-slate-600'
                }`}
              >
                {step.split(' ').slice(-1)[0]}
              </p>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-[2px] mx-1 transition-all ${
                  i < currentIndex ? 'bg-green-500/60' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currency, products } = useContext(shopDataContext);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/order/userorders');
      const data = res.data.orders || res.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      // Fallback to old endpoint shape
      try {
        const res = await api.post('/api/order/userorder', {});
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch {
        toast.error('Failed to load orders.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, []);

  return (
    <div className="w-full min-h-screen pb-28 md:pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="pt-24 pb-6 flex items-center justify-between">
          <Titles text1="MY" text2="ORDERS" />
          <button
            onClick={loadOrders}
            disabled={loading}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <MdRefresh className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Orders */}
        {loading ? (
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 bg-slate-800/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-5"
          >
            <div className="text-7xl">📦</div>
            <p className="text-white text-xl font-semibold">No orders yet</p>
            <p className="text-slate-400 text-sm text-center">Your orders will appear here once you place one</p>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="flex flex-col gap-5"
          >
            {orders.map((order, orderIdx) => (
              <motion.div
                key={order._id || orderIdx}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-colors"
              >
                {/* Order header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <p className="text-slate-400 text-xs font-mono">Order #{order._id?.slice(-8)}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      order.payment ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    }`}>
                      {order.payment ? '✓ Paid' : '⏳ Pending'}
                    </span>
                    <span className="text-white font-bold text-sm">
                      {currency} {order.amount?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex flex-col gap-3 mb-5">
                  {order.items?.map((item, itemIdx) => {
                    const productData = products.find(p => p._id === item._id);
                    return (
                      <div key={itemIdx} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                          {(item.image1 || productData?.image1) && (
                            <img
                              src={item.image1 || productData?.image1}
                              alt={item.name}
                              referrerPolicy="no-referrer-when-downgrade"
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{item.name}</p>
                          <p className="text-slate-400 text-xs">
                            {currency} {item.price} · Qty {item.quantity} · Size {item.size}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Timeline */}
                <div className="pb-7">
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">Order Status</p>
                  <OrderTimeline status={order.status} />
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/50 mt-2">
                  <span className="text-slate-400 text-xs">{order.paymentMethod}</span>
                  <button
                    onClick={loadOrders}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                  >
                    <MdRefresh className="w-3 h-3" /> Track Order
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Order;
