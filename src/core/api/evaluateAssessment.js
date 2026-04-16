import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const evaluateAssessment = async (answersByQuestionId, conceptBasedAnswerDetails) => {
  return apiFetch(API_ENDPOINTS.UTILITY.EVALUATE_ASSESSMENT, {
    method: 'POST',
    body: JSON.stringify({ 
      answers: answersByQuestionId, 
      conceptBasedAnswerDetails
    }),
  });
};
