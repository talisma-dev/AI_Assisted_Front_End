import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const updateAssessmentDetails = async (payload) => {
  return apiFetch(API_ENDPOINTS.UTILITY.UPDATE_ASSESSMENT_DETAILS, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
