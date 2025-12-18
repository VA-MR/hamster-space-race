import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLeaderboard, formatAccuracy, formatQuestions, formatTimeMs } from '../services/leaderboardService';

export default function Leaderboard({ highlightName = null, className = '' }) {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
    setIsLoading(false);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const content = (
    <div className="relative">
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scroll-smooth">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-3xl"
            >
              🚀
            </motion.div>
          </div>
        ) : entries.length === 0 ? (
          <p className="text-center text-white/50 py-4">
            No racers yet! Be the first!
          </p>
        ) : (
          <>
            {entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.05, 1) }}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  entry.name === highlightName
                    ? 'bg-cosmic-accent/30 border border-cosmic-accent'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <span className="w-8 text-center font-bold text-sm">
                  {getRankIcon(index + 1)}
                </span>
                <span className="flex-1 font-display font-medium truncate">
                  {entry.name}
                  {entry.name === highlightName && (
                    <span className="ml-2 text-xs text-cosmic-star">(You!)</span>
                  )}
                </span>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-cosmic-star font-bold text-sm">
                      {formatAccuracy(entry)}
                    </span>
                    <span className="text-white/50 font-mono text-xs">
                      {formatQuestions(entry.totalQuestions)}
                    </span>
                  </div>
                  <div className="h-8 w-px bg-white/20" />
                  <div className="flex flex-col items-end">
                    <span className="text-white/90 font-mono text-sm">
                      {formatTimeMs(entry.timeMs)}
                    </span>
                    <span className="text-white/40 text-xs">
                      time
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
      {entries.length > 5 && !isLoading && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none" />
      )}
    </div>
  );

  // Mobile collapsible version
  if (isMobile) {
    return (
      <div className={`glass-card overflow-hidden ${className}`}>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-lg flex items-center gap-2">
              🏆 Leaderboard
            </span>
            {entries.length > 0 && !isLoading && (
              <span className="text-xs text-white/60 font-mono">
                ({entries.length})
              </span>
            )}
          </div>
          <motion.span
            animate={{ rotate: isCollapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            ▼
          </motion.span>
        </button>
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 pb-4"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop version
  return (
    <div className={`glass-card p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-bold text-lg flex items-center gap-2">
          🏆 Leaderboard
        </h3>
        {entries.length > 0 && !isLoading && (
          <span className="text-xs text-white/60 font-mono">
            {entries.length} racer{entries.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {content}
    </div>
  );
}

