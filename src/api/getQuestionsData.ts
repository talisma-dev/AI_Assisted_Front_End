import { apiFetch, IS_MOCK } from './base';

export interface GenerateAssessmentRequest {
  concepts: string[];
}

export async function getQuestionsData(params: {
    module_id: string;
    course_id: string;
    student_id: string;
    module_name: string;
    outcomes: string[];
    remedition: boolean;
    num_questions: number;
  }) {
    try {
      // Build request for new endpoint: send concepts only for remediation, else empty array
      const requestBody: GenerateAssessmentRequest = {
        concepts: params.remedition ? params.outcomes : []
      };

      if (IS_MOCK) {
        // Return a mapped mock from the provided sample
        const mock = {
          data: [
            { question_id: 'Q1', concept: "Bayes' Theorem", question: 'What does Bayes\' Theorem help us to calculate?', options: ['Likelihood of an event','Prior probability','Posterior probability','Marginal probability'] },
            { question_id: 'Q2', concept: 'Prior, Likelihood, and Posterior', question: 'Which of the following represents the initial belief about a parameter before any data is observed?', options: ['Likelihood','Posterior','Prior','Evidence'] },
            { question_id: 'Q3', concept: 'Conjugate Priors', question: 'What is the advantage of using conjugate priors in Bayesian inference?', options: ['Simplifies posterior calculations','Eliminates the need for likelihoods','Provides point estimates only','Makes priors irrelevant'] },
            { question_id: 'Q4', concept: 'Bayesian vs Frequentist Thinking', question: 'In Bayesian statistics, how is probability interpreted?', options: ['As long-run frequency','As a degree of belief','As a fixed value','As a variable'] },
            { question_id: 'Q5', concept: 'Bayesian Updating', question: 'What is Bayesian updating primarily about?', options: ['Updating prior beliefs with new evidence','Adjusting likelihoods without evidence','Changing the prior to a uniform distribution','Calculating exact frequencies'] },
            { question_id: 'Q6', concept: 'Bayesian vs Frequentist Thinking', question: 'How does the Frequentist approach differ from the Bayesian approach regarding parameters?', options: ['Parameters are considered random variables','Parameters are treated as fixed values','Parameters are ignored completely','Parameters are estimated based on prior knowledge'] },
          ]
        };
        return mock.data.map((q: any) => ({
          question_id: q.question_id,
          question_type: 'MCQ',
          concept: q.concept,
          question: q.question,
          options: q.options,
          // No answer in the schema; omit answer and let UI work without showing correctness until submission
          // Keep compatibility: set a dummy answer to first option to avoid crashes in existing code paths
          answer: q.options?.[0] ?? ''
        }));
      }

      const response = await apiFetch('/api/utility/generateAssessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      // Expecting { data: [ { question_id, concept, question, options } ] }
      if (!data || !Array.isArray(data.data)) {
        console.error('Invalid API Response:', data);
        throw new Error('Invalid response format from API');
      }

      const mapped = data.data.map((q: any) => ({
        question_id: q.question_id,
        question_type: 'MCQ',
        concept: q.concept,
        question: q.question,
        options: q.options,
        answer: q.options?.[0] ?? ''
      }));

      return mapped;
    } catch (error) {
      console.error('Error in getQuestionsData:', error);
      throw error;
    }
  }

// Fallback function to generate sample questions
function generateSampleQuestions(outcomes: string[], numQuestions: number) {
  const questions: any[] = [];
  const questionsPerOutcome = Math.ceil(numQuestions / outcomes.length);

  outcomes.forEach(outcome => {
    for (let i = 0; i < questionsPerOutcome; i++) {
      questions.push({
        question_id: `sample_${outcome.toLowerCase().replace(/\s+/g, '_')}_${i + 1}`,
        question_type: "MCQ",
        concept: outcome,
        question: `Sample question ${i + 1} about ${outcome}?`,
        options: [
          "Option A",
          "Option B",
          "Option C",
          "Option D"
        ],
        answer: "Option A"
      });
    }
  });

  return questions.slice(0, numQuestions);
}