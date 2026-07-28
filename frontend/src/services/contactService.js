import api from './api';

/**
 * Submit Contact Us Form Data
 * @param {Object} contactData - { name, email, phone, subject, message }
 * @returns {Promise<Object>}
 */
export const sendContactMessage = async (contactData) => {
  const response = await api.post('/api/contact/send', contactData);
  return response.data;
};
