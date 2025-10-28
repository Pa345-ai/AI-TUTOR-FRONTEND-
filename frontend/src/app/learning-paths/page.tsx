"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchLearningPaths, type LearningPathItem, fetchPrereqs, fetchNextTopics, fetchMastery, getSavedGoals, updateGoalsProgress, fetchGoals, createLearningPath, updateLearningPath, fetchSchedule, upsertSchedule, getSchedulePrefs, setSchedulePrefs, fetchCatchUp, exportICS, type ScheduleItem, type SchedulePrefs } from "@/lib/api";
import Link from "next/link";

export default function LearningPathsPage() {
  const [userId, setUserId] = useState("123");
  const [items, setItems] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<string>("");
  const [subject, setSubject] = useState<string>("math");
  const [prereqs, setPrereqs] = useState<string[]>([]);
  const [nextTopics, setNextTopics] = useState<string[]>([]);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [goalsTimeframe, setGoalsTimeframe] = useState<"daily"|"weekly">("weekly");
  const [goals, setGoals] = useState<Array<{ title: string; steps: string[]; focusTopic?: string }>>([]);
  const [goalsProgress, setGoalsProgress] = useState<Record<string, boolean>>({});
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsError, setGoalsError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [prefs, setPrefs] = useState<SchedulePrefs | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [catchup, setCatchup] = useState<Array<{ topic: string; minutes: number }>>([]);

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
        const [data, m, pf, sch, cu] = await Promise.all([
          fetchLearningPaths(userId),
          fetchMastery(userId),
          getSchedulePrefs(userId).catch(()=>({} as any)),
          fetchSchedule(userId).catch(()=>[]),
          fetchCatchUp(userId).catch(()=>[]),
        ]);
        if (!mounted) return;
        setItems(data);
        setMastery(m);
        setPrefs((pf as any).prefs || null);
        setSchedule(sch as any);
        setCatchup(cu as any);
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

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await getSavedGoals(userId, goalsTimeframe);
        if (!mounted) return;
        setGoals(saved.goals || []);
        setGoalsProgress(saved.progress || {});
      } catch { /* ignore */ }
    })();
    return () => { mounted = false; };
  }, [userId, goalsTimeframe]);

  const accuracyOf = useCallback((t: string) => {
    const s = mastery[t];
    return s ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0;
  }, [mastery]);

  const loadGraph = useCallback(async (t: string) => {
    if (!t.trim()) return;
    try {
      const [p, n] = await Promise.all([
        fetchPrereqs({ userId, subject, topic: t }),
        fetchNextTopics({ userId, subject, topic: t }),
      ]);
      setPrereqs(p.prereqs || []);
      setNextTopics(n.next || []);
      setTopic(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [userId, subject]);

  const weakPrereqs = useMemo(() => prereqs.filter((p) => accuracyOf(p) < 0.6), [prereqs, accuracyOf]);
  const pathPlan = useMemo(() => [...weakPrereqs, ...prereqs.filter((p) => accuracyOf(p) >= 0.6), topic].filter(Boolean), [weakPrereqs, prereqs, topic, accuracyOf]);

  const saveAsGoals = useCallback(async () => {
    try {
      setGoalsLoading(true);
      setGoalsError(null);
      const items = [
        { title: `Master ${topic}`, steps: pathPlan.map((t) => `Practice ${t} for 20 minutes`), focusTopic: topic },
      ];
      // Reuse backend generator endpoint to persist provided items
      await fetchGoals(userId, goalsTimeframe, 'en');
      // persist items directly by calling the same endpoint with items
      const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL as string);
      await fetch(`${baseUrl}/api/goals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, timeframe: goalsTimeframe, items }) });
      const saved = await getSavedGoals(userId, goalsTimeframe);
      setGoals(saved.goals || []);
      setGoalsProgress(saved.progress || {});
    } catch (e) {
      setGoalsError(e instanceof Error ? e.message : String(e));
    } finally {
      setGoalsLoading(false);
    }
  }, [userId, goalsTimeframe, pathPlan, topic]);

  const createPath = useCallback(async () => {
    if (!topic.trim()) return;
    try {
      setCreating(true);
      const { id } = await createLearningPath({ userId, subject, currentTopic: topic, completedTopics: prereqs.filter((p)=>accuracyOf(p)>=0.85), recommendedResources: [] });
      // refresh
      const list = await fetchLearningPaths(userId);
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally { setCreating(false); }
  }, [userId, subject, topic, prereqs, accuracyOf]);

  const savePrefs = useCallback(async () => {
    if (!prefs) return;
    await setSchedulePrefs({ ...prefs, userId });
  }, [prefs, userId]);

  const planWeek = useCallback(async () => {
    // naive plan: schedule pathPlan topics for this week at 6pm for 30m respecting quiet hours
    const base = new Date();
    base.setHours(18,0,0,0);
    const items: Array<Omit<ScheduleItem,'id'>> = [] as any;
    let dayOffset = 0;
    for (const t of pathPlan) {
      const start = new Date(base.getTime() + dayOffset * 24*60*60*1000);
      items.push({ userId, pathId: (items[0] as any)?.pathId || null, subject, topic: t, startAt: start.toISOString(), durationMinutes: 30, status: 'planned' } as any);
      dayOffset += 1;
    }
    await upsertSchedule(items as any);
    const sch = await fetchSchedule(userId);
    setSchedule(sch);
  }, [userId, subject, pathPlan]);

  const toggleStep = useCallback(async (gi: number, si: number) => {
    const key = `${gi}:${si}`;
    const next = { ...goalsProgress, [key]: !goalsProgress[key] };
    setGoalsProgress(next);
    try { await updateGoalsProgress(userId, goalsTimeframe, next); } catch {}
  }, [goalsProgress, userId, goalsTimeframe]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Learning Paths</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {/* Build a path from knowledge graph */}
      <div className="border rounded-md p-3 space-y-2">
        <div className="flex items-center gap-2">
          <input className="h-8 px-2 border rounded-md text-xs w-36" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" />
          <input className="h-8 px-2 border rounded-md text-xs flex-1" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Target topic (e.g., Algebra)" />
          <button className="h-8 px-3 border rounded-md text-xs" onClick={()=>void loadGraph(topic)} disabled={!topic.trim()}>Load</button>
          <button className="h-8 px-3 border rounded-md text-xs" onClick={()=>void saveAsGoals()} disabled={!topic.trim() || goalsLoading}>{goalsLoading ? 'Saving…' : 'Save as Goals'}</button>
          <button className="h-8 px-3 border rounded-md text-xs" onClick={()=>void createPath()} disabled={!topic.trim() || creating}>{creating ? 'Creating…' : 'Create Path'}</button>
          <select className="h-8 px-2 border rounded-md text-xs" value={goalsTimeframe} onChange={(e)=>setGoalsTimeframe(e.target.value === 'weekly' ? 'weekly' : 'daily')}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        {goalsError && <div className="text-xs text-red-600">{goalsError}</div>}
        {topic && (
          <div className="grid gap-2">
            <div className="text-xs font-medium">Prerequisites</div>
            <div className="flex flex-wrap gap-2">
              {prereqs.map((p)=> (
                <button key={p} className={`text-xs rounded px-2 py-1 border ${accuracyOf(p)>=0.6 ? 'bg-yellow-500' : 'bg-red-500 text-white'}`} onClick={()=>void loadGraph(p)}>{p} {(accuracyOf(p)>0 ? `• ${(accuracyOf(p)*100).toFixed(0)}%` : '')}</button>
              ))}
              {prereqs.length===0 && <span className="text-xs text-muted-foreground">None</span>}
            </div>
            <div className="text-xs font-medium">Next Topics</div>
            <div className="flex flex-wrap gap-2">
              {nextTopics.map((n)=> (
                <button key={n} className={`text-xs rounded px-2 py-1 border ${accuracyOf(n)>=0.85 ? 'bg-green-600 text-white' : accuracyOf(n)>0 ? 'bg-yellow-500' : 'bg-gray-300'}`} onClick={()=>void loadGraph(n)}>{n} {(accuracyOf(n)>0 ? `• ${(accuracyOf(n)*100).toFixed(0)}%` : '')}</button>
              ))}
              {nextTopics.length===0 && <span className="text-xs text-muted-foreground">None</span>}
            </div>
          <div className="text-xs font-medium">Remediation sequence (with prereq gating)</div>
            <ol className="list-decimal pl-5 text-sm space-y-1">
              {pathPlan.map((t,i)=>(
                <li key={`${t}-${i}`}>
                  <span className={`inline-block rounded px-2 py-0.5 ${accuracyOf(t)>=0.85?'bg-green-600 text-white':accuracyOf(t)>=0.6?'bg-yellow-500':'bg-red-500 text-white'}`}>{t}</span>
                  <Link href={`/adaptive?topic=${encodeURIComponent(t)}`} className="ml-2 underline">Practice</Link>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* Saved goals */}
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Your {goalsTimeframe==='daily'?'Daily':'Weekly'} Goals</div>
        {goals.length===0 && <div className="text-xs text-muted-foreground">No goals saved yet.</div>}
        <div className="grid gap-2">
          {goals.map((g, gi)=> (
            <div key={gi} className="border rounded-md p-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{g.title}</div>
                <div className="text-xs text-muted-foreground">{Object.values(goalsProgress).filter(Boolean).length}/{g.steps.length}{(g as unknown as { minutes?: number }).minutes ? ` • ${(g as unknown as { minutes?: number }).minutes} min` : ''}</div>
              </div>
              <ul className="mt-2 space-y-1">
                {g.steps.map((s, si)=> (
                  <li key={si} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={!!goalsProgress[`${gi}:${si}`]} onChange={()=>void toggleStep(gi, si)} />
                    <span className={goalsProgress[`${gi}:${si}`] ? 'line-through text-muted-foreground' : ''}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduling & Calendar */}
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Schedule & Calendar</div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input className="h-8 px-2 border rounded-md" placeholder="Timezone (e.g., UTC)" value={prefs?.timezone || ''} onChange={(e)=>setPrefs((prev)=>({ ...(prev||{}), userId, timezone: e.target.value }))} />
          <input className="h-8 px-2 border rounded-md w-28" placeholder="Daily minutes" type="number" value={prefs?.dailyMinutes ?? 60} onChange={(e)=>setPrefs((prev)=>({ ...(prev||{}), userId, dailyMinutes: parseInt(e.target.value||'60') }))} />
          <button className="h-8 px-3 border rounded-md" onClick={()=>void savePrefs()}>Save Prefs</button>
          <button className="h-8 px-3 border rounded-md" onClick={()=>void planWeek()}>Plan Week</button>
          <button className="h-8 px-3 border rounded-md" onClick={async ()=>{ const ics = await exportICS(userId); const blob = new Blob([ics], { type: 'text/calendar' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'learning-path.ics'; a.click(); URL.revokeObjectURL(url); }}>Export ICS</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs font-medium mb-1">Upcoming</div>
            <ul className="text-sm space-y-1 max-h-[200px] overflow-auto">
              {schedule.filter(s=>new Date(s.startAt)>=new Date()).slice(0,20).map((s)=> (
                <li key={s.id} className="flex items-center justify-between border rounded px-2 py-1">
                  <span>{new Date(s.startAt).toLocaleString()} — {s.topic}</span>
                  <span className="text-[11px] text-muted-foreground">{s.status}</span>
                </li>
              ))}
              {schedule.filter(s=>new Date(s.startAt)>=new Date()).length===0 && <li className="text-xs text-muted-foreground">No upcoming items.</li>}
            </ul>
          </div>
          <div>
            <div className="text-xs font-medium mb-1">Catch-up Plan</div>
            <ul className="text-sm space-y-1">
              {catchup.map((c,i)=> (
                <li key={i} className="flex items-center justify-between border rounded px-2 py-1"><span>{c.topic}</span><span className="text-[11px] text-muted-foreground">{c.minutes} min</span></li>
              ))}
              {catchup.length===0 && <li className="text-xs text-muted-foreground">No catch-up needed.</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="border rounded-md p-3">
            <div className="font-medium">{p.subject}</div>
            <div className="text-sm">Current: {p.currentTopic}</div>
            {p.completedTopics && p.completedTopics.length > 0 && (
              <div className="text-xs text-muted-foreground mt-1">Completed: {p.completedTopics.join(", ")}</div>
            )}
            {p.recommendedResources && p.recommendedResources.length > 0 && (
              <ul className="mt-2 space-y-1 text-sm">
                {p.recommendedResources.map((r, i) => (
                  <li key={i}>
                    <a className="underline" href={r.url} target="_blank" rel="noreferrer">{r.title}</a> <span className="text-xs text-muted-foreground">({r.type})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {(!loading && items.length === 0) && (
          <div className="text-sm text-muted-foreground">No learning paths.</div>
        )}
      </div>
    </div>
  );
}
