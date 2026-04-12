import { apiFetch, getAuthHeaders } from './base';
import { API_ENDPOINTS } from './endpoints';

export const getEvaluateAssessmentScores = async () => {
  const IS_MOCK = import.meta.env.VITE_MOCK === 'true';

  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return {
      evaluationData: [
        {
          concept: "Storage Practices",
          score: 85,
          level: "Mastered",
          attemptCount: 1,
          isRemediationCompleted: false
        }
      ],
      courseName: "AI Assisted Learning Path"
    };
  }

  const response = await apiFetch(API_ENDPOINTS.UTILITY.GET_ASSESSMENT_SCORES, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...getAuthHeaders()
    },
  });

  const evaluationData = (response && typeof response === 'object' && 'data' in response)
    ? response.data
    : response;

  if (Array.isArray(evaluationData) && evaluationData.length > 0) {
    return { evaluationData };
  }

  return { evaluationData: [] };
};
