import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { withSuspense } from '@core/hoc';
import { AppProvider, useApp } from '@core/contexts/AppContext';
import { ROUTES } from '@core/constants/routes';
import { useTimer } from '@core/hooks/useTimer';
import { useToast } from '@core/hooks/useToast';
import { useAssessmentFetch } from '@core/hooks/useAssessmentFetch';
import MainLayout from '@shared/layouts/MainLayout';
import Loader from '@shared/components/Loader/Loader';
import ConfirmationModal from '@shared/components/ConfirmationModal/ConfirmationModal';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import '@shared/styles/globals.css';

const SSOLoading = withSuspense(React.lazy(() => import('@features/Auth/SSOLoading/SSOLoading')));
const DirectLinkLoading = withSuspense(React.lazy(() => import('@features/Auth/DirectLinkLoading/DirectLinkLoading')));
const BlackboardLoading = withSuspense(React.lazy(() => import('@features/Auth/BlackboardLoading/BlackboardLoading')));
const Assessment = withSuspense(React.lazy(() => import('@features/Assessment/Assessment')));
const Evaluation = withSuspense(React.lazy(() => import('@features/Evaluation/Evaluation')));
const Concepts = withSuspense(React.lazy(() => import('@features/LearningConceptModules/LearningConceptModules')));

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { config, isLoading } = useApp();
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [hasAssessmentQuestions, setHasAssessmentQuestions] = useState(false);
  const [currentConceptId, setCurrentConceptId] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const handleTimeUp = useCallback(() => {
    setAssessmentStarted(false);
    setIsTimeUp(true);
  }, []);

  const { timeLeft, setTimeLeft, formatTime } = useTimer({
    isRunning: assessmentStarted,
    onTimeUp: handleTimeUp,
  });

  const {
    assessmentData,
    loadingAssessment,
    assessmentError,
    fetchAssessmentData,
    resetAssessmentData,
  } = useAssessmentFetch();

  useEffect(() => {
    const isReady = !isLoading && config.courseTitle;
    const isConfirmationPath = location.pathname === ROUTES.CONFIRMATION;

    // console.log("AppContent useEffect triggered", { isReady, isConfirmationPath, assessmentData, loadingAssessment, assessmentError });

    if (isReady && isConfirmationPath && !assessmentData && !loadingAssessment && !assessmentError) {
      fetchAssessmentData(currentConceptId);
    }
  }, [isLoading, config.courseTitle, location.pathname, assessmentData, loadingAssessment, assessmentError, currentConceptId, fetchAssessmentData]);

  const handleInitiateAssessment = useCallback((conceptId = null) => {
    setCurrentConceptId(conceptId);
    setIsTimeUp(false);
    resetAssessmentData();
    fetchAssessmentData(conceptId, true);
    navigate(conceptId ? ROUTES.ASSESSMENT : ROUTES.CONFIRMATION);
  }, [resetAssessmentData, fetchAssessmentData, navigate]);

  const handleQuestionsLoaded = useCallback((durationSeconds) => {
    setAssessmentStarted(true);
    setHasAssessmentQuestions(true);
    if (durationSeconds) setTimeLeft(durationSeconds);
  }, [setTimeLeft]);

  const handleAssessmentSubmit = useCallback(() => {
    setAssessmentStarted(false);
    setHasAssessmentQuestions(false);
  }, []);

  return (
    <MainLayout
      timeLeft={timeLeft}
      hasAssessmentQuestions={hasAssessmentQuestions}
      formatTime={formatTime}
      toasts={toasts}
      removeToast={removeToast}
    >
      <Routes>
        {/* Auth entry points */}
        <Route path="/lms" element={<BlackboardLoading />} />
        <Route path="/direct" element={<DirectLinkLoading />} />
        <Route path="/sso" element={<SSOLoading />} />
        <Route path="/" element={<Navigate to="/sso" replace />} />

        {/* Confirmation screen */}
        <Route
          path={ROUTES.CONFIRMATION}
          element={
            loadingAssessment ? (
              <Loader title="Loading Assessment Data..." />
            ) : assessmentError ? (
              <ErrorPage
                error={assessmentError}
                title="Failed to Load Assessment"
                onRetry={() => fetchAssessmentData(currentConceptId)}
              />
            ) : !assessmentData ? (
              <Loader title="Loading Assessment Data..." />
            ) : (
              <ConfirmationModal
                isOpen={true}
                onConfirm={() => navigate(ROUTES.ASSESSMENT)}
                showTimer={config.showTimer}
                duration={config.duration}
                masteryThreshold={config.masteryThreshold}
                attempts={config.attempts}
              />
            )
          }
        />

        {/* Assessment screen */}
        <Route
          path={ROUTES.ASSESSMENT}
          element={
            <Assessment
              preFetchedData={assessmentData}
              onAssessmentComplete={() => {
                setHasAssessmentQuestions(false);
                navigate(ROUTES.EVALUATION);
              }}
              onAssessmentSubmit={handleAssessmentSubmit}
              conceptId={currentConceptId}
              courseTitle={config.courseTitle}
              onLoadError={() => setAssessmentStarted(false)}
              onLoadSuccess={handleQuestionsLoaded}
              isTimeUp={isTimeUp}
            />
          }
        />

        {/* Post-assessment screens */}
        <Route path={ROUTES.EVALUATION} element={<Evaluation masteryThreshold={config.masteryThreshold} attempts={config.attempts} />} />
        <Route path={ROUTES.CONCEPTS} element={<Concepts onStartAssessment={handleInitiateAssessment} attempts={config.attempts} />} />
        <Route path={ROUTES.LEARNING} element={<Concepts onStartAssessment={handleInitiateAssessment} attempts={config.attempts} />} />
      </Routes>
    </MainLayout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
