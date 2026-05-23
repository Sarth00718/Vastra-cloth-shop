import api from './api.js';

export const cartService = {
  getCart: async () => {
    const response = await api.post('/api/cart/getcart', {});
    return response.data.cartData || response.data || {};
  },
  addToCart: async (itemId, size) => {
    const response = await api.post('/api/cart/addtocart', { itemId, size });
    return response.data;
  },
  updateCart: async (itemId, size, quantity) => {
    const response = await api.post('/api/cart/updatecart', { itemId, size, quantity });
    return response.data;
  },
};
