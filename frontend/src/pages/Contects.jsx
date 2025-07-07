import React from 'react';
import Titles from '../components/Titles';
import NewLettorBox from '../components/NewLettorBox';
import contactImage from '../assets/image.png';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

function Contacts() {
  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-12 pt-20 px-4 sm:px-6 lg:px-8 mt-4 md:mt-0 mb-[90px] md:mb-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >

      {/* Title */}
      <Titles text1="CONTACT" text2="US" />

      {/* Main Contact Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-[1200px]">

        {/* Image */}
        <motion.div
          className="w-full lg:w-[60%]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={contactImage}
            alt="Contact Vastra"
            className="w-full h-auto rounded shadow-md shadow-black"
          />
        </motion.div>

        {/* Contact Details */}
        <motion.div
          className="w-full lg:w-[40%] flex flex-col gap-6 text-white text-sm sm:text-base"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="text-lg font-semibold mb-1">Our Store</p>
            <p>On Varachha main road, Surat City, Gujarat, India</p>
          </div>

          <div>
            <p className="text-lg font-semibold mb-1">Phone</p>
            <p>+91-7046053000</p>
          </div>

          <div>
            <p className="text-lg font-semibold mb-1">Email</p>
            <p>admin@vastra.com</p>
          </div>

          <div>
            <p className="text-lg font-semibold mb-1">Careers at Vastra</p>
            <p>Learn more about our teams and job openings.</p>
            <button
              className="mt-3 px-5 py-2 bg-[#bff1f9] text-black font-semibold rounded hover:bg-[#a0e0e9] transition duration-200"
              onClick={() => toast.info('Careers page coming soon!')}
            >
              Explore Jobs
            </button>
          </div>
        </motion.div>
      </div>

      {/* Newsletter Box */}
      <NewLettorBox />
    </motion.div>
  );
}

export default Contacts;
