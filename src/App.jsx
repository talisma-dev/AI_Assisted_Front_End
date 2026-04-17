import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { withSuspense, ProtectedRoute } from '@core/hoc';
import { AppProvider, useApp } from '@core/contexts/AppContext';
import { ROUTES } from '@core/constants/routes';
import { useTimer } from '@core/hooks/useTimer';
import { useToast } from '@core/hooks/useToast';
import { useAssessmentFetch } from '@core/hooks/useAssessmentFetch';
import { logout } from '@core/utils/logout';
import { bootstrapAuth, requestStorageAccess } from '@api/base';
import MainLayout from '@shared/layouts/MainLayout';
import Loader from '@shared/components/Loader/Loader';
import ConfirmationModal from '@shared/components/ConfirmationModal/ConfirmationModal';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';
import ErrorBoundary from '@shared/components/ErrorBoundary/ErrorBoundary';
import '@shared/styles/globals.css';

const ConfirmationPage = ({ config, assessmentData, assessmentError, currentConceptId, fetchAssessmentData, navigate, onConfirm, ...props }) => {
  if (props.loadingAssessment) {
    return <Loader title="Loading Assessment Data..." />;
  }
  if (assessmentError) {
    return (
      <ErrorPage
        error={assessmentError}
        title="Failed to Load Assessment"
        onRetry={() => fetchAssessmentData(currentConceptId)}
      />
    );
  }
  if (!assessmentData) {
    return <Loader title="Loading Assessment Data..." />;
  }
  return (
    <ConfirmationModal
      isOpen={true}
      onConfirm={onConfirm}
      showTimer={config.showTimer}
      duration={config.duration}
      masteryThreshold={config.masteryThreshold}
      attempts={config.attempts}
      assessmentData={assessmentData}
    />
  );
};

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
  const searchParams = new URLSearchParams(location.search);
  const conceptIdFromUrl = searchParams.get('conceptId');
  const [currentConceptId, setCurrentConceptId] = useState(conceptIdFromUrl);

  const [isTimeUp, setIsTimeUp] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const [needsUserAction, setNeedsUserAction] = useState(false);

  // Update currentConceptId when URL changes
  useEffect(() => {
    const newConceptId = searchParams.get('conceptId');
    if (newConceptId !== currentConceptId) {
      setCurrentConceptId(newConceptId);
    }
  }, [location.search]);

  // Check auth on app load - handles Safari iframe storage access
  useEffect(() => {
    const initAuth = async () => {
    const publicRoutes = ['/sso', '/direct', '/lms', '/'];
    const isPublic = publicRoutes.some(r => location.pathname === r || location.pathname.startsWith(r + '/'));
      if (isPublic) return;
     
      const result = await bootstrapAuth();
  
          if (result.status === 'needs-user-action') {
            setNeedsUserAction(true);
            } else if (result.status === 'invalid-token') {
             navigate('/sso', { replace: true });
          }
            };
   
    initAuth();
    }, [navigate, location.pathname]);



  // Multi-tab sync: listen for logout events from other tabs
  useEffect(() => {
    const handleTokenRemoved = () => {
      navigate('/sso', { replace: true });
    };

    const handleAuthError = (event) => {
      if (event.detail?.type === 'unauthorized') {
        navigate('/sso', { replace: true });
      }
    };
 
   const handleNeedsUserAction = () => {
      setNeedsUserAction(true);
 };

    window.addEventListener('token-removed', handleTokenRemoved);
    window.addEventListener('auth-error', handleAuthError);
    window.addEventListener('auth-needs-user-action', handleNeedsUserAction);

    return () => {
      window.removeEventListener('token-removed', handleTokenRemoved);
      window.removeEventListener('auth-error', handleAuthError);
      window.removeEventListener('auth-needs-user-action', handleNeedsUserAction);
    };
  }, [navigate]);
  
  // Handler for Safari storage access user gesture
  const handleContinue = async () => {
  const granted = await requestStorageAccess();
   if (granted) {
    setNeedsUserAction(false);
    window.location.reload();
   }
  };



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

    if (isReady && isConfirmationPath && !assessmentData && !loadingAssessment && !assessmentError) {
      fetchAssessmentData(currentConceptId);
    }
  }, [isLoading, config.courseTitle, location.pathname, assessmentData, loadingAssessment, assessmentError, currentConceptId, fetchAssessmentData]);

  const handleInitiateAssessment = useCallback((conceptId = null) => {
    sessionStorage.removeItem('assessment-submitted');
    setCurrentConceptId(conceptId);
    setIsTimeUp(false);
    resetAssessmentData();
    fetchAssessmentData(conceptId, true);
    const assessmentUrl = conceptId
      ? `${ROUTES.ASSESSMENT}?conceptId=${conceptId}`
      : ROUTES.CONFIRMATION;
    navigate(assessmentUrl);
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



  // Storage access gate - Safari iframe requires user gesture
  if (needsUserAction) {
    return (
      <ErrorPage
        title="Continue to Learning Platform"
        message="Click below to access your session"
        showRetry={true}
        onRetry={handleContinue}
        retryLabel="Continue"
      />
    );
  }

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
        <Route
          path={ROUTES.CONFIRMATION}
          element={
            <ProtectedRoute>
              <ConfirmationPage
                config={config}
                assessmentData={assessmentData}
                assessmentError={assessmentError}
                currentConceptId={currentConceptId}
                fetchAssessmentData={fetchAssessmentData}
                navigate={navigate}
                onConfirm={() => {
                  sessionStorage.removeItem('assessment-submitted');
                  navigate(ROUTES.ASSESSMENT, { replace: true });
                }} 
                loadingAssessment={loadingAssessment}
              />
            </ProtectedRoute>
          }
        />

        <Route
          path={ROUTES.ASSESSMENT}
          element={
          <ProtectedRoute>
            <Assessment
              preFetchedData={assessmentData}
              loadingAssessment={loadingAssessment}
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
          </ProtectedRoute>
        }
      />

        <Route path={ROUTES.EVALUATION}element={<ProtectedRoute><Evaluation masteryThreshold={config.masteryThreshold} attempts={config.attempts} /></ProtectedRoute>}/>
        <Route path={ROUTES.CONCEPTS}element={<ProtectedRoute><Concepts onStartAssessment={handleInitiateAssessment} attempts={config.attempts} /></ProtectedRoute>}/>
        <Route path={ROUTES.LEARNING}element={<ProtectedRoute><Concepts onStartAssessment={handleInitiateAssessment} attempts={config.attempts} /></ProtectedRoute>}/></Routes>
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
