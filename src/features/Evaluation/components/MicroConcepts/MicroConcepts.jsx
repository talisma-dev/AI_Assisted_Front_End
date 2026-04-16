import React, { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { BadgeCheck, ArrowRight, Info, X, RotateCcw, Clock, CheckCircle2, OctagonX } from 'lucide-react';
import { truncateText, TRUNCATION_CONFIG } from '@core/utils/textUtils';
import './MicroConcepts.css';

const MicroConcepts = ({ attempts, conceptPerformance = [], buttonTexts = {}, onConceptCountChange }) => {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);
  const buttonRefs = useRef({});

  const handleContinueLearning = (concept) => {
    navigate(`/learning/${encodeURIComponent(concept.name)}`, {
      state: { triggerContentLoad: true }
    });
  };

  const concepts = conceptPerformance.map(concept => {
    const hasAttemptsLeft = concept.currentAttempts < attempts;
    let finalStatus = concept.status;
    if (!hasAttemptsLeft && concept.status !== 'Mastered') {
      finalStatus = 'max-limit';
    }
    return {
      ...concept,
      attempts: `${concept.currentAttempts}/${attempts}`,
      totalAttempts: concept.currentAttempts,
      status: finalStatus
    };
  });

  useEffect(() => {
    onConceptCountChange?.(concepts.length);
  }, [concepts.length, onConceptCountChange]);

  const getCircleColor = (status) => {
    if (status === 'Mastered') return 'green';
    if (status === 'Remediation') return 'amber';
    if (status === 'Need Intervention') return 'red';
    return 'red';
  };

  const getStatusConfig = (status) => {
    const configs = {
      Mastered: {
        text: buttonTexts.mastered || 'Mastered',
        class: 'btn-mastered',
        icon: <BadgeCheck className="btn-icon" />
      },
      Remediation: {
        text: buttonTexts.continueLearning || 'Continue Learning',
        class: 'btn-card-continue',
        icon: <ArrowRight className="btn-icon" />
      },
      'Need Intervention': {
        text: buttonTexts.continueLearning || 'Continue Learning',
        class: 'btn-card-continue',
        icon: <ArrowRight className="btn-icon" />
      },
      'max-limit': {
        text: buttonTexts.maxLimit || 'Max limit reached',
        class: 'btn-max-limit',
        icon: null
      }
    };

    return configs[status] || {
      text: buttonTexts.continueLearning || 'Continue Learning',
      class: 'btn-card-continue',
      icon: null
    };
  };

  const calculateStrokeDasharray = (score) => {
    const radius = 42;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    return {
      circumference,
      offset
    };
  };

  const hasMoreThanFour = concepts.length > 4;

  return (
    <div className={`concepts-grid ${hasMoreThanFour ? '' : 'concepts-grid-no-scroll'}`}>
      {concepts.map((concept) => {
        const circleColor = getCircleColor(concept.status);
        const strokeProps = calculateStrokeDasharray(concept.score);
        const statusConfig = getStatusConfig(concept.status);

        return (
          <div key={concept.id} className="concept-card">
            <div className="concept-info-wrapper">
              <button
                className="concept-info-btn"
                ref={(el) => { buttonRefs.current[concept.id] = el; }}
                onMouseEnter={() => {
                  const btn = buttonRefs.current[concept.id];
                  if (btn) {
                    const rect = btn.getBoundingClientRect();
                    const rowCount = (concept.attemptsDetails || []).length || 1;
                    const popupHeight = 110 + (rowCount * 25);
                    setPopupPosition({
                      top: rect.top + window.scrollY - popupHeight - 15,
                      left: rect.left + window.scrollX - 120
                    });
                  }
                  setActivePopup(concept.id);
                }}
                onMouseLeave={() => setActivePopup(null)}
                aria-label="View details"
              >
                <Info className="concept-info-icon" />
              </button>
              {activePopup === concept.id && createPortal(
                <div
                  className="concept-info-popup"
                  ref={popupRef}
                  style={{ top: popupPosition.top, left: popupPosition.left }}
                  onMouseEnter={() => setActivePopup(concept.id)}
                  onMouseLeave={() => setActivePopup(null)}
                >
                  <div className="concept-popup-content">
                    <h4 className="popup-title"> Assessment Attempt History</h4>
                    <table className="popup-data-table">
                      <thead>
                        <tr className="popup-header-row">
                          <th className="popup-header-text">Attempts</th>
                          <th className="popup-header-text">Time</th>
                          <th className="popup-header-text">Answered</th>
                          <th className="popup-header-text">Unanswered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...(concept.attemptsDetails || [])].sort((a, b) => b.attemptCount - a.attemptCount).map((attempt, idx) => (
                          <tr key={idx} className="popup-data-row">
                            <td className="popup-attempt-num">{attempt.attemptCount}</td>
                            <td>{attempt.completionTimeTaken || 0}s</td>
                            <td>{attempt.answered || 0}</td>
                            <td>{attempt.unanswered || 0}</td>
                          </tr>
                        ))}
                        {(concept.attemptsDetails || []).length === 0 && (
                          <tr className="popup-data-row">
                            <td colSpan="4" className="popup-no-data">No attempt details</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>,
                document.body
              )}
            </div>
            <div className="concept-card-top">
              <div className="concept-circle-wrapper">
                <svg viewBox="0 0 96 96" className="concept-circle-svg">
                  <circle cx="48" cy="48" r="42" fill="none" />
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    fill="none"
                    className={circleColor}
                    strokeDasharray={strokeProps.circumference}
                    strokeDashoffset={strokeProps.offset}
                  />
                </svg>
                <div className={`concept-circle-text ${circleColor}-text`}>
                  {concept.score}%
                </div>
              </div>
              <h3 className="concept-name" title={concept.name}>{truncateText(concept.name, TRUNCATION_CONFIG.MICROCONCEPT_NAME_MAX_LENGTH)}</h3>
            </div>

            <div className="concept-card-body">
              <div className="concept-stats-bar">
                <div className="concept-stat-item">
                  <span className="stat-value">{concept.currentAttempts}/{attempts}</span>
                  <span className="stat-label">ATTEMPTS</span>
                </div>
                <div className="concept-stat-divider"></div>
                <div className="concept-stat-item">
                  <span className="stat-value">{(concept.attemptsDetails?.[0]?.completionTimeTaken || 0)}s</span>
                  <span className="stat-label">TIME</span>
                </div>
                <div className="concept-stat-divider"></div>
                <div className="concept-stat-item">
                  <span className="stat-value">{(concept.attemptsDetails?.[0]?.answered || 0)}</span>
                  <span className="stat-label">ANSWERED</span>
                </div>
                <div className="concept-stat-divider"></div>
                <div className="concept-stat-item">
                  <span className="stat-value">{(concept.attemptsDetails?.[0]?.unanswered || 0)}</span>
                  <span className="stat-label">UNANSWERED</span>
                </div>
              </div>
              <p className="concept-desc">{concept.description}</p>
            </div>

            <button
              className={`btn ${statusConfig.class}`}
              onClick={() => (concept.status === 'Remediation' || concept.status === 'Need Intervention') && handleContinueLearning(concept)}
              disabled={concept.status === 'Mastered' || concept.status === 'max-limit'}
            >
              {statusConfig.icon}
              <span>{statusConfig.text}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default MicroConcepts;
