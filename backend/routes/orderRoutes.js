import express from 'express';
import isAuth from '../middlewares/isAuth.js';
import { allOrders, placeOrder, placeOrderRazor, updateStatus, userOrder, verifyRazorpay } from '../controllers/orderController.js';
import adminAuth from '../middlewares/adminAuth.js';

const router = express.Router();
router.route('/placeorder').post(isAuth,placeOrder);
router.route('/userorder').post(isAuth,userOrder);
router.route('/placeorderrazor').post(isAuth,placeOrderRazor);
router.route('/verifyrazorpay').post(isAuth, verifyRazorpay);

//admin
router.route('/allorder').post(adminAuth,allOrders);
router.route('/updatestatus').post(adminAuth,updateStatus);



export default router;