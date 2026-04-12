import React from 'react';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';
import Modal from '@shared/components/UI/Modal/Modal';
import './TimeExpiredModal.css';

const TimeExpiredModal = ({ isOpen, attemptedCount, totalQuestions, onConfirm }) => {
  const unansweredCount = totalQuestions - attemptedCount;

  return (
    <Modal isOpen={isOpen} showClose={false} maxWidth="940px">
      <div className="time-expired-modal">
        <div className="expired-icon-wrapper">
          <div className="pulse-circle"></div>
          <Clock className="expired-main-icon" />
        </div>

        <div className="expired-header">
          <h2>Assessment Time Expired</h2>
          <p>Your attempted answers have been automatically submitted</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card attempted">
            <div className="stat-icon-text">
              <CheckCircle2 className="stat-small-icon" />
              <span>ATTEMPTED</span>
            </div>
            <div className="stat-value">{attemptedCount}<span>/{totalQuestions}</span></div>
            <div className="stat-label">Questions</div>
          </div>

          <div className="stat-card unanswered">
            <div className="stat-icon-text">
              <XCircle className="stat-small-icon" />
              <span>UNANSWERED</span>
            </div>
            <div className="stat-value">{unansweredCount}</div>
            <div className="stat-label">Questions</div>
          </div>
        </div>

        <button className="view-report-btn" onClick={onConfirm}>
          View Assessment Report
        </button>
      </div>
    </Modal>
  );
};

export default TimeExpiredModal;
