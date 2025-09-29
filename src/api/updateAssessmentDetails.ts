export async function updateAssessmentDetails(data: {
  contactId: number;
  emailId: string;
  concepts: Array<{
    name: string;
    level: string;
    score: number;
    status: string;
    remediationCount: number;
  }>;
}) {
  try {
    const response = await fetch("https://130518web.saas.talismaonline.com/cxmai/api/copilotresponses/UpdateAssessmentDetails", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Update Assessment Details API Error Response:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Update Assessment Details API Response:', responseData);
    
    return responseData;
  } catch (error) {
    console.error('Error in updateAssessmentDetails:', error);
    throw error;
  }
} 