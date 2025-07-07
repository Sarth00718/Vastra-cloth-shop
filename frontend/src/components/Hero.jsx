import React from 'react';
import { FaCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';


function Hero({ heroData, heroCount, setHeroCount }) {
    return (
        <div className="w-[40%] h-full relative font-[Poppins]">

            {/* Hero Text */}
            <motion.div
                className="absolute text-[#88d9ee] font-bold leading-tight md:left-[10%] md:top-[90px] lg:top-[130px] left-[10%] top-[50px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-[20px] sm:text-[32px] md:text-[40px] lg:text-[55px]">{heroData.text1}</p>
                <p className="text-[16px] sm:text-[28px] md:text-[35px] lg:text-[50px] mt-1">{heroData.text2}</p>
            </motion.div>

            {/* Circles */}
            <div className="absolute md:top-[400px] lg:top-[600px] top-[180px] left-[10%] flex items-center justify-center gap-[10px]">
                {[0, 1, 2, 3].map((count) => (
                    <FaCircle
                        key={count}
                        className={`w-[14px] cursor-pointer transition-colors duration-200 ${heroCount === count ? "fill-blue-500" : "fill-white"}`}
                        onClick={() => setHeroCount(count)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Hero;
