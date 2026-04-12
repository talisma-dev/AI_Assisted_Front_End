import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const generateContent = async (payload) => {
  return apiFetch(API_ENDPOINTS.UTILITY.GENERATE_CONTENT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
