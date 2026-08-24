import { useContext, useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiChevronDown } from 'react-icons/fi';
import { MdOutlineTune } from 'react-icons/md';
import Titles from '../components/Titles';
import Card, { CardSkeleton } from '../components/Card';
import { shopDataContext } from '../context/ShopContext';
import { useNavbarHeight } from '../hooks/useNavbarHeight';

const CATEGORIES = ['Men', 'Women', 'Kids'];
const SUBCATEGORIES = ['Topwear', 'Bottomwear', 'Winterwear'];
const SORT_OPTIONS = [
  { value: 'relevant', label: 'Most Relevant' },
  { value: 'low-high', label: 'Price: Low → High' },
  { value: 'high-low', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
];

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1.5 bg-blue-600/20 text-blue-300 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/30">
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <FiX className="w-3 h-3" />
      </button>
    </span>
  );
}

function Collections() {
  const { products, search, showSearch, productsLoading } = useContext(shopDataContext);
  const navbarPadding = useNavbarHeight();
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevant');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [bestseller, setBestseller] = useState(false);

  const toggle = (arr, setter, value) => {
    setter((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (search && showSearch) {
      result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (selectedSubcategories.length > 0) {
      result = result.filter((p) => selectedSubcategories.includes(p.subCategory));
    }
    if (bestseller) {
      result = result.filter((p) => p.bestseller);
    }
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    switch (sortBy) {
      case 'low-high': result.sort((a, b) => a.price - b.price); break;
      case 'high-low': result.sort((a, b) => b.price - a.price); break;
      case 'newest': result.sort((a, b) => b.date - a.date); break;
      default: break;
    }

    return result;
  }, [products, search, showSearch, selectedCategories, selectedSubcategories, bestseller, priceRange, sortBy]);

  const activeFilters = [
    ...selectedCategories.map((c) => ({ label: c, remove: () => toggle(selectedCategories, setSelectedCategories, c) })),
    ...selectedSubcategories.map((s) => ({ label: s, remove: () => toggle(selectedSubcategories, setSelectedSubcategories, s) })),
    ...(bestseller ? [{ label: 'Bestsellers', remove: () => setBestseller(false) }] : []),
  ];

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setBestseller(false);
    setPriceRange([0, 10000]);
    setSortBy('relevant');
  };

  const renderFilters = (isMobile = false) => (
    <>
      <div className="flex items-center justify-between">
        <p className="text-slate-100 font-bold text-lg">Filters</p>
        <div className="flex items-center gap-3">
          {activeFilters.length > 0 && (
            <button onClick={clearAll} className="text-xs text-blue-400 hover:text-blue-300">Clear all</button>
          )}
          {isMobile && (
            <button onClick={() => setShowFilters(false)} className="text-slate-300 hover:text-white">
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Category</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggle(selectedCategories, setSelectedCategories, cat)}
                className={`w-4 h-4 rounded border-2 transition-all ${
                  selectedCategories.includes(cat)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}
              >
                {selectedCategories.includes(cat) && (
                  <svg viewBox="0 0 16 16" fill="white" className="w-3 h-3 m-[1px]">
                    <path d="M13.5 3.5L6 11l-3.5-3.5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <span className="text-slate-300 text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">Type</p>
        <div className="flex flex-col gap-2">
          {SUBCATEGORIES.map((sub) => (
            <label key={sub} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggle(selectedSubcategories, setSelectedSubcategories, sub)}
                className={`w-4 h-4 rounded border-2 transition-all ${
                  selectedSubcategories.includes(sub)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-600 group-hover:border-slate-400'
                }`}
              />
              <span className="text-slate-300 text-sm">{sub}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => setBestseller((v) => !v)}
            className={`w-10 h-5 rounded-full transition-all relative ${bestseller ? 'bg-blue-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${bestseller ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-slate-300 text-sm">Bestsellers only</span>
        </label>
      </div>

      <div>
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Price Range — ₹{priceRange[0]} – ₹{priceRange[1]}
        </p>
        <input
          type="range"
          min={0}
          max={10000}
          step={100}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, Number(e.target.value)])}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-blue-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/50 hover:[&::-webkit-slider-thumb]:scale-110 [&::-webkit-slider-thumb]:transition-transform"
          style={{
            background: `linear-gradient(to right, #3b82f6 ${(priceRange[1] / 10000) * 100}%, #334155 ${(priceRange[1] / 10000) * 100}%)`,
          }}
        />
      </div>
    </>
  );

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row transition-all duration-300 z-[2] ${navbarPadding}`}>

      {/* ── Mobile Filter Toggle ── */}
      <div className={`md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-800 fixed w-full bg-slate-950 z-20 transition-all duration-300 ${showSearch ? 'top-[144px]' : 'top-[64px]'}`}>
        <span className="text-slate-300 font-semibold text-sm">{filteredProducts.length} Products</span>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-slate-300 hover:text-white text-sm"
        >
          <MdOutlineTune className="w-5 h-5" /> Filters
        </button>
      </div>

      {/* ── Mobile Sidebar ── */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-30 md:hidden"
              onClick={() => setShowFilters(false)}
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'tween', duration: 0.25 }}
              className={`fixed left-0 w-[85%] max-w-[320px] border-r border-slate-800 overflow-y-auto p-5 flex flex-col gap-6 bg-slate-950 z-40 md:hidden transition-all duration-300 ${showSearch ? 'top-[144px] h-[calc(100vh-144px)]' : 'top-[64px] h-[calc(100vh-64px)]'}`}
            >
              {renderFilters(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ── */}
      <aside className={`hidden md:flex md:w-[260px] lg:w-[240px] shrink-0 border-r border-slate-800 md:sticky overflow-y-auto p-5 flex-col gap-6 bg-slate-950 z-10 transition-all duration-300 ${showSearch ? 'md:top-[144px] md:h-[calc(100vh-144px)]' : 'md:top-[64px] md:h-[calc(100vh-64px)]'}`}>
        {renderFilters(false)}
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0 px-4 sm:px-6 py-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Titles text1="ALL" text2="COLLECTIONS" />
            <p className="text-slate-500 text-sm mt-1">{filteredProducts.length} products</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-3 bg-slate-900/80 text-slate-100 font-medium text-sm px-4 py-2.5 rounded-xl border border-slate-700/60 hover:border-blue-500/50 hover:bg-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer shadow-md transition-all backdrop-blur-md"
            >
              {SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort By'}
              <FiChevronDown className={`w-4 h-4 transition-transform duration-300 ${showSortDropdown ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSortDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-[120%] w-48 bg-slate-900/95 border border-slate-700/60 rounded-xl z-50 shadow-xl shadow-black/40 backdrop-blur-xl overflow-hidden py-2"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <div
                        key={o.value}
                        onClick={() => {
                          setSortBy(o.value);
                          setShowSortDropdown(false);
                        }}
                        className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                          sortBy === o.value
                            ? 'bg-blue-500/20 text-blue-400 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        {o.label}
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFilters.map((f, i) => (
              <FilterChip key={i} label={f.label} onRemove={f.remove} />
            ))}
          </div>
        )}

        {/* Product grid */}
        {productsLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-6xl">🔍</div>
            <p className="text-slate-300 text-lg font-semibold">No products found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
            <button onClick={clearAll} className="mt-2 text-blue-400 hover:text-blue-300 text-sm underline">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredProducts.map((item) => (
              <Card
                key={item._id}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image1}
                category={item.category}
                subCategory={item.subCategory}
                sizes={item.sizes}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Collections;
