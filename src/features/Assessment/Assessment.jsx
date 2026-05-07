import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronsRight, ChevronsLeft, Bookmark, ChevronsLeft as CollapseIcon } from 'lucide-react';
import { getQuestionsData } from '@api/getQuestionsData';
import { evaluateAssessment } from '@api/evaluateAssessment';
import { saveAssessmentSession } from '@core/utils/timeTracker';

import { ROUTES } from '@core/constants/routes';
import { useApp } from '@core/contexts/AppContext';
import './Assessment.css';
import Loader from '@shared/components/Loader/Loader';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';
import AssessmentSummaryModal from './components/AssessmentSummaryModal/AssessmentSummaryModal';

export default function Assessment({
  onAssessmentComplete,
  onAssessmentSubmit,
  conceptId,
  courseTitle,
  onLoadError,
  onLoadSuccess,
  preFetchedData,
  loadingAssessment,
  isTimeUp
}) {
  const navigate = useNavigate();
  const { config, refreshAppData } = useApp();

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const activeTimeRef = useRef(0);
  const lastTickRef = useRef(Date.now());
  const fetchStartedRef = useRef(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [error, setError] = useState(null);
  const [showTimeUpModal, setShowTimeUpModal] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  // Check if already submitted this session - prevent retaking
  useEffect(() => {
    const alreadySubmitted = sessionStorage.getItem('assessment-submitted');
    if (alreadySubmitted === 'true') {
      navigate(ROUTES.EVALUATION, { replace: true });
      return;
    }

    if (preFetchedData && preFetchedData.length > 0 && isLoading) {
      setQuestions(preFetchedData);
      lastTickRef.current = Date.now();
      activeTimeRef.current = 0;
      if (onLoadSuccess) onLoadSuccess(config.duration * 60);
      setIsLoading(false);
    } else if (!preFetchedData && !loadingAssessment && isLoading) {
      setIsLoading(false);
    }
  }, [preFetchedData, config.duration, onLoadSuccess, isLoading, navigate]);

  useEffect(() => {

    if (loadingAssessment) {
      fetchStartedRef.current = true;
    }
  }, [loadingAssessment]);

  useEffect(() => {
    const hasFetchCompletedOrNeverStarted = !loadingAssessment;
    const shouldWaitForFetch = loadingAssessment || (!fetchStartedRef.current && !preFetchedData && conceptId);

    if (!isLoading && !shouldWaitForFetch && (!preFetchedData || preFetchedData.length === 0)) {
      if (conceptId) {
        navigate(`${ROUTES.LEARNING}?conceptId=${conceptId}`);
      } else {
        navigate(ROUTES.CONFIRMATION);
      }
    }
  }, [isLoading, preFetchedData, navigate, conceptId, loadingAssessment]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        activeTimeRef.current += Math.floor((Date.now() - lastTickRef.current) / 1000);
      } else {
        lastTickRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (isTimeUp && !isSubmitted && !isEvaluating) {
      setShowSubmitConfirmation(false);
      setShowTimeUpModal(true);
    }
  }, [isTimeUp, isSubmitted, isEvaluating]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const flaggedCount = Object.keys(flaggedQuestions).length;
  const flaggedOnlyCount = Object.keys(flaggedQuestions).filter(id => userAnswers[id] === undefined).length;
  const notVisitedCount = totalQuestions - answeredCount - flaggedOnlyCount;
  const progressPercentage = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const toggleFlag = () => {
    if (!currentQuestion) return;
    setFlaggedQuestions(prev => {
      const isCurrentlyFlagged = prev[currentQuestion.question_id];
      if (isCurrentlyFlagged) {
        const { [currentQuestion.question_id]: removed, ...rest } = prev;
        return rest;
      } else {
        return {
          ...prev,
          [currentQuestion.question_id]: true
        };
      }
    });
  };

  const selectOption = (option) => {
    if (!currentQuestion) return;
    const currentAnswer = userAnswers[currentQuestion.question_id];
    if (currentAnswer === option) {
      setUserAnswers(prev => {
        const { [currentQuestion.question_id]: removed, ...rest } = prev;
        return rest;
      });
    } else {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.question_id]: option
    }));
    }
  };

  const allQuestionsAttended = answeredCount === totalQuestions ||
    (answeredCount + Object.keys(flaggedQuestions).length) === totalQuestions;

  const handleSubmitClick = () => {
    setShowSubmitConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setShowSubmitConfirmation(false);
    await performSubmit();
  };

  const performSubmit = async () => {
    try {
      setShowTimeUpModal(false);
      setIsEvaluating(true);
      sessionStorage.setItem('assessment-submitted', 'true');
      if (onAssessmentSubmit) onAssessmentSubmit();

      const currentSegment = Math.floor((Date.now() - lastTickRef.current) / 1000);
      const totalActiveTime = activeTimeRef.current + currentSegment;

      saveAssessmentSession(totalActiveTime, isTimeUp);

      const conceptStats = {};
      questions.forEach((q) => {
        const concept = q.concept || 'General';
        if (!conceptStats[concept]) {
          conceptStats[concept] = { total: 0, answered: 0 };
        }
        conceptStats[concept].total += 1;
        if (userAnswers[q.question_id]) {
          conceptStats[concept].answered += 1;
        }
      });

      const conceptBasedAnswerDetails = {};
      const conceptCount = Object.keys(conceptStats).length;
      const timePerConcept = Math.floor(totalActiveTime / conceptCount);
      Object.entries(conceptStats).forEach(([concept, stats]) => {
        conceptBasedAnswerDetails[concept] = {
          completionTimeTakenSeconds: timePerConcept,
          answeredQuestionsCount: stats.answered,
          unansweredQuestionsCount: stats.total - stats.answered
        };
      });

      const result = await evaluateAssessment(userAnswers, conceptBasedAnswerDetails);

      if (refreshAppData) {
        await refreshAppData();
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Evaluation failed:', error);
      setIsSubmitted(true);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleAnalysisComplete = () => {
    setIsNavigating(true);
    setQuestions([]); 
    onAssessmentComplete?.();
    navigate(ROUTES.EVALUATION, { replace: true });
  };

  useEffect(() => {
    if (!questions.length && isSubmitted && !isNavigating) {
      navigate(ROUTES.EVALUATION, { replace: true });
      return;
    }
    if (conceptId && !questions.length && !isLoading && !isNavigating && !isSubmitted) {
      navigate(`${ROUTES.LEARNING}?conceptId=${conceptId}`);
    }
  }, [conceptId, questions.length, isLoading, isNavigating, navigate, isSubmitted]);

  if (isNavigating) return null;

  if (isSubmitted || isEvaluating) {
    return (
      <Loader
        type="analysis"
        finished={isSubmitted && !isEvaluating}
        onComplete={handleAnalysisComplete}
      />
    );
  }

  if (isLoading && !isSubmitted) {
    return (
      <Loader
        title="Loading Assessment Data..."
        finished={!isLoading}
      />
    );
  }

  if (conceptId && !questions.length && !isLoading) {
    return null;
  }

  if (error || !questions.length) {
    return (
      <ErrorPage
        error={error || 'Failed to load assessment. Please try again.'}
        title="Assessment Unavailable"
        message={error || 'Failed to load assessment. Please try again.'}
        useModal={true}
        onRetry={() => {
          if (onLoadError) onLoadError();
          else window.location.reload();
        }}
      />
    );
  }


  return (
    <div className="assessment-layout">
      <AssessmentSummaryModal
        isOpen={showTimeUpModal}
        type="timeExpired"
        attemptedCount={answeredCount}
        totalQuestions={totalQuestions}
        markedForReviewCount={Object.keys(flaggedQuestions).length}
        onConfirm={performSubmit}
      />
      <AssessmentSummaryModal
        isOpen={showSubmitConfirmation}
        type="submitConfirmation"
        attemptedCount={answeredCount}
        totalQuestions={totalQuestions}
        markedForReviewCount={Object.keys(flaggedQuestions).length}
        onReview={() => setShowSubmitConfirmation(false)}
        onSubmit={handleConfirmSubmit}
      />
      <aside className={`assessment-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="collapse-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          <CollapseIcon className="collapse-icon" />
        </button>

        {/* Progress indicator - always visible */}
        <div className="progress-indicator-collapsed">
          <div className="progress-vertical-bar">
            <div className="progress-track">
              <div className="progress-fill" style={{ height: `${progressPercentage}%` }} />
            </div>
            <div className="progress-milestones">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`milestone ${i * 25 <= progressPercentage ? 'active' : ''}`}
                  style={{ top: `${i * 25}%` }}
                />
              ))}
            </div>
          </div>
          <div className="progress-info-vertical">
            <div className="progress-percentage-main">{progressPercentage}%</div>
            <div className="progress-details">
              {/* <div className="progress-fraction">{answeredCount}/{totalQuestions}</div> */}
              <div className="progress-text">Complete</div>
            </div>
          </div>
          <div className="legend-collapsed">
            <div className="legend-item-collapsed"><span className="status-dot answered" /> {answeredCount}</div>
            <div className="legend-item-collapsed"><span className="status-dot flagged" /> {flaggedCount}</div>
            <div className="legend-item-collapsed"><span className="status-dot not-visited" /> {notVisitedCount}</div>
          </div>
        </div>

        <div className="sidebar-content">
          <div className="question-navigation">
            <div className="sidebar-header">
              <h3>Question Navigation</h3>
              <span className="total-pill">{totalQuestions} Total</span>
            </div>

            <div className="navigation-grid-container">
              <div className="navigation-grid">
                {questions.map((q, idx) => {
                  const statusClasses = [];
                  if (idx === currentIndex) statusClasses.push('current');
                  if (userAnswers[q.question_id] !== undefined) statusClasses.push('answered');
                  if (flaggedQuestions[q.question_id]) statusClasses.push('flagged');

                  return (
                    <div
                      key={q.question_id}
                      className={`nav-item ${statusClasses.join(' ')}`}
                      onClick={() => setCurrentIndex(idx)}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="progress-info">
              <span className="progress-label">Assessment Progress</span>
              <span className="percentage">{progressPercentage}%</span>
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
            </div>
            <div className="legend">
              <div className="legend-item"><span className="status-dot answered" /> ANSWERED ({answeredCount})</div>
              <div className="legend-item"><span className="status-dot flagged" /> MARKED FOR REVIEW ({flaggedCount})</div>
              <div className="legend-item"><span className="status-dot not-visited" /> NOT VISITED ({notVisitedCount})</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="assessment-main">
        <div className="question-header">
          <div className="header-left">
            <h1>{currentQuestion.concept || courseTitle}</h1>
            <span className="question-type">{currentQuestion.question_type || 'MCQ'}</span>
            <span className="question-badge">Question {currentIndex + 1} of {totalQuestions}</span>
          </div>
          <button
            className={`btn-flag ${flaggedQuestions[currentQuestion.question_id] ? 'flagged' : ''}`}
            onClick={toggleFlag}
          >
            <Bookmark className="flag-icon" fill={flaggedQuestions[currentQuestion.question_id] ? "currentColor" : "none"} />
            {flaggedQuestions[currentQuestion.question_id] ? 'Marked for Review' : 'Mark for Review'}
          </button>
        </div>

        <div className="question-card">
          <p className="question-text">{currentQuestion.question}</p>
          <div className="options-list">
            {currentQuestion.options.map((option, idx) => (
              <div
                key={idx}
                className={`option-item ${userAnswers[currentQuestion.question_id] === option ? 'selected' : ''}`}
                onClick={() => selectOption(option)}
              >
                <div className="option-radio" />
                <span className="option-text">{option}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="assessment-actions">
          <div className="nav-buttons">
            <button
              className="btn-prev"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="nav-icon" />
              Previous <span>Question</span>
            </button>
            <button
              className="btn-next"
              onClick={() => setCurrentIndex(Math.min(totalQuestions - 1, currentIndex + 1))}
              disabled={currentIndex >= totalQuestions - 1}
            >
              {userAnswers[currentQuestion?.question_id] !== undefined ? 'Next ' : 'Skip '}
              <span>Question</span>
              <ChevronRight className="nav-icon" />
            </button>
          </div>
          <button
            className="btn-submit active"
            onClick={handleSubmitClick}
            disabled={isEvaluating}
          >
            {isEvaluating ? 'Submitting...' : 'Submit Assessment'}
          </button>
        </div>
      </main>
    </div>
  );
}
