import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import Titles from '../components/Titles';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Order() {
    const [orderData, setOrderData] = useState([]);
    const { currency } = useContext(shopDataContext);
    const { serverurl } = useContext(authDataContext);

    const loadOrder = async () => {
        const loadingPromise = toast.loading("Loading your orders...");
        try {
            const res = await axios.post(`${serverurl}/api/order/userorder`, {}, {
                withCredentials: true,
            });

            if (res.data) {
                let allOrderItems = [];
                res.data.forEach(order => {
                    order.items.forEach(item => {
                        item['status'] = order.status;
                        item['payment'] = order.payment;
                        item['paymentMethod'] = order.paymentMethod;
                        item['date'] = order.date;
                        allOrderItems.push(item);
                    });
                });
                setOrderData(allOrderItems.reverse());
                toast.dismiss(loadingPromise);
                toast.success("Orders loaded!");
            }
        } catch (err) {
            toast.dismiss(loadingPromise);
            toast.error("Failed to load orders.");
            console.error('Failed to load orders:', err);
        }
    };

    useEffect(() => {
        loadOrder();
    }, []);

    return (
        <div className="w-full min-h-[100vh] p-5 pb-[150px] overflow-hidden">
            <div className="text-center mt-20">
                <Titles text1="MY" text2="ORDER" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } }
                }}
                className="flex flex-col items-center gap-8 mt-8"
            >
                {orderData.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                        }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-[900px] border-t border-b py-4 mx-auto"
                    >
                        <div className="w-full flex flex-col md:flex-row items-start gap-4 md:gap-6 bg-[#51808048] py-4 px-5 rounded-2xl relative">
                            <img
                                src={item.image1}
                                alt={item.name || 'Order item'}
                                className="w-full md:w-[130px] h-[200px] md:h-[130px] rounded-md object-cover"
                            />

                            <div className="flex flex-col gap-3 flex-grow">
                                <p className="text-[20px] md:text-[25px] text-[#f3f9fc]">{item.name}</p>

                                <div className="flex flex-wrap gap-4">
                                    <p className="text-[12px] md:text-[18px] text-[#aaf4e7]">
                                        {currency} {item.price}
                                    </p>
                                    <p className="text-[12px] md:text-[18px] text-[#aaf4e7]">
                                        Quantity: {item.quantity}
                                    </p>
                                    <p className="text-[12px] md:text-[18px] text-[#aaf4e7]">
                                        Size: {item.size}
                                    </p>
                                </div>

                                <p className="text-[12px] md:text-[18px] text-[#aaf4e7]">
                                    Date:
                                    <span className="text-[#e4fbff] pl-2">
                                        {new Date(item.date).toDateString()}
                                    </span>
                                </p>

                                <p className="text-[12px] md:text-[16px] text-[#aaf4e7]">
                                    Payment Method: {item.paymentMethod}
                                </p>

                                <div className="flex flex-col md:flex-row md:absolute md:right-5 md:top-[40%] gap-2 mt-3 md:mt-0">
                                    <div className="flex items-center gap-2">
                                        <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                        <p className="text-[10px] md:text-[17px] text-[#f3f9fc]">{item.status}</p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-3 md:px-4 py-1 md:py-2 rounded-md bg-[#101919] text-[#f3f9fc] text-[12px] md:text-[16px] active:bg-slate-500"
                                        onClick={loadOrder}
                                    >
                                        Track Order
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}

export default Order;
