import React from "react";
import LatestCollections from "../components/LatestCollections";
import BestSeller from "../components/BestSeller";

function Product() {
  return (
    <div className="w-[100vw] min-h-[100vh] text-white flex items-center justify-start flex-col py-[20px]">
      <div className="w-full min-h-[70px] flex items-center justify-center gap-[10px] flex-col">
        <LatestCollections />
      </div>
      <div className="w-full min-h-[70px] flex items-center justify-center gap-[10px] flex-col">
        <BestSeller />
      </div>
    </div>
  );
}

export default Product;