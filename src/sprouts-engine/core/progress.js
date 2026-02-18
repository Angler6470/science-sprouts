/**
 * Creates a progress store for a Sprouts app.
 * @param {{storageKey: string, modes: string[]}} config
 */
export const createProgressStore = (config) => {
  const storageKey = config.storageKey;
  const modes = Array.isArray(config.modes) ? config.modes : [];

  const perModeStats = {};
  for (let i = 0; i < modes.length; i += 1) {
    perModeStats[modes[i]] = { answered: 0, correct: 0 };
  }

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
    perModeStats
  };

  const loadProgress = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...DEFAULT_PROGRESS, ...JSON.parse(saved) } : { ...DEFAULT_PROGRESS };
    } catch (e) {
      console.error('Failed to load progress:', e);
      return { ...DEFAULT_PROGRESS };
    }
  };

  const saveProgress = (progress) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  const recordAnswer = ({ correct, difficulty, mode }) => {
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

    if (progress.perDifficultyStats[difficulty]) {
      progress.perDifficultyStats[difficulty].answered += 1;
      if (correct) progress.perDifficultyStats[difficulty].correct += 1;
    }

    if (progress.perModeStats[mode]) {
      progress.perModeStats[mode].answered += 1;
      if (correct) progress.perModeStats[mode].correct += 1;
    }

    progress.lastPlayedAt = Date.now();
    saveProgress(progress);
    return progress;
  };

  const recordSessionStart = () => {
    const progress = loadProgress();
    progress.sessionsCount += 1;
    progress.lastPlayedAt = Date.now();
    saveProgress(progress);
    return progress;
  };

  const recordSessionEnd = (durationSeconds) => {
    const progress = loadProgress();
    progress.totalPlayTimeSeconds += (durationSeconds || 0);
    saveProgress(progress);
    return progress;
  };

  return {
    loadProgress,
    saveProgress,
    recordAnswer,
    recordSessionStart,
    recordSessionEnd
  };
};
