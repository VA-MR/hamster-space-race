import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Component to prompt user to enable audio on mobile devices
 * iOS and many mobile browsers require user interaction to play audio
 */
export default function AudioInitPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if we're on mobile and haven't prompted yet
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hasPrompted = sessionStorage.getItem('audio-init-prompted');
    
    if (isMobile && !hasPrompted) {
      // Show prompt after a short delay
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleEnableAudio = () => {
    // Initialize audio context on user gesture
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        ctx.resume();
      }
    } catch (e) {
      console.warn('Audio context init failed:', e);
    }
    
    // Mark as prompted
    sessionStorage.setItem('audio-init-prompted', 'true');
    setShowPrompt(false);
  };

  const handleSkip = () => {
    sessionStorage.setItem('audio-init-prompted', 'true');
    sessionStorage.setItem('hamster-audio-muted', 'true');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card p-6 md:p-8 max-w-md w-full text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔊
            </motion.div>
            
            <h2 className="font-display text-2xl font-bold text-white mb-3">
              Enable Sound?
            </h2>
            
            <p className="text-cosmic-200 mb-6 font-body">
              Enjoy the full space adventure with music and sound effects!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <motion.button
                onClick={handleEnableAudio}
                className="btn-primary px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🎵 Enable Sound
              </motion.button>
              
              <motion.button
                onClick={handleSkip}
                className="btn-secondary px-6 py-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔇 Play Silent
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


