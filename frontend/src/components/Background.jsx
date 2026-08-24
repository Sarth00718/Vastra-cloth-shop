import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import back3 from "../assets/back3.jpg";
import back4 from "../assets/back4.jpg";

const images = [back2, back1, back3, back4];

function Background({ heroCount }) {
  if (heroCount < 0 || heroCount >= images.length) return null;

  return (
    <>
      {/* Desktop: absolute overlay behind hero text */}
      <div className="hidden lg:block absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroCount}
            src={images[heroCount]}
            alt="Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        {/* Gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020817]/90 via-[#020817]/60 to-transparent" />
      </div>

      {/* Mobile/Tablet: stacked image below the text */}
      <div className="lg:hidden w-full h-[45vw] min-h-[200px] max-h-[320px] relative overflow-hidden rounded-2xl mx-4 mt-2 mb-4 shrink-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={heroCount}
            src={images[heroCount]}
            alt="Background"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full object-cover rounded-2xl"
          />
        </AnimatePresence>
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020817]/40 to-transparent rounded-2xl" />
      </div>
    </>
  );
}

export default Background;