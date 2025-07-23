import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { authDataContext } from "./AuthContext";
import { userDataContext } from "./UserContext";

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { serverurl } = useContext(authDataContext);
  const { user } = useContext(userDataContext);

  const shopName = "VASTRA";
  const categories = ["Men", "Women", "Kids"];
  const currency = "₹";
  const delivery_fee = 40;

  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false);

  const getProducts = async () => {
    try {
      const result = await axios.get(`${serverurl}/api/product/list`,{
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setProducts(result.data.products);
      console.log(result.data)
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      console.log('Please select size');
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      }
      else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItem(cartData);

    if (user) {
      try {
        const result = await axios.post(`${serverurl}/api/cart/add`, { itemId, size }, { withCredentials: true ,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         });
        console.log(result.data)
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  }

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
    }
    setCartItem(cartData);
    if (user) {
      try {
        const result = await axios.post(`${serverurl}/api/cart/update`, {
          itemId, size,
          quantity
        }, { withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
         });
        console.log(result.data)
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  }

  const getUserCart = async () => {
    try {
      const result = await axios.post(`${serverurl}/api/cart/get`, {}, { withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        
       })
      setCartItem(result.data)
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }


  const getCardCount = () => {
    let count = 0;
    for (const itemId in cartItem) {
      const sizes = cartItem[itemId];
      for (const size in sizes) {
        const quantity = sizes[size];
        if (quantity > 0) {
          count += quantity;
        }
      }
    }
    return count;
  };

  useEffect(() => {
    if (serverurl) {
      getProducts();
    }
  }, [serverurl]);

  useEffect(() => {
    getUserCart();
  }, []);

  const getCartAmount =  () => {
    let total = 0;
    for (const items in cartItem) {
      let iteminfo = products.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            const price = iteminfo.price;
            total += price * cartItem[items][item];
          }
        } catch (error) {
          console.error("Error fetching cart amount:", error);
        }
      }
    }
    return total;
  }

  const value = {
    shopName,
    categories,
    currency,
    delivery_fee,
    products,
    getProducts,
    search, setSearch,
    showSearch, setShowSearch,
    addToCart, getCardCount,
    cartItem, setCartItem,
    getUserCart,
    updateQuantity,
    getCartAmount,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;