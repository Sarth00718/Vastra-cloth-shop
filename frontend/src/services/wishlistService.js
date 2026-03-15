import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const getAuthHeaders = () => ({
    withCredentials: true,
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

export const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await axios.get(`${API_URL}/api/wishlist/get`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            throw error;
        }
    },

    toggleWishlist: async (productId) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/wishlist/toggle`,
                { productId },
                getAuthHeaders()
            );
            return response.data;
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            throw error;
        }
    }
};
