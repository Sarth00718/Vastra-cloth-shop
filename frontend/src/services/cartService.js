import api from './api.js';

export const cartService = {
  getCart: async () => {
    const response = await api.post('/api/cart/get', {});
    return response.data.cartData || response.data || {};
  },
  addToCart: async (itemId, size) => {
    const response = await api.post('/api/cart/add', { itemId, size });
    return response.data;
  },
  updateCart: async (itemId, size, quantity) => {
    const response = await api.post('/api/cart/update', { itemId, size, quantity });
    return response.data;
  },
};
