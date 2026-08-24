import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Background from '../components/Background';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import { useNavbarHeight } from '../hooks/useNavbarHeight';


function Home() {
  const heroData = [
    { tag: "✨ NEW ARRIVALS", text1: "Discover the Best of", text2: "Bold Fashion", desc: "Explore curated collections of contemporary wear crafted to elevate your unique style." },
    { tag: "🔥 TRENDING NOW", text1: "Choose Your Perfect", text2: "Fashion Fit", desc: "Unleash your confidence with our latest high-end fashion line, now available online." },
    { tag: "🎉 LIMITED TIME", text1: "Flat 30% OFF on", text2: "Summer Styles", desc: "Upgrade your wardrobe with premium quality clothing at unbeatable prices." },
    { tag: "💎 PREMIUM WEAR", text1: "Explore Our Best", text2: "Exclusive Collection", desc: "Experience the perfect blend of tradition and modern elegance." }
  ];
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const navbarPadding = useNavbarHeight();

  return (
    <div className={`overflow-x-hidden ${navbarPadding}`}>
      <div className="w-full min-h-[50vh] md:min-h-[70vh] lg:min-h-[calc(100vh-64px)] flex items-center relative overflow-hidden">
        <Background heroCount={heroCount} />
        <Hero
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          heroData={heroData[heroCount]}
        />
      </div>
      <Product />
      <OurPolicy />
    </div>
  );

}

export default Home
