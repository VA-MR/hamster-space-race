import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function VideoIntro({ onComplete, startMuted = true }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(startMuted);
  const [loadProgress, setLoadProgress] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    // If video fails to load or play within 8 seconds on mobile, skip intro
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Video taking too long to load, skipping intro');
        onComplete();
      }
    }, isMobile ? 8000 : 10000);

    return () => clearTimeout(timeout);
  }, [isLoading, onComplete]);

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleError = (e) => {
    console.error('Video failed to load:', e);
    setHasError(true);
    // Auto-skip if video fails
    setTimeout(onComplete, 1000);
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    setLoadProgress(100);
    // Ensure video plays (especially important for Safari)
    if (videoRef.current) {
      // Set muted state before playing
      videoRef.current.muted = startMuted;
      
      // Try to play - iOS/mobile may still block
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn('Video autoplay blocked:', err.message);
          // Don't treat as error on mobile - user can manually start
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          if (!isMobile) {
            setHasError(true);
            setTimeout(onComplete, 1000);
          }
        });
      }
    }
  };

  const handleProgress = () => {
    if (videoRef.current && videoRef.current.buffered.length > 0) {
      const buffered = videoRef.current.buffered.end(0);
      const duration = videoRef.current.duration;
      if (duration > 0) {
        setLoadProgress((buffered / duration) * 100);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Loading indicator */}
      {isLoading && !hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="text-center px-4">
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🐹
            </motion.div>
            <p className="text-white text-lg mb-3">Loading adventure...</p>
            {/* Loading progress bar */}
            {loadProgress > 0 && (
              <div className="w-64 max-w-full mx-auto h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${loadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Error message */}
      {hasError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center text-white">
            <p className="text-xl mb-2">🚀 Starting your adventure...</p>
          </div>
        </motion.div>
      )}

      {/* Fullscreen video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        playsInline
        preload="auto"
        onCanPlay={handleCanPlay}
        onLoadedData={handleLoadedData}
        onProgress={handleProgress}
        onEnded={onComplete}
        onError={handleError}
        className="w-full h-full object-cover"
        style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}
        // iOS-specific attributes for better compatibility
        webkit-playsinline="true"
        x5-playsinline="true"
      >
        <source src="/assets/Video_Generated_With_Funky_Music.mp4" type="video/mp4" />
        {/* Fallback text for browsers that don't support video */}
        Your browser doesn't support video playback. The adventure will start shortly...
      </video>

      {/* Mute/Unmute button */}
      {!isLoading && !hasError && (
        <motion.button
          onClick={toggleMute}
          className="absolute bottom-8 left-8 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? '🔇 Unmute' : '🔊 Mute'}
        </motion.button>
      )}

      {/* Skip button */}
      {!isLoading && !hasError && (
        <motion.button
          onClick={onComplete}
          className="absolute bottom-8 right-8 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/30 transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Skip ⏭️
        </motion.button>
      )}
    </div>
  );
}



