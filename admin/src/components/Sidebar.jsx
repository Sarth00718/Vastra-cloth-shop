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
      className='w-[18%] min-h-[100vh] py-[60px] border-r-[1px] fixed top-0 left-0 bg-[#0A1626]'
    >
      <div className='flex flex-col gap-4 pt-[40px] pl-[20%] text-[15px] font-poppins'>

        {/* Add Items */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className='flex items-center justify-center md:justify-start gap-3 border border-gray-200 border-r-0 px-3 py-2 cursor-pointer hover:bg-[#526f7c] hover:text-white text-white'
          onClick={() => navigate('/add')}
        >
          <IoIosAddCircleOutline className='w-[20px] h-[20px]' />
          <p className='hidden md:block'>Add items</p>
        </motion.div>

        {/* List Items */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className='flex items-center justify-center md:justify-start gap-3 border border-gray-200 border-r-0 px-3 py-2 cursor-pointer hover:bg-[#526f7c] hover:text-white text-white'
          onClick={() => navigate('/lists')}
        >
          <FaListUl className='w-[20px] h-[20px]' />
          <p className='hidden md:block'>List items</p>
        </motion.div>

        {/* View Orders */}
        <motion.div
          whileTap={{ scale: 0.95 }}
          className='flex items-center justify-center md:justify-start gap-3 border border-gray-200 border-r-0 px-3 py-2 cursor-pointer hover:bg-[#526f7c] hover:text-white text-white'
          onClick={() => navigate('/orders')}
        >
          <MdOutlineReceiptLong className='w-[20px] h-[20px]' />
          <p className='hidden md:block'>View Orders</p>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Sidebar;
