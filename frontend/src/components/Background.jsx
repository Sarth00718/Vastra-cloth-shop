import React from 'react';
import back1 from "../assets/back1.jpg";
import back2 from "../assets/back2.jpg";
import back3 from "../assets/back3.jpg";
import back4 from "../assets/back4.jpg";

function Background({ heroCount }) {
  const images = [back2, back1, back3, back4];
  
  if (heroCount >= 0 && heroCount < images.length) {
    return (
      <img
        src={images[heroCount]}
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
    );
  }
  return null;
}

export default Background;