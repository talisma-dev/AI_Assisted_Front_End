export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export const setToken = (token) => {
  document.cookie = `jwt_token=${token}; path=/; secure; samesite=none; max-age=86400`;
  window.dispatchEvent(new CustomEvent('token-changed', { detail: { token } }));
};

export const getToken = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('jwt_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};

export const removeToken = () => {
  document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const isTokenValid = () => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

export const getAuthHeaders = () => {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    ...getAuthHeaders(),
    ...options.headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  

  
  const response = await fetch(url, {
    ...options,
    headers,
  });



  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorBody = {};
    
    if (contentType && contentType.includes('application/json')) {
      errorBody = await response.json().catch(() => ({}));
    } else {
      const text = await response.text();
      if (text.includes('<!DOCTYPE') || text.includes('import') || text.includes('export')) {
        console.error('API Error: Received HTML/file content instead of JSON. Check API_BASE_URL configuration.');
        errorBody = { message: 'Invalid API endpoint - receiving file content instead of JSON' };
      } else {
        errorBody = { message: text.substring(0, 200) };
      }
    }
    
    throw {
      status: response.status,
      message: errorBody.message || 'API Request failed',
      data: errorBody
    };
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    console.error('API Error: Expected JSON but received:', text.substring(0, 200));
    throw new Error('API response is not JSON format');
  }

  return response.json();
};
