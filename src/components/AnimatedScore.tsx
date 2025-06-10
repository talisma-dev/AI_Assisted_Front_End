import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedScoreProps {
  score: number;
  status: 'mastery' | 'remediation' | 'intervention';
  size?: number;
  showCelebration?: boolean;
}

const AnimatedScore: React.FC<AnimatedScoreProps> = ({ 
  score, 
  status, 
  size = 80,
  showCelebration = false 
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const getColorClass = () => {
    switch (status) {
      case 'mastery': return 'text-green-500';
      case 'remediation': return 'text-orange-500';
      case 'intervention': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStrokeColor = () => {
    switch (status) {
      case 'mastery': return '#10b981';
      case 'remediation': return '#f59e0b';
      case 'intervention': return '#ef4444';
      default: return '#6b7280';
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayScore(prev => {
          if (prev >= score) {
            clearInterval(interval);
            if (score > 80 && showCelebration) {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            }
            return score;
          }
          return prev + 1;
        });
      }, 20);
    }, 300);

    return () => clearTimeout(timer);
  }, [score, showCelebration]);

  const circumference = 2 * Math.PI * 35;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="relative">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 80 80"
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx="40"
            cy="40"
            r="35"
            stroke="currentColor"
            strokeWidth="6"
            fill="none"
            className="text-gray-200"
          />
          
          {/* Progress Circle */}
          <motion.circle
            cx="40"
            cy="40"
            r="35"
            stroke={getStrokeColor()}
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              strokeDasharray,
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.4))'
            }}
          />
        </svg>
        
        {/* Score Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              className={`text-sm font-bold ${getColorClass()}`}
              animate={{ scale: displayScore > 80 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayScore}%
            </motion.span>
          </motion.div>
        </div>
        
        {/* Celebration Animation */}
        {showConfetti && displayScore > 80 && (
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.5, 1], 
              rotate: [0, 180, 360],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2 }}
            className="absolute -top-2 -right-2 text-2xl"
          >
            🎉
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default AnimatedScore;
