"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchLearningPaths, type LearningPathItem, fetchMastery, fetchDueReviews, type DueTopicReview } from "@/lib/api";
import Link from "next/link";
import { computeAccuracy, getProficiencyTier } from "@/lib/mastery";

export default function MasteryMapPage() {
  const [userId, setUserId] = useState("123");
  const [paths, setPaths] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [due, setDue] = useState<DueTopicReview[]>([]);

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

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Mastery Map</h1>
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
