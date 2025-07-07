import React, { useContext, useEffect, useState } from 'react';
import Titles from './Titles';
import Card from './Card';
import { shopDataContext } from '../context/ShopContext';

function LatestCollections() {
  const { products } = useContext(shopDataContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 8));
    }
  }, [products]);

  return (
    <>
      {/* Section Title */}
      <div className="w-full text-center md:mt-[50px]">
        <Titles text1="LATEST" text2="COLLECTIONS" />
        <p className="w-full mx-auto text-[13px] md:text-[20px] px-[10px] text-blue-100">
          Step Into Style 💦 New Collection Dropping This Season!
        </p>
      </div>

      {/* Product Grid */}
      <div className="w-full mt-[30px] flex items-center justify-center flex-wrap gap-[50px] px-4">
        {latestProducts.length === 0 ? (
          <p className="text-white">No products found.</p>
        ) : (
          latestProducts.map((item, index) => {
            //console.log('Product item:', item); 
            return (
              <Card
                key={index}
                id={item._id} 
                image={item.image1}
                name={item.name}
                price={item.price}
              />
            );
          })
        )}
      </div>
    </>
  );
}

export default LatestCollections;