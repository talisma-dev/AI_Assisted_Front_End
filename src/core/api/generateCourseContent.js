import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const generateCourseContent = async (conceptName) => {
  return apiFetch(`${API_ENDPOINTS.UTILITY.GENERATE_COURSE_CONTENT}?conceptName=${encodeURIComponent(conceptName)}`, {
    method: 'GET',
  });
};
