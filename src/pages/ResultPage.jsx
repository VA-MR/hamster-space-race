import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useGame } from '../context/GameContext';
import { useAudio } from '../hooks/useAudio';
import { getRank, calculateAccuracy, getLeaderboard } from '../services/leaderboardService';
import HamsterPreview from '../components/HamsterPreview';
import Leaderboard from '../components/Leaderboard';

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function ResultPage() {
  const navigate = useNavigate();
  const { playerName, hamsterConfig, gameStats, resetGame } = useGame();
  const [rankInfo, setRankInfo] = useState(null);
  const [copied, setCopied] = useState(false);

  // Celebration music
  const celebrationMusic = useAudio('/assets/audio/celebration.wav', false);

  const totalTime = gameStats.endTime && gameStats.startTime 
    ? gameStats.endTime - gameStats.startTime 
    : 0;

  // Share functions
  const getShareText = () => {
    const accuracy = calculateAccuracy(gameStats.score, gameStats.totalQuestions);
    return `🐹🚀 I completed the Hamster Space Race with ${accuracy}% accuracy in ${gameStats.totalQuestions} questions! Can you beat my score? Play now!`;
  };

  const handleCopyLink = async () => {
    const shareText = getShareText();
    try {
      await navigator.clipboard.writeText(shareText + '\n' + window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Hamster Space Race',
          text: getShareText(),
          url: window.location.origin,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  };

  // Redirect if no game data
  useEffect(() => {
    if (!playerName || !gameStats.endTime) {
      navigate('/');
    }
  }, [playerName, gameStats.endTime, navigate]);

  // Play celebration music with lower volume
  useEffect(() => {
    if (!playerName) return;
    
    celebrationMusic.setVolume(0.35); // Set volume to 35%
    celebrationMusic.play();
    
    return () => {
      celebrationMusic.stop();
    };
  }, [playerName, celebrationMusic]);

  // Fire confetti on mount
  useEffect(() => {
    if (!playerName) return;

    // Initial burst
    const fireConfetti = () => {
      // Left side
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.1, y: 0.6 },
        colors: ['#FFD93D', '#FF6B9D', '#6B8BFF', '#4ADE80', '#C06BC7'],
      });
      
      // Right side
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { x: 0.9, y: 0.6 },
        colors: ['#FFD93D', '#FF6B9D', '#6B8BFF', '#4ADE80', '#C06BC7'],
      });
    };

    // Fire immediately
    fireConfetti();
    
    // Fire again after a short delay
    const timeout1 = setTimeout(fireConfetti, 500);
    const timeout2 = setTimeout(fireConfetti, 1000);

    // Star shower
    const starShower = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 100,
        origin: { x: 0.5, y: 0 },
        gravity: 0.5,
        ticks: 300,
        shapes: ['star'],
        colors: ['#FFD93D', '#FFAB4A'],
      });
    }, 1500);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(starShower);
    };
  }, [playerName]);

  // Get rank info
  useEffect(() => {
    if (totalTime > 0) {
      // Fetch leaderboard and calculate rank
      getLeaderboard().then((leaderboardData) => {
        const rank = getRank(totalTime, leaderboardData, gameStats.totalQuestions);
        setRankInfo(rank);
      });
    }
  }, [totalTime, gameStats.totalQuestions]);

  const handlePlayAgain = () => {
    resetGame();
    navigate('/customize');
  };

  const handleGoHome = () => {
    resetGame();
    navigate('/');
  };

  if (!playerName) {
    return null;
  }

  return (
    <motion.div
      className="min-h-screen bg-space-gradient py-8 px-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      {/* Floating celebration elements */}
      <motion.div
        className="fixed text-6xl"
        style={{ top: '10%', left: '10%' }}
        animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎉
      </motion.div>
      <motion.div
        className="fixed text-5xl"
        style={{ top: '20%', right: '15%' }}
        animate={{ y: [0, -15, 0], rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="fixed text-6xl"
        style={{ bottom: '15%', left: '8%' }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
      >
        🏆
      </motion.div>
      <motion.div
        className="fixed text-5xl"
        style={{ bottom: '20%', right: '10%' }}
        animate={{ y: [0, -20, 0], rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, delay: 0.3 }}
      >
        🌍
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Victory Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          <motion.div
            className="text-7xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🎊
          </motion.div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gradient text-shadow-glow mb-4">
            Mission Accomplished!
          </h1>
          
          <motion.p
            className="text-xl md:text-2xl text-star-gold font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Amazing job, {playerName}! 🚀
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Stats Card */}
          <motion.div
            className="glass-card p-6 md:p-8"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Hamster celebration */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <HamsterPreview config={hamsterConfig} size="lg" />
              </motion.div>
            </div>

            {/* Stats */}
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-cosmic-800/50 rounded-xl">
                <span className="text-cosmic-200 font-display">Accuracy</span>
                <span className="text-2xl font-bold font-mono text-star-gold">
                  {calculateAccuracy(gameStats.score, gameStats.totalQuestions)}%
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-cosmic-800/50 rounded-xl">
                <span className="text-cosmic-200 font-display">Total Questions</span>
                <span className="text-2xl font-bold font-display text-correct">
                  {gameStats.totalQuestions} 📝
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-cosmic-800/50 rounded-xl">
                <span className="text-cosmic-200 font-display">Correct Answers</span>
                <span className="text-2xl font-bold font-display text-correct">
                  {gameStats.score}/23 ⭐
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-cosmic-800/50 rounded-xl">
                <span className="text-cosmic-200 font-display">Time Taken</span>
                <span className="text-xl font-bold font-mono text-white/80">
                  {formatTime(totalTime)}
                </span>
              </div>

              {rankInfo && (
                <motion.div 
                  className="flex justify-between items-center p-3 bg-star-gold/20 rounded-xl border border-star-gold/30"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                >
                  <span className="text-star-gold font-display">Your Rank</span>
                  <span className="text-2xl font-bold font-display text-star-gold">
                    #{rankInfo.rank} of {rankInfo.total}
                  </span>
                </motion.div>
              )}

              {rankInfo && rankInfo.percentile >= 50 && (
                <motion.p
                  className="text-center text-nebula-pink font-display"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  🎯 Faster than {rankInfo.percentile}% of all racers!
                </motion.p>
              )}
            </div>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Leaderboard 
              currentPlayerTime={totalTime} 
              highlightName={playerName}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            onClick={handlePlayAgain}
            className="btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔄 Play Again
          </motion.button>
          
          <motion.button
            onClick={handleGoHome}
            className="btn-secondary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🏠 Back to Start
          </motion.button>
        </motion.div>

        {/* Share Section */}
        <motion.div
          className="mt-8"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-center text-cosmic-200 font-display mb-4">
            Share your achievement! 🎉
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {/* Native Share (mobile) */}
            {typeof navigator !== 'undefined' && navigator.share && (
              <motion.button
                onClick={handleNativeShare}
                className="px-5 py-2.5 bg-gradient-to-r from-nebula-purple to-nebula-pink text-white font-display font-semibold rounded-full hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                📤 Share
              </motion.button>
            )}
            
            {/* Twitter/X */}
            <motion.button
              onClick={handleShareTwitter}
              className="px-5 py-2.5 bg-[#1DA1F2] text-white font-display font-semibold rounded-full hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              𝕏 Post
            </motion.button>
            
            {/* Copy Link */}
            <motion.button
              onClick={handleCopyLink}
              className="px-5 py-2.5 bg-cosmic-600 text-white font-display font-semibold rounded-full hover:bg-cosmic-500 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </motion.button>
          </div>
        </motion.div>

        {/* Fun fact */}
        <motion.p
          className="text-center text-cosmic-300 text-sm mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Did you know? Your hamster traveled {(23 * 1000000).toLocaleString()} kilometers to reach Earth! 🌍
        </motion.p>
      </div>
    </motion.div>
  );
}
