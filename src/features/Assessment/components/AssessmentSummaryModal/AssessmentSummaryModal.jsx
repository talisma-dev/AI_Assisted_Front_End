import React from 'react';
import { Clock, CheckCircle2, XCircle, Flag, AlertCircle } from 'lucide-react';
import Modal from '@shared/components/UI/Modal/Modal';
import './AssessmentSummaryModal.css';

const AssessmentSummaryModal = ({
  isOpen,
  type, // 'timeExpired' | 'submitConfirmation'
  attemptedCount,
  totalQuestions,
  markedForReviewCount,
  onReview,
  onSubmit,
  onConfirm
}) => {
  const unattemptedCount = totalQuestions - attemptedCount;

  const isTimeExpired = type === 'timeExpired';

  const getWarningMessage = () => {
    if (isTimeExpired) return null;
    const hasUnanswered = unattemptedCount > 0;
    const hasMarkedForReview = markedForReviewCount > 0;

    if (hasUnanswered && hasMarkedForReview) {
      return 'You have unanswered questions and items marked for review. Unanswered questions will be submitted as blank.';
    } else if (hasMarkedForReview) {
      return 'You have questions marked for review. Consider revisiting them before submitting';
    } else if (hasUnanswered) {
      return 'You have unanswered questions. These will be submitted as blank';
    }
    return null;
  };

  const warningMessage = getWarningMessage();

  return (
    <Modal isOpen={isOpen} showClose={false} maxWidth="940px">
      <div className="assessment-summary-modal">
        {isTimeExpired ? (
          <div className="expired-icon-wrapper">
            <div className="pulse-circle"></div>
            <Clock className="expired-main-icon" />
          </div>
        ) : null}

        <div className="summary-header">
          <h2>
            {isTimeExpired
              ? 'Assessment Time Expired'
              : 'Are you sure you want to submit your assessment?'}
          </h2>
          <p>
            {isTimeExpired
              ? 'Your attempted answers have been automatically submitted'
              : 'Please review your progress before final submission. This action cannot be undone.'}
          </p>
        </div>

        <div className="stats-container">
          <div className="stat-row">
            <div className="stat-label-row">
              <CheckCircle2 className="stat-icon attempted-icon" />
              <span>Attempted Questions</span>
            </div>
            <span className="stat-number">
              {attemptedCount}
              <span className="stat-total">/{totalQuestions}</span>
            </span>
          </div>

          <div className="stat-row">
            <div className="stat-label-row">
              <XCircle className="stat-icon unattempted-icon" />
              <span>Unattempted Questions</span>
            </div>
            <span className="stat-number">{unattemptedCount}</span>
          </div>

          <div className="stat-row">
            <div className="stat-label-row">
              <Flag className="stat-icon flagged-icon" fill="currentColor" />
              <span>Marked for Review</span>
            </div>
            <span className="stat-number">{markedForReviewCount}</span>
          </div>
        </div>

        {!isTimeExpired && warningMessage && (
          <div className="warning-banner">
            <AlertCircle className="warning-icon" />
            <p>{warningMessage}</p>
          </div>
        )}

        <div className={`summary-actions ${isTimeExpired ? 'single-button' : ''}`}>
          {!isTimeExpired && (
            <button className="btn-review" onClick={onReview}>
              Review Answers
            </button>
          )}
          <button
            className={isTimeExpired ? 'view-report-btn' : 'btn-confirm-submit'}
            onClick={isTimeExpired ? onConfirm : onSubmit}
          >
            {isTimeExpired ? 'View Assessment Analysis' : 'Submit Assessment'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssessmentSummaryModal;
