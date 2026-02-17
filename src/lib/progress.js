import { createProgressStore } from 'sprouts-engine';

const progressStore = createProgressStore({
  storageKey: 'science_sprouts_progress',
  modes: ['vocab', 'labs', 'facts']
});

export const { loadProgress, saveProgress, recordAnswer, recordSessionStart, recordSessionEnd } = progressStore;
