"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchMastery, fetchPrereqs, fetchNextTopics } from "@/lib/api";

export default function KnowledgeGraphPage() {
  const [userId, setUserId] = useState<string>("123");
  const [subject, setSubject] = useState<string>("math");
  const [topic, setTopic] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [prereqs, setPrereqs] = useState<string[]>([]);
  const [nextTopics, setNextTopics] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const load = async (t: string) => {
    if (!t.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [m, p, n] = await Promise.all([
        fetchMastery(userId),
        fetchPrereqs({ userId, subject, topic: t }),
        fetchNextTopics({ userId, subject, topic: t }),
      ]);
      setMastery(m);
      setPrereqs(p.prereqs || []);
      setNextTopics(n.next || []);
      setTopic(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const accuracyOf = useCallback((t: string) => {
    const s = mastery[t];
    const a = s ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0;
    return a;
  }, [mastery]);

  const colorFor = (acc: number) => {
    if (acc >= 0.85) return "bg-green-600 text-white";
    if (acc >= 0.6) return "bg-yellow-500 text-black";
    if (acc > 0) return "bg-red-500 text-white";
    return "bg-gray-300 text-black";
  };

  const weakList = useMemo(() => {
    const entries = Object.entries(mastery).map(([t, s]) => ({
      t,
      acc: (s.correct || 0) / Math.max(1, s.attempts || 0),
    }));
    return entries.sort((a, b) => a.acc - b.acc).slice(0, 15);
  }, [mastery]);

  const remediationPlan = useMemo(() => {
    const weakPrereqs = prereqs.filter((p) => accuracyOf(p) < 0.6);
    const okPrereqs = prereqs.filter((p) => accuracyOf(p) >= 0.6);
    return [...weakPrereqs, ...okPrereqs, topic].filter(Boolean);
  }, [prereqs, topic, accuracyOf]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Knowledge Graph</h1>
      <div className="grid gap-2">
        <div className="flex items-center gap-2">
          <Input className="w-40" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject (e.g., math)" />
          <Input className="flex-1" value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Topic (e.g., Algebra)" />
          <Button onClick={() => void load(topic)} disabled={!topic.trim() || loading}>{loading ? "Loading…" : "Load"}</Button>
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      {topic && (
        <div className="grid gap-3">
          <div>
            <div className="text-sm font-medium mb-1">Current Topic</div>
            <TopicChip name={topic} acc={accuracyOf(topic)} onClick={() => void load(topic)} />
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Prerequisites</div>
            <div className="flex flex-wrap gap-2">
              {prereqs.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
              {prereqs.map((p) => (
                <TopicChip key={p} name={p} acc={accuracyOf(p)} onClick={() => void load(p)} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium mb-1">Next Topics</div>
            <div className="flex flex-wrap gap-2">
              {nextTopics.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
              {nextTopics.map((n) => (
                <TopicChip key={n} name={n} acc={accuracyOf(n)} onClick={() => void load(n)} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <div className="text-sm font-medium">Remediation Plan</div>
        {remediationPlan.length === 0 ? (
          <div className="text-xs text-muted-foreground">Load a topic to generate a plan.</div>
        ) : (
          <ol className="list-decimal pl-5 text-sm space-y-1">
            {remediationPlan.map((t, i) => (
              <li key={`${t}-${i}`}>
                <span className={`inline-block rounded px-2 py-0.5 ${colorFor(accuracyOf(t))}`}>{t}</span>
                <a href={`/adaptive?topic=${encodeURIComponent(t)}`} className="ml-2 underline">Practice</a>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="grid gap-2">
        <div className="text-sm font-medium">Mastery Heatmap (lowest first)</div>
        <div className="flex flex-wrap gap-2">
          {weakList.map(({ t, acc }) => (
            <TopicChip key={t} name={t} acc={acc} onClick={() => void load(t)} />
          ))}
          {weakList.length === 0 && <span className="text-xs text-muted-foreground">No mastery data yet.</span>}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Legend: <span className="inline-block rounded px-2 py-0.5 bg-red-500 text-white">weak</span> <span className="inline-block rounded px-2 py-0.5 bg-yellow-500">ok</span> <span className="inline-block rounded px-2 py-0.5 bg-green-600 text-white">strong</span> <span className="inline-block rounded px-2 py-0.5 bg-gray-300">no data</span>
      </div>
    </div>
  );

  function TopicChip({ name, acc, onClick }: { name: string; acc: number; onClick?: () => void }) {
    return (
      <button onClick={onClick} className={`text-xs rounded px-2 py-1 border ${colorFor(acc)} hover:opacity-90`}>{name} {(acc>0 ? `• ${(acc*100).toFixed(0)}%` : '')}</button>
    );
  }
}
