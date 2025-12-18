// Mock leaderboard service - will be replaced with Firebase later
// For now, we persist locally so the leaderboard starts empty and grows as real players finish games.

const LEADERBOARD_STORAGE_KEY = 'hamster-space-race-leaderboard-v1';
const DEFAULT_LIMIT = 30;

function hasStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function loadFromStorage() {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(entries) {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // ignore write errors (storage full, private mode, etc)
  }
}

let mockLeaderboard = loadFromStorage();

// Simulate async behavior
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function normalizeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getEntryKey(entry) {
  // Prefer stable per-run id when present.
  if (entry?.runId) return `run:${entry.runId}`;
  if (entry?.id) return `id:${entry.id}`;
  // Very old/invalid entries fall back to a content-derived key.
  return `sig:${entry?.name ?? ''}-${entry?.timeMs ?? ''}-${entry?.totalQuestions ?? ''}-${entry?.correctAnswers ?? ''}`;
}

function dedupeEntries(entries) {
  const map = new Map();
  for (const raw of Array.isArray(entries) ? entries : []) {
    if (!raw) continue;
    const entry = {
      ...raw,
      timeMs: normalizeNumber(raw.timeMs, 0),
      totalQuestions: normalizeNumber(raw.totalQuestions, 23),
      correctAnswers: normalizeNumber(raw.correctAnswers, 23),
    };
    const key = getEntryKey(entry);
    const existing = map.get(key);
    // Keep the better (faster) time if duplicates exist for the same key.
    if (!existing || entry.timeMs < existing.timeMs) {
      map.set(key, entry);
    }
  }
  return Array.from(map.values());
}

function sortLeaderboard(entries) {
  return [...entries].sort((a, b) => a.timeMs - b.timeMs);
}

function limitLeaderboard(entries, limit) {
  if (limit == null) return entries;
  const n = normalizeNumber(limit, DEFAULT_LIMIT);
  if (n <= 0) return [];
  return entries.slice(0, n);
}

export async function getLeaderboard({ limit = DEFAULT_LIMIT } = {}) {
  await delay(300); // Simulate network delay
  
  // Return sorted leaderboard (optionally limited)
  const deduped = dedupeEntries(mockLeaderboard);
  return limitLeaderboard(sortLeaderboard(deduped), limit);
}

export async function submitScore({ runId, name, timeMs, totalQuestions, correctAnswers }) {
  await delay(200); // Simulate network delay
  
  const stableId = runId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const newEntry = {
    // Use runId as the primary key so re-submits of the same run are idempotent.
    id: stableId,
    runId: stableId,
    name,
    timeMs: normalizeNumber(timeMs, 0),
    totalQuestions: normalizeNumber(totalQuestions, 23),
    correctAnswers: normalizeNumber(correctAnswers, 23),
  };
  
  // Replace existing entry for this runId (idempotent), otherwise append.
  const existingIndex = mockLeaderboard.findIndex((e) => (e?.runId || e?.id) === stableId);
  if (existingIndex >= 0) {
    mockLeaderboard[existingIndex] = newEntry;
  } else {
    // Extra safety: if the previous code submitted multiple times without runId,
    // we can remove near-identical duplicates for this same player/run payload.
    mockLeaderboard = mockLeaderboard.filter((e) => {
      if (!e) return false;
      if (e.name !== newEntry.name) return true;
      if (normalizeNumber(e.totalQuestions, 23) !== newEntry.totalQuestions) return true;
      if (normalizeNumber(e.correctAnswers, 23) !== newEntry.correctAnswers) return true;
      // Treat as duplicate if time is extremely close (within 2s).
      const dt = Math.abs(normalizeNumber(e.timeMs, 0) - newEntry.timeMs);
      return dt > 2000;
    });
    mockLeaderboard.push(newEntry);
  }

  // Normalize/dedupe stored data so we don't carry forward historical duplicates.
  mockLeaderboard = dedupeEntries(mockLeaderboard);
  saveToStorage(mockLeaderboard);
  
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

export function getRank(timeMs, leaderboard) {
  // Sort using the same logic as getLeaderboard
  const sorted = [...leaderboard].sort((a, b) => {
    // Sort by time (faster is better) - this is the primary ranking metric
    return a.timeMs - b.timeMs;
  });

  if (sorted.length === 0) {
    return { rank: 1, total: 0, percentile: 100 };
  }
  
  // Find rank based on time (primary ranking factor)
  const betterCount = sorted.filter((entry) => {
    // Entry is better if it has faster time
    return entry.timeMs < timeMs;
  }).length;
  
  return {
    rank: betterCount + 1,
    // Include the current player in the total even if they are not in the returned leaderboard subset.
    total: Math.max(sorted.length, betterCount + 1),
    percentile: Math.round(((Math.max(sorted.length, betterCount + 1) - betterCount) / Math.max(sorted.length, betterCount + 1)) * 100),
  };
}

