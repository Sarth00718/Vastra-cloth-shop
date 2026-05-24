import api from './api.js';

export const wishlistService = {
    getWishlist: async () => {
        try {
            const response = await api.get('/api/wishlist/get');
            return response.data;
        } catch (error) {
            console.error("Error fetching wishlist:", error);
            throw error;
        }
    },

    toggleWishlist: async (productId) => {
        try {
            const response = await api.post(
                '/api/wishlist/toggle',
                { productId }
            );
            return response.data;
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            throw error;
        }
    }
};
