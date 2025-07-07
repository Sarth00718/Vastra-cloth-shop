import React, { useContext, useEffect, useState } from 'react';
import Titles from '../components/Titles';
import { shopDataContext } from '../context/ShopContext';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Cart() {
    const { products, currency, cartItem, updateQuantity } = useContext(shopDataContext);
    const [cartData, setCartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const temp = [];
        for (const productId in cartItem) {
            for (const size in cartItem[productId]) {
                const quantity = cartItem[productId][size];
                if (quantity > 0) {
                    temp.push({ id: productId, size, quantity });
                }
            }
        }
        setCartData(temp);
    }, [cartItem]);

    return (
        <motion.div
            className="w-full min-h-[100vh] px-4 md:px-8 py-8 overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            {/* Header */}
            <div className="text-center mt-20">
                <Titles text1="YOUR" text2="CART" />
            </div>

            {/* Main Layout */}
            <div className="flex flex-col justify-between mt-8 gap-8">

                {/* Cart Items */}
                <div className="flex-1 flex flex-col gap-6">
                    {cartData.length === 0 ? (
                        <p className="text-white text-center text-lg">Your cart is empty.</p>
                    ) : (
                        cartData.map((item, index) => {
                            const productData = products.find(product => product._id === item.id);
                            if (!productData) return null;

                            return (
                                <motion.div
                                    key={index}
                                    className="w-full border-t border-b py-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-[#51808048] py-4 px-5 rounded-2xl relative">
                                        <img
                                            className="w-[100px] h-[100px] rounded-md object-cover"
                                            src={productData.image1}
                                            alt={productData.name}
                                        />
                                        <div className="flex flex-col gap-3 flex-1">
                                            <p className="text-lg md:text-xl text-[#f3f9fc]">
                                                {productData.name}
                                            </p>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[18px] text-[#aaf4e7]">
                                                    {currency} {productData.price}
                                                </p>
                                                <p className="w-[40px] h-[40px] text-[14px] text-white bg-[#518080b4] rounded-md flex items-center justify-center border border-[#9ff9f9]">
                                                    {item.size}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 mt-3 sm:mt-0">
                                            <input
                                                type="number"
                                                min={1}
                                                defaultValue={item.quantity}
                                                className="w-[60px] md:w-[80px] py-1 px-2 text-white text-[16px] font-semibold bg-[#518080b4] border border-[#9ff9f9] rounded-md"
                                                onChange={(e) => {
                                                    if (e.target.value === '' || e.target.value === '0') return;
                                                    updateQuantity(item.id, item.size, Number(e.target.value));
                                                    toast.success('Quantity updated.');
                                                }}
                                            />
                                            <RiDeleteBin6Line
                                                className="text-[#9ff9f9] w-[24px] h-[24px] cursor-pointer"
                                                onClick={() => {
                                                    updateQuantity(item.id, item.size, 0);
                                                    toast.info(`${productData.name} removed from cart.`);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>

                {/* Cart Total & Checkout */}
                <div className="w-full lg:w-[400px] pb-[90px]">
                    <CartTotal />
                    <motion.button
                        className="w-full text-[16px] hover:bg-[#313f5c] cursor-pointer bg-[#58b3a748] py-3 rounded-2xl text-white flex items-center justify-center gap-4 border border-[#80808049] mt-5"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (cartData.length === 0) {
                                toast.warning('Your cart is empty. Please add items before proceeding.');
                                return;
                            }
                            navigate('/placeorder');
                        }}
                    >
                        PROCEED TO CHECKOUT
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default Cart;
