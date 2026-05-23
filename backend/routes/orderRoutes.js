import express from 'express';
import {
  placeOrder,
  placeOrderRazor,
  verifyRazorpay,
  userOrder,
  allOrders,
  updateStatus,
  getAnalytics,
} from '../controllers/orderController.js';
import isAuth from '../middlewares/isAuth.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();

// User routes
router.post('/place', isAuth, placeOrder);
router.post('/razorpay', isAuth, placeOrderRazor);
router.post('/verifyrazorpay', isAuth, verifyRazorpay);
router.get('/userorders', isAuth, userOrder);

// Admin routes
router.post('/allorder', adminAuth, allOrders);
router.post('/updatestatus', adminAuth, updateStatus);
router.get('/analytics', adminAuth, getAnalytics);

export default router;
