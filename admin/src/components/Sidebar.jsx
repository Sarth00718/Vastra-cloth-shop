import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaListUl } from 'react-icons/fa';
import { MdOutlineReceiptLong } from 'react-icons/md';
import { motion } from 'framer-motion';

function Sidebar() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='w-[18%] min-h-[100vh] py-[60px] border-r border-slate-800/50 fixed top-0 left-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-[5]'
    >
      {/* Premium Right Border */}
      <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-blue-500/30 to-transparent" />
      <div className='flex flex-col gap-5 pt-[40px] pl-[20%] text-[15px] relative z-10' style={{ fontFamily: 'Inter, sans-serif' }}>

        {/* Premium Add Items */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ x: 8 }}
          className='relative flex items-center justify-center md:justify-start gap-3 border border-slate-700/50 border-r-0 px-5 py-4 cursor-pointer text-slate-300 rounded-l-2xl transition-all duration-300 font-semibold group overflow-hidden'
          onClick={() => navigate('/add')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300" />
          <IoIosAddCircleOutline className='w-[24px] h-[24px] relative z-10 group-hover:text-blue-400 transition-colors' />
          <p className='hidden md:block relative z-10 group-hover:text-white transition-colors'>Add items</p>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
        </motion.div>

        {/* Premium List Items */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ x: 8 }}
          className='relative flex items-center justify-center md:justify-start gap-3 border border-slate-700/50 border-r-0 px-5 py-4 cursor-pointer text-slate-300 rounded-l-2xl transition-all duration-300 font-semibold group overflow-hidden'
          onClick={() => navigate('/lists')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300" />
          <FaListUl className='w-[24px] h-[24px] relative z-10 group-hover:text-blue-400 transition-colors' />
          <p className='hidden md:block relative z-10 group-hover:text-white transition-colors'>List items</p>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
        </motion.div>

        {/* Premium View Orders */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ x: 8 }}
          className='relative flex items-center justify-center md:justify-start gap-3 border border-slate-700/50 border-r-0 px-5 py-4 cursor-pointer text-slate-300 rounded-l-2xl transition-all duration-300 font-semibold group overflow-hidden'
          onClick={() => navigate('/orders')}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-300" />
          <MdOutlineReceiptLong className='w-[24px] h-[24px] relative z-10 group-hover:text-blue-400 transition-colors' />
          <p className='hidden md:block relative z-10 group-hover:text-white transition-colors'>View Orders</p>
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-2xl" />
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Sidebar;
