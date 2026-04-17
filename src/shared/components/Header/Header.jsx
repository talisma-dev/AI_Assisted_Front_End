import React from 'react';
import { GraduationCap, Clock, User, BarChart3, SquareKanban } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
// import ThemePicker from '../ThemePicker/ThemePicker';
import { truncateText, TRUNCATION_CONFIG } from '@core/utils/textUtils';
import './Header.css';

const Header = ({ showTimer, timeLeft, totalTime, formatTime,courseTitle,userName,userRole }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const getTimerState = () => {
    if (!showTimer || timeLeft === undefined || !totalTime) return { isBlinking: false, isCritical: false };
    
    const twentyFivePercent = totalTime * 0.25;
    const tenPercent = totalTime * 0.1;
    
    return {
      isBlinking: timeLeft <= twentyFivePercent,
      isCritical: timeLeft <= tenPercent && timeLeft > twentyFivePercent
    };
  };

  const { isBlinking, isCritical } = getTimerState();
  const showEvaluationButton = location.pathname === '/concepts';
  const showReportButton = location.pathname.startsWith('/learning/');
  const handleEvaluationClick = () => navigate('/evaluation');

  return (
    <header className="global-header">
      <div className="header-left">
        <div className="course-title">
          <GraduationCap className="graduation-cap" />
          <span className="course-title-text" title={courseTitle}>
            {truncateText(courseTitle, TRUNCATION_CONFIG.COURSE_NAME_MAX_LENGTH)}
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-actions">
          {showEvaluationButton && (
            <button
              className="evaluation-nav-btn"
              onClick={handleEvaluationClick}
              title="Go to Evaluation"
            >
              <BarChart3 className="evaluation-nav-icon" />
              <span>Evaluation</span>
            </button>
          )}

          {showTimer && timeLeft !== undefined && (
            <div className={`header-timer ${isBlinking ? 'blinking-critical' : isCritical ? 'critical' : ''}`}>
              <Clock className="timer-icon" />
              <span className="timer-label">Time Remaining:</span>
              <span className="timer-value">{formatTime(timeLeft)}</span>
            </div>
          )}

          {showReportButton && (
            <button
              className="report-nav-btn"
              onClick={handleEvaluationClick}
              title="View Assessment Analysis"
            >
              <SquareKanban className="report-nav-icon" />
            </button>
          )}
          {/* <ThemePicker /> */}

          <div className="user-profile-wrapper">
            <div className="user-text">
              <span className="user-name" title={userName}>{truncateText(userName, TRUNCATION_CONFIG.STUDENT_NAME_MAX_LENGTH)}</span>
              <span className="user-role">{userRole}</span>
            </div>
            <div className="user-avatar">
              <User className="user-avatar-icon" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
