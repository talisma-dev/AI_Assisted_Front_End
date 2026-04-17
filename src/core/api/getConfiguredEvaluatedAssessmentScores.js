import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const getConfiguredEvaluatedAssessmentScores = async () => {
  return apiFetch(API_ENDPOINTS.UTILITY.GET_CONFIG_ASSESSMENT_SCORES, {
    method: 'GET',
  });
};
