/**
 * Creates a parent settings store for a Sprouts app.
 * @param {{storageKey: string, allowedModes: string[]}} config
 */
export const createParentSettingsStore = (config) => {
  const storageKey = config.storageKey;
  const allowedModes = Array.isArray(config.allowedModes) ? config.allowedModes : [];
  
  const DEFAULT_SETTINGS = {
    pin: null,
    sessionTimeLimit: 0,
    stopAfterCurrentQuestion: true,
    locks: {
      theme: false,
      difficulty: false,
      gameMode: false
    },
    allowedThemes: ['garden', 'ocean', 'space'],
    allowedDifficulties: ['beginner', 'intermediate', 'advanced'],
    allowedModes
  };

  const loadParentSettings = () => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch (e) {
      console.error('Failed to load parent settings:', e);
      return { ...DEFAULT_SETTINGS };
    }
  };

  const saveParentSettings = (settings) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save parent settings:', e);
    }
  };

  const isThemeAllowed = (theme) => loadParentSettings().allowedThemes.includes(theme);
  const isDifficultyAllowed = (difficulty) => loadParentSettings().allowedDifficulties.includes(difficulty);
  const isModeAllowed = (mode) => loadParentSettings().allowedModes.includes(mode);
  
  return {
    loadParentSettings,
    saveParentSettings,
    isThemeAllowed,
    isDifficultyAllowed,
    isModeAllowed
  };
};
