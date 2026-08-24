import React from "react";

function Titles({ text1, text2 }) {
  return (
    <div className="mb-8 flex w-full items-center justify-center text-center">
      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-blue-100 sm:text-4xl md:text-5xl lg:text-[52px]">
        {text1}{" "}
        <span className="bg-gradient-to-r from-[#a5faf7] via-[#7dd3fc] to-[#60a5fa] bg-clip-text text-transparent">
          {text2}
        </span>
      </h2>
    </div>
  );
}

export default Titles;
