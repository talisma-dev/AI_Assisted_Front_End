export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');

export const setToken = (token,expiry) => {
  document.cookie = `jwt_token=${token}; path=/; secure; samesite=None; max-age=${expiry}`;
  window.dispatchEvent(new CustomEvent('token-changed', { detail: { token } }));
};

export const getToken = () => {
 try {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('jwt_token='));
  return tokenCookie ? tokenCookie.split('=').slice(1).join('=').trim() : null;
  } catch {
    return null;
  }
};

export const removeToken = () => {
  document.cookie = 'jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  window.dispatchEvent(new CustomEvent('token-removed'));
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

export const hasStorageAccess = async () => {
  if (!document.hasStorageAccess) return true;
  try {
    return await document.hasStorageAccess();
  } catch {
    return false;
  }
};

export const requestStorageAccess = async () => {
  if (!document.requestStorageAccess) return true;
  try {
    await document.requestStorageAccess();
    return true;
  } catch {
    return false;
  }
};


export const bootstrapAuth = async () => {
  const hasAccess = await hasStorageAccess();

  if (!hasAccess) {
    return { status: 'needs-user-action' };
  }

  if (!isTokenValid()) {
    return { status: 'invalid-token' };
  }

  return { status: 'ready' };
};

export const getAuthHeaders = (options = {}) => {
  const token = getToken();
  const isFormData = options.body instanceof FormData;
  return {
    Accept: 'application/json',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  const headers = {
    ...getAuthHeaders(options),
    ...options.headers,
  };
  const response = await fetch(url, {
    ...options,
    headers,
  });


  if (response.status === 401 && !getToken()) {
    window.dispatchEvent(new CustomEvent('auth-needs-user-action'));
  }

  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let errorBody = {};
    
    if (contentType && contentType.includes('application/json')) {
      errorBody = await response.json().catch(() => ({}));
    } else {
      const text = await response.text();
        errorBody = { message: text.substring(0, 200) };
      }

    if (response.status === 401) {
      removeToken();
      window.dispatchEvent(
        new CustomEvent('auth-error', { detail: { type: 'unauthorized' } }));
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
