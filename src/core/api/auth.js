import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';


// Mock JWT Generation for Development
function createFakeJwt(hoursValid = 4) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * hoursValid;
  const payload = btoa(JSON.stringify({ sub: "student-123", exp }));
  return `${header}.${payload}.signature`;
}

// Authentication API
export const generateJWTToken = async (studentGuid, courseGuid) => {
  const IS_MOCK = import.meta.env.VITE_MOCK === 'true';

  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return createFakeJwt();
  }

  const data = await apiFetch(API_ENDPOINTS.AUTH.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ StudentGuid: studentGuid, CourseGuid: courseGuid }),
  });

  return data.token?.token || data.token || data;
};

export const generateAccessTokenbySSO = async (ssoToken) => {
  const data = await apiFetch(API_ENDPOINTS.AUTH.VALIDATE_SSO, {
    method: 'POST',
    body: JSON.stringify({ verificationCode: ssoToken }),
  });

  return data;
};
