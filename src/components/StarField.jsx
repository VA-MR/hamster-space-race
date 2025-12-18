import { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function StarField({ count = 100 }) {
  const isMobile = useMemo(() => {
    return typeof window !== 'undefined' && window.innerWidth < 768;
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
    }));
  }, [count]);

  // Reduce decorative elements on mobile
  const showShootingStars = !isMobile || count > 30;
  const showSatellites = !isMobile;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            willChange: 'opacity, transform', // Performance hint for browser
            transform: 'translateZ(0)', // Force hardware acceleration
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Shooting stars / Comets - reduced on mobile for performance */}
      {showShootingStars && (
        <>
          <motion.div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: '20%', left: '-5%', willChange: 'transform, opacity' }}
            animate={{
              x: ['0vw', '110vw'],
              y: ['0vh', '30vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 8,
              ease: 'easeOut',
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-0.5 bg-gradient-to-l from-transparent to-white opacity-50" />
          </motion.div>

          <motion.div
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{ top: '60%', left: '-5%', willChange: 'transform, opacity' }}
            animate={{
              x: ['0vw', '110vw'],
              y: ['0vh', '20vh'],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 12,
              delay: 5,
              ease: 'easeOut',
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-0.5 bg-gradient-to-l from-transparent to-white opacity-50" />
          </motion.div>
        </>
      )}

      {/* Satellites - desktop only for performance */}
      {showSatellites && (
        <>
          <motion.div
            className="absolute text-2xl"
            style={{ top: '30%', left: '-5%', willChange: 'transform, opacity' }}
            animate={{
              x: ['0vw', '110vw'],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              x: { duration: 4, ease: 'linear' },
              rotate: { duration: 4, ease: 'linear' },
              opacity: { duration: 4 },
              repeat: Infinity,
              repeatDelay: 12,
              delay: 2,
            }}
          >
            🛰️
          </motion.div>

          <motion.div
            className="absolute text-2xl"
            style={{ top: '70%', left: '-5%', willChange: 'transform, opacity' }}
            animate={{
              x: ['0vw', '110vw'],
              rotate: [0, 360],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              x: { duration: 5, ease: 'linear' },
              rotate: { duration: 5, ease: 'linear' },
              opacity: { duration: 5 },
              repeat: Infinity,
              repeatDelay: 18,
              delay: 8,
            }}
          >
            🛰️
          </motion.div>
        </>
      )}
    </div>
  );
}

