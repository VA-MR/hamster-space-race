import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Fisher-Yates shuffle
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizCard({ question, questionNumber, onCorrect, onWrong }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const timersRef = useRef({ primary: null, fallback: null });
  const didAdvanceRef = useRef(false);
  const pendingCorrectRef = useRef(null);

  const clearTimers = useCallback(() => {
    const { primary, fallback } = timersRef.current;
    if (primary) clearTimeout(primary);
    if (fallback) clearTimeout(fallback);
    timersRef.current.primary = null;
    timersRef.current.fallback = null;
  }, []);

  const advanceNow = useCallback(() => {
    if (didAdvanceRef.current) return;
    didAdvanceRef.current = true;
    clearTimers();

    const correct = pendingCorrectRef.current === true;
    const fn = correct ? onCorrect : onWrong;

    if (typeof fn !== 'function') {
      // If callbacks are missing for any reason, don't strand the UI in a locked state.
      console.error('QuizCard: missing advance callback', { correct });
      setIsLocked(false);
      return;
    }

    try {
      fn();
    } catch (e) {
      console.error('QuizCard: advance callback threw', e);
      setIsLocked(false);
    }
  }, [clearTimers, onCorrect, onWrong]);

  // Reset local state whenever the question changes (also guarantees we don't carry a locked state forward).
  useEffect(() => {
    clearTimers();
    didAdvanceRef.current = false;
    pendingCorrectRef.current = null;
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsLocked(false);
    
    // Shuffle answer options for the new question
    if (question?.options) {
      setShuffledOptions(shuffleArray(question.options));
    }
  }, [question?.id, clearTimers]);

  // Cleanup on unmount
  useEffect(() => clearTimers, [clearTimers]);

  const handleAnswer = (answer) => {
    if (isLocked) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setIsLocked(true);
    pendingCorrectRef.current = correct;
    didAdvanceRef.current = false;
    
    // Small delay before moving to next question (keeps the feedback visible).
    // In production on some devices/browsers, timer callbacks can be flaky; add a
    // secondary fallback so we never strand the player on a locked question.
    clearTimers();
    timersRef.current.primary = setTimeout(advanceNow, 800);
    timersRef.current.fallback = setTimeout(advanceNow, 1800);
  };

  const getButtonClasses = (option) => {
    const baseClasses = "w-full p-4 rounded-xl font-display text-lg transition-all duration-200 border-2 text-left";
    
    if (selectedAnswer === option) {
      if (isCorrect) {
        return `${baseClasses} bg-correct/20 border-correct text-correct shadow-lg shadow-correct/20`;
      } else {
        return `${baseClasses} bg-wrong/20 border-wrong text-wrong animate-shake`;
      }
    }
    
    if (isLocked) {
      return `${baseClasses} bg-cosmic-700/30 border-cosmic-600/30 text-cosmic-400 cursor-not-allowed`;
    }
    
    return `${baseClasses} bg-cosmic-700/50 border-cosmic-500/50 text-white hover:bg-cosmic-600/50 hover:border-cosmic-400 hover:scale-[1.02] cursor-pointer`;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        className="glass-card p-6 md:p-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Question Number Badge */}
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-nebula-purple/30 rounded-full text-sm font-display text-nebula-pink">
            {questionNumber}
          </span>
          {isCorrect && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl"
            >
              ✨
            </motion.span>
          )}
        </div>

        {/* Question Text */}
        <h2 className="text-xl md:text-2xl font-display font-bold text-white mb-6 leading-relaxed">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="grid gap-3">
          {shuffledOptions.map((option, index) => (
            <motion.button
              key={`${question.id}-${option}`}
              className={getButtonClasses(option)}
              onClick={() => handleAnswer(option)}
              disabled={isLocked}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-cosmic-600/50 flex items-center justify-center text-sm font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                {selectedAnswer === option && isCorrect && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-correct"
                  >
                    ✓
                  </motion.span>
                )}
                {selectedAnswer === option && isCorrect === false && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-wrong"
                  >
                    ✗
                  </motion.span>
                )}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {isCorrect === false && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-wrong font-display"
            >
              Wrong! Next question... 🤔
            </motion.p>
          )}
          {isCorrect === true && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-center text-correct font-display text-lg"
            >
              Amazing! Keep going! 🎉
            </motion.p>
          )}
        </AnimatePresence>

        {/* Manual fallback control (covers cases where the timer callback fails) */}
        {isLocked && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={advanceNow}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 font-display text-white/90 hover:text-white transition-all"
            >
              Next question →
            </button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
