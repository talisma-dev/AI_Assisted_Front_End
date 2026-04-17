
export const TRUNCATION_CONFIG = {
  COURSE_NAME_MAX_LENGTH: 45,
  STUDENT_NAME_MAX_LENGTH: 20,
  MICROCONCEPT_NAME_MAX_LENGTH: 24
};

/**
 * @param {string} text 
 * @param {number} maxLength 
 * @returns {string} 
 */
export const truncateText = (text, maxLength) => {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};
