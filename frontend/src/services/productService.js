import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const productService = {
    getProducts: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/product/list`);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }
};
