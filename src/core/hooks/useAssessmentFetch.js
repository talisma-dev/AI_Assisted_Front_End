import { useState, useRef, useCallback } from 'react';
import { getQuestionsData } from '@api/getQuestionsData';
import { useApp } from '@core/contexts/AppContext';

export const useAssessmentFetch = () => {
  const { config, setConfig } = useApp();

  const [assessmentData, setAssessmentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchingRef = useRef(false);

  const fetchAssessmentData = async (conceptId = null, force = false) => {
    if ((!force && assessmentData) || isLoading || fetchingRef.current) return;

    //   const fetchAssessmentData = useCallback(async (conceptId = null) => {
    // // Guard against concurrent or duplicate fetches
    // if (assessmentData || isLoading || fetchingRef.current) return;

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setError(null);

      const params = {
        outcomes: conceptId ? [conceptId] : [],
        remediation: Boolean(conceptId),
      };

      const { questions, configuration } = await getQuestionsData(params);
      const questionsList = questions || [];

      if (questionsList.length > 0) {
        const cfg = configuration || {};

        setConfig(prev => ({
          ...prev,
          masteryThreshold: Number(cfg.masteryThreshold) || prev.masteryThreshold,
          attempts: Number(cfg.maxRemediation) || prev.attempts,
          duration: Number(cfg.durationInMinutes) || prev.duration,
          showTimer: cfg.isTimed ?? prev.showTimer,
        }));

        setAssessmentData(questionsList);
      } else {
        setError('No questions available. Please try again.');
      }
    } catch (err) {
      console.error('Assessment fetch failed:', err);
      setError('Failed to load assessment. Please try again.');
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  const resetAssessmentData = useCallback(() => {
    setAssessmentData(null);
    setError(null);
  }, []);

  return {
    assessmentData,
    loadingAssessment: isLoading,
    assessmentError: error,
    fetchAssessmentData,
    resetAssessmentData,
  };
};
