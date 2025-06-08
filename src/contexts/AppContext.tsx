
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  student_id: string;
  username: string;
  password: string;
  course_id: string;
  module_id: string;
  module_name: string;
}

interface Question {
  id: string;
  concept: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ConceptScore {
  concept: string;
  score: number;
  attempts: number;
  status: 'mastery' | 'remediation' | 'intervention';
  label: 'Mastery' | 'Intermediate' | 'Novice';
}

interface AppState {
  currentUser: User | null;
  conceptScores: ConceptScore[];
  assessmentAnswers: { [questionId: string]: number };
  showCongratulations: boolean;
}

interface AppContextType {
  state: AppState;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  submitAssessment: (answers: { [questionId: string]: number }, conceptFilter?: string) => void;
  updateConceptAttempts: (concept: string) => void;
  showCongratulations: boolean;
  setShowCongratulations: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const validUsers: User[] = [
  { student_id: "S001", username: "Ankul", password: "Ankul123", course_id: "C202", module_id: "M101", module_name: "Algorithm" },
  { student_id: "S002", username: "Riya", password: "Riya123", course_id: "C202", module_id: "M101", module_name: "Algorithm" },
  { student_id: "S003", username: "Donson", password: "Donson123", course_id: "C202", module_id: "M101", module_name: "Algorithm" },
];

const outcomes = [
  "Bayesian Inference",
  "Feature Selection & Dimensionality Reduction", 
  "Linear & Non-Linear Models",
  "Gaussian distributions and decision boundaries"
];

const initialConceptScores: ConceptScore[] = outcomes.map(concept => ({
  concept,
  score: 0,
  attempts: 0,
  status: 'intervention',
  label: 'Novice'
}));

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    conceptScores: initialConceptScores,
    assessmentAnswers: {},
    showCongratulations: false
  });

  const login = (username: string, password: string): boolean => {
    const user = validUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setState(prev => ({ ...prev, currentUser: user }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setState(prev => ({ 
      ...prev, 
      currentUser: null,
      conceptScores: initialConceptScores,
      assessmentAnswers: {},
      showCongratulations: false
    }));
  };

  const calculateRubric = (score: number): { status: ConceptScore['status'], label: ConceptScore['label'] } => {
    if (score > 80) return { status: 'mastery', label: 'Mastery' };
    if (score > 50) return { status: 'remediation', label: 'Intermediate' };
    return { status: 'intervention', label: 'Novice' };
  };

  const submitAssessment = (answers: { [questionId: string]: number }, conceptFilter?: string) => {
    setState(prev => {
      const newConceptScores = [...prev.conceptScores];
      
      // Calculate scores for each concept
      outcomes.forEach(concept => {
        if (conceptFilter && concept !== conceptFilter) return;
        
        const conceptQuestions = Object.keys(answers).filter(qId => 
          qId.startsWith(concept.replace(/\s+/g, '').substring(0, 3))
        );
        
        if (conceptQuestions.length === 0) return;
        
        const correctAnswers = conceptQuestions.filter(qId => {
          // Simplified correct answer logic - in real app, this would reference actual questions
          return Math.random() > 0.3; // Simulate 70% chance of correct answer
        }).length;
        
        const score = Math.round((correctAnswers / conceptQuestions.length) * 100);
        const rubric = calculateRubric(score);
        
        const conceptIndex = newConceptScores.findIndex(cs => cs.concept === concept);
        if (conceptIndex !== -1) {
          newConceptScores[conceptIndex] = {
            ...newConceptScores[conceptIndex],
            score,
            ...rubric
          };
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
          newConceptScores[conceptIndex].label = 'Novice';
        }
      }
      
      return { ...prev, conceptScores: newConceptScores };
    });
  };

  const setShowCongratulations = (show: boolean) => {
    setState(prev => ({ ...prev, showCongratulations: show }));
  };

  return (
    <AppContext.Provider value={{
      state,
      login,
      logout,
      submitAssessment,
      updateConceptAttempts,
      setShowCongratulations
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
