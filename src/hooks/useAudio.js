import { useState, useEffect, useRef, useCallback } from 'react';

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

  // Initialize audio element
  useEffect(() => {
    if (!audioSrc) return;

    const audio = new Audio(audioSrc);
    audio.loop = loop;
    audio.muted = isMuted;
    audioRef.current = audio;

    // Add event listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

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
  }, [audioSrc, loop]);

  // Update muted state when global mute changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
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
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Audio play failed:', error);
        });
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const stop = useCallback(() => {
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



