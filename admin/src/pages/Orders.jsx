import React, { useState, useEffect, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { SiHackthebox } from 'react-icons/si';
import  toast  from 'react-hot-toast';
import { motion } from 'framer-motion';

function Orders() {
  const [orders, setOrders] = useState([]);
  const { serverurl } = useContext(authDataContext);

  const fetchAllOrders = async () => {
    try {
      const result = await axios.post(`${serverurl}/api/order/allorder`, {}, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
       });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error(error.message);
      toast.error('Failed to fetch orders.');
    }
  };

  const statusHandler = async (orderId, status) => {
    try {
      const result = await axios.post(`${serverurl}/api/order/updatestatus`, { orderId, status }, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
       });
      if (result.data) {
        toast.success('Order status updated!');
        await fetchAllOrders();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update order status.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-tr from-[#0f172a] to-[#1e293b] text-white flex flex-col font-poppins">
      <Nav />
      <div className="w-full flex lg:justify-start justify-center">
        <Sidebar />
        <div className="lg:w-[85%] md:w-[75%] ml-auto mt-[65px] px-6 md:px-24 py-12 flex flex-col gap-10">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">All Orders List</h1>

          {orders.length === 0 ? (
            <p className="text-gray-300">No orders found.</p>
          ) : (
            orders.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-full bg-slate-700/60 border border-gray-600 rounded-lg p-6 flex flex-col lg:flex-row gap-6 backdrop-blur-md hover:shadow-lg transition"
              >
                <SiHackthebox className="w-[50px] h-[50px] text-black p-2 rounded-lg bg-white" />

                <div className="flex flex-col gap-2 flex-1">
                  {order.items.map((item, idx) => (
                    <p key={idx} className="text-cyan-300 text-sm">
                      {item.name.toUpperCase()} × {item.quantity} <span className="text-white">({item.size})</span>
                    </p>
                  ))}

                  <div className="text-sm text-green-200 mt-2">
                    <p>{`${order.address.firstName} ${order.address.lastName}`}</p>
                    <p>{order.address.street},</p>
                    <p>{`${order.address.city}, ${order.address.state}, ${order.address.country}, ${order.address.pinCode}`}</p>
                    <p>{order.address.phone}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-sm text-green-200">
                  <p>Items: {order.items.length}</p>
                  <p>Method: {order.paymentMethod}</p>
                  <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="text-lg font-bold text-white">₹ {order.amount}</p>
                </div>

                <select
                  value={order.status}
                  onChange={(e) => statusHandler(order._id, e.target.value)}
                  className="px-3 py-2 bg-[#0c3b3b] text-white rounded-md border border-gray-500 hover:border-cyan-400 transition"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;
