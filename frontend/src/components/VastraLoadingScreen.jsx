import React from 'react';
import Vogo from "../assets/vogo.png";

function VastraLoadingScreen({ isVisible }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
      <div className="flex flex-col items-center animate-fade-in">
        <img 
          src={Vogo} 
          alt="Vastra Logo" 
          className="w-28 h-28 mb-4 animate-glow-dark rounded-full"
        />
        <h1 className="text-4xl font-bold text-cyan-300 animate-blink-lg">
          Vastra
        </h1>
        <div className="mt-6 flex space-x-2">
          <div className="w-3 h-3 bg-cyan-300 rounded-full animate-blink-sm"></div>
          <div className="w-3 h-3 bg-cyan-300 rounded-full animate-blink-sm" style={{animationDelay: '0.2s'}}></div>
          <div className="w-3 h-3 bg-cyan-300 rounded-full animate-blink-sm" style={{animationDelay: '0.4s'}}></div>
        </div>
      </div>
    </div>
  );
}

export default VastraLoadingScreen; 