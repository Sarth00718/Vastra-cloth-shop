import { useState, useEffect, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { MdShoppingBag, MdInventory, MdAttachMoney, MdTrendingUp, MdPeople, MdLocalShipping } from 'react-icons/md';

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 flex items-center gap-5 hover:border-slate-600 transition-colors"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0`} style={{ background: `${color}20` }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-slate-500 text-xs mt-0.5">{sub}</p>}
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
      // Try new analytics endpoint first, fallback to counting manually
      try {
        const res = await axios.get(`${serverurl}/api/order/analytics`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setAnalytics(res.data.analytics);
      } catch {
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

        const orders = ordersRes.data.orders || ordersRes.data;
        const products = productsRes.data.data || productsRes.data.products || [];

        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const statusBreakdown = orders.reduce((acc, o) => {
          const found = acc.find(s => s._id === o.status);
          if (found) found.count++;
          else acc.push({ _id: o.status, count: 1 });
          return acc;
        }, []);

        setAnalytics({
          totalOrders: orders.length,
          totalRevenue,
          monthlyOrders: 0,
          monthlyRevenue: 0,
          revenueGrowth: 0,
          statusBreakdown,
          recentOrders: orders.slice(0, 5),
          totalProducts: products.length,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load analytics');
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
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <Nav />
      <Sidebar />
      <div className="pl-[240px] pt-[75px] pr-6 pb-12 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
            <p className="text-slate-400 mt-1">Welcome back! Here's what's happening with your store.</p>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 bg-slate-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-8">
                <StatCard
                  icon={MdAttachMoney}
                  label="Total Revenue"
                  value={`₹${(analytics?.totalRevenue || 0).toLocaleString('en-IN')}`}
                  sub={analytics?.revenueGrowth > 0 ? `+${analytics.revenueGrowth}% this month` : 'All time'}
                  color="#10b981"
                  delay={0}
                />
                <StatCard
                  icon={MdShoppingBag}
                  label="Total Orders"
                  value={analytics?.totalOrders || 0}
                  sub={`${analytics?.monthlyOrders || 0} this month`}
                  color="#3b82f6"
                  delay={0.1}
                />
                <StatCard
                  icon={MdInventory}
                  label="Total Products"
                  value={analytics?.totalProducts || '—'}
                  color="#8b5cf6"
                  delay={0.2}
                />
                <StatCard
                  icon={MdTrendingUp}
                  label="Monthly Revenue"
                  value={`₹${(analytics?.monthlyRevenue || 0).toLocaleString('en-IN')}`}
                  color="#f59e0b"
                  delay={0.3}
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="lg:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6"
                >
                  <h3 className="text-white font-semibold mb-4">Revenue Trend</h3>
                  {analytics?.monthlySeries && analytics.monthlySeries.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={analytics.monthlySeries}>
                        <defs>
                          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                        <Tooltip
                          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                          formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="url(#revenueGrad)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No revenue data yet</div>
                  )}
                </motion.div>

                {/* Status Pie */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6"
                >
                  <h3 className="text-white font-semibold mb-4">Order Status</h3>
                  {statusPieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                          {statusPieData.map((entry, i) => (
                            <Cell key={i} fill={STATUS_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#f1f5f9' }}
                        />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{ fontSize: 11, color: '#94a3b8' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">No order data yet</div>
                  )}
                </motion.div>
              </div>

              {/* Recent Orders */}
              {analytics?.recentOrders?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6"
                >
                  <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
                          <th className="text-left pb-3">Order ID</th>
                          <th className="text-left pb-3">Customer</th>
                          <th className="text-left pb-3">Amount</th>
                          <th className="text-left pb-3">Status</th>
                          <th className="text-left pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.recentOrders.map((order, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 text-slate-400 font-mono text-xs">{order._id?.slice(-8)}</td>
                            <td className="py-3 text-slate-300">
                              {order.address?.firstName} {order.address?.lastName}
                            </td>
                            <td className="py-3 text-green-300 font-semibold">₹{order.amount?.toLocaleString('en-IN')}</td>
                            <td className="py-3">
                              <span
                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  background: `${STATUS_COLORS[order.status] || '#3b82f6'}20`,
                                  color: STATUS_COLORS[order.status] || '#3b82f6',
                                }}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 text-slate-400">{new Date(order.date).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
