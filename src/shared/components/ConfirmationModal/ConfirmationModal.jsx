import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import Modal from '../UI/Modal/Modal';
import './ConfirmationModal.css';

const ConfirmationModal = ({ onConfirm, isOpen, showTimer, duration, masteryThreshold, attempts, overview }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isBeforeYouBeginExpanded, setIsBeforeYouBeginExpanded] = useState(true);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  const handleConfirm = () => {
    if (isChecked && onConfirm) {
      onConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={null} showClose={false} maxWidth="940px">
      <div className="confirmation-container">
        {/* Before You Begin - Expandable Section */}
        <div className="confirmation-section">
          <div className="section-toggle static">
            <span className="section-title">Before You Begin</span>
          </div>

          <ul className="confirmation-list">
            <li className="confirmation-item">
              This Assessment evaluates your understanding of all <strong>Learning Objectives</strong> in this Unit.
            </li>

            {showTimer ? (
              <>
                <li className="confirmation-item">
                  Complete the assessment within <strong>{duration} minutes</strong>.
                </li>
                <li className="confirmation-item">
                  A score of <strong>{masteryThreshold}% or higher</strong> is required to achieve Mastery.
                </li>
                <li className="confirmation-item">
                  The timer will start once you click <strong>"Agree & Start Assessment"</strong>.
                </li>
                <li className="confirmation-item">
                  The quiz will be <strong>automatically submitted when the timer expires</strong>.
                </li>
                <li className="confirmation-item">
                  You will be having <strong>{attempts} Attempts</strong>.
                </li>
              </>
            ) : (
              <>
                <li className="confirmation-item">
                  There is no time limit for completing the quiz, however your session will expire after a period of <strong>inactivity</strong>.
                </li>
                <li className="confirmation-item">
                  A score of <strong>{masteryThreshold}% or higher</strong> is required to achieve Mastery.
                </li>
                <li className="confirmation-item">
                  You will be having <strong>{attempts} Attempts</strong>.
                </li>
                <li className="confirmation-item">
                  If the quiz is not submitted before the session expires, <strong>your answers will be lost.</strong>
                </li>
              </>
            )}

            <li className="confirmation-item">
              Please do not <strong>close or refresh</strong> the page while the assessment is loading.
            </li>
          </ul>
        </div>

        {/* Assessment Overview - Expandable Section (only show if overview data provided) */}
        {overview?.concepts?.length > 0 && (
          <div className="confirmation-section">
            <button
              className="section-toggle"
              onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
            >
              <span className="section-title">Assessment Overview</span>
              {isOverviewExpanded ? (
                <ChevronUp className="section-toggle-icon" />
              ) : (
                <ChevronDown className="section-toggle-icon" />
              )}
            </button>

            {isOverviewExpanded && (
              <div className="overview-content">
                <p className="overview-description">You will be assessed over the following <strong>{overview.concepts.length} concepts</strong>:</p>
                <div className="concepts-outer-box">
                  <div className="concepts-grid">
                    {overview.concepts.map((concept) => (
                      <div key={concept.id} className="concept-card">
                        <div className="concept-icon-wrapper">
                          <BookOpen className="concept-icon" />
                        </div>
                        <span className="concept-name">{concept.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div
          className={`acknowledgement-box ${isChecked ? 'checked' : ''}`}
          onClick={() => setIsChecked(!isChecked)}
        >
          <div className="custom-checkbox">
            <Check className="checkbox-check" />
          </div>
          <span className="acknowledgement-text">
            I have read and understood the assessment information above
          </span>
        </div>

        <div className="confirmation-footer">
          <button
            className="btn-agree"
            disabled={!isChecked}
            onClick={handleConfirm}
          >
            Agree & Start Assessment
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
