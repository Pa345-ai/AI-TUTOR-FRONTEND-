"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchParentDashboard } from "@/lib/api";

export default function ParentDashboardPage() {
  const [parentId, setParentId] = useState<string>("p-1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ children: Array<{ userId: string; name?: string; progress?: { xp: number; level: number; streak: number }; weak: Array<{ topic: string; accuracy: number }>; strong: Array<{ topic: string; accuracy: number }> }> } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pid = (typeof window !== 'undefined' ? window.localStorage.getItem('parentId') : null) || parentId;
      const res = await fetchParentDashboard(pid);
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [parentId]);

  useEffect(() => { void load(); }, [load]);

  const exportCsv = useCallback(() => {
    if (!data) return;
    const rows: string[] = [];
    rows.push(['userId','name','xp','level','streak','weakTopics','strongTopics'].join(','));
    for (const s of data.children) {
      const weak = (s.weak || []).map(w => `${w.topic}(${Math.round(w.accuracy*100)}%)`).join('; ');
      const strong = (s.strong || []).map(w => `${w.topic}(${Math.round(w.accuracy*100)}%)`).join('; ');
      rows.push([
        s.userId,
        '"' + String(s.name ?? '').replaceAll('"','""') + '"',
        String(s.progress?.xp ?? 0),
        String(s.progress?.level ?? 1),
        String(s.progress?.streak ?? 0),
        '"' + weak.replaceAll('"','""') + '"',
        '"' + strong.replaceAll('"','""') + '"',
      ].join(','));
    }
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parent-dashboard-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Parent Dashboard</h1>
        <button className="h-9 px-3 border rounded-md text-sm" onClick={exportCsv} disabled={!data || (data.children?.length ?? 0) === 0}>Export CSV</button>
      </div>
      <div className="flex items-center gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" value={parentId} onChange={(e)=>setParentId(e.target.value)} placeholder="Parent ID" />
        <button className="h-9 px-3 border rounded-md text-sm" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Load'}</button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {data && (
        <div className="grid gap-3">
          {data.children.map((s) => (
            <div key={s.userId} className="border rounded-md p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">Child: {s.name || s.userId}</div>
                <div className="text-xs text-muted-foreground">XP {s.progress?.xp ?? 0} • Lv {s.progress?.level ?? 1} • Streak {s.progress?.streak ?? 0}</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 mt-2">
                <div>
                  <div className="text-sm font-medium">Needs improvement</div>
                  <ul className="text-sm space-y-1">
                    {s.weak.length === 0 && <li className="text-xs text-muted-foreground">Not enough data</li>}
                    {s.weak.map((w,i)=> (
                      <li key={i}>{w.topic} — {(w.accuracy*100).toFixed(0)}%</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium">Strengths</div>
                  <ul className="text-sm space-y-1">
                    {s.strong.length === 0 && <li className="text-xs text-muted-foreground">Not enough data</li>}
                    {s.strong.map((w,i)=> (
                      <li key={i}>{w.topic} — {(w.accuracy*100).toFixed(0)}%</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
