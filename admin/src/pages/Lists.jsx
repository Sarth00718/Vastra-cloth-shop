import React, { useState, useEffect, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

function Lists() {
  const [list, setList] = useState([]);
  const { serverurl } = useContext(authDataContext);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${serverurl}/api/product/list`);
      setList(response.data.products);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch products.');
    }
  };

  const removeList = async (id) => {
    try {
      const result = await axios.post(`${serverurl}/api/product/remove/${id}`, {}, { withCredentials: true });
      if (result.data) {
        toast.success('Product removed successfully!');
        fetchList();
      }
    } catch (error) {
      console.error('Error removing product:', error);
      toast.error('Failed to remove product.');
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white relative overflow-hidden flex flex-col font-poppins">
      <Nav />
      <Sidebar />

      <div className="w-full md:w-[82%] ml-auto px-6 md:pl-[65px] pr-[20px] pt-[110px] flex flex-col gap-8">
        <h2 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4">All Listed Products</h2>

        {list?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.03 }}
                className="bg-[#1e293b] border border-gray-600 rounded-xl shadow-lg backdrop-blur-sm flex flex-col items-center p-4 gap-4"
              >
                <img
                  src={item.image1 || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-[200px] object-cover rounded-lg"
                />
                <div className="w-full flex flex-col items-start gap-1">
                  <p className="text-lg font-medium text-cyan-200">{item.name}</p>
                  <p className="text-sm text-gray-400">Category: {item.category}</p>
                  <p className="text-sm text-green-300">₹{item.price}</p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => removeList(item._id)}
                  className="text-red-400 hover:text-white border border-red-400 hover:bg-red-500 px-4 py-1 rounded-md transition"
                >
                  Remove
                </motion.button>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-300"></p>
        )}
      </div>
    </div>
  );
}

export default Lists;
