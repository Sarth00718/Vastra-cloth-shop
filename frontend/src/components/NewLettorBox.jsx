import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';

function NewLettorBox() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter a valid email address.');
      return;
    }

    console.log('Subscribed email:', email);
    toast.success('Thank you for subscribing!');
    setEmail('');
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
        className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="email"
          placeholder="Enter Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-80 md:w-96 px-4 py-3 rounded-md text-white bg-white/20 placeholder-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="submit"
          className="w-full sm:w-auto bg-cyan-700 hover:bg-cyan-800 transition px-6 py-3 rounded-md font-semibold text-white"
        >
          Subscribe
        </motion.button>
      </form>
    </motion.div>
  );
}

export default NewLettorBox;
