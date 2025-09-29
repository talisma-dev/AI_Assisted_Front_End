import React, { createContext, useContext, useState, ReactNode } from 'react';
import { getQuestionsData } from '@/api/getQuestionsData';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface ConceptScore {
  concept: string;
  score: number;
  attempts: number;
  status: 'mastery' | 'remediation' | 'intervention';
  label: 'Mastered' | 'Needs Review' | 'Contact Advisor';
}

interface AppState {
  conceptScores: ConceptScore[];
  assessmentAnswers: { [questionId: string]: number };
  showCongratulations: boolean;
  assessmentQuestions: any[];
  assessmentSource?: string;
  microconcepts: { [concept: string]: any[] };
  videourls: { [concept: string]: any[] };
}

interface AppContextType {
  state: AppState;
  submitAssessment: (answers: { [questionId: string]: number }, conceptFilter?: string) => void;
  updateConceptAttempts: (concept: string) => void;
  showCongratulations: boolean;
  setShowCongratulations: (show: boolean) => void;
  setAssessmentQuestions: (questions: any[]) => void;
  setAssessmentSource?: (source: string) => void;
  resetAllConceptAttempts: () => void;
  setMicroconcepts: (concept: string, microconcepts: any[]) => void;
  setVideourls: (concept: string, videourls: any[]) => void;
  setConceptScores: (scores: ConceptScore[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const outcomes = [
  "Storage Practices",
  "Medication Ordering and Transcription",
  "Dispensing and High-Alert Medications",
  "Dosage and IV Infusion Calculations",
];

const initialConceptScores: ConceptScore[] = outcomes.map(concept => ({
  concept,
  score: 0,
  attempts: 0,
  status: 'intervention',
  label: 'Contact Advisor'
}));

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    conceptScores: initialConceptScores,
    assessmentAnswers: {},
    showCongratulations: false,
    assessmentQuestions: [],
    assessmentSource: undefined,
    microconcepts: {},
    videourls: {},
  });

  const calculateRubric = (score: number, engagement: string, performance: string): { status: ConceptScore['status'], label: ConceptScore['label'] } => {
    if (score >= 75) {
      return { status: 'mastery', label: 'Mastered' };
    } else {
      return { status: 'remediation', label: 'Needs Review' };
    }
  };

  const submitAssessment = async (answers: { [questionId: string]: number }, conceptFilter?: string) => {
    setState(prev => {
      const newConceptScores = [...prev.conceptScores];

      // Calculate scores for each concept
      outcomes.forEach(concept => {
        // Skip if we're doing a single concept assessment and this isn't the target concept
        if (conceptFilter && concept !== conceptFilter) return;

        // Get all questions for this concept from the current assessment
        const conceptQuestions = prev.assessmentQuestions.filter(q => q.concept === concept);

        if (conceptQuestions.length === 0) return;

        // Calculate correct answers for this concept
        const correctAnswers = conceptQuestions.filter(q => {
          const userAnswerIndex = answers[q.question_id];
          if (userAnswerIndex === undefined) return false;
          const userAnswer = q.options[userAnswerIndex];
          return userAnswer === q.answer;
        }).length;

        const score = Math.round((correctAnswers / conceptQuestions.length) * 100);

        // Use default engagement/performance values
        const engagement = 'High';
        const performance = 'Low';

        // Calculate status based on score, engagement, and performance
        const rubric = calculateRubric(score, engagement, performance);

        // Find the concept in the scores array
        const conceptIndex = newConceptScores.findIndex(cs => cs.concept === concept);
        if (conceptIndex !== -1) {
          // Update the concept score and status
          newConceptScores[conceptIndex] = {
            ...newConceptScores[conceptIndex],
            score, // Use the calculated score directly
            attempts: conceptFilter ? newConceptScores[conceptIndex].attempts + 1 : newConceptScores[conceptIndex].attempts,
            ...rubric
          } as ConceptScore;
        }
      });

      return {
        ...prev,
        conceptScores: newConceptScores,
        assessmentAnswers: answers
      };
    });
  };

  const updateConceptAttempts = (concept: string) => {
    setState(prev => {
      const newConceptScores = [...prev.conceptScores];
      const conceptIndex = newConceptScores.findIndex(cs => cs.concept === concept);

      if (conceptIndex !== -1) {
        const currentAttempts = newConceptScores[conceptIndex].attempts + 1;
        newConceptScores[conceptIndex] = {
          ...newConceptScores[conceptIndex],
          attempts: currentAttempts
        };

        // If 3 attempts and still not mastery, move to intervention
        if (currentAttempts >= 3 && newConceptScores[conceptIndex].status === 'remediation') {
          newConceptScores[conceptIndex].status = 'intervention';
          newConceptScores[conceptIndex].label = 'Contact Advisor';
        }
      }

      return { ...prev, conceptScores: newConceptScores };
    });
  };

  const setShowCongratulations = (show: boolean) => {
    setState(prev => ({ ...prev, showCongratulations: show }));
  };

  const setAssessmentQuestions = (questions: any[]) => {
    setState(prev => ({ ...prev, assessmentQuestions: questions }));
  };

  const setAssessmentSource = (source: string) => {
    setState(prev => ({ ...prev, assessmentSource: source }));
  };

  const resetAllConceptAttempts = () => {
    setState(prev => ({
      ...prev,
      conceptScores: prev.conceptScores.map(cs => ({ ...cs, attempts: 0 }))
    }));
  };

  const setMicroconcepts = (concept: string, microconcepts: any[]) => {
    setState(prev => ({
      ...prev,
      microconcepts: { ...prev.microconcepts, [concept]: microconcepts }
    }));
  };

  const setVideourls = (concept: string, videourls: any[]) => {
    setState(prev => ({
      ...prev,
      videourls: { ...prev.videourls, [concept]: videourls }
    }));
  };

  const setConceptScores = (scores: ConceptScore[]) => {
    setState(prev => ({
      ...prev,
      conceptScores: scores
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      submitAssessment,
      updateConceptAttempts,
      showCongratulations: state.showCongratulations,
      setShowCongratulations,
      setAssessmentQuestions,
      setAssessmentSource,
      resetAllConceptAttempts,
      setMicroconcepts,
      setVideourls,
      setConceptScores,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
