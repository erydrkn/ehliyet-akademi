import { useEffect, useRef, useState } from 'react';

export type UseTimerResult = {
  secondsLeft: number;
  formattedTime: string;
  isLowTime: boolean;
  isCriticalTime: boolean;
  pause: () => void;
  resume: () => void;
};

export function useTimer(
  durationSeconds: number,
  onTimeout: () => void,
): UseTimerResult {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutCalled = useRef(false);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  useEffect(() => {
    if (isPaused || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!timeoutCalled.current) {
            timeoutCalled.current = true;
            onTimeoutRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  return {
    secondsLeft,
    formattedTime,
    isLowTime: secondsLeft < 300 && secondsLeft > 30,
    isCriticalTime: secondsLeft <= 30 && secondsLeft > 0,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
  };
}
