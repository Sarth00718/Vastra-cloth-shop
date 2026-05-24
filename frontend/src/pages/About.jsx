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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 w-full max-w-[1240px]">

        {/* Image Container */}
        <motion.div
          className="w-full lg:w-[45%] flex justify-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative group w-full max-w-[500px]">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <img
              src={about}
              alt="About Vastra"
              className="relative w-full h-auto shadow-2xl shadow-black/50 rounded-lg object-cover"
            />
          </div>
        </motion.div>

        {/* Text Container */}
        <motion.div
          className="w-full lg:w-[50%] flex flex-col gap-8 text-slate-300 text-[15px] sm:text-[16px] leading-relaxed"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col gap-6">
            <p>
              <strong className="text-white text-lg">Vastra</strong> was born for smart, seamless shopping — created to deliver quality products, trending styles, and everyday essentials in one place. With reliable service, fast delivery, and great value, Vastra makes your online shopping experience simple, satisfying, and stress-free.
            </p>
            <p>
              Vastra is an innovative e-commerce platform designed to bring you a premium collection of clothing and lifestyle products. We bridge the gap between high-end fashion and accessibility, offering a curated selection that reflects modern trends and timeless classics. Our platform is built on advanced technology to provide a smooth, secure, and enjoyable shopping journey for every customer.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <div className="w-8 h-[2px] bg-blue-500"></div>
              Our Mission
            </h3>
            <p>
              Our mission is to redefine the digital shopping landscape by prioritizing quality, transparency, and customer satisfaction. We aim to empower our users with a diverse range of products, supported by a robust infrastructure that ensures fast delivery, secure payments, and dedicated support. At Vastra, we don't just sell products; we deliver a lifestyle.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Us Section */}
      <div className="w-full max-w-[1240px] flex flex-col items-center gap-10 px-4 sm:px-6 mb-12">
        <Titles text1="WHY" text2="CHOOSE US" />

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          
          {/* Card 1 */}
          <motion.div
            className="group relative h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full border border-slate-700/50 flex flex-col items-center text-center gap-5 px-8 py-10 text-white backdrop-blur-md bg-slate-900/40 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Quality Assurance</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                We guarantee quality through strict checks, reliable sourcing, and a commitment to customer satisfaction always.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            className="group relative h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full border border-slate-700/50 flex flex-col items-center text-center gap-5 px-8 py-10 text-white backdrop-blur-md bg-slate-900/40 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Convenience</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Shop easily with fast delivery, simple navigation, secure checkout, and everything you need in one place.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            className="group relative h-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-full border border-slate-700/50 flex flex-col items-center text-center gap-5 px-8 py-10 text-white backdrop-blur-md bg-slate-900/40 rounded-2xl hover:border-blue-500/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">Exceptional Service</h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Our dedicated support team ensures quick responses, helpful solutions, and a smooth shopping experience every time.
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Newsletter Box */}
      <NewLettorBox />
    </motion.div>
  );
}

export default About;
