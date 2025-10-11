"use client";

import { useEffect, useState } from "react";
import { fetchAchievements, fetchUserAchievements, type AchievementItem } from "@/lib/api";

export default function AchievementsPage() {
  const [userId, setUserId] = useState<string>("123");
  const [all, setAll] = useState<AchievementItem[]>([]);
  const [mine, setMine] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [a, m] = await Promise.all([
        fetchAchievements(),
        fetchUserAchievements(userId)
      ]);
      setAll(a);
      setMine(m);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [userId]);

  const has = (id: string) => mine.some((x) => x.id === id);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Achievements</h1>
      <div className="flex items-center gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" value={userId} onChange={(e)=>setUserId(e.target.value)} placeholder="User ID" />
        <button className="h-9 px-3 border rounded-md text-sm" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid sm:grid-cols-2 gap-2">
        {all.map((a) => (
          <div key={a.id} className={`border rounded-md p-3 ${has(a.id) ? 'bg-green-50' : ''}`}>
            <div className="font-medium">{a.name}</div>
            <div className="text-xs text-muted-foreground">{a.description}</div>
            {has(a.id) ? (
              <div className="mt-1 text-xs text-green-700">Unlocked</div>
            ) : (
              <div className="mt-1 text-xs">Locked</div>
            )}
          </div>
        ))}
        {all.length === 0 && <div className="text-sm text-muted-foreground">No achievements configured.</div>}
      </div>
    </div>
  );
}
