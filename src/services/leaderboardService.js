// Mock leaderboard service - will be replaced with Firebase later

let mockLeaderboard = [
  { id: '1', name: 'Luna', timeMs: 90000, totalQuestions: 23, correctAnswers: 23 },
  { id: '2', name: 'Cosmo', timeMs: 120000, totalQuestions: 25, correctAnswers: 23 },
  { id: '3', name: 'Star', timeMs: 135000, totalQuestions: 27, correctAnswers: 23 },
  { id: '4', name: 'Nova', timeMs: 150000, totalQuestions: 29, correctAnswers: 23 },
  { id: '5', name: 'Orbit', timeMs: 180000, totalQuestions: 31, correctAnswers: 23 },
  { id: '6', name: 'Astro', timeMs: 195000, totalQuestions: 24, correctAnswers: 23 },
  { id: '7', name: 'Galaxy', timeMs: 210000, totalQuestions: 26, correctAnswers: 23 },
  { id: '8', name: 'Rocket', timeMs: 225000, totalQuestions: 28, correctAnswers: 23 },
  { id: '9', name: 'Comet', timeMs: 240000, totalQuestions: 30, correctAnswers: 23 },
  { id: '10', name: 'Meteor', timeMs: 255000, totalQuestions: 32, correctAnswers: 23 },
  { id: '11', name: 'Nebula', timeMs: 270000, totalQuestions: 25, correctAnswers: 23 },
  { id: '12', name: 'Stellar', timeMs: 285000, totalQuestions: 27, correctAnswers: 23 },
  { id: '13', name: 'Eclipse', timeMs: 300000, totalQuestions: 29, correctAnswers: 23 },
  { id: '14', name: 'Pulsar', timeMs: 315000, totalQuestions: 31, correctAnswers: 23 },
  { id: '15', name: 'Quasar', timeMs: 330000, totalQuestions: 33, correctAnswers: 23 },
  { id: '16', name: 'Saturn', timeMs: 345000, totalQuestions: 35, correctAnswers: 23 },
  { id: '17', name: 'Jupiter', timeMs: 360000, totalQuestions: 28, correctAnswers: 23 },
  { id: '18', name: 'Mars', timeMs: 375000, totalQuestions: 30, correctAnswers: 23 },
  { id: '19', name: 'Venus', timeMs: 390000, totalQuestions: 32, correctAnswers: 23 },
  { id: '20', name: 'Mercury', timeMs: 405000, totalQuestions: 34, correctAnswers: 23 },
  { id: '21', name: 'Neptune', timeMs: 420000, totalQuestions: 36, correctAnswers: 23 },
  { id: '22', name: 'Uranus', timeMs: 435000, totalQuestions: 38, correctAnswers: 23 },
  { id: '23', name: 'Pluto', timeMs: 450000, totalQuestions: 40, correctAnswers: 23 },
  { id: '24', name: 'Sirius', timeMs: 465000, totalQuestions: 42, correctAnswers: 23 },
  { id: '25', name: 'Vega', timeMs: 480000, totalQuestions: 44, correctAnswers: 23 },
  { id: '26', name: 'Polaris', timeMs: 495000, totalQuestions: 46, correctAnswers: 23 },
  { id: '27', name: 'Andromeda', timeMs: 510000, totalQuestions: 48, correctAnswers: 23 },
  { id: '28', name: 'Cassiopeia', timeMs: 525000, totalQuestions: 50, correctAnswers: 23 },
];

// Simulate async behavior
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getLeaderboard() {
  await delay(300); // Simulate network delay
  
  // Return top 30 sorted by fastest time (time is the primary ranking factor)
  return [...mockLeaderboard]
    .sort((a, b) => {
      // Sort by time (faster is better) - this is the primary ranking metric
      return a.timeMs - b.timeMs;
    })
    .slice(0, 30);
}

export async function submitScore({ name, timeMs, totalQuestions, correctAnswers }) {
  await delay(200); // Simulate network delay
  
  const newEntry = {
    id: Date.now().toString(),
    name,
    timeMs,
    totalQuestions: totalQuestions || 23,
    correctAnswers: correctAnswers || 23,
  };
  
  mockLeaderboard.push(newEntry);
  
  // Return the updated leaderboard
  return getLeaderboard();
}

export function formatTimeMs(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateAccuracy(correctAnswers, totalQuestions) {
  if (!totalQuestions || totalQuestions === 0) return 100;
  return Math.round((correctAnswers / totalQuestions) * 100);
}

export function formatAccuracy(entry) {
  const accuracy = calculateAccuracy(entry.correctAnswers, entry.totalQuestions);
  return `${accuracy}%`;
}

export function formatQuestions(totalQuestions) {
  return `${totalQuestions} Q`;
}

export function getRank(timeMs, leaderboard, totalQuestions) {
  // Sort using the same logic as getLeaderboard
  const sorted = [...leaderboard].sort((a, b) => {
    // Sort by time (faster is better) - this is the primary ranking metric
    return a.timeMs - b.timeMs;
  });
  
  // Find rank based on time (primary ranking factor)
  const betterCount = sorted.filter((entry) => {
    // Entry is better if it has faster time
    return entry.timeMs < timeMs;
  }).length;
  
  return {
    rank: betterCount + 1,
    total: sorted.length,
    percentile: Math.round(((sorted.length - betterCount) / sorted.length) * 100),
  };
}

