import { motion } from 'framer-motion';

const milestones = [
  { step: 0, label: 'Deep Space', emoji: '🌌' },
  { step: 5, label: 'Nebula', emoji: '💫' },
  { step: 10, label: 'Asteroid Belt', emoji: '☄️' },
  { step: 15, label: 'Mars Orbit', emoji: '🔴' },
  { step: 20, label: 'Moon', emoji: '🌙' },
  { step: 23, label: 'Earth', emoji: '🌍' },
];

export default function ProgressBar({ currentStep, maxSteps = 23 }) {
  const progress = (currentStep / maxSteps) * 100;

  return (
    <div className="w-full glass-card-dark p-4">
      {/* Journey label */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-display font-semibold text-cosmic-100">
          🚀 Journey Progress
        </span>
        <span className="text-sm font-display font-semibold text-star-gold">
          {currentStep} / {maxSteps} steps
        </span>
      </div>

      {/* Progress track */}
      <div className="relative h-10 bg-cosmic-900/60 rounded-full overflow-hidden border-2 border-cosmic-500/40 shadow-inner">
        {/* Stars background */}
        <div className="absolute inset-0 stars-bg opacity-30" />
        
        {/* Progress fill */}
        <motion.div 
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-nebula-blue via-nebula-purple to-nebula-pink rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Animated glow */}
          <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-r from-transparent to-white/40 rounded-r-full" />
        </motion.div>

        {/* Hamster indicator */}
        <motion.div 
          className="absolute top-1/2 -translate-y-1/2 z-10"
          initial={{ left: '8px' }}
          animate={{ left: `calc(${Math.max(progress, 2)}% - 12px)` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.span 
            className="text-2xl filter drop-shadow-lg"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
          >
            🐹
          </motion.span>
        </motion.div>

        {/* Earth at the end */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-2xl">
          🌍
        </div>
      </div>

      {/* Milestones */}
      <div className="relative mt-3 px-6">
        <div className="flex justify-between items-start">
          {milestones.map((milestone) => {
            const isReached = currentStep >= milestone.step;
            
            return (
              <motion.div
                key={milestone.step}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: milestone.step * 0.05 }}
              >
                <motion.span 
                  className={`text-4xl transition-all duration-300 ${isReached ? 'opacity-100 scale-110' : 'opacity-40 scale-100'}`}
                  animate={isReached ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  {milestone.emoji}
                </motion.span>
                <span className={`font-display font-semibold whitespace-nowrap mt-2 transition-colors duration-300 ${isReached ? 'text-star-gold' : 'text-cosmic-400'}`}>
                  {milestone.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
