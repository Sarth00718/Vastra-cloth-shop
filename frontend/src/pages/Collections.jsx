import React, { useContext, useEffect, useState } from 'react';
import { FiFilter } from "react-icons/fi";
import Titles from '../components/Titles';
import Card from '../components/Card';
import { shopDataContext } from '../context/ShopContext';
import { toast } from 'react-toastify';


function Collections() {
  const { products, search, showSearch } = useContext(shopDataContext);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState('relevant');
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const applyFilter = () => {
    let productcopy = products.slice();
    if (search && showSearch) {
      productcopy = productcopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category.length > 0) {
      productcopy = productcopy.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productcopy = productcopy.filter((item) => subCategory.includes(item.subCategory));
    }
    if (productcopy.length === 0) {
      toast.warning('No matching products found.');
    }
    setFilterProduct(productcopy);
  };

  const sortProducts = () => {
    let fpcopy = [...filterProduct];
    switch (showSort) {
      case 'low-high':
        fpcopy.sort((a, b) => a.price - b.price);
        break;
      case 'high-low':
        fpcopy.sort((a, b) => b.price - a.price);
        break;
      default:
        applyFilter();
        return;
    }
    setFilterProduct(fpcopy);
  };

  useEffect(() => {
    sortProducts();
  }, [showSort]);

  useEffect(() => {
    setFilterProduct(products);
  }, [products]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  return (
    <div className="w-screen min-h-screen flex flex-col md:flex-row pt-[70px] overflow-hidden z-[2]">

      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center px-6 py-3 text-[#aaf5fa] border-b border-gray-500">
        <p className="text-[20px] font-semibold">FILTERS</p>
        <button onClick={() => setShowFilters(!showFilters)} className="text-white">
          <FiFilter size={24} />
        </button>
      </div>

      {/* Sidebar Filters */}
      <div className={`md:w-[30vw] lg:w-[20vw] w-full p-5 border-r border-gray-400 text-[#aaf5fa] bg-opacity-20 md:min-h-screen lg:fixed ${showFilters ? "block" : "hidden"} md:block`}>
        <p className="text-[25px] font-semibold mb-4 hidden md:block">FILTERS</p>

        {/* Category Filter */}
        <div className="border-2 border-[#dedcdc] pl-5 py-3 mb-6 rounded-md bg-slate-600">
          <p className="text-[18px] text-[#f8fafa] mb-2">CATEGORIES</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Men" onChange={toggleCategory} className="w-3 h-3" />
              Men
            </label>
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Women" onChange={toggleCategory} className="w-3 h-3" />
              Women
            </label>
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Kids" onChange={toggleCategory} className="w-3 h-3" />
              Kids
            </label>
          </div>
        </div>

        {/* Subcategory Filter */}
        <div className="border-2 border-[#dedcdc] pl-5 py-3 rounded-md bg-slate-600">
          <p className="text-[18px] text-[#f8fafa] mb-2">SUBCATEGORIES</p>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Topwear" onChange={toggleSubCategory} className="w-3 h-3" />
              Topwear
            </label>
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory} className="w-3 h-3" />
              Bottomwear
            </label>
            <label className="flex items-center gap-2 text-[16px] font-light">
              <input type="checkbox" value="Winterwear" onChange={toggleSubCategory} className="w-3 h-3" />
              Winterwear
            </label>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-[30vw] lg:ml-[20vw] w-full px-4 sm:px-6 md:px-8 py-6">
        {/* Title and Sort Dropdown */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 text-white">
          <Titles text1="ALL" text2="COLLECTIONS" />
          <select
            className="bg-slate-700 text-white px-4 py-2 rounded-md border border-gray-400 mt-4 md:mt-0"
            value={showSort}
            onChange={(e) => setShowSort(e.target.value)}
          >
            <option value="relevant">Sort By: Relevant</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Responsive Product List using Flex */}
        <div className="flex flex-wrap justify-center gap-6">
          {filterProduct.length > 0 ? (
            filterProduct.map((item, index) => (
              <Card
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image1}
              />
            ))
          ) : (
            <p className="text-white text-center w-full">No products found.</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Collections;
