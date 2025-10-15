"use client";

import { useEffect, useMemo, useState } from "react";
import { getExposureConfig, setExposureConfig, getExposureHotlist, enforceExposureNow, scanItemDrift, recalibrateItemBank, reestimateIRTAll, recalibrateAbilitiesNow } from "@/lib/api";

export default function AdminPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ id: string; userId: string; content: string; createdAt?: string }>>([]);
  const [metrics, setMetrics] = useState<Record<string, unknown>>({});
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [items, setItems] = useState<Array<{ id: string; topic: string; subject?: string; difficulty?: string; question: string; tags?: string[]; skills?: string[]; standards?: string[]; graphNodes?: string[] }>>([]);
  const [filter, setFilter] = useState<{ q: string; subject: string; difficulty: string }>({ q: "", subject: "", difficulty: "" });
  const [sortBy, setSortBy] = useState<'created'|'difficulty'|'topic'>('created');
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const selectedIds = useMemo(()=> Object.keys(selected).filter(k=>selected[k]), [selected]);
  const [itemCsv, setItemCsv] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [irt, setIrt] = useState<{ aDiscrimination: number; bDifficulty: number } | null>(null);
  const [attempts, setAttempts] = useState<Array<{ correct: boolean; userAbility: number; createdAt: string }>>([]);
  const [irtMap, setIrtMap] = useState<Array<{ id: string; subject?: string; topic: string; irt?: { aDiscrimination: number; bDifficulty: number } }>>([]);
  const [jobs, setJobs] = useState<Array<{ id?: string; name: string; createdAt?: string; props?: any }>>([]);
  const [exposureCfg, setExposureCfg] = useState<{ capPerItemPerUser?: number; windowDays?: number; perTopicDailyCap?: number }>({ capPerItemPerUser: 3, windowDays: 7 });
  const [hotlist, setHotlist] = useState<Array<{ id: string; topic?: string; subject?: string; exposures: number }>>([]);
  const [examEvents, setExamEvents] = useState<Array<{ createdAt?: string; userId?: string; sessionId?: string; score?: number; total?: number; cheat?: any }>>([]);
  const [audits, setAudits] = useState<Array<{ id?: string; userId?: string; action?: string; target?: string; createdAt?: string }>>([]);
  const [auditFilter, setAuditFilter] = useState<{ action: string; q: string }>({ action: '', q: '' });
  const [deletions, setDeletions] = useState<Array<{ id: string; userId: string; reason?: string; status?: string; createdAt?: string }>>([]);
  const [delFilter, setDelFilter] = useState<{ status: string; q: string }>({ status: '', q: '' });

  const loadAll = async () => {
    try {
      const [f, m, mm, ib, irts, jb, au, del, ex] = await Promise.all([
        fetch(`${base}/api/admin/flags`).then(r=>r.json()),
        fetch(`${base}/api/admin/mod/messages`).then(r=>r.json()),
        fetch(`${base}/api/admin/metrics`).then(r=>r.json()),
        fetch(`${base}/api/items`).then(r=>r.json()).catch(()=>({ items: [] })),
        fetch(`${base}/api/items/irt`).then(r=>r.json()).catch(()=>({ items: [] })),
        fetch(`${base}/api/items/jobs`).then(r=>r.json()).catch(()=>({ jobs: [] })),
        fetch(`${base}/api/admin/audit`).then(r=>r.json()).catch(()=>({ logs: [] })),
        fetch(`${base}/api/admin/deletions`).then(r=>r.json()).catch(()=>({ deletions: [] })),
        fetch(`${base}/api/admin/events?name=exam.result`).then(r=>r.json()).catch(()=>({ events: [] })),
      ]);
      setFlags(f.flags || {});
      setMessages((m.messages || []).map((x: { id?: string; userId: string; content: string; createdAt?: string }) => ({ id: x.id || crypto.randomUUID(), userId: x.userId, content: x.content, createdAt: x.createdAt })));
      setMetrics(mm || {} as Record<string, unknown>);
      setItems((ib.items || []).map((x: any)=>({ id: x.id, topic: x.topic, subject: x.subject, difficulty: x.difficulty, question: x.question, tags: x.tags || [], skills: x.skills || [], standards: x.standards || [], graphNodes: x.graphNodes || [] })));
      setIrtMap((irts.items || []).map((x: any)=>({ id: x.id, subject: x.subject, topic: x.topic, irt: x.irt })));
      setJobs((jb.jobs || []).map((j: any)=>({ id: j.id, name: j.name, createdAt: j.createdAt, props: j.props })));
      setAudits((au.logs || []).map((x: any)=>({ id: x.id, userId: x.userId, action: x.action, target: x.target, createdAt: x.createdAt })));
      setDeletions((del.deletions || []).map((d: any)=>({ id: d.id, userId: d.userId, reason: d.reason, status: d.status, createdAt: d.createdAt })));
      setExamEvents((ex.events || []).map((e: any)=>({ createdAt: e.createdAt, userId: e.userId, sessionId: e.props?.sessionId, score: e.props?.score, total: e.props?.total, cheat: e.props?.cheat })));
    } catch {}
  };

  useEffect(() => { void loadAll(); (async()=>{ try { const c = await getExposureConfig(); if (c?.config) setExposureCfg(c.config); const h = await getExposureHotlist(); setHotlist(h.items||[]); } catch {} })(); }, []);

  const updateFlag = async () => {
    if (!newKey.trim()) return;
    await fetch(`${base}/api/admin/flags`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: newKey.trim(), value: newVal }) });
    setNewKey("");
    void loadAll();
  };

  return (
    <div className="mx-auto max-w-5xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Admin Console</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Feature Flags</div>
          <div className="flex items-center gap-2">
            <input className="h-9 px-2 border rounded-md text-sm" placeholder="flag key" value={newKey} onChange={(e)=>setNewKey(e.target.value)} />
            <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={newVal} onChange={(e)=>setNewVal(e.target.checked)} /> on</label>
            <button className="h-9 px-3 border rounded-md text-sm" onClick={updateFlag}>Save</button>
          </div>
          <ul className="text-sm space-y-1">
            {Object.keys(flags).length === 0 && <li className="text-xs text-muted-foreground">No flags.</li>}
            {Object.entries(flags).map(([k,v]) => (
              <li key={k} className="flex items-center justify-between"><span>{k}</span><span className="text-xs text-muted-foreground">{String(v)}</span></li>
            ))}
          </ul>
        </div>
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Metrics</div>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(metrics, null, 2)}</pre>
          <button className="h-9 px-3 border rounded-md text-sm" onClick={()=>void loadAll()}>Refresh</button>
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Exams: Proctoring Evidence</div>
        <div className="text-xs text-muted-foreground">Recent exam results with attached anti‑cheat/proctoring events. Click to expand.</div>
        <div className="max-h-[260px] overflow-auto grid gap-1 text-xs">
          {examEvents.map((e,i)=> (
            <details key={i} className="border rounded-md p-2">
              <summary className="flex items-center justify-between cursor-pointer">
                <span>{e.userId} — {e.score}/{e.total}</span>
                <span className="text-muted-foreground">{e.createdAt ? new Date(e.createdAt).toLocaleString() : ''}</span>
              </summary>
              <div className="mt-2">
                <div className="font-medium mb-1">Cheat events</div>
                <pre className="whitespace-pre-wrap bg-muted rounded p-2 overflow-auto max-h-40">{JSON.stringify(e.cheat || {}, null, 2)}</pre>
              </div>
            </details>
          ))}
          {examEvents.length===0 && <div className="text-muted-foreground">No exam events.</div>}
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">GDPR Deletion Requests</div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <select className="h-8 px-2 border rounded-md" value={delFilter.status} onChange={(e)=>setDelFilter({...delFilter, status: e.target.value})}>
            <option value="">All</option>
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="denied">denied</option>
          </select>
          <input className="h-8 px-2 border rounded-md" placeholder="User/reason contains" value={delFilter.q} onChange={(e)=>setDelFilter({...delFilter, q: e.target.value})} />
          <button className="h-8 px-2 border rounded-md" onClick={()=>void loadAll()}>Refresh</button>
        </div>
        <div className="max-h-[260px] overflow-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-[11px] text-muted-foreground"><th className="px-1 py-1">Time</th><th className="px-1 py-1">User</th><th className="px-1 py-1">Reason</th><th className="px-1 py-1">Status</th><th className="px-1 py-1">Action</th></tr></thead>
            <tbody>
              {deletions
                .filter(d => !delFilter.status || (d.status||'')===delFilter.status)
                .filter(d => !delFilter.q || (d.userId||'').includes(delFilter.q) || (d.reason||'').includes(delFilter.q))
                .map((d,i)=> (
                  <tr key={d.id || i} className="border-t">
                    <td className="px-1 py-1">{d.createdAt ? new Date(d.createdAt).toLocaleString() : ''}</td>
                    <td className="px-1 py-1">{d.userId}</td>
                    <td className="px-1 py-1">{d.reason}</td>
                    <td className="px-1 py-1">{d.status || 'pending'}</td>
                    <td className="px-1 py-1 space-x-1">
                      <button className="h-7 px-2 border rounded-md" onClick={async ()=>{ await fetch(`${base}/api/admin/deletions/${encodeURIComponent(d.id)}/decide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: true, adminId: (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : '') || 'admin' }) }); await loadAll(); }}>Approve</button>
                      <button className="h-7 px-2 border rounded-md" onClick={async ()=>{ await fetch(`${base}/api/admin/deletions/${encodeURIComponent(d.id)}/decide`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved: false, adminId: (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : '') || 'admin' }) }); await loadAll(); }}>Deny</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="border rounded-md p-3">
        <div className="text-sm font-medium mb-2">Recent Messages (Moderation)</div>
        <div className="grid gap-1 text-sm max-h-[320px] overflow-y-auto">
          {messages.length === 0 && <div className="text-xs text-muted-foreground">No messages.</div>}
          {messages.map((m) => (
            <div key={m.id} className="flex items-center justify-between">
              <div className="truncate mr-2"><span className="text-xs text-muted-foreground mr-2">{m.userId}</span>{m.content}</div>
              <div className="text-[11px] text-muted-foreground">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ''}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Item Exposure Controls</div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <label className="flex items-center justify-between gap-2">Cap per item/user
            <input type="number" className="h-8 px-2 border rounded-md w-24" value={exposureCfg.capPerItemPerUser ?? 3} onChange={(e)=>setExposureCfg({...exposureCfg, capPerItemPerUser: parseInt(e.target.value||'0')||0})} />
          </label>
          <label className="flex items-center justify-between gap-2">Window (days)
            <input type="number" className="h-8 px-2 border rounded-md w-24" value={exposureCfg.windowDays ?? 7} onChange={(e)=>setExposureCfg({...exposureCfg, windowDays: parseInt(e.target.value||'0')||0})} />
          </label>
          <label className="flex items-center justify-between gap-2">Per-topic daily cap
            <input type="number" className="h-8 px-2 border rounded-md w-24" value={exposureCfg.perTopicDailyCap ?? 0} onChange={(e)=>setExposureCfg({...exposureCfg, perTopicDailyCap: parseInt(e.target.value||'0')||0})} />
          </label>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ try { await setExposureConfig(exposureCfg); alert('Saved exposure config'); } catch (e) { alert(String(e)); } }}>Save Config</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ try { await enforceExposureNow(); const h = await getExposureHotlist(); setHotlist(h.items||[]); } catch {} }}>Enforce now</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ try { const d = await scanItemDrift({ aRelThreshold: 0.25, bAbsThreshold: 150, minAttempts: 100 }); alert(`Drifted: ${d.drifted?.length||0}`); } catch (e) { alert(String(e)); } }}>Scan drift</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ try { await recalibrateItemBank(); await reestimateIRTAll(); alert('Recalibration jobs started'); } catch (e) { alert(String(e)); } }}>Start recalibration</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ try { await recalibrateAbilitiesNow(); alert('Person ability recalibration queued'); } catch (e) { alert(String(e)); } }}>Recalibrate abilities</button>
        </div>
        <div>
          <div className="text-xs font-medium mb-1">Exposure hotlist</div>
          <div className="max-h-[160px] overflow-auto grid gap-1 text-xs">
            {hotlist.map((h,i)=> (
              <div key={h.id||i} className="flex items-center justify-between border rounded p-1">
                <span className="truncate mr-2">{h.subject? h.subject+': ' : ''}{h.topic||h.id}</span>
                <span className="text-muted-foreground">{h.exposures}</span>
              </div>
            ))}
            {hotlist.length===0 && <div className="text-muted-foreground">No recent exposure spikes.</div>}
          </div>
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Item Bank</div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <button className="h-8 px-2 border rounded-md" onClick={loadAll}>Refresh</button>
          <input className="h-8 px-2 border rounded-md" placeholder="Search question/topic" value={filter.q} onChange={(e)=>setFilter({...filter, q: e.target.value})} />
          <input className="h-8 px-2 border rounded-md" placeholder="Subject" value={filter.subject} onChange={(e)=>setFilter({...filter, subject: e.target.value})} />
          <select className="h-8 px-2 border rounded-md" value={filter.difficulty} onChange={(e)=>setFilter({...filter, difficulty: e.target.value})}>
            <option value="">All</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
          <select className="h-8 px-2 border rounded-md" value={sortBy} onChange={(e)=>setSortBy(e.target.value as any)}>
            <option value="created">Newest</option>
            <option value="difficulty">Difficulty</option>
            <option value="topic">Topic</option>
          </select>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            const r = await fetch(`${base}/api/items/export`); const d = await r.json(); const rows = [ ['id','subject','topic','difficulty','question'].join(',') ] as string[]; for (const it of (d.items||[])) rows.push([it.id,it.subject||'',it.topic||'',it.difficulty||'',(it.question||'').replace(/\n|\r|,/g,' ')].join(',')); setItemCsv(rows.join('\n'));
          }}>Export CSV</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            const lines = itemCsv.split(/\r?\n/).slice(1).filter(Boolean); const items = lines.map((ln)=>{ const [id,subject,topic,difficulty,question] = ln.split(','); return { subject: subject||null, topic, difficulty: (['easy','medium','hard'].includes(difficulty||'')?difficulty:'medium'), question, options: [], correctAnswer: '', explanation: '' }; });
            await fetch(`${base}/api/items/import`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
            await loadAll();
          }}>Import CSV</button>
          {selectedIds.length>0 && (
            <>
              <span className="text-[11px] text-muted-foreground">{selectedIds.length} selected</span>
              <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
                const newDiff = prompt('Set difficulty for selected (easy|medium|hard):','medium');
                if (!newDiff || !['easy','medium','hard'].includes(newDiff)) return;
                for (const id of selectedIds) { await fetch(`${base}/api/items/${encodeURIComponent(id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ difficulty: newDiff }) }); }
                setSelected({}); await loadAll();
              }}>Set Difficulty</button>
              <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
                const tagStr = prompt('Add tags (space-separated):','review'); if (!tagStr) return; const tags = tagStr.trim().split(/\s+/);
                for (const id of selectedIds) { await fetch(`${base}/api/items/${encodeURIComponent(id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ tags }) }); }
                setSelected({}); await loadAll();
              }}>Set Tags</button>
            </>
          )}
        </div>
        <textarea className="w-full min-h-[120px] border rounded-md p-2 text-xs" placeholder="CSV here" value={itemCsv} onChange={(e)=>setItemCsv(e.target.value)} />
        <div className="grid gap-2 text-xs max-h-[260px] overflow-auto">
          {items
            .filter(it => !filter.q || it.question.toLowerCase().includes(filter.q.toLowerCase()) || it.topic.toLowerCase().includes(filter.q.toLowerCase()))
            .filter(it => !filter.subject || (it.subject||'').toLowerCase().includes(filter.subject.toLowerCase()))
            .filter(it => !filter.difficulty || (it.difficulty||'')===filter.difficulty)
            .sort((a,b)=> sortBy==='topic' ? a.topic.localeCompare(b.topic) : sortBy==='difficulty' ? (a.difficulty||'').localeCompare(b.difficulty||'') : 0)
            .map((it)=> (
            <div key={it.id} className={`border rounded-md p-2 ${selectedItemId===it.id?'ring-1 ring-blue-500':''}`} onClick={async ()=>{
              setSelectedItemId(it.id); setIrt(null); setAttempts([]);
              try {
                const r1 = await fetch(`${base}/api/items/${encodeURIComponent(it.id)}/attempts`); const a = await r1.json(); setAttempts(a.attempts||[]);
                const r2 = await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`); const d = await r2.json(); if (d.item && d.item.irt) setIrt(d.item.irt);
              } catch {}
            }}>
              <div className="flex items-center justify-between">
                <div className="font-medium flex items-center gap-2">
                  <input type="checkbox" checked={!!selected[it.id]} onChange={(e)=>{ e.stopPropagation(); setSelected(s=>({ ...s, [it.id]: e.target.checked })); }} />
                  <span>{it.topic} — {it.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <input className="w-36 border rounded px-1" defaultValue={(it.tags||[]).join(' ')} placeholder="tags" onBlur={async (e)=>{ await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ tags: e.target.value.trim()? e.target.value.trim().split(/\s+/) : [] }) }); await loadAll(); }} />
                  <input className="w-36 border rounded px-1" defaultValue={(it.skills||[]).join(' ')} placeholder="skills" onBlur={async (e)=>{ await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ skills: e.target.value.trim()? e.target.value.trim().split(/\s+/) : [] }) }); await loadAll(); }} />
                  <input className="w-40 border rounded px-1" defaultValue={(it.standards||[]).join(' ')} placeholder="standards" onBlur={async (e)=>{ await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ standards: e.target.value.trim()? e.target.value.trim().split(/\s+/) : [] }) }); await loadAll(); }} />
                  <input className="w-40 border rounded px-1" defaultValue={(it.graphNodes||[]).join(' ')} placeholder="graph nodes" onBlur={async (e)=>{ await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ graphNodes: e.target.value.trim()? e.target.value.trim().split(/\s+/) : [] }) }); await loadAll(); }} />
                  <button className="h-7 px-2 border rounded-md" onClick={async (ev)=>{ ev.stopPropagation(); await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`, { method:'PATCH', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ difficulty: it.difficulty==='easy'?'medium': it.difficulty==='medium'?'hard':'easy' }) }); await loadAll(); }}>Toggle Difficulty</button>
                </div>
              </div>
              <div className="mt-1">{it.question}</div>
            </div>
          ))}
        </div>
        {selectedItemId && (
          <div className="mt-3 grid md:grid-cols-2 gap-3 text-xs">
            <div className="border rounded-md p-2 space-y-2">
              <div className="font-medium mb-1">IRT Estimation</div>
              <div className="flex items-center gap-2">
                <button className="h-7 px-2 border rounded-md" onClick={async ()=>{ const r = await fetch(`${base}/api/items/${encodeURIComponent(selectedItemId)}/irt/estimate`, { method: 'POST' }); const d = await r.json(); setIrt(d.irt || null); }}>Estimate IRT</button>
                {irt && (<div className="text-[11px]">a={Math.round((irt.aDiscrimination/1000)*100)/100} b={irt.bDifficulty}</div>)}
              </div>
              {irt && (
                <div className="space-y-2">
                  <div className="text-xs font-medium">Item Characteristic Curve (ICC)</div>
                  <svg viewBox="0 0 200 120" className="w-full border rounded">
                    {Array.from({ length: 100 }).map((_,i)=>{
                      const theta = 500 + (i/99)*2000; // 500..2500
                      const a = irt.aDiscrimination/1000; const b = irt.bDifficulty; const c = 0.2;
                      const z = a * (theta - b); const L = 1/(1+Math.exp(-z)); const p = c + (1-c)*L;
                      const x = i * 2; const y = 110 - p*100;
                      return i===0? null : <path key={i} d={`M ${(i-1)*2} ${110 - (c + (1-c)*(1/(1+Math.exp(-a*((500+((i-1)/99)*2000)-b)))))*100} L ${x} ${y}`} stroke="#2563eb" strokeWidth="2" fill="none" />
                    })}
                  </svg>
                  <div className="text-xs font-medium mt-2">Person map (ability vs correctness)</div>
                  <svg viewBox="0 0 240 120" className="w-full border rounded bg-white">
                    <line x1="30" y1="100" x2="230" y2="100" stroke="#94a3b8" />
                    <line x1="30" y1="20" x2="30" y2="100" stroke="#94a3b8" />
                    {(attempts||[]).slice(0,300).map((a,i)=>{
                      const theta = Math.max(500, Math.min(2500, a.userAbility || 1500));
                      const x = 30 + ((theta - 500)/2000)*200;
                      const yBase = a.correct ? 30 : 90;
                      const y = yBase + ((i%5)-2)*1.2; // slight jitter
                      return <circle key={i} cx={x} cy={y} r={2} fill={a.correct? '#16a34a':'#ef4444'} />
                    })}
                    {/* optional ICC overlay at y-scale 20-100 */}
                    {irt && Array.from({ length: 100 }).map((_,i)=>{
                      const theta = 500 + (i/99)*2000; const a = irt.aDiscrimination/1000; const b = irt.bDifficulty; const c = 0.2;
                      const z = a*(theta-b); const L = 1/(1+Math.exp(-z)); const p = c + (1-c)*L;
                      const x = 30 + (i/99)*200; const y = 100 - (p*70+10);
                      if (i===0) return null;
                      const prevTheta = 500 + ((i-1)/99)*2000; const prevZ = a*(prevTheta-b); const prevL = 1/(1+Math.exp(-prevZ)); const prevP = c + (1-c)*prevL; const prevX = 30 + ((i-1)/99)*200; const prevY = 100 - (prevP*70+10);
                      return <path key={i} d={`M ${prevX} ${prevY} L ${x} ${y}`} stroke="#2563eb" strokeWidth="1" fill="none" />
                    })}
                  </svg>
                </div>
              )}
            </div>
            <div className="border rounded-md p-2">
              <div className="font-medium mb-1">Recent Attempts</div>
              <div className="max-h-[140px] overflow-auto space-y-1">
                {attempts.map((a,i)=> (
                  <div key={i} className="flex justify-between"><span>{new Date(a.createdAt).toLocaleString()}</span><span>{a.userAbility}</span><span className={a.correct? 'text-green-600':'text-red-600'}>{a.correct? 'correct':'wrong'}</span></div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ await fetch(`${base}/api/items/recalibrate`, { method: 'POST' }); await loadAll(); }}>Recalibrate (difficulty)</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{ await fetch(`${base}/api/items/irt/reestimate-all`, { method: 'POST' }); await loadAll(); }}>Re-estimate IRT (all)</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            const r = await fetch(`${base}/api/admin/audit`); const d = await r.json(); alert(`Recent audits: ${d.logs?.length||0}`);
          }}>Audit Logs</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">IRT Dashboards</div>
          <div className="text-xs">Item map (difficulty vs discrimination)</div>
          <svg viewBox="0 0 240 180" className="w-full border rounded bg-white">
            {/* axes */}
            <line x1="30" y1="150" x2="230" y2="150" stroke="#94a3b8" />
            <line x1="30" y1="20" x2="30" y2="150" stroke="#94a3b8" />
            {irtMap.map((it,i)=>{
              if (!it.irt) return null; const a = it.irt.aDiscrimination/1000; const b = it.irt.bDifficulty; // theta scale 500..2500
              const x = 30 + ((b - 500) / 2000) * 200;
              const y = 150 - ((Math.max(0.1, Math.min(3, a)) - 0.1) / (3 - 0.1)) * 130;
              return <circle key={it.id} cx={x} cy={y} r={3} fill="#0ea5e9"><title>{`${it.topic}  a=${a.toFixed(2)}  b=${b}`}</title></circle>;
            })}
          </svg>
          <div className="text-[10px] text-muted-foreground">x: b (difficulty 500→2500), y: a (0.1→3.0)</div>
        </div>
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Jobs</div>
          <div className="flex items-center gap-2 text-xs">
            <button className="h-8 px-2 border rounded-md" onClick={()=>void loadAll()}>Refresh</button>
          </div>
          <ul className="text-xs max-h-[220px] overflow-auto grid gap-1">
            {(() => {
              // Pair start/end by name; show running if no end
              const pairs: Array<{ name: string; startedAt?: string; endedAt?: string; durationMs?: number; status: 'running'|'done' }>=[];
              const byName: Record<string, { start?: any; end?: any }>={};
              for (const j of jobs) {
                if (j.name.endsWith('.start')) { byName[j.name.replace('.start','')] = { ...(byName[j.name.replace('.start','')]||{}), start: j }; }
                else if (j.name.endsWith('.end')) { byName[j.name.replace('.end','')] = { ...(byName[j.name.replace('.end','')]||{}), end: j }; }
              }
              for (const key of Object.keys(byName)) {
                const it = byName[key];
                const startedAt = it.start?.createdAt; const endedAt = it.end?.createdAt;
                const durationMs = (startedAt && endedAt) ? (new Date(endedAt).getTime() - new Date(startedAt).getTime()) : undefined;
                pairs.push({ name: key, startedAt, endedAt, durationMs, status: endedAt? 'done':'running' });
              }
              return pairs.sort((a,b)=> (new Date(b.startedAt||0).getTime()) - (new Date(a.startedAt||0).getTime())).map((p,i)=> (
                <li key={i} className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.status==='running' ? 'running' : `${Math.max(0, p.durationMs||0)}ms`}</span>
                </li>
              ));
            })()}
          </ul>
          <div className="text-xs text-muted-foreground">Live progress</div>
          <JobProgressStream base={base} />
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Audit Logs</div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <input className="h-8 px-2 border rounded-md" placeholder="Action contains" value={auditFilter.action} onChange={(e)=>setAuditFilter({...auditFilter, action: e.target.value})} />
          <input className="h-8 px-2 border rounded-md" placeholder="User/Target contains" value={auditFilter.q} onChange={(e)=>setAuditFilter({...auditFilter, q: e.target.value})} />
          <button className="h-8 px-2 border rounded-md" onClick={()=>void loadAll()}>Refresh</button>
        </div>
        <div className="max-h-[260px] overflow-auto">
          <table className="w-full text-xs">
            <thead><tr className="text-left text-[11px] text-muted-foreground"><th className="px-1 py-1">Time</th><th className="px-1 py-1">User</th><th className="px-1 py-1">Action</th><th className="px-1 py-1">Target</th></tr></thead>
            <tbody>
              {audits
                .filter(a => !auditFilter.action || (a.action||'').includes(auditFilter.action))
                .filter(a => !auditFilter.q || (a.userId||'').includes(auditFilter.q) || (a.target||'').includes(auditFilter.q))
                .map((a,i)=> (
                  <tr key={a.id || i} className="border-t"><td className="px-1 py-1">{a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}</td><td className="px-1 py-1">{a.userId}</td><td className="px-1 py-1">{a.action}</td><td className="px-1 py-1">{a.target}</td></tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function JobProgressStream({ base }: { base: string }) {
  const [events, setEvents] = useState<Array<{ name: string; createdAt?: string; props?: any }>>([]);
  useEffect(() => {
    let timer: number | null = null;
    const poll = async () => {
      try {
        const r = await fetch(`${base}/api/admin/events?name=items.`);
        if (!r.ok) return;
        const d = await r.json();
        const list = (d.events || []).filter((e: any) => /items\.(recalibrate|irt\.reestimate)\.(start|progress|end)/.test(e.name));
        setEvents(list);
      } catch {}
      timer = window.setTimeout(poll, 2000);
    };
    poll();
    return () => { if (timer) window.clearTimeout(timer); };
  }, [base]);
  return (
    <div className="max-h-[180px] overflow-auto border rounded p-2 text-[11px]">
      {events.slice(0, 80).map((e, i) => (
        <div key={i} className="flex items-center justify-between">
          <span>{e.name}</span>
          <span className="text-muted-foreground">{e.createdAt ? new Date(e.createdAt).toLocaleTimeString() : ''}</span>
        </div>
      ))}
      {events.length === 0 && <div className="text-muted-foreground">No recent job activity.</div>}
    </div>
  );
}
