import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

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

export default function PostVideoScreen({ onStartGame, onReplayVideo }) {
  const navigate = useNavigate();

  const handleStartGame = () => {
    onStartGame();
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
            Ready to begin your adventure? 🚀
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

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Start Game button */}
          <motion.button
            className="btn-primary text-xl md:text-2xl px-10 md:px-16 py-5 md:py-6 animate-pulse-glow"
            onClick={handleStartGame}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 START ADVENTURE 🚀
          </motion.button>

          {/* Replay Video button */}
          <motion.button
            className="px-8 md:px-12 py-5 md:py-6 text-lg md:text-xl font-bold rounded-full bg-cosmic-purple/30 border-2 border-cosmic-purple text-white backdrop-blur-sm hover:bg-cosmic-purple/50 transition-all shadow-lg hover:shadow-cosmic-purple/50"
            onClick={onReplayVideo}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🎬 REPLAY VIDEO
          </motion.button>
        </div>

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

