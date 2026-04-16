import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@shared/components/Header/Header';
import ToastContainer from '@shared/components/UI/Toast/ToastContainer';
import { useApp } from '@core/contexts/AppContext';
import { ROUTES } from '@core/constants/routes';

const MainLayout = ({ children, timeLeft, hasAssessmentQuestions, formatTime, toasts, removeToast }) => {
  const { config } = useApp();
  const location = useLocation();
  const isAssessmentRoute = location.pathname === ROUTES.ASSESSMENT;

  return (
    <div className="app">
      <Header
        showTimer={config.showTimer && hasAssessmentQuestions && isAssessmentRoute}
        timeLeft={timeLeft}
        totalTime={config.duration * 60}
        formatTime={formatTime}
        courseTitle={config.courseTitle}
        userName={config.userName}
        userRole={config.userRole}
      />
      <main className="layout-content">
        {children}
      </main>
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default MainLayout;
