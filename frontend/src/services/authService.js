import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const authService = {
    getCurrentUser: async () => {
        try {
            const response = await axios.post(
                `${API_URL}/api/user/getcurrentuser`,
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
            console.error("Error fetching current user:", error);
            throw error;
        }
    }
};
