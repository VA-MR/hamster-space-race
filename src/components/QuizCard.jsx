import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizCard({ question, questionNumber, onCorrect, onWrong }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isLocked, setIsLocked] = useState(false);

  const handleAnswer = (answer) => {
    if (isLocked) return;
    
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    setIsLocked(true);
    
    if (correct) {
      // Small delay before moving to next question
      setTimeout(() => {
        onCorrect();
        resetState();
      }, 800);
    } else {
      // Wrong answer - move to different question after feedback
      setTimeout(() => {
        onWrong();
        resetState();
      }, 800);
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    setIsLocked(false);
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
        transition={{ duration: 0.3 }}
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
          {question.options.map((option, index) => (
            <motion.button
              key={`${question.id}-${index}`}
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
      </motion.div>
    </AnimatePresence>
  );
}
