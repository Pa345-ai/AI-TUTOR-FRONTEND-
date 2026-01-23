"use client";

import { useEffect, useState } from "react";
import { fetchGoals } from "@/lib/api";

type Goal = { title: string; steps: string[]; focusTopic?: string };
type GoalsResponse = { goals?: { goals?: Goal[]; timeframe?: string } };

export default function GoalsWidget() {
  const [timeframe, setTimeframe] = useState<'daily'|'weekly'>('daily');
  const [goals, setGoals] = useState<{ goals?: Goal[]; timeframe?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
    setLoading(true);
    setError(null);
    fetchGoals(userId, timeframe)
      .then((g: GoalsResponse) => setGoals(g.goals ?? null))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [timeframe]);

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">Goals</div>
        <select className="h-8 px-2 border rounded-md text-sm" value={timeframe} onChange={(e) => setTimeframe(e.target.value as 'daily'|'weekly')}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>
      {loading && <div className="text-xs text-muted-foreground">Loading…</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}
      {goals?.goals ? (
        <ul className="space-y-2">
          {goals.goals.map((g: Goal, i: number) => (
            <li key={i} className="border rounded-md p-2">
              <div className="text-sm font-medium">{g.title}</div>
              {g.focusTopic && <div className="text-xs text-muted-foreground">Focus: {g.focusTopic}</div>}
              <ul className="list-disc list-inside text-sm mt-1">
                {(g.steps || []).map((s: string, j: number) => <li key={j}>{s}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <div className="text-xs text-muted-foreground">No goals yet.</div>
      )}
    </div>
  );
}
