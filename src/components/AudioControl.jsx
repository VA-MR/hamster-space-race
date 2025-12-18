import { motion, AnimatePresence } from 'framer-motion';
import { useAudioMute } from '../hooks/useAudio';

export default function AudioControl({ className = "fixed top-4 right-4 z-50", inline = false }) {
  const { isMuted, toggleMute } = useAudioMute();

  return (
    <motion.button
      onClick={toggleMute}
      className={`${className} glass-card p-3 hover:bg-white/20 transition-all group ${inline ? '' : 'z-50'}`}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
      title={isMuted ? 'Unmute audio' : 'Mute audio'}
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.span
              key="muted"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="text-2xl"
            >
              🔇
            </motion.span>
          ) : (
            <motion.span
              key="unmuted"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.2 }}
              className="text-2xl"
            >
              🔊
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Tooltip on hover */}
      <motion.div
        className={`absolute top-full mt-2 px-3 py-1 bg-cosmic-dark/90 rounded-lg text-white text-xs font-display whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity ${inline ? 'left-0' : 'right-0'}`}
        initial={{ y: -5 }}
        animate={{ y: 0 }}
      >
        {isMuted ? 'Unmute Sound' : 'Mute Sound'}
      </motion.div>
    </motion.button>
  );
}

