/**
 * Progress Tracking Library for Science Sprouts
 * Persists user performance stats to LocalStorage
 */

const STORAGE_KEY = 'science_sprouts_progress';

const DEFAULT_PROGRESS = {
  totalQuestionsAnswered: 0,
  totalCorrectAnswers: 0,
  streakBest: 0,
  currentStreak: 0,
  sessionsCount: 0,
  totalPlayTimeSeconds: 0,
  lastPlayedAt: null,
  perDifficultyStats: {
    beginner: { answered: 0, correct: 0 },
    intermediate: { answered: 0, correct: 0 },
    advanced: { answered: 0, correct: 0 }
  },
  perModeStats: {
    phonics: { answered: 0, correct: 0 },
    sight: { answered: 0, correct: 0 },
    story: { answered: 0, correct: 0 }
  }
};

export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : { ...DEFAULT_PROGRESS };
  } catch (e) {
    console.error('Failed to load progress:', e);
    return { ...DEFAULT_PROGRESS };
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
};

/**
 * Updates stats for an answer
 * @param {Object} params { correct: boolean, difficulty: string, mode: string }
 */
export const recordAnswer = ({ correct, difficulty, mode }) => {
  const progress = loadProgress();
  
  progress.totalQuestionsAnswered += 1;
  if (correct) {
    progress.totalCorrectAnswers += 1;
    progress.currentStreak += 1;
    if (progress.currentStreak > progress.streakBest) {
      progress.streakBest = progress.currentStreak;
    }
  } else {
    progress.currentStreak = 0;
  }

  // Per Difficulty
  if (progress.perDifficultyStats[difficulty]) {
    progress.perDifficultyStats[difficulty].answered += 1;
    if (correct) progress.perDifficultyStats[difficulty].correct += 1;
  }

  // Per Mode
  if (progress.perModeStats[mode]) {
    progress.perModeStats[mode].answered += 1;
    if (correct) progress.perModeStats[mode].correct += 1;
  }

  progress.lastPlayedAt = Date.now();
  saveProgress(progress);
  return progress;
};

export const recordSessionStart = () => {
  const progress = loadProgress();
  progress.sessionsCount += 1;
  progress.lastPlayedAt = Date.now();
  saveProgress(progress);
  return progress;
};

export const recordSessionEnd = (durationSeconds) => {
  const progress = loadProgress();
  progress.totalPlayTimeSeconds += (durationSeconds || 0);
  saveProgress(progress);
  return progress;
};
