import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem('token');
      // Redirect happens via UserContext
    } else if (status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (status === 429) {
      toast.error('Too many requests. Please slow down.');
    } else if (!error.response) {
      toast.error('Network error. Check your connection.');
    }

    return Promise.reject(error);
  }
);

export { API_URL };
export default api;
