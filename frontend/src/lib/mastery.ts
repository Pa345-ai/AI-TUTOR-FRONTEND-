export type TopicStats = {
  correct: number;
  attempts: number;
};

function getKey(userId: string) {
  return `localMastery:${userId}`;
}

export function getLocalMastery(userId: string): Record<string, TopicStats> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(getKey(userId));
    return raw ? (JSON.parse(raw) as Record<string, TopicStats>) : {};
  } catch {
    return {};
  }
}

export function updateLocalMastery(userId: string, topic: string, correct: boolean) {
  if (typeof window === "undefined") return;
  const key = getKey(userId);
  const current = getLocalMastery(userId);
  const prev = current[topic] ?? { correct: 0, attempts: 0 };
  const next: TopicStats = {
    correct: prev.correct + (correct ? 1 : 0),
    attempts: prev.attempts + 1,
  };
  current[topic] = next;
  window.localStorage.setItem(key, JSON.stringify(current));
}

export function getWeakTopics(userId: string, minAttempts = 1): Array<{ topic: string; accuracy: number; stats: TopicStats }> {
  const data = getLocalMastery(userId);
  const items = Object.entries(data)
    .map(([topic, stats]) => ({ topic, stats, accuracy: stats.attempts > 0 ? stats.correct / stats.attempts : 0 }))
    .filter((x) => x.stats.attempts >= minAttempts)
    .sort((a, b) => a.accuracy - b.accuracy);
  return items;
}
