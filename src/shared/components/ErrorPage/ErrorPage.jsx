import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Modal from '../UI/Modal/Modal';
import './ErrorPage.css';

const ErrorPage = ({ 
  error = null,
  onRetry = null,
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again or contact support if the problem persists.",
  showRetry = true,
  useModal = false
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const parseError = (error) => {
    if (typeof error === 'string') {
      try {
        return JSON.parse(error);
      } catch {
        return null;
      }
    }
    return null;
  };

  const getErrorMessage = () => {
    if (error) {
      const parsed = parseError(error);
      
      if (parsed) {
        return parsed.title || parsed.message || 
               (parsed.errors ? Object.entries(parsed.errors).map(([k, v]) => `${k}: ${v}`).join(', ') : error);
      }
      
      return error.message || error.statusText || error.title || JSON.stringify(error);
    }
    return message;
  };

  const getErrorDetails = () => {
    if (error?.stack && import.meta.env.DEV) {
      return error.stack;
    }

    const parsed = parseError(error);
    if (parsed?.traceId || parsed?.errors || parsed?.type) {
      return JSON.stringify(parsed, null, 2);
    }

    if (error?.data) {
      return JSON.stringify(error.data, null, 2);
    }

    return null;
  };

  const ErrorContent = () => (
    <div className="error-content">
      <div className="error-icon-wrapper">
        <AlertTriangle className="error-icon" />
      </div>
      
      <h1 className="error-title">{title}</h1>
      <p className="error-message">{getErrorMessage()}</p>
      
      {getErrorDetails() && (
        <div className="error-details-container">
          <h3 className="details-header">Technical Details</h3>
          <pre className="error-stack">{getErrorDetails()}</pre>
        </div>
      )}
      
      {showRetry && (
        <div className="error-actions">
          <button 
            className="error-button error-button-primary"
            onClick={handleRetry}
          >
            <RefreshCw className="button-icon" />
            Try Again
          </button>
        </div>
      )}
    </div>
  );

  return useModal ? (
    <Modal isOpen={true} onClose={null} showClose={false} maxWidth="940px">
      <ErrorContent />
    </Modal>
  ) : (
    <div className="error-page">
      <div className="error-container">
        <ErrorContent />
      </div>
    </div>
  );
};

export default ErrorPage;
