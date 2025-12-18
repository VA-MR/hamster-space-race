import { useState, useEffect, useRef, useCallback } from 'react';

// Global audio context to handle iOS restrictions
let audioContextInitialized = false;
let audioContextUnlocked = false;

/**
 * Initialize Web Audio API context for iOS
 * Must be called on user gesture
 */
function initAudioContext() {
  if (audioContextInitialized) return;
  audioContextInitialized = true;

  // Create a silent audio context to unlock iOS audio
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
      audioContextUnlocked = true;
    }
  } catch (e) {
    console.warn('Audio context initialization failed:', e);
  }
}

/**
 * Custom hook for managing audio playback with mute functionality
 * @param {string} audioSrc - Path to the audio file
 * @param {boolean} loop - Whether the audio should loop
 * @returns {Object} Audio control methods and state
 */
export function useAudio(audioSrc, loop = false) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    // Get mute state from localStorage
    const saved = localStorage.getItem('hamster-audio-muted');
    return saved === 'true';
  });
  const [isReady, setIsReady] = useState(false);
  const pendingPlayRef = useRef(false);

  // Initialize audio element only once
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.muted = isMuted;
    audio.preload = 'auto'; // Preload audio to prevent loading issues
    
    // Add error handling
    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', audioSrc, e);
    });

    audio.addEventListener('canplaythrough', () => {
      setIsReady(true);
      // If play was requested before ready, play now
      if (pendingPlayRef.current && !isMuted) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Audio autoplay blocked:', error);
          });
        }
        pendingPlayRef.current = false;
      }
    });

    audioRef.current = audio;

    // Add event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      // Only set playing to false if not looping
      // When looping, the 'ended' event should not fire, but handle it just in case
      if (!loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
    };
  }, [audioSrc, loop]); // Removed isMuted from deps to prevent recreation

  // Update muted state when global mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      // If unmuting and audio should be playing, ensure it plays
      if (!isMuted && pendingPlayRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Audio play failed after unmute:', error);
          });
        }
      }
    }
  }, [isMuted]);

  // Listen for global mute changes from other components
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'hamster-audio-muted') {
        setIsMuted(e.newValue === 'true');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    const handleMuteChange = (e) => {
      setIsMuted(e.detail.muted);
    };
    
    window.addEventListener('audio-mute-change', handleMuteChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('audio-mute-change', handleMuteChange);
    };
  }, []);

  const play = useCallback(() => {
    // Initialize audio context on first user interaction (iOS requirement)
    initAudioContext();

    if (audioRef.current) {
      if (!isReady) {
        // Mark as pending if not ready yet
        pendingPlayRef.current = true;
        return;
      }

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            pendingPlayRef.current = false;
          })
          .catch(error => {
            console.warn('Audio play failed:', error.message);
            // Mark as pending for retry when user interacts
            pendingPlayRef.current = true;
          });
      }
    }
  }, [isReady]);

  const pause = useCallback(() => {
    pendingPlayRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
    pendingPlayRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying,
    isMuted,
    isReady,
    audioRef,
  };
}

/**
 * Hook for global audio mute state management
 */
export function useAudioMute() {
  const [isMuted, setIsMuted] = useState(() => {
    const saved = localStorage.getItem('hamster-audio-muted');
    return saved === 'true';
  });

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    localStorage.setItem('hamster-audio-muted', String(newMuted));
    
    // Dispatch custom event for same-tab components
    window.dispatchEvent(
      new CustomEvent('audio-mute-change', { 
        detail: { muted: newMuted } 
      })
    );
  }, [isMuted]);

  const setMute = useCallback((muted) => {
    setIsMuted(muted);
    localStorage.setItem('hamster-audio-muted', String(muted));
    
    // Dispatch custom event
    window.dispatchEvent(
      new CustomEvent('audio-mute-change', { 
        detail: { muted } 
      })
    );
  }, []);

  return {
    isMuted,
    toggleMute,
    setMute,
  };
}

export default useAudio;



