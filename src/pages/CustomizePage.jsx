import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import HamsterPreview from '../components/HamsterPreview';

const FUR_COLORS = [
  { id: 'brown', name: 'Brownie', color: '#8B4513' },
  { id: 'gray', name: 'Smokey', color: '#808080' },
  { id: 'cream', name: 'Vanilla', color: '#F5DEB3' },
  { id: 'spotted', name: 'Patches', color: '#E8E8E8' },
  { id: 'gold', name: 'Goldie', color: '#FFD700' },
  { id: 'tricolor', name: 'Rainbow', color: '#DEB887' },
];

const ACCESSORIES = [
  { id: 'goggles', name: 'Goggles', emoji: '🥽', description: 'See the stars!' },
  { id: 'headset', name: 'Headset', emoji: '🎧', description: 'Mission control!' },
  { id: 'flag', name: 'Flag', emoji: '🚩', description: 'Plant your flag!' },
  { id: 'helmet', name: 'Helmet', emoji: '⛑️', description: 'Safety first!' },
  { id: 'antenna', name: 'Antenna', emoji: '📡', description: 'Stay connected!' },
  { id: 'jetpack', name: 'Jetpack', emoji: '🎒', description: 'Boost speed!' },
  { id: 'medal', name: 'Medal', emoji: '🏅', description: 'Champion racer!' },
  { id: 'telescope', name: 'Telescope', emoji: '🔭', description: 'Explore space!' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', description: 'Blast off!' },
  { id: 'satellite', name: 'Satellite', emoji: '🛰️', description: 'Track your path!' },
  { id: 'star', name: 'Star Badge', emoji: '⭐', description: 'Shine bright!' },
  { id: 'planet', name: 'Planet', emoji: '🪐', description: 'Your own world!' },
  { id: 'comet', name: 'Comet', emoji: '☄️', description: 'Blazing speed!' },
  { id: 'alien', name: 'Alien Friend', emoji: '👾', description: "You're not alone!" },
  { id: 'flashlight', name: 'Flashlight', emoji: '🔦', description: 'Light the way!' },
  { id: 'compass', name: 'Compass', emoji: '🧭', description: 'Never get lost!' },
];

const TABS = ['Fur Color', 'Accessories'];

export default function CustomizePage() {
  const navigate = useNavigate();
  const { setPlayerName, setHamsterConfig, startGame, playerName: savedName, hamsterConfig: savedConfig } = useGame();
  
  const [name, setName] = useState(savedName || '');
  const [activeTab, setActiveTab] = useState(0);
  const [accessoryPage, setAccessoryPage] = useState(0);
  const [config, setConfig] = useState({
    color: savedConfig.color || 'gold',
    accessory: savedConfig.accessory || null,
  });

  const ITEMS_PER_PAGE = 6; // 3 columns x 2 rows
  const totalAccessoryPages = Math.ceil(ACCESSORIES.length / ITEMS_PER_PAGE);
  const currentAccessories = ACCESSORIES.slice(
    accessoryPage * ITEMS_PER_PAGE,
    (accessoryPage + 1) * ITEMS_PER_PAGE
  );

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value, // Toggle selection
    }));
  };

  const handleLaunch = () => {
    if (!name.trim()) return;
    
    setPlayerName(name.trim());
    setHamsterConfig(config);
    startGame();
    navigate('/play');
  };

  const isReady = name.trim().length > 0;

  return (
    <motion.div
      className="min-h-screen bg-space-gradient py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 stars-bg opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
            🛸 Customize Your Hamster
          </h1>
          <p className="text-cosmic-200">Create your perfect space explorer!</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left: Customization Options */}
          <motion.div
            className="glass-card p-6"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Name Input */}
            <div className="mb-6">
              <label className="block font-display font-semibold text-star-gold mb-2">
                👨‍🚀 Astronaut Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="input-field"
                maxLength={20}
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {TABS.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`tab-button whitespace-nowrap ${
                    activeTab === index ? 'tab-button-active' : 'tab-button-inactive'
                  }`}
                >
                  {index === 0 && '🎨 '}
                  {index === 1 && '✨ '}
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Fur Color Tab */}
                {activeTab === 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    {FUR_COLORS.map((fur) => (
                      <motion.button
                        key={fur.id}
                        onClick={() => handleConfigChange('color', fur.id)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                          config.color === fur.id
                            ? 'border-star-gold bg-star-gold/15 shadow-lg shadow-star-gold/20'
                            : 'border-cosmic-500/40 bg-cosmic-700/40 hover:border-cosmic-400 hover:bg-cosmic-600/40'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`w-20 h-20 rounded-full overflow-hidden border-3 mb-3 ${
                          config.color === fur.id 
                            ? 'border-star-gold shadow-md shadow-star-gold/30' 
                            : 'border-cosmic-400/50'
                        }`}>
                          <img
                            src={`/assets/hamsters/${fur.id}.png`}
                            alt={fur.name}
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <p className={`text-sm font-display font-medium text-center ${
                          config.color === fur.id ? 'text-star-gold' : 'text-cosmic-100'
                        }`}>{fur.name}</p>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Accessories Tab */}
                {activeTab === 1 && (
                  <div className="relative">
                    {/* Navigation buttons */}
                    <div className="flex items-center justify-between mb-4">
                      <motion.button
                        onClick={() => setAccessoryPage((prev) => Math.max(0, prev - 1))}
                        disabled={accessoryPage === 0}
                        className="px-3 py-2 rounded-lg bg-cosmic-600/50 hover:bg-cosmic-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        ← Prev
                      </motion.button>
                      <span className="text-sm text-cosmic-300 font-mono">
                        {accessoryPage + 1} / {totalAccessoryPages}
                      </span>
                      <motion.button
                        onClick={() => setAccessoryPage((prev) => Math.min(totalAccessoryPages - 1, prev + 1))}
                        disabled={accessoryPage === totalAccessoryPages - 1}
                        className="px-3 py-2 rounded-lg bg-cosmic-600/50 hover:bg-cosmic-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        whileTap={{ scale: 0.95 }}
                      >
                        Next →
                      </motion.button>
                    </div>

                    {/* Accessories grid - 2 rows */}
                    <div className="grid grid-cols-3 gap-3 min-h-[280px]">
                      <AnimatePresence mode="wait">
                        {currentAccessories.map((acc, index) => (
                          <motion.button
                            key={acc.id}
                            onClick={() => handleConfigChange('accessory', acc.id)}
                            className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center ${
                              config.accessory === acc.id
                                ? 'border-star-orange bg-star-orange/15 shadow-lg shadow-star-orange/20'
                                : 'border-cosmic-500/40 bg-cosmic-700/40 hover:border-cosmic-400 hover:bg-cosmic-600/40'
                            }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: index * 0.05 }}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${
                              config.accessory === acc.id 
                                ? 'bg-star-orange/30' 
                                : 'bg-cosmic-600/50'
                            }`}>
                              <span className="text-3xl">{acc.emoji}</span>
                            </div>
                            <p className={`text-sm font-display font-medium ${
                              config.accessory === acc.id ? 'text-star-orange' : 'text-cosmic-100'
                            }`}>{acc.name}</p>
                            <p className="text-xs text-cosmic-300 mt-1 text-center">{acc.description}</p>
                          </motion.button>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Page indicators */}
                    <div className="flex justify-center gap-2 mt-4">
                      {Array.from({ length: totalAccessoryPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setAccessoryPage(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === accessoryPage
                              ? 'bg-star-orange w-6'
                              : 'bg-cosmic-500/50 hover:bg-cosmic-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Preview & Launch */}
          <motion.div
            className="flex flex-col items-center"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* Preview Card */}
            <div className="glass-card p-8 w-full max-w-sm text-center mb-6">
              <h3 className="font-display font-semibold text-cosmic-200 mb-4">
                Your Space Hamster
              </h3>
              
              <div className="flex justify-center mb-4">
                <HamsterPreview config={config} size="xl" animate />
              </div>

              {/* Selected items summary */}
              <div className="text-left space-y-2 mt-6 p-4 bg-cosmic-800/50 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-cosmic-300">Name:</span>
                  <span className="font-display text-white">
                    {name || <span className="text-cosmic-500 italic">Enter name...</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-cosmic-300">Fur:</span>
                  <span className="font-display text-white">
                    {FUR_COLORS.find(f => f.id === config.color)?.name || 'None'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-cosmic-300">Accessory:</span>
                  <span className="font-display text-white">
                    {ACCESSORIES.find(a => a.id === config.accessory)?.name || 
                      <span className="text-cosmic-500">None selected</span>}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Button */}
            <motion.button
              onClick={handleLaunch}
              disabled={!isReady}
              className="btn-primary w-full max-w-sm"
              whileHover={isReady ? { scale: 1.02 } : {}}
              whileTap={isReady ? { scale: 0.98 } : {}}
            >
              {isReady ? '🚀 Launch Mission!' : '✏️ Enter Your Name First'}
            </motion.button>

            {/* Back button */}
            <button
              onClick={() => navigate('/')}
              className="mt-4 text-cosmic-300 hover:text-white transition-colors font-display"
            >
              ← Back to Start
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
