import React, { useState, useEffect } from 'react';
import { Brain } from 'lucide-react';
import './Loader.css';

const Loader = ({ onComplete, initialProgress = 0, type = 'loading', title, subtitle, caption, finished, size = 'default' }) => {
  const [progress, setProgress] = useState(initialProgress);

  useEffect(() => {
    if (finished) {
      setProgress(100);
    }
  }, [finished]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const threshold = onComplete ? 100 : 98;
        if (prev >= threshold) {
          if (onComplete && prev >= 100) {
            clearInterval(interval);
            setTimeout(onComplete, 500);
            return 100;
          }
          return prev;
        }

        // Realistic easing progress
        let increment = 2;
        if (prev > 60) increment = 1;
        if (prev > 85) increment = 0.4;
        if (prev > 95) increment = 0.1;

        return Math.min(prev + increment, threshold);
      });
    }, 150);
    return () => clearInterval(interval);
  }, [onComplete]);

  const defaultTitle = type === 'analysis' ? "AI Analysis in Progress" : "Loading Assessment";
  const defaultSubtitle = type === 'analysis' ? "Analyzing complex patterns..." : "Preparing assessment environment...";
  const defaultCaption = type === 'analysis' ?
    "Almost there! We are fine-tuning your results based on course benchmarks." :
    "Please wait while we prepare your assessment.";

  // console.log("Loader is problem");

  return (
    <div className={`loader-container ${size === 'small' ? 'size-sm' : ''}`}>
      <div className="spinner-wrap">
        <div className="orbit orbit-1">
          <div className="dot dot-1" />
        </div>
        <div className="orbit orbit-2">
          <div className="dot dot-2" />
        </div>
        <div className="orbit orbit-3">
          <div className="dot dot-3" />
        </div>
        <div className="orbit-center">
          {type === 'analysis' ? (
            <Brain className="brain-icon" size={size === 'small' ? 24 : 32} />
          ) : (
            <div className="center-arc" />
          )}
        </div>
      </div>

      <h2 className="loader-title">{title || defaultTitle}</h2>
      <div className="progress-section">
        <p className="loader-subtitle">{subtitle || defaultSubtitle}</p>
        <div className="progress-outer">
          <div className="progress-inner" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <p className="loader-caption">{caption || defaultCaption}</p>
    </div>
  );
};

export default Loader;
