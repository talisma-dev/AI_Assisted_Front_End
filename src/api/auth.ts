// API functions for JWT token authentication and data fetching
import { getAuthHeaders } from "@/lib/auth";
import { apiFetch, IS_MOCK } from './base';

function createFakeJwt(hoursValid = 4) {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * hoursValid;
  const payload = btoa(JSON.stringify({ sub: "student-123", exp }));
  return `${header}.${payload}.signature`;
}

// Generate JWT token for direct link users
export async function generateJWTToken(studentGuid: string, courseGuid: string) {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return createFakeJwt();
  }
  try {
    const response = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        StudentGuid: studentGuid,
        CourseGuid: courseGuid
      }),
    });

    const data = await response.json();
    return data.token?.token;
  } catch (error) {
    console.error("Error in generateJWTToken:", error);
    throw error;
  }
}

// Get evaluation data for Blackboard LMS users
export async function getEvaluationData() {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return {
      concepts: [
        { name: "Storage Practices", microconcepts: ["Labeling", "Refrigeration"], videourls: ["https://example.com/a"] },
        { name: "Medication Ordering and Transcription", microconcepts: ["Verification"], videourls: ["https://example.com/b"] },
        { name: "Dispensing and High-Alert Medications", microconcepts: ["Double-Check"], videourls: [] },
        { name: "Dosage and IV Infusion Calculations", microconcepts: ["Drip Rate"], videourls: [] },
      ],
    } as any;
  }
  try {
    const response = await apiFetch("/api/utility/evaluateAssessment", {
      method: "POST",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getEvaluationData:", error);
    throw error;
  }
}

// Get assessment data for direct link users
export async function getAssessmentData(concepts: string[] = []) {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return {
      questions: [
        { question_id: "q1", question_type: "MCQ", concept: "Storage Practices", question: "What is correct storage temp?", options: ["2-8°C", "20-25°C", "35-40°C", "Any"], answer: "2-8°C" },
        { question_id: "q2", question_type: "MCQ", concept: "Medication Ordering and Transcription", question: "What is a MAR?", options: ["Medical Admin Record", "Medication Admin Record", "Med Audit Report", "None"], answer: "Medication Admin Record" },
        { question_id: "q3", question_type: "MCQ", concept: "Dispensing and High-Alert Medications", question: "High-alert meds require?", options: ["No check", "Single check", "Double check", "Triple check"], answer: "Double check" },
        { question_id: "q4", question_type: "MCQ", concept: "Dosage and IV Infusion Calculations", question: "Drip rate depends on?", options: ["Patient age", "Drop factor", "Color", "Brand"], answer: "Drop factor" },
      ],
    } as any;
  }
  try {
    const response = await apiFetch("/api/utility/generateAssessment", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ concepts })
    });

    const data = await response.json();
    return data?.data;
  } catch (error) {
    console.error("Error in getAssessmentData:", error);
    throw error;
  }
}

export async function generateAccessTokenbySSO(ssoToken: string) {
  try {
    const response = await apiFetch("/api/auth/validateSSOToken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        verificationCode: ssoToken
      }),
    });
    const data = await response.json();
    return data;  
  } catch (error) {
    console.error("Error in generateAccessTokenbySSO:", error);
    throw error;
  }
}
