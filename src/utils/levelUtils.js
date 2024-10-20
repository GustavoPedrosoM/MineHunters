// src/utils/levelUtils.js

export const getLevelKey = (level) => {
    if (level === 0.1) return 'easy';
    else if (level === 0.2) return 'medium';
    else if (level === 0.3) return 'hard';
    else return '';
  };
  