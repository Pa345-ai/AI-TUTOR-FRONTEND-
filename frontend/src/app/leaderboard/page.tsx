"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardItem } from "@/lib/api";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState<string>(()=> (typeof window!=='undefined' ? (window.localStorage.getItem('season')||'S1') : 'S1'));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderboard(10);
        if (!mounted) return;
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Leaderboard</h1>
      <div className="flex items-center gap-2 text-xs">
        <label>Season</label>
        <select className="h-8 px-2 border rounded" value={season} onChange={(e)=>{ setSeason(e.target.value); try { window.localStorage.setItem('season', e.target.value); } catch {} }}>
          {['S1','S2','S3','S4'].map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        <span className="text-muted-foreground">Anti‑cheat: tab‑blur and proctor events affect standings</span>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ol className="space-y-2">
        {items.map((u, idx) => (
          <li key={u.userId} className="flex items-center justify-between border rounded-md p-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm w-6 text-center">#{idx + 1}</span>
              <div className="truncate">
                <div className="font-medium truncate">{u.name ?? u.userId}</div>
                <div className="text-xs text-muted-foreground">Level {u.level ?? "-"}</div>
              </div>
            </div>
            <div className="font-semibold">{u.xp} XP</div>
          </li>
        ))}
        {(!loading && items.length === 0) && (
          <li className="text-sm text-muted-foreground">No leaderboard data.</li>
        )}
      </ol>
    </div>
  );
}
