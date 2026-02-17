import { createUseSessionTimer } from 'sprouts-engine';
import { recordSessionEnd } from '../lib/progress';

export const useSessionTimer = createUseSessionTimer({ recordSessionEnd });
