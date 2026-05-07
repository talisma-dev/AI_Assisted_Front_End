import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
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

const parsePerformanceData = (rawList = [], detailData = []) => {
  const attemptsMap = new Map();
  detailData.forEach(detail => {
    if (detail.conceptName) {
      if (!attemptsMap.has(detail.conceptName)) {
        attemptsMap.set(detail.conceptName, []);
      }
      attemptsMap.get(detail.conceptName).push({
        attemptCount: detail.attemptCount || 0,
        score: detail.score || 0,
        answered: detail.answeredQuestionsCount || 0,
        unanswered: detail.unansweredQuestionsCount || 0,
        completionTimeTaken: detail.completionTimeTaken || 0
      });
    }
  });

  return rawList.map(item => {
    const attempts = attemptsMap.get(item.concept) || [];
    const totals = attempts.reduce((sum, a) => ({
      answered: sum.answered + a.answered,
      unanswered: sum.unanswered + a.unanswered,
      completionTimeTaken: sum.completionTimeTaken + a.completionTimeTaken,
      score: sum.score + a.score
    }), { answered: 0, unanswered: 0, completionTimeTaken: 0, score: 0 });

    return {
      id: item.concept,
      name: item.concept,
      score: Number(item.score ?? 0),
      status: item.level || 'Remediation',
      currentAttempts: item.attemptCount ?? 0,
      isRemediationCompleted: item.isRemediationCompleted ?? false,
      answered: totals.answered,
      unanswered: totals.unanswered,
      completionTimeTaken: totals.completionTimeTaken,
      totalScore: totals.score,
      attemptsDetails: attempts 
    };
  });
};

const applyThemeAndMeta = (config, profile) => {
  if (config.courseTitle) {
    document.title = config.courseTitle;
  }

  const primaryColor = profile?.university?.primaryThemeShade || config.themeColor || '#3b82f6';
  const secondaryColor = profile?.university?.secondaryThemeShade;
  const tertiaryColor = profile?.university?.teritoryThemeShade;

  if (primaryColor) {
    document.documentElement.style.setProperty('--accent', primaryColor);
    document.documentElement.style.setProperty('--accent-glow', `${primaryColor}33`);
    document.documentElement.style.setProperty('--accent-light', `${primaryColor}1a`);
    document.documentElement.style.setProperty('--accent-border', `${primaryColor}4d`);
    document.documentElement.style.setProperty('--accent-bg', `${primaryColor}1a`);
    document.documentElement.style.setProperty('--primary-color', primaryColor);
  }

  if (secondaryColor) {
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
  }

  if (tertiaryColor) {
    document.documentElement.style.setProperty('--tertiary-color', tertiaryColor);
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
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const fetchingRef = useRef(false);

  const { profile } = useSelector((state) => state.studentProfile);

  const refreshAppData = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }

    if (fetchingRef.current) return;
    const isAssessmentFromSSO = sessionStorage.getItem('isAssessmentRoute') === 'true';

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setIsError(false);

      if (isAssessmentFromSSO) {
        sessionStorage.removeItem('isAssessmentRoute');
        setPerformanceData(null);
        setIsLoading(false);
        fetchingRef.current = false;
        return;
      }

      const data = await getConfiguredEvaluatedAssessmentScores();

      if (data) {
        const freshConfig = parseAppConfig(data);
        setConfig(freshConfig);

        const rawList = data.data?.evaluations || data.data || [];
        const detailData = data.data?.evaluationDetail?.data || [];

        // Sync Check: If DB is cleared (no concepts returned), purge local time tracking
        if (rawList.length === 0) {
          import('@core/utils/timeTracker').then(m => m.resetTimeData());
        }

        const conceptPerformance = parsePerformanceData(rawList, detailData);

        setPerformanceData({
          conceptPerformance,
          courseName: data.courseName,
          overallTimeTakenSeconds: data.data?.evaluationDetail?.overallTimeTakenSeconds || 0
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
    window.addEventListener('token-changed', refreshAppData);
    return () => window.removeEventListener('token-changed', refreshAppData);
  }, [refreshAppData]);

  useEffect(() => {
    applyThemeAndMeta(config, profile);
  }, [config, profile]);

  const mergedConfig = useMemo(() => {
    if (!profile) return config;

    return {
      ...config,
      userName: profile.name || config.userName,
      userEmail: profile.emailId,
      courseTitle: profile.courseName || config.courseTitle,
      moduleName: profile.moduleName,
      universityName: profile.university?.name,
      masteryThreshold: profile.assessmentConfiguration?.masteryThreshold ?? config.masteryThreshold,
      attempts: profile.assessmentConfiguration?.maxRemediationCount ?? config.attempts,
      showTimer: profile.assessmentConfiguration?.isTimed ?? config.showTimer,
      duration: profile.assessmentConfiguration?.timeLimitInMinutes ?? config.duration,
      questionCount: profile.assessmentConfiguration?.questionCount ?? config.questionCount,
    };
  }, [config, profile]);
  const suggestedRedirect = useMemo(() => {
    return performanceData?.conceptPerformance?.length > 0 ? '/evaluation' : '/confirmation';
  }, [performanceData?.conceptPerformance?.length]);

  const value = useMemo(() => ({
    config: mergedConfig,
    performanceData,
    isLoading,
    isError,
    refreshAppData,
    setPerformanceData,
    setConfig,
    suggestedRedirect,
    profile,
  }), [
    mergedConfig,
    performanceData,
    isLoading,
    isError,
    refreshAppData,
    suggestedRedirect,
    profile,
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
