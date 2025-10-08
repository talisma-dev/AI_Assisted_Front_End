import { apiFetch, IS_MOCK } from './base';
import { EvaluateResponse } from './evaluateAssessment';
import {getToken} from '@/lib/auth';

export async function getEvaluateAssessmentScores(token: string | null = null) : Promise<EvaluateResponse | null> {
    try {
     if (IS_MOCK) {
        return null;
     }
    //  const authToken= (token || getToken() ) ? {Authorization: `Bearer ${token ?? getToken()}` } : {};
     const res = await apiFetch('/api/utility/getAssessmentEvaluatedScores', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            //...authToken
            },
     });

     const data = await res.json();
     const payload: EvaluateResponse = { evaluationData : (data && typeof data === 'object' && 'data' in data) ? (data as any).data : data };
     if(payload && Array.isArray(payload.evaluationData) && payload.evaluationData.length > 0) {
        return payload;
     }
     // Fallback to empty list to avoid runtime errors
     return { evaluationData: [] };
    }
    catch (error) {
        console.error("Error in getEvaluateAssessmentScores:", error);
        throw error;
    }
}