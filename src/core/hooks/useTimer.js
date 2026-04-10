import { useState, useEffect, useCallback } from 'react';
import { saveAssessmentSession } from '@core/utils/timeTracker';
import { useApp } from '@core/contexts/AppContext';

/**
 * Manages countdown timer for timed assessments.
 * @param {boolean} isRunning 
 * @param {function} onTimeUp 
 */
export const useTimer = ({ isRunning, onTimeUp }) => {
  const { config } = useApp();
  const [timeLeft, setTimeLeft] = useState(config.duration * 60);

  // Reset timeLeft when duration changes and assessment hasn't started
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(config.duration * 60);
    }
  }, [config.duration, isRunning]);

  // Countdown logic
  useEffect(() => {
    if (!isRunning || !config.showTimer) return;

    if (timeLeft === 0) {
      const timeSpent = (config.duration * 60) - timeLeft;
      saveAssessmentSession(timeSpent, true);
      onTimeUp?.();
      return;
    }

    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [isRunning, config.showTimer, timeLeft, onTimeUp]);

  const formatTime = useCallback((seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }, []);

  return { timeLeft, setTimeLeft, formatTime };
};
