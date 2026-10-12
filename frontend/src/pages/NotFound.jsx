import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LuArrowLeft, LuFileQuestion } from 'react-icons/lu';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex items-center justify-center text-white px-4 bg-slate-950">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
          <LuFileQuestion className="w-10 h-10 stroke-[1.5]" />
        </div>
        <div>
          <h1 className="text-[40px] md:text-[64px] font-bold tracking-tight">404</h1>
          <p className="text-[18px] md:text-[22px] text-slate-300">Oops! Page Not Found</p>
          <p className="text-sm text-slate-500 mt-2">The page you are looking for might have been moved or doesn't exist.</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-blue-400 transition cursor-pointer"
        >
          <LuArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>
    </div>
  );
}

export default NotFound;
