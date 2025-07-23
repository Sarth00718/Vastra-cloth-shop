import React, { useState, useEffect, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function Home() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const { serverurl } = useContext(authDataContext);

  const fetchCounts = async () => {
    try {
      const productsResponse = await axios.get(`${serverurl}/api/product/list`, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
       });
      setTotalProducts(productsResponse.data.products.length);

      const ordersResponse = await axios.post(`${serverurl}/api/order/allorder`, {}, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
       });
      setTotalOrders(ordersResponse.data.length);
    } catch (err) {
      console.error('Failed to fetch counts', err);
      toast.error('Failed to fetch product and order counts');
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden">
      <Nav />
      <Sidebar />
      <div className="w-[80%] ml-auto py-[100px] px-[30px] flex flex-col gap-10">
        <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">Vastra Admin Panel</h1>

        <div className="flex flex-wrap gap-6">
          {/* Products Card */}
          <div className="flex-1 min-w-[280px] max-w-[400px] bg-[#1e293b] border border-gray-600 rounded-xl shadow-lg backdrop-blur-sm p-6 text-center">
            <p className="text-xl text-cyan-200">Total Products</p>
            <p className="text-4xl font-bold mt-3 text-white">{totalProducts}</p>
          </div>

          {/* Orders Card */}
          <div className="flex-1 min-w-[280px] max-w-[400px] bg-[#1e293b] border border-gray-600 rounded-xl shadow-lg backdrop-blur-sm p-6 text-center">
            <p className="text-xl text-cyan-200">Total Orders</p>
            <p className="text-4xl font-bold mt-3 text-white">{totalOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
