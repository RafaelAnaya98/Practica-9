import { useEffect, useRef, useCallback } from 'react';
import { Vibration } from 'react-native';
import { useFitnessStore } from '@/store/useStore';

export const useRestTimer = () => {
  const restTimerSeconds = useFitnessStore((state) => state.restTimerSeconds);
  const isRestTimerRunning = useFitnessStore((state) => state.isRestTimerRunning);
  const lastUsedRestTime = useFitnessStore((state) => state.lastUsedRestTime);
  
  // Acciones (stable)
  const setRestTimerSeconds = useFitnessStore((state) => state.setRestTimerSeconds);
  const toggleRestTimer = useFitnessStore((state) => state.toggleRestTimer);
  const setLastUsedRestTime = useFitnessStore((state) => state.setLastUsedRestTime);

  const targetEndTimeRef = useRef<number | null>(null);

  const startTimer = useCallback((seconds: number) => {
    setLastUsedRestTime(seconds);
    setRestTimerSeconds(seconds);
    targetEndTimeRef.current = Date.now() + seconds * 1000;
    if (!useFitnessStore.getState().isRestTimerRunning) {
      toggleRestTimer();
    }
  }, [setLastUsedRestTime, setRestTimerSeconds, toggleRestTimer]);

  const pauseTimer = useCallback(() => {
    if (useFitnessStore.getState().isRestTimerRunning) {
      toggleRestTimer();
    }
    targetEndTimeRef.current = null;
  }, [toggleRestTimer]);

  const resumeTimer = useCallback(() => {
    const currentSeconds = useFitnessStore.getState().restTimerSeconds;
    if (!useFitnessStore.getState().isRestTimerRunning && currentSeconds > 0) {
      targetEndTimeRef.current = Date.now() + currentSeconds * 1000;
      toggleRestTimer();
    }
  }, [toggleRestTimer]);

  const resetTimer = useCallback(() => {
    const lastUsed = useFitnessStore.getState().lastUsedRestTime;
    targetEndTimeRef.current = null;
    setRestTimerSeconds(lastUsed);
    if (useFitnessStore.getState().isRestTimerRunning) {
      toggleRestTimer();
    }
  }, [setRestTimerSeconds, toggleRestTimer]);

  const skipTimer = useCallback(() => {
    targetEndTimeRef.current = null;
    setRestTimerSeconds(0);
    if (useFitnessStore.getState().isRestTimerRunning) {
      toggleRestTimer();
    }
  }, [setRestTimerSeconds, toggleRestTimer]);

  const addTime = useCallback((seconds: number) => {
    const currentSeconds = useFitnessStore.getState().restTimerSeconds;
    const newRemaining = currentSeconds + seconds;
    setRestTimerSeconds(newRemaining);
    if (useFitnessStore.getState().isRestTimerRunning) {
      targetEndTimeRef.current = Date.now() + newRemaining * 1000;
    }
  }, [setRestTimerSeconds]);

  const handleToggle = useCallback(() => {
    if (useFitnessStore.getState().isRestTimerRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  }, [pauseTimer, resumeTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRestTimerRunning) {
      if (!targetEndTimeRef.current) {
        const currentSeconds = useFitnessStore.getState().restTimerSeconds;
        targetEndTimeRef.current = Date.now() + currentSeconds * 1000;
      }
      
      interval = setInterval(() => {
        if (targetEndTimeRef.current) {
          const remaining = Math.max(0, Math.ceil((targetEndTimeRef.current - Date.now()) / 1000));
          
          if (remaining !== useFitnessStore.getState().restTimerSeconds) {
            setRestTimerSeconds(remaining);
          }
          
          if (remaining <= 0) {
            Vibration.vibrate([500, 200, 500]); // Patrón de vibración de finalización
            toggleRestTimer();
            targetEndTimeRef.current = null;
            if (interval) clearInterval(interval);
          }
        }
      }, 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRestTimerRunning, setRestTimerSeconds, toggleRestTimer]);

  return {
    restTimerSeconds,
    isRestTimerRunning,
    lastUsedRestTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    skipTimer,
    addTime,
    toggleRestTimer: handleToggle
  };
};
