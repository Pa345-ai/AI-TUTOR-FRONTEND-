"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardItem } from "@/lib/api";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
