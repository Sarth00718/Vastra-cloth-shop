import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import Background from '../components/Background';
import Product from './Product';
import OurPolicy from '../components/OurPolicy';
import NewLettorBox from '../components/NewLettorBox';
import Footer from '../components/Footer';
import { toast } from 'react-toastify';


function Home() {
  const heroData = [
    { text1: "30% OFF Limited Offer", text2: "Style that" },
    { text1: "Discover the Best of Bold Fashion", text2: "Limited Time Only!" },
    { text1: "Explore Our Best Collection", text2: "Shop Now!" },
    { text1: "Choose your Perfect Fashion Fit", text2: "Now on Sale!" }
  ];
  const [heroCount, setHeroCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroCount(prevCount => (prevCount === 3 ? 0 : prevCount + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='overflow-x-hidden relative top-[70px]'>
      <div className="w-[100vw] lg:h-[100vh] md:h-[50vh] sm:h-[35vh]  relative overflow-hidden">
        <Background heroCount={heroCount} />
        <Hero
          heroCount={heroCount}
          setHeroCount={setHeroCount}
          heroData={heroData[heroCount]}
        />
      </div>
      <Product />
      <OurPolicy />
      <NewLettorBox />
      <Footer />
    </div>
  );

}

export default Home
