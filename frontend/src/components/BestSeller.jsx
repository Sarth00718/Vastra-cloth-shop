import { useContext } from 'react';
import { motion } from 'framer-motion';
import Titles from './Titles';
import Card, { CardSkeleton } from './Card';
import { shopDataContext } from '../context/ShopContext';

function BestSeller() {
  const { products, productsLoading } = useContext(shopDataContext);
  const bestSellers = products.filter(p => p.bestseller === true || p.bestseller === 'true').slice(0, 5);

  return (
    <section className="w-full py-14 px-4">
      <div className="text-center mb-3">
        <Titles text1="BEST" text2="SELLERS" />
        <p className="text-slate-400 text-sm md:text-base mt-2">
          Tried, tested, loved — our all-time favourites
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {productsLoading ? (
          Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
        ) : bestSellers.length === 0 ? (
          <p className="text-slate-500 text-sm">No bestsellers available.</p>
        ) : (
          bestSellers.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                id={item._id}
                image={item.image1}
                name={item.name}
                price={item.price}
                category={item.category}
                sizes={item.sizes}
              />
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}

export default BestSeller;
