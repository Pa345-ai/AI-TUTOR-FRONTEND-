"use client";

import { useEffect, useMemo, useState } from "react";
import { abAssign, abSet, listAbAssignments, adminListEvents, type AbAssignment } from "@/lib/api";

export default function AbAdminPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [assignments, setAssignments] = useState<AbAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [bucket, setBucket] = useState<'A'|'B'>('A');

  const load = async () => {
    try {
      setLoading(true); setError("");
      const rows = await listAbAssignments();
      setAssignments(rows);
    } catch (e: any) { setError(e.message || String(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { void load(); }, []);

  const perBucket = useMemo(() => {
    const by: Record<string, number> = { A: 0, B: 0 };
    for (const a of assignments) { if (a.bucket === 'A' || a.bucket === 'B') by[a.bucket] += 1; }
    const total = assignments.length || 1;
    return { A: by.A, B: by.B, pA: Math.round((by.A/total)*100), pB: Math.round((by.B/total)*100) };
  }, [assignments]);

  const [events, setEvents] = useState<Array<{ name: string; createdAt?: string; userId?: string; props?: any }>>([]);
  const [range, setRange] = useState<'24h'|'7d'|'30d'>('24h');
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const list = await adminListEvents();
        if (!mounted) return;
        setEvents(list);
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    const delta = range === '24h' ? 24*60*60*1000 : range === '7d' ? 7*24*60*60*1000 : 30*24*60*60*1000;
    return events.filter(e => { const t = new Date(e.createdAt || 0).getTime(); return !isNaN(t) && (now - t) <= delta; });
  }, [events, range]);

  const kpis = useMemo(() => {
    // Example KPIs per bucket from exam results and api latency
    const byBucket: Record<'A'|'B', { exams: number; avgScore: number; latencies: number[] }> = { A: { exams: 0, avgScore: 0, latencies: [] }, B: { exams: 0, avgScore: 0, latencies: [] } };
    const bucketOfUser: Record<string, 'A'|'B'> = {};
    for (const a of assignments) bucketOfUser[a.userId] = a.bucket;
    for (const e of filtered) {
      if (e.name === 'exam.result') {
        const b = bucketOfUser[String(e.userId || '')];
        if (b) {
          const score = (Number(e.props?.score)||0) / Math.max(1, Number(e.props?.total)||1);
          byBucket[b].avgScore = ((byBucket[b].avgScore * byBucket[b].exams) + score) / (byBucket[b].exams + 1);
          byBucket[b].exams += 1;
        }
      } else if (e.name === 'api.latency') {
        const b = bucketOfUser[String(e.userId || '')];
        if (b) { const ms = Number(e.props?.ms||0); if (ms>0) byBucket[b].latencies.push(ms); }
      }
    }
    const pct = (arr: number[], q: number) => {
      if (arr.length === 0) return 0; const s = [...arr].sort((a,b)=>a-b); const idx = Math.min(s.length-1, Math.max(0, Math.floor(q*(s.length-1)))); return s[idx];
    };
    return {
      A: { exams: byBucket.A.exams, avgScore: byBucket.A.avgScore || 0, p90: Math.round(pct(byBucket.A.latencies, 0.9)) },
      B: { exams: byBucket.B.exams, avgScore: byBucket.B.avgScore || 0, p90: Math.round(pct(byBucket.B.latencies, 0.9)) },
    };
  }, [assignments, filtered]);

  return (
    <div className="mx-auto max-w-5xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">A/B Testing</h1>
      {loading && <div className="text-xs text-muted-foreground">Loading…</div>}
      {error && <div className="text-xs text-red-600">{error}</div>}

      <section className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Assign bucket</div>
        <div className="flex items-center gap-2 text-sm">
          <input className="h-8 px-2 border rounded" placeholder="userId" value={userId} onChange={(e)=>setUserId(e.target.value)} />
          <select className="h-8 px-2 border rounded" value={bucket} onChange={(e)=>setBucket(e.target.value as 'A'|'B')}>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
          <button className="h-8 px-3 border rounded" onClick={async ()=>{ if (!userId.trim()) return; await abSet(userId.trim(), bucket); await load(); }}>Set</button>
          <button className="h-8 px-3 border rounded" onClick={async ()=>{ if (!userId.trim()) return; await abAssign(userId.trim()); await load(); }}>Randomize</button>
        </div>
        <div className="text-xs text-muted-foreground">A: {perBucket.A} ({perBucket.pA}%) • B: {perBucket.B} ({perBucket.pB}%)</div>
      </section>

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-2">Assignments</div>
        <div className="max-h-[260px] overflow-auto text-xs grid gap-1">
          {assignments.map((a,i)=> (
            <div key={`${a.userId}-${i}`} className="flex items-center justify-between">
              <span className="truncate mr-2">{a.userId}</span>
              <span className="text-muted-foreground">{a.testName}</span>
              <span className="font-medium">{a.bucket}</span>
              <span className="text-muted-foreground">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</span>
            </div>
          ))}
          {assignments.length===0 && <div className="text-muted-foreground">No assignments.</div>}
        </div>
      </section>

      <section className="border rounded-md p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">Per-bucket KPIs</div>
          <select className="h-8 px-2 border rounded text-xs" value={range} onChange={(e)=>setRange(e.target.value as any)}>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <div className="border rounded p-2">
            <div className="font-medium mb-1">Bucket A</div>
            <div>Exam events: {kpis.A.exams}</div>
            <div>Avg score: {(kpis.A.avgScore*100).toFixed(0)}%</div>
            <div>API p90 latency: {kpis.A.p90}ms</div>
          </div>
          <div className="border rounded p-2">
            <div className="font-medium mb-1">Bucket B</div>
            <div>Exam events: {kpis.B.exams}</div>
            <div>Avg score: {(kpis.B.avgScore*100).toFixed(0)}%</div>
            <div>API p90 latency: {kpis.B.p90}ms</div>
          </div>
        </div>
      </section>
    </div>
  );
}
