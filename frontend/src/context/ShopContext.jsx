import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { userDataContext } from './UserContext';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import api from '../services/api';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const SHOP_CONFIG = { name: 'Vastra', currency: '₹', deliveryFee: 10 };

const CATEGORIES = [
  { name: 'Men', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Women', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
  { name: 'Kids', subcategories: ['Topwear', 'Bottomwear', 'Winterwear'] },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getCartCount = (cartItem) => {
  return Object.values(cartItem || {}).reduce((total, sizes) => {
    return total + Object.values(sizes || {}).reduce((s, qty) => s + (qty > 0 ? qty : 0), 0);
  }, 0);
};

const calculateCartTotal = (cartItem, products) => {
  return Object.entries(cartItem || {}).reduce((total, [productId, sizes]) => {
    const product = (products || []).find((p) => p._id === productId);
    if (!product) return total;
    return total + Object.values(sizes || {}).reduce((s, qty) => s + (qty > 0 ? product.price * qty : 0), 0);
  }, 0);
};

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
export const shopDataContext = createContext();

function ShopContext({ children }) {
  const { user } = useContext(userDataContext);

  const [products, setProducts] = useState([]);
  const [cartItem, setCartItem] = useState(() => {
    try {
      const saved = localStorage.getItem('vastra_guest_cart');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // ─── PRODUCTS ───────────────────────────────────────────────────────────────
  const getProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const result = await productService.getProducts();
      setProducts(result.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  // ─── RECENTLY VIEWED ────────────────────────────────────────────────────────
  const addToRecentlyViewed = useCallback((productId) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  }, []);

  // ─── CART ───────────────────────────────────────────────────────────────────
  const addToCart = async (itemId, size) => {
    if (!size) return;

    const cartData = structuredClone(cartItem || {});
    if (!cartData[itemId]) cartData[itemId] = {};
    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    setCartItem(cartData);

    if (user) {
      try {
        await cartService.addToCart(itemId, size);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    } else {
      try {
        localStorage.setItem('vastra_guest_cart', JSON.stringify(cartData));
      } catch (error) {
        console.error('Error saving guest cart:', error);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItem || {});
    if (cartData[itemId]?.[size] !== undefined) {
      if (quantity <= 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) delete cartData[itemId];
      } else {
        cartData[itemId][size] = quantity;
      }
    }
    setCartItem(cartData);

    if (user) {
      try {
        await cartService.updateCart(itemId, size, quantity);
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    } else {
      try {
        localStorage.setItem('vastra_guest_cart', JSON.stringify(cartData));
      } catch (error) {
        console.error('Error saving guest cart:', error);
      }
    }
  };

  const syncAndLoadUserCart = useCallback(async () => {
    try {
      const serverCart = await cartService.getCart();
      let guestCart = {};
      try {
        const saved = localStorage.getItem('vastra_guest_cart');
        if (saved) guestCart = JSON.parse(saved);
      } catch (e) {
        console.error('Error reading guest cart:', e);
      }

      const mergedCart = structuredClone(serverCart || {});
      const guestProductIds = Object.keys(guestCart || {});

      if (guestProductIds.length > 0) {
        for (const itemId of guestProductIds) {
          if (!mergedCart[itemId]) mergedCart[itemId] = {};
          for (const size in guestCart[itemId]) {
            const guestQty = guestCart[itemId][size];
            if (guestQty > 0) {
              const currentQty = mergedCart[itemId][size] || 0;
              const newQty = currentQty + guestQty;
              mergedCart[itemId][size] = newQty;
              try {
                await cartService.updateCart(itemId, size, newQty);
              } catch (err) {
                console.error(`Error syncing cart item ${itemId} (${size}):`, err);
              }
            }
          }
          if (Object.keys(mergedCart[itemId]).length === 0) {
            delete mergedCart[itemId];
          }
        }
        localStorage.removeItem('vastra_guest_cart');
      }

      setCartItem(mergedCart);
    } catch (error) {
      console.error('Error fetching user cart:', error);
      try {
        const saved = localStorage.getItem('vastra_guest_cart');
        if (saved) setCartItem(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const getUserCart = useCallback(async () => {
    try {
      const result = await cartService.getCart();
      setCartItem(result);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, []);

  // ─── WISHLIST ────────────────────────────────────────────────────────────────
  const getUserWishlist = useCallback(async () => {
    try {
      const result = await wishlistService.getWishlist();
      setWishlist(result.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, []);

  const toggleWishlist = async (productId) => {
    if (!user) {
      toast.error('Please log in to save items to your wishlist');
      return;
    }

    const isWishlisted = wishlist.includes(productId);
    // Optimistic update
    setWishlist((prev) =>
      isWishlisted ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
    try {
      const result = await wishlistService.toggleWishlist(productId);
      setWishlist(result.wishlist || []);
      return result.added;
    } catch (error) {
      // Revert on failure
      setWishlist((prev) =>
        isWishlisted ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
      throw error;
    }
  };

  // ─── EFFECTS ────────────────────────────────────────────────────────────────
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (user) {
      syncAndLoadUserCart();
      getUserWishlist();
    } else {
      setWishlist([]);
      try {
        const saved = localStorage.getItem('vastra_guest_cart');
        setCartItem(saved ? JSON.parse(saved) : {});
      } catch {
        setCartItem({});
      }
    }
  }, [user, syncAndLoadUserCart, getUserWishlist]);

  // ─── VALUE ───────────────────────────────────────────────────────────────────
  const value = {
    shopName: SHOP_CONFIG.name,
    categories: CATEGORIES,
    currency: SHOP_CONFIG.currency,
    delivery_fee: SHOP_CONFIG.deliveryFee,
    products,
    productsLoading,
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
    recentlyViewed,
    addToRecentlyViewed,
  };

  return <shopDataContext.Provider value={value}>{children}</shopDataContext.Provider>;
}

export default ShopContext;
