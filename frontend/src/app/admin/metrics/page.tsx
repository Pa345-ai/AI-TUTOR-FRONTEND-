"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStudentTrends, fetchMastery, fetchDueReviews } from "@/lib/api";

type EventItem = { name: string; createdAt?: string; userId?: string; props?: Record<string, any> };

type RangeKey = "24h" | "7d" | "30d";

export default function AdminMetricsDashboards() {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [range, setRange] = useState<RangeKey>("24h");
  const [nameFilter, setNameFilter] = useState("");
  const [pathFilter, setPathFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [trend, setTrend] = useState<Array<{ d: string; acc: number }>>([]);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [due, setDue] = useState<Array<{ topic: string }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setError("");
        const r = await fetch(`${base}/api/admin/events`);
        if (!r.ok) throw new Error(await r.text());
        const d = await r.json();
        if (!mounted) return;
        setEvents((d.events || []) as EventItem[]);
      } catch (e: any) { if (mounted) setError(e.message || String(e)); }
      finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, [base]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const delta = range === "24h" ? 24*60*60*1000 : range === "7d" ? 7*24*60*60*1000 : 30*24*60*60*1000;
    return events.filter(e => {
      const t = new Date(e.createdAt || 0).getTime();
      const okTime = !isNaN(t) && (now - t) <= delta;
      const okName = !nameFilter || (e.name||"").includes(nameFilter);
      const okPath = !pathFilter || String(e.props?.path||"").includes(pathFilter);
      const okUser = !userFilter || String(e.userId||"")===userFilter;
      return okTime && okName && okPath && okUser;
    });
  }, [events, range, nameFilter, pathFilter, userFilter]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!userFilter) { setTrend([]); setMastery({}); setDue([]); return; }
      try {
        const [t, m, d] = await Promise.all([
          fetchStudentTrends(userFilter, 30).catch(()=>({ trends: [] })),
          fetchMastery(userFilter).catch(()=>({} as any)),
          fetchDueReviews(userFilter, 200).catch(()=>[] as any),
        ]);
        if (!mounted) return;
        const tr = (t.trends || []).map((x: any) => ({ d: x.date, acc: Math.round((x.correct/Math.max(1,x.attempts))*100) }));
        setTrend(tr);
        setMastery(m || {});
        setDue(Array.isArray(d) ? d as any : (d?.due || []));
      } catch {}
    })();
    return () => { mounted = false; };
  }, [userFilter]);

  const latenciesByPath = useMemo(() => {
    const groups: Record<string, number[]> = {};
    for (const e of filtered) {
      if (e.name !== 'api.latency') continue;
      const p = String(e.props?.path || '');
      const ms = Number(e.props?.ms || 0);
      if (!p || !(ms > 0)) continue;
      if (!groups[p]) groups[p] = [];
      groups[p].push(ms);
    }
    const pct = (arr: number[], q: number) => {
      if (arr.length === 0) return 0;
      const s = [...arr].sort((a,b)=>a-b);
      const idx = Math.min(s.length-1, Math.max(0, Math.floor(q * (s.length-1))));
      return s[idx];
    };
    return Object.entries(groups).map(([path, arr]) => ({ path, p50: Math.round(pct(arr, 0.5)), p90: Math.round(pct(arr, 0.9)), p99: Math.round(pct(arr, 0.99)), count: arr.length }));
  }, [filtered]);

  const throughput = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of filtered) {
      if (e.name !== 'api.latency') continue;
      const p = String(e.props?.path || '');
      if (!p) continue;
      counts[p] = (counts[p] || 0) + 1;
    }
    return Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,15);
  }, [filtered]);

  const dau_mau = useMemo(() => {
    const byDay: Record<string, Set<string>> = {};
    const allUsers = new Set<string>();
    for (const e of filtered) {
      const day = (e.createdAt || '').slice(0, 10);
      const uid = String(e.userId || '') || 'anon';
      allUsers.add(uid);
      if (!byDay[day]) byDay[day] = new Set();
      byDay[day].add(uid);
    }
    const days = Object.entries(byDay).sort((a,b)=> a[0].localeCompare(b[0]));
    const dau = days.length>0 ? days[days.length-1][1].size : 0;
    const mau = allUsers.size;
    return { dau, mau, daily: days.map(([d,s]) => ({ d, n: s.size })) };
  }, [filtered]);

  const featureUsage = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const e of filtered) {
      counts[e.name] = (counts[e.name] || 0) + 1;
    }
    return Object.entries(counts).sort((a,b)=> b[1]-a[1]).slice(0,20);
  }, [filtered]);

  const examTrend = useMemo(() => {
    const list = filtered.filter(e => e.name === 'exam.result').map(e => ({ t: new Date(e.createdAt || 0).getTime(), s: (Number(e.props?.score)||0) / Math.max(1, Number(e.props?.total)||1) }));
    return list.sort((a,b)=> a.t - b.t);
  }, [filtered]);

  return (
    <div className="mx-auto max-w-5xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Metrics Dashboards</h1>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <label>Range</label>
        <select className="h-8 px-2 border rounded" value={range} onChange={(e)=> setRange(e.target.value as RangeKey)}>
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
        </select>
        <input className="h-8 px-2 border rounded" placeholder="Filter event name" value={nameFilter} onChange={(e)=>setNameFilter(e.target.value)} />
        <input className="h-8 px-2 border rounded" placeholder="Filter path" value={pathFilter} onChange={(e)=>setPathFilter(e.target.value)} />
        <input className="h-8 px-2 border rounded" placeholder="User ID (for KPIs)" value={userFilter} onChange={(e)=>setUserFilter(e.target.value)} />
      </div>
      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-1">Latency percentiles by API</div>
        <div className="grid gap-1 text-xs">
          {latenciesByPath.map((row) => (
            <div key={row.path} className="flex items-center justify-between">
              <span className="truncate mr-2">{row.path}</span>
              <span>p50 {row.p50}ms • p90 {row.p90}ms • p99 {row.p99}ms • {row.count}</span>
            </div>
          ))}
          {latenciesByPath.length===0 && <div className="text-muted-foreground text-xs">No latency events.</div>}
        </div>
      </section>

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-2">Throughput (top endpoints)</div>
        <div className="grid gap-1 text-xs">
          {throughput.map(([path, n], i) => (
            <div key={path} className="flex items-center gap-2">
              <span className="w-8 text-right">{n}</span>
              <div className="h-2 bg-muted rounded flex-1"><div className="h-full bg-blue-600 rounded" style={{ width: `${Math.min(100, (n / Math.max(1, throughput[0]?.[1] || 1))*100)}%` }} /></div>
              <span className="truncate ml-2">{path}</span>
            </div>
          ))}
          {throughput.length===0 && <div className="text-muted-foreground text-xs">No API throughput data.</div>}
        </div>
      </section>

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-1">DAU / MAU</div>
        <div className="text-xs">DAU: {dau_mau.dau} • MAU: {dau_mau.mau}</div>
        <svg viewBox="0 0 320 120" className="w-full border rounded bg-white mt-2">
          <line x1="30" y1="100" x2="310" y2="100" stroke="#94a3b8" />
          <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" />
          {dau_mau.daily.map((d,i)=>{
            const x = 30 + (i/Math.max(1, dau_mau.daily.length-1))*280; const y = 100 - Math.min(80, d.n);
            return <circle key={d.d} cx={x} cy={y} r={2} fill="#16a34a" />
          })}
        </svg>
      </section>

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-2">Feature usage (top events)</div>
        <div className="grid gap-1 text-xs">
          {featureUsage.map(([name, n]) => (
            <div key={name} className="flex items-center justify-between">
              <span className="truncate mr-2">{name}</span>
              <span>{n}</span>
            </div>
          ))}
          {featureUsage.length===0 && <div className="text-muted-foreground text-xs">No usage events.</div>}
        </div>
      </section>

      <section className="border rounded-md p-3">
        <div className="text-sm font-medium mb-1">Learning KPIs (exam score trend)</div>
        {examTrend.length===0 && <div className="text-xs text-muted-foreground">No exam results available.</div>}
        {examTrend.length>0 && (
          <svg viewBox="0 0 320 120" className="w-full border rounded bg-white">
            <line x1="30" y1="100" x2="310" y2="100" stroke="#94a3b8" />
            <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" />
            {examTrend.map((p,i)=>{
              if (i===0) return null; const x = 30 + (i/(examTrend.length-1))*280; const y = 100 - (p.s*80+0);
              const x0 = 30 + ((i-1)/(examTrend.length-1))*280; const y0 = 100 - (examTrend[i-1].s*80+0);
              return <path key={i} d={`M ${x0} ${y0} L ${x} ${y}`} stroke="#ef4444" strokeWidth="2" fill="none" />
            })}
          </svg>
        )}
        <div className="text-xs text-muted-foreground mt-1">Use User ID filter for per-user mastery and review KPIs.</div>
      </section>

      {userFilter && (
        <section className="border rounded-md p-3">
          <div className="text-sm font-medium mb-1">User KPIs — {userFilter}</div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium">Accuracy trend (last 30d)</div>
              {trend.length===0 ? (
                <div className="text-xs text-muted-foreground">No trend data.</div>
              ) : (
                <svg viewBox="0 0 320 120" className="w-full border rounded bg-white">
                  <line x1="30" y1="100" x2="310" y2="100" stroke="#94a3b8" />
                  <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" />
                  {trend.map((p,i)=>{
                    if (i===0) return null; const x = 30 + (i/(trend.length-1))*280; const y = 100 - (Math.min(100, Math.max(0, p.acc))*0.8);
                    const x0 = 30 + ((i-1)/(trend.length-1))*280; const y0 = 100 - (Math.min(100, Math.max(0, trend[i-1].acc))*0.8);
                    return <path key={i} d={`M ${x0} ${y0} L ${x} ${y}`} stroke="#16a34a" strokeWidth="2" fill="none" />
                  })}
                </svg>
              )}
            </div>
            <div>
              <div className="text-xs font-medium">Review adherence</div>
              <div className="text-xs text-muted-foreground">Due flashcards: {due.length}</div>
              <div className="mt-1 h-2 bg-muted rounded">
                <div className={`h-full ${due.length<=20? 'bg-green-600' : due.length<=50? 'bg-yellow-500' : 'bg-red-600'}`} style={{ width: `${Math.min(100, Math.round((Math.max(0, 100 - due.length)/100)*100))}%` }} />
              </div>
              <div className="text-[11px] text-muted-foreground">Lower due counts indicate better adherence.</div>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs font-medium">Mastery distribution (top 10 by attempts)</div>
            <svg viewBox="0 0 320 140" className="w-full border rounded bg-white">
              {(() => {
                const arr = Object.entries(mastery).map(([topic, s]) => ({ topic, attempts: s.attempts||0, acc: Math.round(((s.correct||0)/Math.max(1,(s.attempts||1)))*100) }));
                const top = arr.sort((a,b)=> b.attempts - a.attempts).slice(0, 10);
                const barW = 280 / Math.max(1, top.length);
                return top.map((x,i)=>{
                  const x0 = 30 + i*barW + 4; const h = (x.acc/100)*100; const y = 120 - h;
                  return <g key={x.topic}><rect x={x0} y={y} width={barW-8} height={h} fill="#2563eb" /><text x={x0} y={130} fontSize="8" transform={`rotate(45 ${x0} 130)`}>
                    {x.topic.slice(0,12)}</text></g>;
                });
              })()}
            </svg>
          </div>
        </section>
      )}
    </div>
  );
}
