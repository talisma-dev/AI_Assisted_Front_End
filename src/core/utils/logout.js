import { removeToken } from '@api/base';
import { clearProfile } from '@core/store/studentProfileSlice';

let store = null;

export const setStore = (reduxStore) => {
  store = reduxStore;
};

export const logout = (navigate, options = {}) => {
  const { 
    redirectTo = '/sso',
    clearStorage = true,
    reload = false 
  } = options;

  // 1. Clear token 
  removeToken();

  // 2. Clear Redux state
  if (store) {
    store.dispatch(clearProfile());
  }

  // 3. Clear localStorage items
  if (clearStorage) {
    localStorage.removeItem('student_id');
    localStorage.removeItem('course_id');
    localStorage.removeItem('module_id');
  }

  // 4. Navigate or reload
  if (reload) {
    window.location.href = redirectTo;
  } else if (navigate) {
    navigate(redirectTo);
  }
};

export const handleAuthError = (navigate, error) => {
  if (error?.status === 401) {
    logout(navigate, { redirectTo: '/sso', reload: true });
    return true;
  }
  return false;
};
