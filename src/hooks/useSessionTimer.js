import { useState, useEffect, useRef } from 'react';
import { recordSessionEnd } from '../lib/progress';

/**
 * Custom hook to track session duration and handle time limits
 */
export const useSessionTimer = (timeLimitMinutes, onTimeUp) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsActive(document.visibilityState === 'visible');
    };

    const startTime = startTimeRef.current; // capture start time for stable cleanup

    document.addEventListener('visibilitychange', handleVisibilityChange);

    timerRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        setElapsedSeconds(prev => prev + 1);
      }
    }, 1000);

    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Record time when hook unmounts using the captured start time
      const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
      recordSessionEnd(sessionDuration);
    };
  }, []);

  useEffect(() => {
    if (timeLimitMinutes > 0) {
      const limitSeconds = timeLimitMinutes * 60;
      if (elapsedSeconds >= limitSeconds) {
        onTimeUp();
      }
    }
  }, [elapsedSeconds, timeLimitMinutes, onTimeUp]);

  return {
    elapsedSeconds,
    isActive,
    resetTimer: () => setElapsedSeconds(0)
  };
};
