import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Trophy, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '@core/contexts/AppContext';
import { getTotalTimeSpent, formatTime } from '@core/utils/timeTracker';
import MicroConcepts from './components/MicroConcepts/MicroConcepts';
import ErrorPage from '@shared/components/ErrorPage/ErrorPage';
import Loader from '@shared/components/Loader/Loader';
import Toast from '@shared/components/UI/Toast/Toast';
import './Evaluation.css';

const Evaluation = ({ masteryThreshold, attempts }) => {
  const { performanceData, isLoading, isError, config, refreshAppData } = useApp();
  const overallSeconds = performanceData?.overallTimeTakenSeconds || getTotalTimeSpent();
  const timeTaken = formatTime(overallSeconds);
  const [allConceptsMastered, setAllConceptsMastered] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [totalConceptCount, setTotalConceptCount] = useState(0);

  const conceptPerformance = performanceData?.conceptPerformance || [];

  const masteredCount = conceptPerformance.filter(concept => concept.status === 'Mastered').length;
  const learnAndGrowCount = conceptPerformance.filter(concept => concept.status !== 'Mastered').length;

  const totalScore = conceptPerformance.reduce((sum, concept) => sum + concept.score, 0);
  const currentScore = conceptPerformance.length > 0 ? Math.round(totalScore / conceptPerformance.length) : 0;
  const hasPassedMasteryThreshold = currentScore >= masteryThreshold;

  useEffect(() => {
    if (performanceData?.conceptPerformance) {
      const allMastered = performanceData.conceptPerformance.every(concept => concept.status === 'Mastered');
      setAllConceptsMastered(allMastered);
    }
  }, [performanceData]);


  useEffect(() => {
    if (!performanceData && !isLoading && !isError) {
      refreshAppData();
    }
  }, [performanceData, isLoading, isError, refreshAppData]);

  const getCurrentScoreColor = (score) => {
    if (score >= 95) return 'green';
    if (score >= masteryThreshold) return 'green';
    if (score >= masteryThreshold * 0.7) return 'amber';
    return 'red';
  };

  if (isLoading || (!performanceData && !isError)) {
    return (
      <Loader
        title="Loading Assessment Results..."
        subtitle="Please wait while we fetch your evaluation data."
      />
    );
  }

  if (isError) {
    return (
      <ErrorPage
        error="SESSION EXPIRED"
        title="Assessment Data Unavailable"
        message="We couldn't retrieve your assessment results. This might be due to a session expiration or network issue. Please try refreshing the page."
        onRetry={refreshAppData}
      />
    );
  }


  return (
    <div className="evaluation-page">
      {!hasPassedMasteryThreshold && showNotification && (
        <div className="evaluation-notification-container">
          <div style={{ pointerEvents: 'auto' }}>
            <Toast
              type="ai-assistant"
              message={
                <span>
                  🎉 Almost there! You didn't reach the minimum score yet, but your personalized
                  pathway is ready with micro-concepts to help strengthen your understanding.
                  Click <strong>Continue Learning</strong> to review the material and attempt the assessment again.
                </span>
              }
              duration={0}
              onClose={() => setShowNotification(false)}
            />
          </div>
        </div>
      )}

      {hasPassedMasteryThreshold && showNotification && (
        <div className="evaluation-notification-container">
          <div style={{ pointerEvents: 'auto' }}>
            <Toast
              type="ai-assistant"
              message={
                <span>
                  🏆 <strong>Mastery Achieved!</strong> Congratulations! You've successfully
                  mastered the assessment with a score of <strong>{currentScore}%</strong>. Your dedication
                  and hard work have paid off!
                </span>
              }
              duration={0}
              onClose={() => setShowNotification(false)}
            />
          </div>
        </div>
      )}

      <div className="evaluation-content">
        <header className="evaluation-header">
          <div className="report-badge">Performance Report</div>
          <h1 className="page-title">Assessment <span>Overview</span></h1>
        </header>

        <div className="summary-cards">
          {/* Overall Score */}
          <div className={`summary-card score-card ${getCurrentScoreColor(currentScore)}`}>
            <div className="card-icon-wrapper">
              <Trophy className="card-icon" />
            </div>
            <div className="card-info score-info">
              <span className="card-stat-label">
                Overall Score
                <span className="info-tooltip" data-tooltip="Your overall score across all concepts, measured against the required passing threshold.">
                  <Info size={14} className="info-icon" />
                </span>
              </span>
              <span className={`card-main-stat ${getCurrentScoreColor(currentScore)}`}>{currentScore}%</span>
              <div className="score-bar-wrap">
                <div className="score-bar-bg">
                  <div
                    className={`score-bar-progress ${getCurrentScoreColor(currentScore)}`}
                    style={{ width: `${currentScore}%` }}
                  />
                </div>
              </div>
              <span className="card-subtitle">
                {currentScore >= masteryThreshold ? 'Mastery achieved' : `Target: ${masteryThreshold}%`}
              </span>
            </div>
          </div>

          {/* Completion Time */}
          <div className="summary-card time-card">
            <div className="card-icon-wrapper">
              <Clock className="card-icon" />
            </div>
            <div className="card-info">
              <span className="card-stat-label">
                Completion Time
                <span className="info-tooltip" data-tooltip="Total time spent across all attempts for this assessment.">
                  <Info size={14} className="info-icon" />
                </span>
              </span>
              <span className="card-main-stat">{timeTaken}</span>
              <span className="card-subtitle">Assessment duration</span>
            </div>
          </div>

          {/* Mastered Units */}
          <div className="summary-card mastered-card">
            <div className="card-icon-wrapper">
              <ShieldCheck className="card-icon" />
            </div>
            <div className="card-info">
              <span className="card-stat-label">
                Mastered Units
                <span className="info-tooltip" data-tooltip="Number of concepts where the mastery threshold has been achieved">
                  <Info size={14} className="info-icon" />
                </span>
              </span>
              <span className="card-main-stat">{masteredCount} / {conceptPerformance.length}</span>
              <span className="card-subtitle">Core competency reached</span>
            </div>
          </div>

          {/* Learn and Grow */}
          <div className="summary-card learn-card">
            <div className="card-icon-wrapper">
              <BookOpen className="card-icon" />
            </div>
            <div className="card-info">
              <span className="card-stat-label">
                Learn and Grow
                <span className="info-tooltip" data-tooltip="Concepts that did not meet the mastery threshold and need further review.">
                  <Info size={14} className="info-icon" />
                </span>
              </span>
              <span className="card-main-stat">{learnAndGrowCount}</span>
              <span className="card-subtitle">Concepts to revisit</span>
            </div>
          </div>
        </div>

        <section className="breakdown-section">
          <div className="section-header">
            <h2 className="section-title">Concept Level Breakdown</h2>
            {totalConceptCount > 4 && (
              <span className="concepts-count">{totalConceptCount} Micro Concepts</span>
            )}
          </div>
          <MicroConcepts
            attempts={attempts}
            conceptPerformance={conceptPerformance}
            buttonTexts={config.buttonTexts || {}}
            onConceptCountChange={setTotalConceptCount}
          />
        </section>
      </div>
    </div>
  );
};

export default Evaluation;
