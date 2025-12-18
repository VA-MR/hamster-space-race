import { useState, useEffect, useCallback } from 'react';
import { useGame } from '../context/GameContext';

export function useGameTimer() {
  const { gameStats } = useGame();
  const { startTime, endTime } = gameStats;
  
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    // If game hasn't started, reset elapsed time
    if (!startTime) {
      setElapsedMs(0);
      return;
    }

    // If game has ended, calculate final time
    if (endTime) {
      setElapsedMs(endTime - startTime);
      return;
    }

    // Game is in progress - update every 100ms for smooth display
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const formatTime = useCallback((ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    elapsedMs,
    formattedTime: formatTime(elapsedMs),
    isRunning: startTime && !endTime,
  };
}

export default useGameTimer;
