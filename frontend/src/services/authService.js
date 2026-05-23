import api from './api.js';

export const authService = {
  getCurrentUser: async () => {
    const response = await api.post('/api/user/getcurrentuser', {});
    return response.data;
  },
  logout: async () => {
    const response = await api.get('/api/auth/logout');
    return response.data;
  },
};
