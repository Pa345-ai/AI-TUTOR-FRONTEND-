"use client";

import { useEffect, useState } from "react";
import { fetchLeaderboard, fetchSeasons, fetchSeasonInfo, fetchLeaderboardFlags, reportSuspicious, type LeaderboardItem, rolloverSeason } from "@/lib/api";

export default function LeaderboardPage() {
  const [items, setItems] = useState<LeaderboardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [season, setSeason] = useState<string>(()=> (typeof window!=='undefined' ? (window.localStorage.getItem('season')||'S1') : 'S1'));
  const [seasons, setSeasons] = useState<Array<{ id: string; name: string; current?: boolean }>>([]);
  const [flags, setFlags] = useState<Array<{ userId: string; reason: string }>>([]);
  const [rolloverAt, setRolloverAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchLeaderboard(10, season);
        if (!mounted) return;
        setItems(data);
        try { const ss = await fetchSeasons(); setSeasons(ss.map(s=>({ id: s.id, name: s.name || s.id, current: s.current }))); } catch {}
        try { const si = await fetchSeasonInfo(season); setRolloverAt(si.rolloverAt || null); } catch {}
        try { const fl = await fetchLeaderboardFlags(season); setFlags(fl); } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [season]);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Leaderboard</h1>
      <div className="flex items-center gap-2 text-xs flex-wrap">
        <label>Season</label>
        <select className="h-8 px-2 border rounded" value={season} onChange={(e)=>{ setSeason(e.target.value); try { window.localStorage.setItem('season', e.target.value); } catch {} }}>
          {seasons.length? seasons.map(s => (<option key={s.id} value={s.id}>{s.name}{s.current?' (current)':''}</option>)) : ['S1','S2','S3','S4'].map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        {rolloverAt && <span className="text-muted-foreground">Rollover: {new Date(rolloverAt).toLocaleString()}</span>}
        <button className="h-7 px-2 border rounded" onClick={async ()=>{ try { const r = await rolloverSeason(season); setSeason(r.nextSeason || season); } catch (e:any) { alert(e.message||String(e)); } }}>Force rollover</button>
        <span className="text-muted-foreground">Anti‑cheat: tab‑blur and proctor events affect standings</span>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <ol className="space-y-2">
        {items.map((u, idx) => (
          <li key={u.userId} className="flex items-center justify-between border rounded-md p-3">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-sm w-6 text-center">#{idx + 1}</span>
              <div className="truncate">
                <div className="font-medium truncate">{u.name ?? u.userId}</div>
                <div className="text-xs text-muted-foreground">Level {u.level ?? "-"}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="font-semibold">{u.xp} XP</div>
              <button className="h-6 px-2 border rounded text-[11px]" onClick={async ()=>{ const reason = prompt('Report suspicious behavior (reason):','proctoring events'); if (!reason) return; try { await reportSuspicious(u.userId, reason); alert('Reported'); } catch (e:any) { alert(e.message||String(e)); } }}>Report</button>
            </div>
          </li>
        ))}
        {(!loading && items.length === 0) && (
          <li className="text-sm text-muted-foreground">No leaderboard data.</li>
        )}
      </ol>
      {flags.length>0 && (
        <div className="border rounded-md p-3 text-xs">
          <div className="font-medium mb-1">Flagged accounts (season)</div>
          <ul className="grid gap-1">
            {flags.map((f,i)=> (<li key={i} className="flex items-center justify-between"><span>{f.userId}</span><span className="text-muted-foreground">{f.reason}</span></li>))}
          </ul>
        </div>
      )}
    </div>
  );
}
