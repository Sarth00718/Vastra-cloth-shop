import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import Razorpay from 'razorpay';
import dotenv from "dotenv";
dotenv.config()
const currency = 'INR';

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const placeOrder = async (req, res) => {
    try {
        const { orderItems, amount, address, paymentMethod } = req.body;
        const userId = req.userId;

        const orderData = {
            items: orderItems,
            amount,
            address,
            userId,
            paymentMethod: paymentMethod || 'COD',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        await User.findByIdAndUpdate(userId, { cartData: {} });

        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Order placement failed', error: error.message });
    }
};

export const placeOrderRazor = async (req, res) => {
    try {
        const { orderItems, amount, address, paymentMethod } = req.body;
        const userId = req.userId;

        const orderData = {
            items: orderItems,
            amount,
            address,
            userId,
            paymentMethod: paymentMethod || 'COD',
            payment: false,
            date: Date.now(),
        };

        const newOrder = new Order(orderData);
        await newOrder.save();

        const options = {
            amount: amount * 100, // Convert to paise
            currency: currency.toUpperCase(), // e.g., 'INR'
            receipt: newOrder._id.toString(), // Unique receipt ID
        };

        razorpayInstance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json(error);
            }
            res.status(200).json(order);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Order placement failed', error: error.message });
    }
};

export const verifyRazorpay = async (req, res) => {
    try {
        const userId = req.userId;
        const { razorpay_order_id } = req.body;

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        if (orderInfo.status === 'paid') {
            await Order.findByIdAndUpdate(orderInfo.receipt, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });
            res.status(200).json({ message: 'Payment Successful' });
        } else {
            res.status(400).json({ message: 'Payment Failed' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const userOrder = async (req, res) => {
    try {
        const userId = req.userId; // assuming userId is set in auth middleware
        const orders = await Order.find({ userId });
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user.' });
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};

//Admin

export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find({});
        res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "adminAllOrders error" });
    }
};

export const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        return res.status(201).json({ message: 'Status Updated' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};