import React, { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import './MicroConcepts.css';

const MicroConcepts = ({ attempts, conceptPerformance = [], buttonTexts = {}, onConceptCountChange }) => {
  const navigate = useNavigate();

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
        icon: <Check className="btn-icon" />
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
              <div className="attempts-badge">
                <span className="attempts-label">ATTEMPTS</span>
                <span className="attempts-count">{concept.currentAttempts}/{attempts}</span>
              </div>
            </div>

            <div className="concept-card-body">
              <h3 className="concept-name">{concept.name}</h3>
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
