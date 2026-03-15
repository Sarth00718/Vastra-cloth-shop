import { createContext, useContext, useState, useEffect } from "react";
import { userDataContext } from "./UserContext";
import { productService } from "../services/productService";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";

// Shop configuration constants
const SHOP_CONFIG = {
  name: "Vastra",
  currency: "₹",
  deliveryFee: 10
};

const CATEGORIES = [
  { name: "Men", subcategories: ["Topwear", "Bottomwear", "Winterwear"] },
  { name: "Women", subcategories: ["Topwear", "Bottomwear", "Winterwear"] },
  { name: "Kids", subcategories: ["Topwear", "Bottomwear", "Winterwear"] }
];

// Helper functions
const getCartCount = (cartItem) => {
  let totalCount = 0;
  for (const items in cartItem) {
    for (const item in cartItem[items]) {
      try {
        if (cartItem[items][item] > 0) {
          totalCount += cartItem[items][item];
        }
      } catch (error) {
        console.error("Error calculating cart count:", error);
      }
    }
  }
  return totalCount;
};

const calculateCartTotal = (cartItem, products) => {
  let totalAmount = 0;
  for (const items in cartItem) {
    let itemInfo = products.find((product) => product._id === items);
    for (const item in cartItem[items]) {
      try {
        if (cartItem[items][item] > 0) {
          totalAmount += itemInfo.price * cartItem[items][item];
        }
      } catch (error) {
        console.error("Error calculating cart total:", error);
      }
    }
  }
  return totalAmount;
};

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { user } = useContext(userDataContext);

  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState({});
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [wishlist, setWishlist] = useState([]);

  const getProducts = async () => {
    try {
      const result = await productService.getProducts();
      setProducts(result.products);
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
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItem(cartData);

    if (user) {
      try {
        const result = await cartService.addToCart(itemId, size);
        console.log(result);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity;
    }
    setCartItem(cartData);
    
    if (user) {
      try {
        const result = await cartService.updateCart(itemId, size, quantity);
        console.log(result);
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const getUserCart = async () => {
    try {
      const result = await cartService.getCart();
      setCartItem(result);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const getUserWishlist = async () => {
    try {
      const result = await wishlistService.getWishlist();
      setWishlist(result.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const toggleWishlist = async (productId) => {
    // Optimistic update
    const isWishlisted = wishlist.includes(productId);
    if (isWishlisted) {
      setWishlist(prev => prev.filter(id => id !== productId));
    } else {
      setWishlist(prev => [...prev, productId]);
    }
    try {
      const result = await wishlistService.toggleWishlist(productId);
      setWishlist(result.wishlist || []);
      return result.added;
    } catch (error) {
      // Revert on failure
      setWishlist(prev => isWishlisted ? [...prev, productId] : prev.filter(id => id !== productId));
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (user) {
      getUserCart();
      getUserWishlist();
    } else {
      setWishlist([]);
    }
  }, [user]);

  const value = {
    shopName: SHOP_CONFIG.name,
    categories: CATEGORIES,
    currency: SHOP_CONFIG.currency,
    delivery_fee: SHOP_CONFIG.deliveryFee,
    products,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    addToCart,
    getCardCount: () => getCartCount(cartItem),
    cartItem,
    setCartItem,
    getUserCart,
    updateQuantity,
    getCartAmount: () => calculateCartTotal(cartItem, products),
    wishlist,
    setWishlist,
    toggleWishlist,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
