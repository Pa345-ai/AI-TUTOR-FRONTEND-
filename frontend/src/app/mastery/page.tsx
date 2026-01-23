"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchLearningPaths, type LearningPathItem, fetchMastery, fetchDueReviews, type DueTopicReview, fetchGoals, getSavedGoals, updateGoalsProgress, fetchMemory, summarizeMemory } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { computeAccuracy, getProficiencyTier } from "@/lib/mastery";

export default function MasteryMapPage() {
  const [userId, setUserId] = useState("123");
  const [paths, setPaths] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [due, setDue] = useState<DueTopicReview[]>([]);
  const [goalsTimeframe, setGoalsTimeframe] = useState<"daily" | "weekly">("daily");
  const [goals, setGoals] = useState<Array<{ title: string; steps: string[]; focusTopic?: string }>>([]);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [dailyMemory, setDailyMemory] = useState<string>("");
  const [weeklyMemory, setWeeklyMemory] = useState<string>("");
  const [memLoading, setMemLoading] = useState(false);

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
        const [data, m, d] = await Promise.all([
          fetchLearningPaths(userId),
          fetchMastery(userId),
          fetchDueReviews(userId, 10),
        ]);
        if (!mounted) return;
        setPaths(data);
        setMastery(m);
        setDue(d);
        // Load memory summaries
        try {
          const [dm, wm] = await Promise.all([
            fetchMemory(userId, 'daily'),
            fetchMemory(userId, 'weekly'),
          ]);
          setDailyMemory(dm.memory?.summary || "");
          setWeeklyMemory(wm.memory?.summary || "");
        } catch { /* ignore */ }
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

  const topics = useMemo(() => {
    return paths.flatMap((p) => [p.currentTopic, ...(p.completedTopics ?? [])]).filter(Boolean) as string[];
  }, [paths]);

  // Goals persistence (local only for now)
  const [goalsProgress, setGoalsProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await getSavedGoals(userId, goalsTimeframe);
        if (!mounted) return;
        setGoals(saved.goals || []);
        setGoalsProgress(saved.progress || {});
      } catch {
        // ignore if none saved yet
      }
    })();
    return () => { mounted = false; };
  }, [userId, goalsTimeframe]);

  const toggleStep = async (gi: number, si: number) => {
    const key = `${gi}:${si}`;
    const next = { ...goalsProgress, [key]: !goalsProgress[key] };
    setGoalsProgress(next);
    try {
      await updateGoalsProgress(userId, goalsTimeframe, next);
    } catch {
      // ignore
    }
  };

  const completedCount = (gi: number) => goals[gi]?.steps?.reduce((acc, _s, si) => acc + (goalsProgress[`${gi}:${si}`] ? 1 : 0), 0);

  const loadGoals = async () => {
    try {
      setGoalsLoading(true);
      setGoalsError(null);
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) as "en" | "si" | "ta" | null;
      const res = await fetchGoals(userId, goalsTimeframe, language ?? "en");
      type Goal = { title: string; steps: string[]; focusTopic?: string };
      const root = (res as { goals?: Goal[] })?.goals ?? (res as Goal[]);
      const items: Goal[] = Array.isArray(root) ? root : [];
      setGoals(items.filter(g => g && typeof g.title === 'string' && Array.isArray(g.steps)));
      // Reset local progress after regeneration
      setGoalsProgress({});
      await updateGoalsProgress(userId, goalsTimeframe, {});
    } catch (e) {
      setGoalsError(e instanceof Error ? e.message : String(e));
    } finally {
      setGoalsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mastery Map</h1>
      {/* Memory Panel */}
      <div className="border rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Learning Memory</div>
          <div className="flex items-center gap-2">
            <button
              className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"
              onClick={async () => { setMemLoading(true); try { const r = await summarizeMemory(userId, 'daily'); setDailyMemory(r.memory?.summary || ""); } finally { setMemLoading(false); } }}
              disabled={memLoading}
            >{memLoading ? 'Updating…' : 'Update Daily'}</button>
            <button
              className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"
              onClick={async () => { setMemLoading(true); try { const r = await summarizeMemory(userId, 'weekly'); setWeeklyMemory(r.memory?.summary || ""); } finally { setMemLoading(false); } }}
              disabled={memLoading}
            >{memLoading ? 'Updating…' : 'Update Weekly'}</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-sm">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Daily</div>
            <Textarea className="rounded-md border p-2 whitespace-pre-wrap min-h-16 w-full" value={dailyMemory} onChange={(e)=>setDailyMemory(e.target.value)} placeholder="Write a short daily memory summary…" />
            <div className="mt-1 flex gap-2">
              <button className="text-xs underline" onClick={async ()=>{ try { await summarizeMemory(userId, 'daily'); } catch {} }}>AI suggest</button>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Weekly</div>
            <Textarea className="rounded-md border p-2 whitespace-pre-wrap min-h-16 w-full" value={weeklyMemory} onChange={(e)=>setWeeklyMemory(e.target.value)} placeholder="Write a short weekly memory summary…" />
            <div className="mt-1 flex gap-2">
              <button className="text-xs underline" onClick={async ()=>{ try { await summarizeMemory(userId, 'weekly'); } catch {} }}>AI suggest</button>
            </div>
          </div>
        </div>
      </div>
      {/* Goals Panel */}
      <div className="border rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Your {goalsTimeframe === 'daily' ? 'Daily' : 'Weekly'} Goals</div>
          <div className="flex items-center gap-2">
            <select
              className="h-8 px-2 border rounded-md text-xs"
              value={goalsTimeframe}
              onChange={(e) => setGoalsTimeframe((e.target.value === 'weekly' ? 'weekly' : 'daily'))}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <button
              onClick={() => void loadGoals()}
              className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"
              disabled={goalsLoading}
            >
              {goalsLoading ? 'Generating…' : 'Generate'}
            </button>
          </div>
        </div>
        {goalsError && <div className="text-xs text-red-600">{goalsError}</div>}
        {goals.length === 0 && !goalsLoading && (
          <div className="text-xs text-muted-foreground">No goals yet. Click Generate to create your {goalsTimeframe} plan.</div>
        )}
        <div className="grid gap-2">
          {goals.map((g, gi) => (
            <div key={gi} className="border rounded-md p-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">
                  {completedCount(gi)}/{g.steps.length} done
                </div>
              </div>
              {g.focusTopic && (
                <div className="text-xs mt-1">
                  Focus: <a href={`/adaptive?topic=${encodeURIComponent(g.focusTopic)}`} className="underline">{g.focusTopic}</a>
                </div>
              )}
              <ul className="mt-2 space-y-1">
                {g.steps.map((s, si) => (
                  <li key={si} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!goalsProgress[`${gi}:${si}`]}
                      onChange={() => toggleStep(gi, si)}
                    />
                    <span className={goalsProgress[`${gi}:${si}`] ? 'line-through text-muted-foreground' : ''}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {due.length > 0 && (
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-1">Today’s practice</div>
          <div className="flex flex-wrap gap-2">
            {due.map((item, i) => (
              <Link key={i} href={`/adaptive?topic=${encodeURIComponent(item.topic)}`} className="px-2 py-1 text-xs border rounded-md hover:bg-muted">
                {item.topic}
              </Link>
            ))}
          </div>
        </div>
      )}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="grid sm:grid-cols-3 gap-3">
        {paths.map((p) => (
          <div key={p.id} className="border rounded-md p-3">
            <div className="font-medium">{p.subject}</div>
            <div className="text-xs text-muted-foreground">Current</div>
            <div className="text-sm mb-2">
              {p.currentTopic}
              {mastery[p.currentTopic] && (
                <span className="ml-2 text-xs text-muted-foreground">
                  {Math.round(computeAccuracy(mastery[p.currentTopic]) * 100)}% — {getProficiencyTier(computeAccuracy(mastery[p.currentTopic]))}
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">Completed</div>
            <ul className="text-sm list-disc list-inside">
              {(p.completedTopics ?? []).map((t, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>
                    {t}
                    {mastery[t] && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {Math.round(computeAccuracy(mastery[t]) * 100)}% — {getProficiencyTier(computeAccuracy(mastery[t]))}
                      </span>
                    )}
                  </span>
                  <Link href={`/adaptive?topic=${encodeURIComponent(t)}`} className="text-xs underline">Practice</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {paths.length === 0 && !loading && (
        <div className="text-sm text-muted-foreground">No learning paths. Start chatting or generating lessons to build your path.</div>
      )}
      {topics.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">All Topics</div>
          <div className="flex flex-wrap gap-2">
            {topics.map((t, i) => (
              <span key={i} className="px-2 py-1 text-xs border rounded-md">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
