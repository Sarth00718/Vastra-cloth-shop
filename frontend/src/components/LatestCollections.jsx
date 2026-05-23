import { useContext } from 'react';
import { motion } from 'framer-motion';
import Titles from './Titles';
import Card, { CardSkeleton } from './Card';
import { shopDataContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

function LatestCollections() {
  const { products, productsLoading } = useContext(shopDataContext);
  const navigate = useNavigate();

  // Sort by newest and take first 8
  const latestProducts = [...products]
    .sort((a, b) => b.date - a.date)
    .slice(0, 8);

  return (
    <section className="w-full py-14 px-4">
      <div className="text-center mb-3">
        <Titles text1="LATEST" text2="COLLECTIONS" />
        <p className="text-slate-400 text-sm md:text-base mt-2">
          New arrivals — fresh styles just dropped this season
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-6 mt-8">
        {productsLoading ? (
          Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)
        ) : latestProducts.length === 0 ? (
          <p className="text-slate-500 text-sm">No products found.</p>
        ) : (
          latestProducts.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card
                id={item._id}
                image={item.image1}
                name={item.name}
                price={item.price}
                category={item.category}
                subCategory={item.subCategory}
                sizes={item.sizes}
              />
            </motion.div>
          ))
        )}
      </div>

      {latestProducts.length > 0 && (
        <div className="text-center mt-10">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/collections')}
            className="px-8 py-3 border border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition-all"
          >
            View All Collections →
          </motion.button>
        </div>
      )}
    </section>
  );
}

export default LatestCollections;
