import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getConfiguredEvaluatedAssessmentScores } from '@api/getConfiguredEvaluatedAssessmentScores';
import { getToken } from '@api/base';

const AppContext = createContext();
const parseAppConfig = (data) => {
  if (!data) return {};

  return {
    courseTitle: data.courseName || '',
    attempts: data.maxRemediationConfigCount ?? 0,
    masteryThreshold: data.masteryThreshold ?? 0,
    themeColor: data.themeColor || '#3b82f6',
    showTimer: data.showTimer ?? false,
    duration: data.duration ?? 0,
    userName: data.userName || '',
    userRole: data.userRole || '',
  };
};

const parsePerformanceData = (rawList = []) => {
  return rawList.map(item => {

    return {
      id: item.concept,
      name: item.concept,
      score: Number(item.score ?? 0),
      status: item.level || 'Remediation',
      currentAttempts: item.attemptCount ?? 0,
      isRemediationCompleted: item.isRemediationCompleted ?? false
    };
  });
};

const applyThemeAndMeta = (config) => {
  if (config.courseTitle) {
    document.title = config.courseTitle;
  }

  if (config.themeColor) {
    document.documentElement.style.setProperty('--accent', config.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${config.themeColor}33`);
    document.documentElement.style.setProperty('--accent-light', `${config.themeColor}1a`);
    document.documentElement.style.setProperty('--accent-border', `${config.themeColor}4d`);
    document.documentElement.style.setProperty('--accent-bg', `${config.themeColor}1a`);
  }

  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }
};


export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState({});
  const [performanceData, setPerformanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const fetchingRef = useRef(false);

  const refreshAppData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (fetchingRef.current) return;

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setIsError(false);

      const data = await getConfiguredEvaluatedAssessmentScores();

      if (data) {
        const freshConfig = parseAppConfig(data);
        setConfig(freshConfig);

        const rawList = data.data || [];

        // Sync Check: If DB is cleared (no concepts returned), purge local time tracking
        if (rawList.length === 0) {
          import('@core/utils/timeTracker').then(m => m.resetTimeData());
        }

        const conceptPerformance = parsePerformanceData(rawList);

        setPerformanceData({
          conceptPerformance,
          courseName: data.courseName
        });
      }
    } catch (error) {
      console.error('Core app data fetch failed:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    refreshAppData();
    window.addEventListener('token-changed', refreshAppData);
    return () => window.removeEventListener('token-changed', refreshAppData);
  }, [refreshAppData]);

  useEffect(() => {
    applyThemeAndMeta(config);
  }, [config]);
  const suggestedRedirect = useMemo(() => {
    return performanceData?.conceptPerformance?.length > 0 ? '/evaluation' : '/confirmation';
  }, [performanceData?.conceptPerformance?.length]);

  const value = useMemo(() => ({
    config,
    performanceData,
    isLoading,
    isError,
    refreshAppData,
    setPerformanceData,
    setConfig,
    suggestedRedirect
  }), [
    config,
    performanceData,
    isLoading,
    isError,
    refreshAppData,
    suggestedRedirect
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
