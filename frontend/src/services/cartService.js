import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const cartService = {
    getCart: async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/cart/get`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error fetching cart:", error);
            throw error;
        }
    },

    addToCart: async (itemId, size) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/cart/add`,
                { itemId, size },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    },

    updateCart: async (itemId, size, quantity) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/cart/update`,
                { itemId, size, quantity },
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error updating cart:", error);
            throw error;
        }
    }
};
