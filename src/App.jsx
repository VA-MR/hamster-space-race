import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LandingPage from './pages/LandingPage';
import CustomizePage from './pages/CustomizePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import StarField from './components/StarField';
import VideoIntro from './components/VideoIntro';
import PostVideoScreen from './components/PostVideoScreen';
import AudioInitPrompt from './components/AudioInitPrompt';

function App() {
  const location = useLocation();
  const [appState, setAppState] = useState(() => {
    // Check if user is trying to deep link - skip video if so
    const path = window.location.pathname;
    if (path !== '/' && path !== '') {
      return 'game';
    }
    // Check if video has been seen this session
    const videoSeen = sessionStorage.getItem('intro-video-seen');
    return videoSeen ? 'game' : 'video';
  });
  const [isFirstPlay, setIsFirstPlay] = useState(true);

  // Mark video as seen when completing it
  useEffect(() => {
    if (appState === 'game') {
      sessionStorage.setItem('intro-video-seen', 'true');
    }
  }, [appState]);

  // Show intro video
  if (appState === 'video') {
    return (
      <VideoIntro 
        onComplete={() => {
          setAppState('post-video');
          setIsFirstPlay(false);
        }}
        startMuted={isFirstPlay}
      />
    );
  }

  // Show post-video screen with options
  if (appState === 'post-video') {
    return (
      <PostVideoScreen 
        onStartGame={() => setAppState('game')}
        onReplayVideo={() => setAppState('video')}
      />
    );
  }

  // Show main game
  return (
    <div className="min-h-screen bg-space-gradient">
      <StarField count={100} />
      <AudioInitPrompt />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage onReplayVideo={() => setAppState('video')} />} />
          <Route path="/customize" element={<CustomizePage />} />
          <Route path="/play" element={<GamePage />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
