"use client";

import { useEffect, useMemo, useState } from "react";

type ExamEvent = { createdAt?: string; props?: { sessionId?: string; score?: number; total?: number; sections?: Array<{ name: string; correct: number; total: number }>; items?: Array<{ question?: string; correct?: boolean }>; cheat?: any } };

export default function ExamsAnalyticsPage() {
  const [userId, setUserId] = useState<string>("123");
  const [events, setEvents] = useState<ExamEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => { if (typeof window !== 'undefined') { const uid = window.localStorage.getItem('userId'); if (uid) setUserId(uid); } }, []);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true); setError("");
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        const r = await fetch(`${base}/api/exams/history/${encodeURIComponent(userId)}`);
        if (!r.ok) throw new Error(await r.text());
        const d = await r.json();
        setEvents((d.results || []).slice(0, 100));
      } catch (e: any) { setError(e.message || String(e)); }
      finally { setLoading(false); }
    })();
  }, [userId]);

  const trend = useMemo(() => {
    const pts = events.map((ev) => ({ t: new Date(ev.createdAt || Date.now()).getTime(), s: (ev.props?.score ?? 0) / Math.max(1, ev.props?.total ?? 1) }));
    return pts.sort((a,b)=> a.t - b.t);
  }, [events]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Exams Analytics</h1>
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {trend.length>0 && (
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-1">Score trend</div>
          <svg viewBox="0 0 320 120" className="w-full border rounded bg-white">
            <line x1="30" y1="100" x2="310" y2="100" stroke="#94a3b8" />
            <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" />
            {trend.map((p,i)=>{
              if (i===0) return null; const x = 30 + (i/(trend.length-1))*280; const y = 100 - (p.s*80+0);
              const x0 = 30 + ((i-1)/(trend.length-1))*280; const y0 = 100 - (trend[i-1].s*80+0);
              return <path key={i} d={`M ${x0} ${y0} L ${x} ${y}`} stroke="#2563eb" strokeWidth="2" fill="none" />
            })}
          </svg>
        </div>
      )}
      <div className="grid gap-3">
        {events.map((ev, idx) => (
          <div key={idx} className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{new Date(ev.createdAt || '').toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Score: {ev.props?.score}/{ev.props?.total}</div>
            </div>
            {Array.isArray(ev.props?.sections) && ev.props?.sections?.length>0 && (
              <div className="mt-2 text-xs">
                <div className="font-medium">Sections</div>
                <ul className="grid gap-1">
                  {ev.props!.sections!.map((s,i)=>(<li key={i} className="flex items-center justify-between"><span>{s.name}</span><span>{s.correct}/{s.total}</span></li>))}
                </ul>
              </div>
            )}
            {Array.isArray(ev.props?.items) && ev.props?.items?.length>0 && (
              <div className="mt-2 text-xs">
                <div className="font-medium">Items</div>
                <div className="grid gap-1">
                  {ev.props!.items!.slice(0,10).map((it,i)=>(<div key={i} className={`border rounded px-2 py-1 ${it.correct? 'border-green-600':'border-red-600'}`}>{it.question || 'Item'} — {it.correct? 'correct':'wrong'}</div>))}
                  {ev.props!.items!.length>10 && (<div className="text-muted-foreground">… {ev.props!.items!.length-10} more</div>)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
