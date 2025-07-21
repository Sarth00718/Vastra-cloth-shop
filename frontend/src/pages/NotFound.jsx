import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen  flex items-center justify-center text-white px-4">
      <div className="text-center flex flex-col gap-6">
        <h1 className="text-[40px] md:text-[80px] font-bold">404</h1>
        <p className="text-[18px] md:text-[24px]">Oops! Page Not Found</p>
        <button
          onClick={() => {
            toast.success('Redirecting to Login page...');
            navigate('/login');
          }}
          className="bg-white text-black text-[16px] md:text-[18px] px-6 cursor-pointer py-3 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition"
        >
          Go to Login
        </button>

      </div>
    </div>
  );
}

export default NotFound;
