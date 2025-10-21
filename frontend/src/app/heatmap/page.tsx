"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchMastery, fetchPrereqs, fetchNextTopics, fetchStudentSummary, fetchStudentSuggestions } from "@/lib/api";

 type TopicStat = { topic: string; correct: number; attempts: number; accuracy: number };

export default function HeatmapPage() {
  const [userId, setUserId] = useState<string>("123");
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [minAttempts, setMinAttempts] = useState<number>(1);
  const [tile, setTile] = useState<number>(44);
  const [onlyWeak, setOnlyWeak] = useState<boolean>(false);
  const [prereqs, setPrereqs] = useState<string[]>([]);
  const [nexts, setNexts] = useState<string[]>([]);
  const [focus, setFocus] = useState<string>("");
  const [weak, setWeak] = useState<Array<{ topic: string; accuracy: number }>>([]);
  const [strong, setStrong] = useState<Array<{ topic: string; accuracy: number }>>([]);
  const [suggestions, setSuggestions] = useState<Array<{ topic: string; pCorrect: number; difficulty: 'easy'|'medium'|'hard' }>>([]);
  const [planLoading, setPlanLoading] = useState(false);
  const [planMsg, setPlanMsg] = useState<string | null>(null);

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
        const data = await fetchMastery(userId);
        if (!mounted) return;
        setMastery(data);
        // weak/strong + suggestions from backend modeling
        try {
          const summary = await fetchStudentSummary(userId);
          setWeak(summary.weak || []);
          setStrong(summary.strong || []);
        } catch {}
        try {
          const sugg = await fetchStudentSuggestions(userId);
          setSuggestions(sugg.suggestions || []);
        } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  const items: TopicStat[] = useMemo(() => {
    const list: TopicStat[] = Object.entries(mastery).map(([topic, s]) => ({ topic, correct: s.correct || 0, attempts: s.attempts || 0, accuracy: (s.attempts || 0) > 0 ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0 }));
    let filtered = list.filter((x) => x.attempts >= minAttempts);
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter((x) => x.topic.toLowerCase().includes(q));
    }
    if (onlyWeak) filtered = filtered.filter((x) => x.accuracy < 0.6);
    // stable order by topic for consistent layout
    return filtered.sort((a, b) => a.topic.localeCompare(b.topic));
  }, [mastery, minAttempts, query, onlyWeak]);

  const colorFor = useCallback((acc: number, attempts: number) => {
    if (attempts === 0) return "bg-gray-300 text-black";
    if (acc >= 0.85) return "bg-green-600 text-white";
    if (acc >= 0.6) return "bg-yellow-500 text-black";
    return "bg-red-500 text-white";
  }, []);

  const openTopic = useCallback(async (t: string) => {
    setFocus(t);
    try {
      const [p, n] = await Promise.all([
        fetchPrereqs({ userId, topic: t }),
        fetchNextTopics({ userId, topic: t }),
      ]);
      setPrereqs(p.prereqs || []);
      setNexts(n.next || []);
    } catch {}
  }, [userId]);

  const exportCsv = useCallback(() => {
    const rows = [["Topic","Correct","Attempts","Accuracy"]]
      .concat(items.map((x) => [x.topic, String(x.correct), String(x.attempts), String(Math.round(x.accuracy * 100)) + "%"]));
    const csv = rows.map((r) => r.map((c) => String(c).replace(/"/g, '""')).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mastery-heatmap-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [items]);

  return (
    <div className="mx-auto max-w-6xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mastery Heatmap</h1>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-muted-foreground">Search</label>
          <Input className="h-8 w-48" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Filter topics" />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label>Min attempts</label>
          <input type="range" min={0} max={10} value={minAttempts} onChange={(e)=>setMinAttempts(parseInt(e.target.value))} />
          <span>{minAttempts}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label>Tile</label>
          <input type="range" min={24} max={72} value={tile} onChange={(e)=>setTile(parseInt(e.target.value))} />
          <span>{tile}px</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label>Only weak</label>
          <input type="checkbox" checked={onlyWeak} onChange={(e)=>setOnlyWeak(e.target.checked)} />
        </div>
        <Button size="sm" variant="outline" onClick={exportCsv}>Export CSV</Button>
        <Button size="sm" onClick={async ()=>{
          try {
            setPlanLoading(true); setPlanMsg(null);
            const topics = items.slice(0,5).map(x=>x.topic);
            if (topics.length === 0) { setPlanMsg('No topics to plan.'); return; }
            const goals = topics.map(t => ({ title: `Improve ${t}`, steps: [`Practice ${t} 20 min`, `Review notes for ${t}`, `Take 3 quiz questions on ${t}`], focusTopic: t }));
            const base = process.env.NEXT_PUBLIC_BASE_URL!;
            await fetch(`${base}/api/goals`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, timeframe: 'weekly', items: goals }) });
            setPlanMsg('Weekly plan created. See Mastery → Your Goals.');
          } catch (e) {
            setPlanMsg(e instanceof Error ? e.message : String(e));
          } finally { setPlanLoading(false); }
        }} disabled={planLoading}>{planLoading ? 'Planning…' : 'One-click study plan'}</Button>
      </div>
      {planMsg && <div className="text-xs text-muted-foreground">{planMsg}</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}

      {/* Heatmap grid */}
      <div className="border rounded-md p-3">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground">No topics yet. Practice to build mastery data.</div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${tile}px, 1fr))` }}>
            {items.map((x) => (
              <button key={x.topic} onClick={() => void openTopic(x.topic)} className={`rounded-md border text-[11px] px-1 py-1 ${colorFor(x.accuracy, x.attempts)} hover:opacity-90`} title={`${x.topic} — ${Math.round(x.accuracy*100)}% (${x.correct}/${x.attempts})`}>
                <div className="truncate" style={{ maxWidth: tile + 24 }}>{x.topic}</div>
                <div className="opacity-80">{Math.round(x.accuracy*100)}%</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Topic focus panel */}
      {focus && (
        <div className="grid md:grid-cols-3 gap-3">
          <div className="md:col-span-2 border rounded-md p-3">
            <div className="text-sm font-medium">Topic</div>
            <div className="text-lg font-semibold">{focus}</div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Link href={`/adaptive?topic=${encodeURIComponent(focus)}`} className="underline">Practice this topic</Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-2 mt-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Prerequisites</div>
                <div className="flex flex-wrap gap-2">
                  {prereqs.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                  {prereqs.map((t) => (
                    <Link key={t} href={`#`} onClick={(e)=>{e.preventDefault(); void openTopic(t);}} className="text-[11px] underline">{t}</Link>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Next topics</div>
                <div className="flex flex-wrap gap-2">
                  {nexts.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                  {nexts.map((t) => (
                    <Link key={t} href={`#`} onClick={(e)=>{e.preventDefault(); void openTopic(t);}} className="text-[11px] underline">{t}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border rounded-md p-3 space-y-2">
            <div className="text-sm font-medium">Insights</div>
            <div className="text-xs">Weak (top 5)</div>
            <ul className="text-sm space-y-1">
              {weak.length === 0 && <li className="text-xs text-muted-foreground">None</li>}
              {weak.map((w, i) => (
                <li key={i} className="flex items-center justify-between"><span>{w.topic}</span><span className="text-xs text-muted-foreground">{Math.round((w.accuracy||0)*100)}%</span></li>
              ))}
            </ul>
            <div className="text-xs mt-2">Strong (top 5)</div>
            <ul className="text-sm space-y-1">
              {strong.length === 0 && <li className="text-xs text-muted-foreground">None</li>}
              {strong.map((s, i) => (
                <li key={i} className="flex items-center justify-between"><span>{s.topic}</span><span className="text-xs text-muted-foreground">{Math.round((s.accuracy||0)*100)}%</span></li>
              ))}
            </ul>
            <div className="text-xs mt-2">Suggested next</div>
            <ul className="text-sm space-y-1">
              {suggestions.length === 0 && <li className="text-xs text-muted-foreground">None</li>}
              {suggestions.map((s, i) => (
                <li key={i} className="flex items-center justify-between"><span>{s.topic}</span><span className="text-xs text-muted-foreground">{Math.round((s.pCorrect||0)*100)}% • {s.difficulty}</span></li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Legend: <span className="inline-block rounded px-2 py-0.5 bg-red-500 text-white">weak</span> <span className="inline-block rounded px-2 py-0.5 bg-yellow-500">ok</span> <span className="inline-block rounded px-2 py-0.5 bg-green-600 text-white">strong</span> <span className="inline-block rounded px-2 py-0.5 bg-gray-300">no data</span>
      </div>
    </div>
  );
}
