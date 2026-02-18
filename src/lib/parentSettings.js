import { createParentSettingsStore } from '../sprouts-engine';

const parentSettingsStore = createParentSettingsStore({
  storageKey: 'science_sprouts_parent_settings',
  allowedModes: ['vocab', 'labs', 'facts']
});

export const {
  loadParentSettings,
  saveParentSettings,
  isThemeAllowed,
  isDifficultyAllowed,
  isModeAllowed
} = parentSettingsStore;
