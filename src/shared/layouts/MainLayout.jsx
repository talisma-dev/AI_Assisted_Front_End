import React from 'react';
import Header from '@shared/components/Header/Header';
import ToastContainer from '@shared/components/UI/Toast/ToastContainer';
import { useApp } from '@core/contexts/AppContext';

const MainLayout = ({ children, timeLeft, hasAssessmentQuestions, formatTime, toasts, removeToast }) => {
  const { config } = useApp();

  return (
    <div className="app">
      <Header
        showTimer={config.showTimer && hasAssessmentQuestions}
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
