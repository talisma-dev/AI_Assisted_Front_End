// JWT Token Management Utilities
export const setToken = (token: string): void => {
  document.cookie = `jwt_token=${token}; path=/; secure; samesite=none; max-age=86400`;
};

export const getToken = (): string | null => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith("jwt_token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

export const removeToken = (): void => {
  document.cookie = "jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    
    return payload.exp > currentTime;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};
