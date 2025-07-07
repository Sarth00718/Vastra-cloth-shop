import React, { useContext, useEffect, useState } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Card from './Card';
import Titles from './Titles';
function RelatedProducts({ category, subCategory, currentProductId }) {
    const { products } = useContext(shopDataContext);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => item.category === category);
            productsCopy = productsCopy.filter((item) => item.subCategory === subCategory);
            productsCopy = productsCopy.filter((item) => item._id !== currentProductId);
            setRelated(productsCopy.slice(0, 4)); // Limit to 4 related products
        }
    }, [products, category, subCategory, currentProductId]);

    return (
        <div className="my-[130px] md:my-[40px] md:px-[60px]">
            <div className="ml-[20px] lg:ml-[80px]">
                <Titles text1="RELATED" text2="PRODUCTS" />
            </div>
            <div className="w-full mt-[30px] flex items-center justify-center flex-wrap gap-[50px]">
                {related.map((item, index) => (
                    <Card
                        key={index}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.image1}
                    />
                ))}
            </div>
        </div>
    );
}

export default RelatedProducts;