/**
 * Parent Settings Library for Science Sprouts
 * Manages PIN, locks, and session limits
 */

const STORAGE_KEY = 'science_sprouts_parent_settings';

const DEFAULT_SETTINGS = {
  pin: null, // 4-digit string
  sessionTimeLimit: 0, // 0 = off, else minutes
  stopAfterCurrentQuestion: true,
  locks: {
    theme: false,
    difficulty: false,
    gameMode: false
  },
  allowedThemes: ['garden', 'ocean', 'space'],
  allowedDifficulties: ['beginner', 'intermediate', 'advanced'],
  allowedModes: ['vocab', 'labs', 'facts']
};

export const loadParentSettings = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
  } catch (e) {
    console.error('Failed to load parent settings:', e);
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveParentSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save parent settings:', e);
  }
};

export const isThemeAllowed = (theme) => {
  const settings = loadParentSettings();
  return settings.allowedThemes.includes(theme);
};

export const isDifficultyAllowed = (difficulty) => {
  const settings = loadParentSettings();
  return settings.allowedDifficulties.includes(difficulty);
};

export const isModeAllowed = (mode) => {
  const settings = loadParentSettings();
  return settings.allowedModes.includes(mode);
};
