"use client";

import { useEffect, useState } from "react";
import { fetchProgress, fetchAchievements, fetchMastery, type AchievementItem } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeakTopics } from "@/lib/mastery";
import Link from "next/link";
import GoalsWidget from "./GoalsWidget";

export default function ProgressPage() {
  const [userId, setUserId] = useState("123");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    xp: number;
    level: number;
    streak: number;
    totalAssignmentsCompleted?: number;
    totalQuizzesCompleted?: number;
    averageScore?: number;
  } | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [weakTopics, setWeakTopics] = useState<Array<{ topic: string; accuracy: number }>>([]);
  const [masteryMap, setMasteryMap] = useState<Record<string, { correct: number; attempts: number }>>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [p, a, m] = await Promise.all([
          fetchProgress(userId),
          fetchAchievements(),
          fetchMastery(userId),
        ]);
        if (!mounted) return;
        setProgress(p);
        setAchievements(a);
        setMasteryMap(m);
        const weak = getWeakTopics(userId, 1).slice(0, 5).map(({ topic, accuracy }) => ({ topic, accuracy }));
        setWeakTopics(weak);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-6">
      <h1 className="text-xl font-semibold">Progress</h1>
      {loading && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="XP" value={progress.xp} />
          <Stat label="Level" value={progress.level} />
          <Stat label="Streak" value={`${progress.streak} days`} />
          <Stat label="Assignments" value={progress.totalAssignmentsCompleted ?? 0} />
          <Stat label="Quizzes" value={progress.totalQuizzesCompleted ?? 0} />
          <Stat label="Avg Score" value={(progress.averageScore ?? 0) + "%"} />
        </div>
      )}
      <div>
        <h2 className="text-lg font-medium mb-2">Achievements</h2>
        {achievements.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No achievements yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <li key={a.id} className="border rounded-md p-3">
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-muted-foreground">{a.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <GoalsWidget />
      <TodayQueue masteryMap={masteryMap} />
      <div>
        <h2 className="text-lg font-medium mb-2">Weak topics</h2>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No weak topics detected yet.</p>
        ) : (
          <ul className="space-y-2">
            {weakTopics.map((w, i) => (
              <li key={i} className="flex items-center justify-between border rounded-md p-3">
                <div className="text-sm">{w.topic} — {(w.accuracy * 100).toFixed(0)}%</div>
                <Link href={`/adaptive?topic=${encodeURIComponent(w.topic)}`} className="text-sm underline">
                  Practice now
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function TodayQueue({ masteryMap }: { masteryMap: Record<string, { correct: number; attempts: number }> }) {
  const items = Object.entries(masteryMap)
    .map(([topic, s]) => ({ topic, acc: (s.correct || 0) / Math.max(1, s.attempts || 1) }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 5);
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Today&apos;s practice</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.topic} className="flex items-center justify-between border rounded-md p-3">
            <div className="text-sm">{it.topic} — {(it.acc * 100).toFixed(0)}%</div>
            <Link href={`/adaptive?topic=${encodeURIComponent(it.topic)}`} className="text-sm underline">
              Practice now
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
