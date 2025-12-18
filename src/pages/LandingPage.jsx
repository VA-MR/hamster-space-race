import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Floating star component
function Star({ delay, duration, size, left, top }) {
  return (
    <motion.div
      className="absolute rounded-full bg-white"
      style={{
        width: size,
        height: size,
        left: `${left}%`,
        top: `${top}%`,
      }}
      animate={{
        opacity: [0.2, 1, 0.2],
        scale: [1, 1.5, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// Generate random stars
const stars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  delay: Math.random() * 3,
  duration: 2 + Math.random() * 3,
  size: 1 + Math.random() * 3,
  left: Math.random() * 100,
  top: Math.random() * 100,
}));

export default function LandingPage({ onReplayVideo }) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/customize');
  };

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-space-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star) => (
          <Star key={star.id} {...star} />
        ))}
      </div>

      {/* Nebula gradient overlay */}
      <div className="absolute inset-0 bg-nebula-gradient opacity-50" />

      {/* Floating planets */}
      <motion.div
        className="absolute text-6xl md:text-8xl"
        style={{ top: '15%', right: '10%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        🪐
      </motion.div>
      
      <motion.div
        className="absolute text-4xl md:text-6xl"
        style={{ bottom: '20%', left: '8%' }}
        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🌙
      </motion.div>

      <motion.div
        className="absolute text-3xl md:text-5xl"
        style={{ top: '40%', left: '15%' }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        ⭐
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Title */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="text-6xl md:text-8xl mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            🐹
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-gradient text-shadow-glow mb-4">
            Hamster Space Race
          </h1>
          
          <motion.p
            className="text-lg md:text-xl text-cosmic-200 font-body max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Journey from Deep Space to Earth! 
            <br />
            Answer questions to help your hamster fly home! 🚀
          </motion.p>
        </motion.div>

        {/* Hamster preview */}
        <motion.div
          className="mb-12"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src="/assets/hamsters/gold.png" 
              alt="Space Hamster"
              className="w-48 h-48 md:w-64 md:h-64 object-cover object-top rounded-full border-4 border-star-gold/50 shadow-2xl shadow-star-gold/30"
            />
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-star-gold/30 to-transparent" />
          </motion.div>
        </motion.div>

        {/* Start button */}
        <motion.button
          className="btn-primary text-xl md:text-2xl px-10 md:px-16 py-5 md:py-6 animate-pulse-glow"
          onClick={handleStart}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🚀 START ADVENTURE 🚀
        </motion.button>

        {/* Replay Video Button */}
        {onReplayVideo && (
          <motion.button
            className="mt-4 px-8 py-3 bg-cosmic-700/50 border-2 border-cosmic-500/50 text-cosmic-100 rounded-xl font-bold hover:bg-cosmic-600/50 hover:border-cosmic-400/50 transition-all"
            onClick={onReplayVideo}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎬 Replay Intro Video
          </motion.button>
        )}

        {/* Subtitle */}
        <motion.p
          className="mt-6 text-cosmic-300 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          23 questions • Race against time • Have fun! ✨
        </motion.p>
      </div>

      {/* Bottom decorative rockets */}
      <motion.div
        className="absolute bottom-4 left-4 text-3xl opacity-50"
        animate={{ y: [0, -5, 0], rotate: [45, 50, 45] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        🚀
      </motion.div>
      
      <motion.div
        className="absolute bottom-4 right-4 text-3xl opacity-50"
        animate={{ y: [0, -5, 0], rotate: [-45, -50, -45] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        🚀
      </motion.div>
    </motion.div>
  );
}
