import api from './api.js';

export const productService = {
  getProducts: async (params = {}) => {
    const response = await api.get('/api/product/list', { params });
    // Support both old shape {products:[]} and new paginated shape {data:[]}
    return { products: response.data.data || response.data.products || [] };
  },

  getProduct: async (id) => {
    const response = await api.get(`/api/product/${id}`);
    return response.data.product;
  },
};
