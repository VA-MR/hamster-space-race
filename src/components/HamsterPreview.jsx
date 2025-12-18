import { motion, AnimatePresence } from 'framer-motion';

const hamsterImages = {
  brown: '/assets/hamsters/brown.png',
  gray: '/assets/hamsters/gray.png',
  cream: '/assets/hamsters/cream.png',
  spotted: '/assets/hamsters/spotted.png',
  gold: '/assets/hamsters/gold.png',
  tricolor: '/assets/hamsters/tricolor.png',
};

const accessoryEmojis = {
  'goggles': '🥽',
  'headset': '🎧',
  'flag': '🚩',
  'helmet': '⛑️',
  'antenna': '📡',
  'jetpack': '🎒',
  'medal': '🏅',
  'telescope': '🔭',
  'rocket': '🚀',
  'satellite': '🛰️',
  'star': '⭐',
  'planet': '🪐',
  'comet': '☄️',
  'alien': '👾',
  'flashlight': '🔦',
  'compass': '🧭',
};

export default function HamsterPreview({ config, size = 'md', animate = false, showEquipped = true }) {
  const { color, accessory } = config;
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    xl: 'w-72 h-72',
  };

  const badgeSizes = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
    lg: 'w-10 h-10 text-xl',
    xl: 'w-12 h-12 text-2xl',
  };

  const imageSrc = color ? hamsterImages[color] : null;

  return (
    <motion.div 
      className={`relative ${sizeClasses[size]}`}
      animate={animate ? { y: [0, -10, 0] } : {}}
      transition={animate ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
    >
      {/* Hamster Image Container */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-cosmic-700/50 border-4 border-cosmic-500/50 shadow-lg shadow-cosmic-500/20">
        {imageSrc ? (
          <img 
            src={imageSrc} 
            alt={`${color} hamster`}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">🐹</span>
          </div>
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-star-gold/20 to-transparent pointer-events-none" />
      </div>

      {/* Equipped Accessory Badge */}
      <AnimatePresence>
        {accessory && showEquipped && (
          <motion.div 
            className={`absolute ${badgeSizes[size]} bg-gradient-to-br from-star-gold to-star-orange rounded-full flex items-center justify-center shadow-lg border-2 border-white/30 z-10`}
            style={{ bottom: -8, right: -8 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {accessoryEmojis[accessory]}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
