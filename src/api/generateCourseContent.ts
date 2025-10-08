import { apiFetch, IS_MOCK } from './base';

export interface MicroLearningItem {
  content_type: 'Text' | 'URL' | string;
  content_heading: string;
  text: string;
  url: string;
}

export interface GenerateCourseContentResponse {
  concept: string;
  score: number;
  attemptCount: number;
  micro_learnings: MicroLearningItem[];
}

export async function generateCourseContent(conceptName: string): Promise<GenerateCourseContentResponse> {
  if (IS_MOCK) {
    await new Promise(r => setTimeout(r, 300));
    return {
      concept: conceptName,
      score: 70,
      attemptCount: 1,
      micro_learnings: [
        {
          content_type: 'Text',
          content_heading: 'Understanding Bayesian Inference',
          text: 'Bayesian inference integrates prior knowledge with likelihood to update beliefs. Use examples like coin flipping to grasp the concept of prior, likelihood, and posterior.',
          url: ''
        },
        {
          content_type: 'Text',
          content_heading: 'Conjugate Priors Explained',
          text: 'Learn about conjugate priors, which simplify calculations in Bayesian inference by keeping the posterior in the same distribution family as the prior.',
          url: ''
        },
        {
          content_type: 'URL',
          content_heading: 'Interactive Bayesian Models',
          text: '',
          url: 'https://www.statlearning.com/bayesian/interactive'
        },
        {
          content_type: 'Text',
          content_heading: 'Bayesian vs Frequentist Paradigms',
          text: 'Explore the differences between Bayesian and Frequentist thinking, particularly focusing on how each views probability and parameters.',
          url: ''
        },
        {
          content_type: 'URL',
          content_heading: 'Bayesian Thinking in Real Life',
          text: '',
          url: 'https://towardsdatascience.com/bayesian-thinking-examples-ef7d73b7e3b5'
        },
        {
          content_type: 'Text',
          content_heading: 'Bayesian Updating with Examples',
          text: 'Understand Bayesian updating through practical examples, helping clarify how to revise probabilities as new data becomes available.',
          url: ''
        },
        {
          content_type: 'URL',
          content_heading: 'Coin Flipping & Bayesian Inference',
          text: '',
          url: 'https://www.khanacademy.org/math/statistics-probability/bayesian-statistics'
        },
        {
          content_type: 'Text',
          content_heading: "Practical Application of Bayes' Theorem",
          text: "Study a real-world application of Bayes' Theorem, such as medical testing, highlighting the importance of understanding prior probabilities.",
          url: ''
        }
      ]
    };
  }

  const res = await apiFetch(`/api/utility/generateCourseContent?conceptName=${encodeURIComponent(conceptName)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  });
  const data = await res.json();
  const payload = (data && typeof data === 'object' && 'data' in data) ? (data as any).data : data;
  const micro_learnings: MicroLearningItem[] = Array.isArray(payload)
    ? payload as MicroLearningItem[]
    : (payload?.micro_learnings as MicroLearningItem[]) ?? [];
  return {
    concept: (payload && !Array.isArray(payload) && (payload as any).concept) || conceptName,
    score: (payload && !Array.isArray(payload) && (payload as any).score) || 0,
    attemptCount: (payload && !Array.isArray(payload) && (payload as any).attemptCount) || 0,
    micro_learnings,
  } as GenerateCourseContentResponse;
} 