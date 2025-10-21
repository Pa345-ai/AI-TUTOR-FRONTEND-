"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProgress, listLessonSessions, fetchDueReviews, fetchUserAchievements, type AchievementItem } from "@/lib/api";

export default function ProfilePage() {
  const [userId, setUserId] = useState<string>("123");
  const [progress, setProgress] = useState<{ xp: number; level: number; streak: number } | null>(null);
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const uid = window.localStorage.getItem("userId");
      if (uid) setUserId(uid);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [p, due, sessions, mine] = await Promise.all([
          fetchProgress(userId),
          fetchDueReviews(userId, 1),
          listLessonSessions(userId),
          fetchUserAchievements(userId),
        ]);
        if (!mounted) return;
        setProgress(p);
        setAchievements(mine);
        if (Array.isArray(due) && due[0]?.topic) {
          setContinueUrl(`/adaptive?topic=${encodeURIComponent(due[0].topic)}`);
        } else {
          const incompletes = (sessions.sessions || []).filter((s) => !s.completed);
          if (incompletes[0]) setContinueUrl(`/lessons/interactive?session=${encodeURIComponent(incompletes[0].id)}`);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {progress && (
        <div className="grid sm:grid-cols-3 gap-3">
          <Stat label="XP" value={progress.xp} />
          <Stat label="Level" value={progress.level} />
          <Stat label="Streak" value={`${progress.streak} days`} />
        </div>
      )}
      {continueUrl && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="text-sm">Continue learning</div>
          <Link href={continueUrl} className="text-sm underline">Go</Link>
        </div>
      )}
      <div>
        <div className="text-sm font-medium mb-1">Shortcuts</div>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/chat" className="px-2 py-1 border rounded-md">Open Chat</Link>
          <Link href="/mastery" className="px-2 py-1 border rounded-md">Goals</Link>
          <Link href="/heatmap" className="px-2 py-1 border rounded-md">Heatmap</Link>
          <Link href="/lessons/interactive" className="px-2 py-1 border rounded-md">Interactive Lesson</Link>
          <Link href="/quizzes" className="px-2 py-1 border rounded-md">Quiz</Link>
        </div>
      </div>
      <div>
        <div className="text-sm font-medium mb-1">Achievements</div>
        {achievements.length === 0 ? (
          <div className="text-xs text-muted-foreground">No achievements yet.</div>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-2">
            {achievements.map((a) => (
              <li key={a.id} className="border rounded-md p-2">
                <div className="font-medium text-sm">{a.name}</div>
                <div className="text-xs text-muted-foreground">{a.description}</div>
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
    <div className="border rounded-md p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}
