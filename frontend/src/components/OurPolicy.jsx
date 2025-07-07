import React from 'react';
import { FiRepeat, FiHeadphones } from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";

function OurPolicy() {
  return (
    <div className="w-full px-[16px] py-[80px]  text-white">
      <h2 className="text-center text-[24px] sm:text-[30px] font-semibold text-cyan-300 mb-[8px]">
        OUR POLICY
      </h2>
      <p className="text-center text-[14px] sm:text-[16px] mb-[40px] text-gray-300">
        Customer-Friendly Policies - Committed to Your Satisfaction and Safety.
      </p>

      <div className="flex flex-col md:flex-row justify-center items-center gap-[40px] max-w-7xl mx-auto">
        {/* Easy Exchange */}
        <div className="flex flex-col items-center text-center max-w-xs px-[16px]">
          <FiRepeat size={40} className="text-cyan-400 mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-cyan-200 mb-[8px]">
            Easy Exchange Policy
          </h3>
          <p className="text-[14px] text-gray-300">
            Exchange Made Easy - Quick, Simple, and Customer-Friendly Process.
          </p>
        </div>

        {/* 7 Days Return */}
        <div className="flex flex-col items-center text-center max-w-xs px-[16px]">
          <BsShieldCheck size={40} className="text-cyan-400 mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-cyan-200 mb-[8px]">
            7 Days Return Policy
          </h3>
          <p className="text-[14px] text-gray-300">
            Shop with Confidence - 7 Days Easy Return Guarantee.
          </p>
        </div>

        {/* Customer Support */}
        <div className="flex flex-col items-center text-center max-w-xs px-[16px]">
          <FiHeadphones size={40} className="text-cyan-400 mb-[16px]" />
          <h3 className="text-[18px] font-semibold text-cyan-200 mb-[8px]">
            Best Customer Support
          </h3>
          <p className="text-[14px] text-gray-300">
            Trusted Customer Support - Your Satisfaction Is Our Priority.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OurPolicy;
