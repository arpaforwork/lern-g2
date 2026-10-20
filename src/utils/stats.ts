import { UserStats, SubjectStat } from '../types';

const STATS_STORAGE_KEY = 'learn_p1_user_stats';

const DEFAULT_SUBJECT_IDS = ['th', 'ma', 'sc', 'so', 'he', 'ar', 'mu', 'wk', 'en'];

export function getInitialStats(): UserStats {
  const subjects: Record<string, SubjectStat> = {};
  DEFAULT_SUBJECT_IDS.forEach((id) => {
    subjects[id] = {
      subjectId: id,
      studyCount: 0,
      quizTotal: 0,
      quizCorrect: 0,
      starsEarned: 0,
    };
  });

  return {
    totalStars: 0,
    subjects,
  };
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return getInitialStats();
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) {
      // Seed with some initial data so parents/teachers can immediately see demo insights if fresh
      const initial = getInitialStats();
      saveUserStats(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as UserStats;
    // ensure all subjects exist
    DEFAULT_SUBJECT_IDS.forEach((id) => {
      if (!parsed.subjects[id]) {
        parsed.subjects[id] = {
          subjectId: id,
          studyCount: 0,
          quizTotal: 0,
          quizCorrect: 0,
          starsEarned: 0,
        };
      }
    });
    return parsed;
  } catch (err) {
    console.error('Failed to load stats', err);
    return getInitialStats();
  }
}

export function saveUserStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
}

export function recordStudyVisit(subjectId: string) {
  const stats = loadUserStats();
  if (!stats.subjects[subjectId]) {
    stats.subjects[subjectId] = {
      subjectId,
      studyCount: 0,
      quizTotal: 0,
      quizCorrect: 0,
      starsEarned: 0,
    };
  }
  stats.subjects[subjectId].studyCount += 1;
  stats.subjects[subjectId].lastStudied = new Date().toISOString();
  saveUserStats(stats);
  return stats;
}

export function recordQuizAttempt(
  subjectId: string,
  totalQuestions: number,
  correctQuestions: number,
  starsWon: number
) {
  const stats = loadUserStats();
  if (!stats.subjects[subjectId]) {
    stats.subjects[subjectId] = {
      subjectId,
      studyCount: 0,
      quizTotal: 0,
      quizCorrect: 0,
      starsEarned: 0,
    };
  }

  const s = stats.subjects[subjectId];
  s.quizTotal += totalQuestions;
  s.quizCorrect += correctQuestions;
  s.starsEarned += starsWon;
  s.lastStudied = new Date().toISOString();
  stats.totalStars += starsWon;

  saveUserStats(stats);
  return stats;
}

export function resetUserStats() {
  const fresh = getInitialStats();
  saveUserStats(fresh);
  return fresh;
}
