import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { useGameTimer } from '../hooks/useGameTimer';
import { useAudio } from '../hooks/useAudio';
import { submitScore } from '../services/leaderboardService';
import HamsterPreview from '../components/HamsterPreview';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';
import Leaderboard from '../components/Leaderboard';
import StarField from '../components/StarField';
import AudioControl from '../components/AudioControl';
import questions from '../data/questions.json';

const MAX_STEPS = 23;

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function GamePage() {
  const navigate = useNavigate();
  const { 
    playerName, 
    hamsterConfig, 
    gameStats,
    incrementScore,
    incrementTotalQuestions,
    endGame,
    resetGame 
  } = useGame();
  const { formattedTime, elapsedMs } = useGameTimer();

  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [totalQuestionsAsked, setTotalQuestionsAsked] = useState(1);
  const [isHamsterMoving, setIsHamsterMoving] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  // Audio hooks - background music should loop
  const backgroundMusic = useAudio('/assets/audio/cosmic-gameplay-playful-twist.wav', true);
  const victorySound = useAudio('/assets/audio/mission-complete.wav', false);
  
  // Shuffle all questions on mount
  const selectedQuestions = useMemo(() => {
    return shuffleArray(questions);
  }, []);

  // Redirect if no player name
  useEffect(() => {
    if (!playerName) {
      navigate('/customize');
    }
  }, [playerName, navigate]);

  // Start background music when page loads with lower volume
  useEffect(() => {
    // Use refs to avoid dependency issues
    const music = backgroundMusic;
    music.setVolume(0.3); // Set volume to 30%
    
    // Delay play slightly to ensure audio context is initialized
    const playTimer = setTimeout(() => {
      music.play().catch(err => {
        console.warn('Background music play failed:', err);
      });
    }, 300);
    
    return () => {
      clearTimeout(playTimer);
      // Don't stop music on cleanup - let it continue playing
    };
  }, []); // Empty deps - only run on mount

  // Handle game completion
  const handleGameComplete = useCallback(async () => {
    endGame();
    
    // Calculate final time
    const finalTime = Date.now() - gameStats.startTime;
    
    // Submit score to leaderboard
    try {
      await submitScore({
        name: playerName,
        timeMs: finalTime,
        totalQuestions: gameStats.totalQuestions,
        correctAnswers: gameStats.score,
      });
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
    
    // Navigate to results
    navigate('/results');
  }, [endGame, gameStats.startTime, gameStats.totalQuestions, gameStats.score, playerName, navigate]);

  // Handle game completion when step reaches MAX_STEPS
  useEffect(() => {
    if (currentStep >= MAX_STEPS) {
      // Game complete!
      backgroundMusic.stop();
      victorySound.setVolume(0.4); // Set victory sound volume to 40%
      victorySound.play();
      setTimeout(handleGameComplete, 800);
    }
  }, [currentStep, backgroundMusic, victorySound, handleGameComplete]);

  const handleCorrectAnswer = useCallback(() => {
    incrementScore();
    incrementTotalQuestions();
    
    // Animate hamster
    setIsHamsterMoving(true);
    setTimeout(() => setIsHamsterMoving(false), 500);

    // Update step and question index together for smooth progression
    setCurrentStep((prevStep) => {
      const newStep = prevStep + 1;
      
      // Update question index only if not completing the game
      if (newStep < MAX_STEPS) {
        setCurrentQuestionIndex((prev) => prev + 1);
        setTotalQuestionsAsked((prev) => prev + 1);
      }
      
      return newStep;
    });
  }, [incrementScore, incrementTotalQuestions]);

  const handleWrongAnswer = useCallback(() => {
    incrementTotalQuestions();
    // Wrong answer feedback handled in QuizCard
    // No penalty, move to next question
    setCurrentQuestionIndex((prev) => prev + 1);
    setTotalQuestionsAsked((prev) => prev + 1);
  }, [incrementTotalQuestions]);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  if (!playerName || !currentQuestion) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-dark via-cosmic-purple to-cosmic-blue" />
      {/* Reduce star count on mobile for better performance */}
      <StarField count={typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60} />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-4 min-h-screen flex flex-col">
        {/* Top Bar: Progress + Timer */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => {
                  if (window.confirm('Are you sure you want to end the game? Your progress will be lost.')) {
                    resetGame();
                    navigate('/');
                  }
                }}
                className="px-4 py-2 bg-cosmic-700/60 hover:bg-cosmic-600/60 border border-cosmic-500/50 rounded-lg font-display text-sm text-white/90 hover:text-white transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ❌ End Game
              </motion.button>
              <AudioControl className="" inline={true} />
            </div>
            <span className="font-mono text-cosmic-star text-lg">
              ⏱️ {formattedTime}
            </span>
          </div>
          <ProgressBar currentStep={currentStep} maxSteps={MAX_STEPS} />
        </motion.div>

        {/* Main Game Area */}
        <div className="flex-1 grid lg:grid-cols-[1fr_2fr_1fr] gap-4 items-start">
          {/* Left: Hamster Cockpit */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-4 hidden lg:flex flex-col items-center"
          >
            <h3 className="font-display font-bold text-sm mb-3 text-white/70">
              Your Explorer
            </h3>
            
            {/* Player Name */}
            <div className="font-display font-bold text-white text-lg mb-3">
              🐹 {playerName}
            </div>
            
            {/* Cockpit frame */}
            <div className="relative">
              {/* Cockpit border */}
              <div className="absolute inset-0 rounded-full border-4 border-cosmic-accent/30 animate-pulse" />
              
              <motion.div
                animate={isHamsterMoving ? {
                  x: [0, 10, -5, 5, 0],
                  y: [0, -10, 0],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <HamsterPreview
                  config={hamsterConfig}
                  size="md"
                  animate={!isHamsterMoving}
                />
              </motion.div>
            </div>

            {/* Status */}
            <div className="mt-4 text-center">
              <div className="text-cosmic-star font-display text-2xl font-bold">
                {currentStep}/{MAX_STEPS}
              </div>
              <div className="text-white/50 text-sm">Steps to Earth</div>
            </div>

            {/* Encouragement messages */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center text-sm"
              >
                {currentStep === 0 && "🚀 Let's go!"}
                {currentStep > 0 && currentStep < 5 && "⭐ Great start!"}
                {currentStep >= 5 && currentStep < 10 && "🌟 You're doing amazing!"}
                {currentStep >= 10 && currentStep < 15 && "🔥 Halfway there!"}
                {currentStep >= 15 && currentStep < 20 && "💫 Almost home!"}
                {currentStep >= 20 && "🌍 Earth is near!"}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Center: Quiz Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col"
          >
            {/* Mobile hamster display */}
            <div className="lg:hidden mb-4 flex flex-col items-center">
              <div className="font-display font-bold text-white text-lg mb-3">
                🐹 {playerName}
              </div>
              <div className="flex items-center justify-center gap-4">
                <motion.div
                  animate={isHamsterMoving ? {
                    x: [0, 10, -5, 5, 0],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <HamsterPreview
                    config={hamsterConfig}
                    size="sm"
                    animate={!isHamsterMoving}
                  />
                </motion.div>
                <div className="text-center">
                  <div className="text-cosmic-star font-display text-3xl font-bold">
                    {currentStep}/{MAX_STEPS}
                  </div>
                  <div className="text-white/50 text-sm">to Earth</div>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <QuizCard
                key={currentQuestion.id}
                question={currentQuestion}
                questionNumber={totalQuestionsAsked}
                onCorrect={handleCorrectAnswer}
                onWrong={handleWrongAnswer}
              />
            </AnimatePresence>
          </motion.div>

          {/* Right: Leaderboard */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:block"
          >
            {/* Mobile toggle */}
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="lg:hidden w-full glass-card p-3 mb-2 text-center font-display"
            >
              🏆 {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
            </button>
            
            <div className={`${showLeaderboard ? 'block' : 'hidden'} lg:block`}>
              <Leaderboard />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Celebration overlay when completing */}
      <AnimatePresence>
        {currentStep >= MAX_STEPS && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-dark/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-8xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="font-display text-4xl font-bold text-cosmic-star">
                Mission Complete!
              </h2>
              <p className="text-white/70 mt-2">Preparing results...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

