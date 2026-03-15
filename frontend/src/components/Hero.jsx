import { FaCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';


function Hero({ heroData, heroCount, setHeroCount }) {
    return (
        <div className="w-[40%] h-full relative font-[Poppins]">

            {/* Hero Text */}
            <motion.div
                className="absolute text-blue-200 font-bold leading-tight -md:left-[10%] md:top-[90px] lg:top-[130px] left-[10%] top-[50px]"
                style={{ fontFamily: 'Poppins, sans-serif' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <p className="text-[20px] sm:text-[32px] md:text-[40px] lg:text-[55px] drop-shadow-[0_0_15px_rgba(33,150,243,0.5)]">{heroData.text1}</p>
                <p className="text-[16px] sm:text-[28px] md:text-[35px] lg:text-[50px] mt-1 drop-shadow-[0_0_15px_rgba(33,150,243,0.5)]">{heroData.text2}</p>
            </motion.div>

            {/* Circles */}
            <div className="absolute md:top-[400px] lg:top-[600px] top-[180px] left-[10%] flex items-center justify-center gap-[10px]">
                {[0, 1, 2, 3].map((count) => (
                    <motion.div
                        key={count}
                        whileHover={{ scale: 1.3 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaCircle
                            className={`w-[14px] cursor-pointer transition-all duration-300 ${heroCount === count ? "fill-blue-500 drop-shadow-[0_0_8px_rgba(33,150,243,0.8)]" : "fill-blue-300/50 hover:fill-blue-400"}`}
                            onClick={() => setHeroCount(count)}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default Hero;
