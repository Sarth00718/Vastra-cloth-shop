import { motion } from 'framer-motion';
import { MdOutlineArrowRightAlt } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function Hero({ heroData, heroCount, setHeroCount }) {
    const navigate = useNavigate();

    return (
        <div className="w-full lg:w-1/2 py-16 md:py-24 lg:py-32 px-[8%] md:px-[10%] lg:px-[12%] relative z-10 flex flex-col justify-center">

            {/* Content Container */}
            <motion.div
                key={heroCount}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-start gap-4 sm:gap-6 max-w-xl"
            >
                {/* Tagline */}
                <div className="flex items-center gap-3">
                    <span className="w-8 sm:w-12 h-[2px] bg-blue-500 rounded-full" />
                    <span className="text-blue-400 font-semibold text-xs sm:text-sm tracking-widest uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {heroData.tag || "✨ NEW ARRIVALS"}
                    </span>
                </div>

                {/* Main Heading */}
                <h1 className="text-white font-bold leading-[1.1]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    <span className="block text-[32px] sm:text-[44px] md:text-[50px] lg:text-[60px] drop-shadow-xl text-slate-200">
                        {heroData.text1}
                    </span>
                    <span className="block text-[36px] sm:text-[48px] md:text-[56px] lg:text-[68px] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 drop-shadow-2xl">
                        {heroData.text2}
                    </span>
                </h1>

                {/* Description */}
                <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-md leading-relaxed drop-shadow-md border-l-2 border-blue-500/50 pl-4">
                    {heroData.desc || "Explore curated collections of contemporary wear crafted to elevate your unique style."}
                </p>

                {/* CTA Button */}
                <motion.button
                    whileHover={{ scale: 1.05, gap: '16px' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/collections')}
                    className="mt-4 flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold text-sm sm:text-base shadow-lg shadow-blue-500/30 transition-all"
                >
                    Shop Collection
                    <MdOutlineArrowRightAlt className="w-5 h-5 sm:w-6 sm:h-6" />
                </motion.button>
            </motion.div>

            {/* Premium Pill Indicators */}
            <div className="flex items-center gap-3 mt-10 md:mt-16">
                {[0, 1, 2, 3].map((count) => (
                    <motion.div
                        key={count}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => setHeroCount(count)}
                        className={`cursor-pointer transition-all duration-500 rounded-full shadow-lg ${
                            heroCount === count 
                            ? "w-10 sm:w-12 h-2.5 bg-gradient-to-r from-blue-400 to-cyan-300 shadow-blue-500/50" 
                            : "w-2.5 h-2.5 bg-slate-500/50 hover:bg-blue-400/50"
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

export default Hero;
