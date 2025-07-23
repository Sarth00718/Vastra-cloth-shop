import React, { useState, useContext } from 'react';
import Titles from '../components/Titles';
import CartTotal from '../components/CartTotal';
import Razorpay from '../assets/Razorpay.jpg';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

function PlaceOrder() {
    const { setCartItem, cartItem, getCartAmount, delivery_fee, products } = useContext(shopDataContext);
    const { serverurl } = useContext(authDataContext);
    const navigate = useNavigate();
    const [method, setMethod] = useState('cod');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '',
        street: '', city: '', state: '',
        pinCode: '', country: '', phone: ''
    });

    const onChangeHandler = (e) => {
        setFormData(data => ({ ...data, [e.target.name]: e.target.value }));
    };

    const validateForm = () => {
        const { firstName, lastName, email, street, city, state, pinCode, country, phone } = formData;

        if (!firstName || !lastName || !email || !street || !city || !state || !pinCode || !country || !phone) {
            alert("🚫 Oops! All fields are important. Please complete the form.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const pinCodeRegex = /^[0-9]{6}$/;

        if (!emailRegex.test(email)) {
            alert("📧 Please enter a valid email address (e.g., example@mail.com).");
            return false;
        }

        if (!phoneRegex.test(phone)) {
            alert("📱 Phone number must be exactly 10 digits. Double-check and try again!");
            return false;
        }

        if (!pinCodeRegex.test(pinCode)) {
            alert("📍 Pincode should be a 6-digit number. Please verify your entry.");
            return false;
        }

        return true;
    };


    const initPay = (order, token) => {
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'Order Payment',
            description: 'Order Payment',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(
                        serverurl + '/api/order/verifyrazorpay',
                        response,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (data) {
                        setCartItem({});
                        toast.success('Payment verified! Order placed.');
                        navigate('/order');
                    }
                } catch (err) {
                    toast.error("Payment verification failed.");
                    console.error(err);
                }
            },
            theme: { color: '#3399cc' },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const onSubmitHandler = async () => {
        if (!validateForm()) return;
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const orderItems = [];
            for (const productId in cartItem) {
                for (const size in cartItem[productId]) {
                    const quantity = cartItem[productId][size];
                    if (quantity > 0) {
                        const itemInfo = structuredClone(products.find(p => p._id === productId));
                        if (itemInfo) {
                            itemInfo.size = size;
                            itemInfo.quantity = quantity;
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            if (orderItems.length === 0) {
                toast.error('Your cart is empty!');
                setLoading(false);
                return;
            }

            const orderData = {
                address: formData,
                orderItems,
                amount: getCartAmount() + delivery_fee,
            };

            if (method === 'cod') {
                const res = await axios.post(
                    serverurl + '/api/order/placeorder',
                    orderData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (res.data) {
                    setCartItem({});
                    toast.success('Order placed successfully!');
                    navigate('/order');
                }
            } else if (method === 'razorpay') {
                const resrp = await axios.post(
                    serverurl + '/api/order/placeorderrazor',
                    orderData,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (resrp.data) {
                    initPay(resrp.data, token);
                }
            }
        } catch (error) {
            toast.error('Error placing order. Please try again.');
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <div className="w-full min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 px-4 py-12 pt-[97px]">
            {/* Delivery Info */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2"
            >
                <div className="w-full flex flex-col gap-4">
                    <Titles text1="DELIVERY" text2="INFORMATION" />
                    <div className="flex flex-wrap gap-4">
                        <input type="text" name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First name" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                        <input type="text" name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last name" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={onChangeHandler} placeholder="Email address" className="w-full h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                    <input type="text" name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street" className="w-full h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                    <div className="flex flex-wrap gap-4">
                        <input type="text" name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                        <input type="text" name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <input type="text" name="pinCode" value={formData.pinCode} onChange={onChangeHandler} placeholder="Pincode" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                        <input type="text" name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className="flex-1 min-w-[48%] h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                    </div>
                    <input type="tel" name="phone" value={formData.phone} onChange={onChangeHandler} placeholder="Phone" className="w-full h-12 rounded-md bg-slate-700 text-white placeholder:text-white px-4" />
                </div>
            </motion.div>

            {/* Cart + Payment */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full md:w-1/2 flex flex-col items-center gap-6"
            >
                <CartTotal />
                <Titles text1="PAYMENT" text2="METHOD" />

                <div className="flex flex-wrap justify-center gap-6">
                    <button type="button" onClick={() => setMethod('razorpay')} className={`w-[150px] h-[50px] rounded-sm ${method === 'razorpay' ? 'border-[4px] border-blue-900' : ''}`}>
                        <img src={Razorpay} className="w-full h-full object-fill rounded-sm" alt="Razorpay" />
                    </button>

                    <button type="button" onClick={() => setMethod('cod')} className={`w-[200px] h-[50px] bg-gradient-to-t from-[#95b3f8] to-[white] text-sm rounded-sm text-[#332f6f] font-bold ${method === 'cod' ? 'border-[4px] border-blue-900' : ''}`}>
                        CASH ON DELIVERY
                    </button>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSubmitHandler}
                    disabled={loading}
                    className="mt-4 w-full max-w-[300px] bg-[#547fc448] hover:bg-blue-900 text-white py-3 rounded-2xl text-[16px] border border-[#80808049] disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'PLACE ORDER'}
                </motion.button>
            </motion.div>
        </div>
    );
}

export default PlaceOrder;
