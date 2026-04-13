// Application Routes
export const ROUTES = {
  HOME: '/',
  SSO: '/sso',
  DIRECT: '/direct',
  LMS: '/lms',
  CONFIRMATION: '/confirmation',
  ASSESSMENT: '/assessment',
  EVALUATION: '/evaluation',
  CONCEPTS: '/concepts',
  LEARNING: '/learning/:conceptName'
};

// Default Application Configuration (fallbacks only)
export const DEFAULT_APP_CONFIG = {
  studentId: '',
  courseId: '',
  moduleId: '',
  courseTitle: '',
  userName: 'USER',
  userRole: '',
  showTimer: true,
  duration: 1,
  questionsCount: 0,
  masteryThreshold: '0',
  attempts: 0,
  themeColor: '#3b82f6',
  colors: {
    'text': '#6b6375',
    'text-h': '#08060d',
    'bg': '#f6f6f8',
    'border': '#e5e4e7',
    'code-bg': '#f4f3ec',
    'accent': '#aa3bff',
    'accent-bg': 'rgba(170, 59, 255, 0.1)',
    'accent-border': 'rgba(170, 59, 255, 0.5)',
    'social-bg': 'rgba(244, 243, 236, 0.5)',
    'shadow': 'rgba(0, 0, 0, 0.1) 0 10px 15px -3px, rgba(0, 0, 0, 0.05) 0 4px 6px -2px'
  }
};
