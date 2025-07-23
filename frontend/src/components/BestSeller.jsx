import React, { useContext, useEffect, useState } from 'react';
import Titles from './Titles';
import Card from './Card';
import { shopDataContext } from '../context/ShopContext';

function BestSeller() {
  const { products } = useContext(shopDataContext);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const filtered = products.filter((item) => item.bestseller === true);
      setBestSellers(filtered.slice(8,12));
    }
  }, [products]);

  return (
    <div>
      {/* Section Title */}
      <div className="h-[8%] w-full text-center mt-[50px]">
        <Titles text1="BEST" text2="SELLER" />
        <p className="w-full m-auto text-[13px] md:text-[20px] px-[10px] text-blue-100">
          Tried, Tested, Loved — Discover Our All-Time Best Sellers.
        </p>
      </div>

      {/* Product Grid */}
      <div className="w-full h-[50%] mt-[30px] flex items-center justify-center flex-wrap gap-[50px] px-4 ">
        {bestSellers.length === 0 ? (
          <p className="text-white">No best sellers available.</p>
        ) : (
          bestSellers.map((item, index) => (
            <Card
              key={index}
              id={item._id} 
              image={item.image1}
              name={item.name}
              price={item.price}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default BestSeller;