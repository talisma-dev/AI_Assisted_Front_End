import { apiFetch, IS_MOCK } from './base';

export type EvaluatePayload = Record<string, string>;

export interface EvaluationItem {
  concept: string;
  score: number | string;
  level: 'Mastered' | 'Intermediate' | '"Contact_Advisor"' | string;
  attemptCount: number;
}

export interface EvaluateResponse {
  evaluationData: EvaluationItem[];
}

export async function evaluateAssessment(answersByQuestionId: EvaluatePayload, conceptName: string | null = null): Promise<EvaluateResponse> {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 400));
    return {
      evaluationData: [
        { concept: 'Storage Practices', score: 82, level: 'Mastered', attemptCount: 1 },
        { concept: 'Medication Ordering and Transcription', score: 66, level: 'Intermediate', attemptCount: 1 },
        { concept: 'Dispensing and High-Alert Medications', score: 45, level: 'Novice', attemptCount: 1 },
        { concept: 'Dosage and IV Infusion Calculations', score: 73, level: 'Intermediate', attemptCount: 1 },
      ]
    };
  }
  const res = await apiFetch('/api/utility/evaluateAssessment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      answers: answersByQuestionId,
      conceptName: conceptName ?? null
    })
  });
  const data = await res.json();
  // Normalize various backend shapes
  const payload = (data && typeof data === 'object' && 'data' in data) ? (data as any).data : data;
  if (Array.isArray(payload)) {
    return { evaluationData: payload as EvaluationItem[] };
  }
  if (payload && typeof payload === 'object' && 'evaluationData' in payload) {
    return payload as EvaluateResponse;
  }
  // Fallback to empty list to avoid runtime errors
  return { evaluationData: [] };
} 