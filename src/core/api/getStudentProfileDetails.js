import { API_ENDPOINTS } from './endpoints';
import { apiFetch } from './base';

export const getStudentProfileDetails = async () => {
  const response = await apiFetch(API_ENDPOINTS.STUDENT.PROFILE_CONFIGURATION, {
    method: 'GET',
  });

  if (response.status === 'Failure') {
    throw new Error(response.message || 'Failed to fetch student profile details');
  }

  return response.data;
};
