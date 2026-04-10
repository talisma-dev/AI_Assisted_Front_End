// Utility to manage assessment time tracking
export const getAssessmentTimeData = () => {
  const currentStudent = localStorage.getItem('student_id');
  const stored = localStorage.getItem('assessment-time-data');
  
  if (!stored) return { totalTime: 0, sessions: [], studentId: currentStudent };
  
  try {
    const data = JSON.parse(stored);
    // If the data belongs to a different student, start fresh
    if (data.studentId !== currentStudent) {
      return { totalTime: 0, sessions: [], studentId: currentStudent };
    }
    return data;
  } catch (e) {
    return { totalTime: 0, sessions: [], studentId: currentStudent };
  }
};

export const saveAssessmentSession = (duration, wasAutoSubmitted = false) => {
  const timeData = getAssessmentTimeData();
  const session = {
    duration,
    wasAutoSubmitted,
    timestamp: new Date().toISOString()
  };
  
  timeData.sessions.push(session);
  timeData.totalTime += duration;
  timeData.studentId = localStorage.getItem('student_id');
  
  localStorage.setItem('assessment-time-data', JSON.stringify(timeData));
  return timeData;
};

export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs.toString().padStart(2, '0')}s`;
};

export const getTotalTimeSpent = () => {
  const timeData = getAssessmentTimeData();
  return timeData.totalTime;
};

export const resetTimeData = () => {
  localStorage.removeItem('assessment-time-data');
};
