import { useState, useEffect, useContext } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import { authDataContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { LuIndianRupee, LuShoppingBag, LuPackage, LuUsers, LuTrendingUp } from 'react-icons/lu';

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

const STATUS_COLORS = {
  'Order Placed': '#3b82f6',
  'Packing': '#f59e0b',
  'Shipped': '#8b5cf6',
  'Out for delivery': '#06b6d4',
  'Delivered': '#10b981',
};

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex items-center gap-4 hover:border-slate-700/80 transition-all shadow-lg shadow-black/20"
    >
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border border-slate-700/40" style={{ background: `${color}18` }}>
        <Icon className="w-6 h-6 stroke-[1.75]" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-xs sm:text-sm truncate">{label}</p>
        <p className="text-white text-xl sm:text-2xl font-bold tracking-tight mt-0.5 truncate">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5 truncate">{sub}</p>}
      </div>
    </motion.div>
  );
}

function Home() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { serverurl } = useContext(authDataContext);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Try analytics endpoint first
      try {
        const res = await axios.get(`${serverurl}/api/order/analytics`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAnalytics(res.data.analytics);
      } catch (err) {
        console.warn('Analytics endpoint failed, using fallback manual calculation:', err.message);
        // Fallback to manual count
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`${serverurl}/api/product/list`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.post(`${serverurl}/api/order/allorder`, {}, {
            withCredentials: true,
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        const orders = ordersRes.data.orders || ordersRes.data || [];
        const products = productsRes.data.data || productsRes.data.products || [];

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const monthlyOrders = orders.filter(o => o.date >= startOfMonth);
        const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

        const statusBreakdown = orders.reduce((acc, o) => {
          const found = acc.find(s => s._id === o.status);
          if (found) found.count++;
          else acc.push({ _id: o.status, count: 1 });
          return acc;
        }, []);

        setAnalytics({
          totalOrders: orders.length,
          totalRevenue,
          monthlyOrders: monthlyOrders.length,
          monthlyRevenue,
          revenueGrowth: 0,
          statusBreakdown,
          recentOrders: orders.slice(0, 5),
          totalProducts: products.length,
          totalUsers: '—',
        });
      }
    } catch (err) {
      console.error('Final analytics error:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statusPieData = analytics?.statusBreakdown?.map(s => ({
    name: s._id,
    value: s.count,
  })) || [];

  return (
    <AdminLayout className="max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Dashboard <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Overview</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">Real-time store performance, revenue insights, and order tracking.</p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-800/40 border border-slate-700/40 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
            <StatCard
              icon={LuIndianRupee}
              label="Total Revenue"
              value={`₹${(analytics?.totalRevenue || 0).toLocaleString('en-IN')}`}
              sub={analytics?.revenueGrowth > 0 ? `+${analytics.revenueGrowth}% this month` : 'All time'}
              color="#10b981"
              delay={0}
            />
            <StatCard
              icon={LuShoppingBag}
              label="Total Orders"
              value={analytics?.totalOrders || 0}
              sub={`${analytics?.monthlyOrders || 0} this month`}
              color="#3b82f6"
              delay={0.05}
            />
            <StatCard
              icon={LuPackage}
              label="Total Products"
              value={analytics?.totalProducts || '—'}
              sub="Catalog count"
              color="#8b5cf6"
              delay={0.1}
            />
            <StatCard
              icon={LuUsers}
              label="Total Users"
              value={analytics?.totalUsers || '—'}
              sub="Registered users"
              color="#06b6d4"
              delay={0.15}
            />
            <StatCard
              icon={LuTrendingUp}
              label="Monthly Revenue"
              value={`₹${(analytics?.monthlyRevenue || 0).toLocaleString('en-IN')}`}
              sub="Current month"
              color="#f59e0b"
              delay={0.2}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-white font-semibold mb-4 text-base">Revenue Trend</h3>
              {analytics?.monthlySeries && analytics.monthlySeries.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={analytics.monthlySeries}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }}
                      formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No revenue trend data yet</div>
              )}
            </motion.div>

            {/* Status Pie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-white font-semibold mb-4 text-base">Order Status</h3>
              {statusPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                      {statusPieData.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 12, color: '#f1f5f9' }}
                    />
                    <Legend
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">No order breakdown data yet</div>
              )}
            </motion.div>
          </div>

          {/* Recent Orders */}
          {analytics?.recentOrders?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-white font-semibold mb-4 text-base">Recent Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800 pb-3">
                      <th className="text-left pb-3 font-semibold">Order ID</th>
                      <th className="text-left pb-3 font-semibold">Customer</th>
                      <th className="text-left pb-3 font-semibold">Amount</th>
                      <th className="text-left pb-3 font-semibold">Status</th>
                      <th className="text-left pb-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.recentOrders.map((order, i) => (
                      <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 text-slate-400 font-mono text-xs">{order._id?.slice(-8)}</td>
                        <td className="py-3 text-slate-300 font-medium">
                          {order.address?.firstName} {order.address?.lastName}
                        </td>
                        <td className="py-3 text-blue-300 font-semibold">₹{order.amount?.toLocaleString('en-IN')}</td>
                        <td className="py-3">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background: `${STATUS_COLORS[order.status] || '#3b82f6'}18`,
                              color: STATUS_COLORS[order.status] || '#3b82f6',
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 text-xs">{new Date(order.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AdminLayout>
  );
}

export default Home;
