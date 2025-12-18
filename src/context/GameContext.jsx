import { createContext, useContext, useState, useCallback } from 'react';

const GameContext = createContext(null);

const initialState = {
  playerName: '',
  hamsterConfig: {
    color: null,
    accessory: null,
  },
  gameStats: {
    score: 0,
    totalQuestions: 0,
    startTime: null,
    endTime: null,
  },
};

export function GameProvider({ children }) {
  const [playerName, setPlayerNameState] = useState(initialState.playerName);
  const [hamsterConfig, setHamsterConfigState] = useState(initialState.hamsterConfig);
  const [gameStats, setGameStats] = useState(initialState.gameStats);

  const setPlayerName = useCallback((name) => {
    setPlayerNameState(name);
  }, []);

  const setHamsterConfig = useCallback((config) => {
    setHamsterConfigState((prev) => ({
      ...prev,
      ...config,
    }));
  }, []);

  const startGame = useCallback(() => {
    setGameStats({
      score: 0,
      totalQuestions: 0,
      startTime: Date.now(),
      endTime: null,
    });
  }, []);

  const incrementScore = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      score: prev.score + 1,
    }));
  }, []);

  const incrementTotalQuestions = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      totalQuestions: prev.totalQuestions + 1,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      endTime: Date.now(),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setPlayerNameState(initialState.playerName);
    setHamsterConfigState(initialState.hamsterConfig);
    setGameStats(initialState.gameStats);
  }, []);

  const value = {
    playerName,
    hamsterConfig,
    gameStats,
    setPlayerName,
    setHamsterConfig,
    startGame,
    incrementScore,
    incrementTotalQuestions,
    endGame,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
