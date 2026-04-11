import React, { useEffect } from 'react';
import { Clock, BadgeCheck, Sparkles } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (type === 'ai-assistant') {
    return (
      <div className={`toast toast-${type}`}>
        <div className="ai-toast-header">
           <div className="ai-icon-container">
             <Sparkles className="toast-icon-ai" size={24} color="white" strokeWidth={1.8} />
           </div>
           <div className="ai-toast-title">
             <span className="ai-title-text">AI Learning Assistant</span>
             <span className="ai-toast-subtitle">Your personalized guide</span>
           </div>
           <button className="toast-close" onClick={onClose} aria-label="Close notification">×</button>
        </div>
        <div className="toast-message ai-toast-message">{message}</div>
      </div>
    );
  }

  const getIcon = () => {
    switch (type) {
      case 'time-up':
        return <Clock className="toast-icon" />;
      case 'success':
        return <BadgeCheck className="toast-icon" />;
      default:
        return <Clock className="toast-icon" />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      {getIcon()}
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Close notification">
        ×
      </button>
    </div>
  );
};

export default Toast;
