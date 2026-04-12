import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { getConfiguredEvaluatedAssessmentScores } from '@api/getConfiguredEvaluatedAssessmentScores';
import { getToken } from '@api/base';
import { DEFAULT_APP_CONFIG } from '@core/constants/routes';

const AppContext = createContext();
const parseAppConfig = (data, defaultConfig) => {
  if (!data) return defaultConfig;

  return {
    ...defaultConfig,
    courseTitle: data.courseName || defaultConfig.courseTitle,
    attempts: data.maxRemediationConfigCount ?? defaultConfig.attempts,
    masteryThreshold: data.masteryThreshold ?? defaultConfig.masteryThreshold,
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
    document.documentElement.style.setProperty('--accent-color', config.themeColor);
    document.documentElement.style.setProperty('--accent-glow', `${config.themeColor}33`);
  }

  if (config.colors) {
    Object.entries(config.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }
};


export const AppProvider = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_APP_CONFIG);
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
        const freshConfig = parseAppConfig(data, DEFAULT_APP_CONFIG);
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
