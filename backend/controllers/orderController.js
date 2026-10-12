import { Order } from '../models/orderModel.js';
import { User } from '../models/userModel.js';
import { Product } from '../models/productModel.js';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder',
});

// Helper: Calculate verified total price on server
const calculateVerifiedTotal = async (items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  const productIds = items.map((i) => i._id).filter(Boolean);
  const dbProducts = await Product.find({ _id: { $in: productIds } }).lean();
  const priceMap = new Map(dbProducts.map((p) => [p._id.toString(), p.price]));

  let subtotal = 0;
  for (const item of items) {
    const verifiedPrice = priceMap.get(item._id?.toString()) ?? (Number(item.price) || 0);
    const qty = Math.max(1, Number(item.quantity) || 1);
    subtotal += verifiedPrice * qty;
  }
  const deliveryFee = subtotal >= 999 ? 0 : 10;
  return subtotal + deliveryFee;
};

// ─── PLACE ORDER (COD) ────────────────────────────────────────────────────────
export const placeOrder = asyncHandler(async (req, res) => {
  const { orderItems, amount, address, paymentMethod } = req.body;
  const userId = req.userId;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return sendError(res, 'Order items are required', 400);
  }

  // Calculate verified server-side total price
  const verifiedAmount = await calculateVerifiedTotal(orderItems);
  const finalAmount = verifiedAmount > 0 ? verifiedAmount : (Number(amount) || 0);

  const newOrder = await Order.create({
    items: orderItems,
    amount: finalAmount,
    address,
    userId,
    paymentMethod: paymentMethod || 'COD',
    payment: false,
    date: Date.now(),
  });

  await User.findByIdAndUpdate(userId, { cartData: {} });
  return sendSuccess(res, { orderId: newOrder._id }, 'Order placed successfully', 201);
});

// ─── PLACE ORDER (RAZORPAY) ───────────────────────────────────────────────────
export const placeOrderRazor = asyncHandler(async (req, res) => {
  const { orderItems, amount, address } = req.body;
  const userId = req.userId;

  if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
    return sendError(res, 'Order items are required', 400);
  }

  const verifiedAmount = await calculateVerifiedTotal(orderItems);
  const finalAmount = verifiedAmount > 0 ? verifiedAmount : (Number(amount) || 0);

  const newOrder = await Order.create({
    items: orderItems,
    amount: finalAmount,
    address,
    userId,
    paymentMethod: 'Razorpay',
    payment: false,
    date: Date.now(),
  });

  const options = {
    amount: Math.round(finalAmount * 100),
    currency: 'INR',
    receipt: newOrder._id.toString(),
  };

  const razorpayOrder = await new Promise((resolve, reject) => {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) reject(err);
      else resolve(order);
    });
  });

  return sendSuccess(res, razorpayOrder, 'Razorpay order created');
});

// ─── VERIFY RAZORPAY ──────────────────────────────────────────────────────────
export const verifyRazorpay = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  if (!razorpay_order_id) {
    return sendError(res, 'razorpay_order_id is required', 400);
  }

  let isVerified = false;

  // 1. Primary: Cryptographic HMAC SHA256 Signature Verification
  if (razorpay_signature && razorpay_payment_id && process.env.RAZORPAY_KEY_SECRET) {
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      isVerified = true;
    }
  }

  // 2. Fallback: Query Razorpay API directly
  if (!isVerified) {
    try {
      const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
      if (orderInfo && (orderInfo.status === 'paid' || orderInfo.amount_paid > 0)) {
        isVerified = true;
      }
    } catch (err) {
      console.warn('Razorpay fetch fallback check:', err.message);
    }
  }

  if (isVerified) {
    let orderInfo = null;
    try {
      orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    } catch {
      // ignore
    }

    const orderId = orderInfo?.receipt;
    if (orderId) {
      await Order.findOneAndUpdate({ _id: orderId, userId }, { payment: true });
    } else {
      await Order.findOneAndUpdate(
        { userId, paymentMethod: 'Razorpay', payment: false },
        { payment: true },
        { sort: { date: -1 } }
      );
    }

    await User.findByIdAndUpdate(userId, { cartData: {} });
    return sendSuccess(res, {}, 'Payment verified successfully');
  }

  return sendError(res, 'Payment verification failed', 400);
});

// ─── USER ORDERS ──────────────────────────────────────────────────────────────
export const userOrder = asyncHandler(async (req, res) => {
  const orders = await Order.find({ userId: req.userId }).sort({ date: -1 }).lean();
  return sendSuccess(res, { orders });
});

// ─── ADMIN: ALL ORDERS ────────────────────────────────────────────────────────
export const allOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const query = {};
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [orders, total] = await Promise.all([
    Order.find(query).sort({ date: -1 }).skip(skip).limit(Number(limit)).lean(),
    Order.countDocuments(query),
  ]);

  return res.status(200).json({
    success: true,
    orders,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  });
});

// ─── ADMIN: UPDATE STATUS ─────────────────────────────────────────────────────
export const updateStatus = asyncHandler(async (req, res) => {
  const { orderId, status } = req.body;
  const validStatuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered'];
  if (!validStatuses.includes(status)) return sendError(res, 'Invalid status', 400);

  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) return sendError(res, 'Order not found', 404);
  return sendSuccess(res, { order }, 'Status updated');
});

// ─── ADMIN: ANALYTICS OVERVIEW ────────────────────────────────────────────────
export const getAnalytics = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const [
    totalOrders,
    totalProducts,
    totalUsers,
    totalRevenue,
    monthlyOrders,
    monthlyRevenue,
    lastMonthRevenue,
    statusBreakdown,
    monthlySeries,
    recentOrders,
  ] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]),
    Order.countDocuments({ date: { $gte: startOfMonth.getTime() } }),
    Order.aggregate([
      { $match: { date: { $gte: startOfMonth.getTime() } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Order.aggregate([
      { $match: { date: { $gte: startOfLastMonth.getTime(), $lte: endOfLastMonth.getTime() } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    // Monthly series for last 6 months
    Order.aggregate([
      { $match: { date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1).getTime(), $lte: now.getTime() } } },
      { $addFields: { dateObj: { $toDate: '$date' } } },
      { $group: { _id: { year: { $year: '$dateObj' }, month: { $month: '$dateObj' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
    Order.find().sort({ date: -1 }).limit(5).lean(),
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const monthRev = monthlyRevenue[0]?.total || 0;
  const lastMonthRev = lastMonthRevenue[0]?.total || 0;
  const revenueGrowth = lastMonthRev > 0 ? (((monthRev - lastMonthRev) / lastMonthRev) * 100).toFixed(1) : 0;

  // Build a chronological series for the last 6 months
  const seriesStart = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const months = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(seriesStart.getFullYear(), seriesStart.getMonth() + i, 1);
    const label = d.toLocaleString('default', { month: 'short' });
    months.push({ year: d.getFullYear(), month: d.getMonth() + 1, label });
  }

  const monthlySeriesData = months.map(({ year, month, label }) => {
    const found = (monthlySeries || []).find(m => m._id && m._id.year === year && m._id.month === month);
    return {
      month: label,
      revenue: found ? (found.total || 0) : 0,
      orders: found ? (found.count || 0) : 0,
    };
  });

  return sendSuccess(res, {
    analytics: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenue,
      monthlyOrders,
      monthlyRevenue: monthRev,
      revenueGrowth: Number(revenueGrowth),
      statusBreakdown,
      monthlySeries: monthlySeriesData,
      recentOrders,
    },
  });
});
