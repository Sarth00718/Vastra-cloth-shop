import React, { useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

function NewLettorBox() {
  const [email, setEmail] = useState('');
  const { serverurl } = useContext(authDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email');
      return;
    }

    try {
      const response = await axios.post(`${serverurl}/api/subscription/subscribe`, { email });
      toast.success(response.data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Subscription failed. Please try again.';
      toast.error(errorMsg);
      console.error('Subscription error:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="w-full h-[350px] py-10 px-4 flex flex-col items-center text-center text-white font-poppins"
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-2">
        Subscribe now & get 30% off
      </h2>
      <p className="text-sm sm:text-base max-w-xl mb-6 text-gray-300">
        Subscribe now and enjoy exclusive savings, special deals, and early access to new collections.
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 flex flex-col sm:flex-row gap-3 items-center shadow-2xl shadow-black/20"
      >
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 w-full px-5 py-4 rounded-xl text-white bg-slate-950/60 placeholder-slate-500 border border-slate-800 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-600 transition px-8 py-4 rounded-xl font-bold text-white shadow-lg shadow-cyan-900/20"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  );
}

export default NewLettorBox;
