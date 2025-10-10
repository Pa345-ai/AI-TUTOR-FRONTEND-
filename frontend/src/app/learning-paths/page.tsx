"use client";

import { useEffect, useState } from "react";
import { fetchLearningPaths, type LearningPathItem } from "@/lib/api";

export default function LearningPathsPage() {
  const [userId, setUserId] = useState("123");
  const [items, setItems] = useState<LearningPathItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        const data = await fetchLearningPaths(userId);
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
  }, [userId]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Learning Paths</h1>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
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
