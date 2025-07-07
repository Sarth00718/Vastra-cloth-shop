import React from 'react';
import about from '../assets/vastraAbout.jpg';
import Titles from '../components/Titles';
import NewLettorBox from '../components/NewLettorBox';
import { motion } from 'framer-motion';

function About() {
  return (
    <motion.div
      className="w-full min-h-screen flex flex-col items-center justify-center gap-12 pt-20 px-4 sm:px-6 lg:px-8 mt-4 md:mt-0 md:mb-0 mb-[90px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >

      {/* About Us Title */}
      <Titles text1="ABOUT" text2="US" />

      {/* About Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full max-w-[1200px]">

        {/* Image */}
        <motion.div
          className="w-full lg:w-1/2 max-w-[400px]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <img
            src={about}
            alt="About Vastra"
            className="w-full h-auto shadow-md shadow-black rounded-sm"
          />
        </motion.div>

        {/* Text */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col gap-6 text-white text-[14px] sm:text-[15px] md:text-[16px]"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <p>
            <strong>Vastra</strong> was born for smart, seamless shopping — created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, Vastra makes your online shopping experience simple, satisfying, and stress-free.
          </p>
          <p>
            Made for modern shoppers — combining style, convenience, and affordability. Whether it's fashion, essentials, or trends, we bring everything you need to one trusted platform with fast delivery, easy returns, and a customer-first shopping experience you'll love.
          </p>
          <div>
            <p className="text-base sm:text-lg font-bold text-white mb-2">Our Mission</p>
            <p>
              Our mission is to redefine online shopping by delivering quality, affordability, and convenience. Vastra connects customers with trusted products and brands, offering a seamless, customer-focused experience that saves time, adds value, and fits every lifestyle and need.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full max-w-[1200px] flex flex-col items-center gap-6 px-4 sm:px-6">
        <Titles text1="WHY" text2="CHOOSE US" />

        {/* Cards */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 w-full py-10">
          
          {/* Card 1 */}
          <motion.div
            className="w-full lg:w-1/3 h-auto border border-gray-100 flex flex-col items-center text-center gap-4 px-6 py-6 text-white backdrop-blur-sm bg-white/10 rounded-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <b className="text-lg sm:text-xl font-semibold text-[#bff1f9]">Quality Assurance</b>
            <p className="text-sm sm:text-base">
              We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction always.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="w-full lg:w-1/3 h-auto border border-gray-100 flex flex-col items-center text-center gap-4 px-6 py-6 text-white backdrop-blur-sm bg-white/10 rounded-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <b className="text-lg sm:text-xl font-semibold text-[#bff1f9]">Convenience</b>
            <p className="text-sm sm:text-base">
              Shop easily with fast delivery, simple navigation, secure checkout, and everything you need in one place.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="w-full lg:w-1/3 h-auto border border-gray-100 flex flex-col items-center text-center gap-4 px-6 py-6 text-white backdrop-blur-sm bg-white/10 rounded-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <b className="text-lg sm:text-xl font-semibold text-[#bff1f9]">Exceptional Service</b>
            <p className="text-sm sm:text-base">
              Our dedicated support team ensures quick responses, helpful solutions, and a smooth shopping experience every time.
            </p>
          </motion.div>

        </div>
      </div>

      {/* Newsletter Box */}
      <NewLettorBox />
    </motion.div>
  );
}

export default About;
