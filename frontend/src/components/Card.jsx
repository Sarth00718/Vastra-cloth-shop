import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

function Card({ name, image, id, price }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!id) {
      toast.error("Product ID is missing!");
      return;
    }
    navigate(`/productdetails/${id}`);
  };

  return (
    <motion.div
      className="w-[300px] max-w-[90%] h-[400px] backdrop-blur-lg rounded-lg transition-transform flex flex-col p-[10px] cursor-pointer border border-[#80808049] shadow-md"
      onClick={handleClick}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.03 }}
    >
      <img
        src={image}
        alt={name}
        className="w-full h-[310px] object-cover rounded-md"
      />
      <div className="mt-4 px-2">
        <h3 className="text-white text-lg font-semibold">{name}</h3>
        <p className="text-blue-100 text-sm mt-1">₹ {price}</p>
      </div>
    </motion.div>
  );
}

export default Card;
