import React from 'react';
import { FiRepeat, FiHeadphones } from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";
import { motion } from "framer-motion";
import Titles from "./Titles";

function OurPolicy() {
  const policies = [
    {
      icon: <FiRepeat className="w-8 h-8 text-blue-400" />,
      title: "Easy Exchange Policy",
      description: "Exchange Made Easy - Quick, Simple, and Customer-Friendly Process.",
      delay: 0.1
    },
    {
      icon: <BsShieldCheck className="w-8 h-8 text-blue-400" />,
      title: "7 Days Return Policy",
      description: "Shop with Confidence - 7 Days Easy Return Guarantee.",
      delay: 0.2
    },
    {
      icon: <FiHeadphones className="w-8 h-8 text-blue-400" />,
      title: "Best Customer Support",
      description: "Trusted Customer Support - Your Satisfaction Is Our Priority.",
      delay: 0.3
    }
  ];

  return (
    <div className="w-full relative py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Titles text1="OUR" text2="POLICY" />
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto -mt-2">
            Committed to providing you with a seamless and secure shopping experience.
          </p>
        </motion.div>

        {/* Policy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {policies.map((policy, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: policy.delay, duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="group relative flex flex-col items-center text-center p-8 rounded-3xl bg-slate-900/40 border border-slate-800/50 backdrop-blur-sm hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-500"
            >
              {/* Icon Container with Glow */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 group-hover:scale-150 transition-all duration-500" />
                <div className="relative w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center shadow-lg group-hover:border-blue-500/30 group-hover:shadow-blue-500/20 transition-all duration-500">
                  {policy.icon}
                </div>
              </div>

              {/* Content */}
              <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300">
                {policy.title}
              </h4>
              <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                {policy.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OurPolicy;
