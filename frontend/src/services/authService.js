import api from './api.js';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  googleLogin: async (googleData) => {
    const response = await api.post('/api/auth/googlelogin', googleData);
    return response.data;
  },

  logout: async () => {
    const response = await api.get('/api/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.post('/api/user/getcurrentuser', {});
    return response.data;
  }
};
