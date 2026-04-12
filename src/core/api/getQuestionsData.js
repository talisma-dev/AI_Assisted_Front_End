import { apiFetch } from './base';
import { API_ENDPOINTS } from './endpoints';

export const getQuestionsData = async (params) => {
  const { outcomes, remediation } = params;

  const payload = {
    concepts: remediation ? outcomes : []
  };

  const response = await apiFetch(API_ENDPOINTS.UTILITY.GENERATE_ASSESSMENT, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const innerData = response?.data || {};
  const questionsList = innerData.data || [];

  const questions = questionsList.map((q) => ({
    ...q,
    question_id: q.question_id || q.id,
    question_type: q.question_type || 'MCQ',
    concept: q.concept || (outcomes?.[0]) || '',
  }));

  return {
    questions,
    configuration: innerData.configuration || {},
    courseName: innerData.courseName || innerData.course_name || ''
  };
};
