import { useState, useEffect, useRef } from 'react';

/**
 * Creates a session timer hook for a specific app store implementation.
 * @param {{ recordSessionEnd: (seconds: number) => void }} deps
 */
export const createUseSessionTimer = (deps) => {
  const { recordSessionEnd } = deps;

  return function useSessionTimer(timeLimitMinutes, onTimeUp) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const timerRef = useRef(null);
    const startTimeRef = useRef(Date.now());

    useEffect(() => {
      const handleVisibilityChange = () => {
        setIsActive(document.visibilityState === 'visible');
      };

      const startTime = startTimeRef.current;
      document.addEventListener('visibilitychange', handleVisibilityChange);

      timerRef.current = setInterval(() => {
        if (document.visibilityState === 'visible') {
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);

      return () => {
        clearInterval(timerRef.current);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
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
};
