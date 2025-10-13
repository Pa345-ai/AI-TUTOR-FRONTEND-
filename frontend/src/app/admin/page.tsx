"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ id: string; userId: string; content: string; createdAt?: string }>>([]);
  const [metrics, setMetrics] = useState<Record<string, unknown>>({});
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [items, setItems] = useState<Array<{ id: string; topic: string; subject?: string; difficulty?: string; question: string; tags?: string[]; skills?: string[]; standards?: string[]; graphNodes?: string[] }>>([]);
  const [itemCsv, setItemCsv] = useState("");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [irt, setIrt] = useState<{ aDiscrimination: number; bDifficulty: number } | null>(null);
  const [attempts, setAttempts] = useState<Array<{ correct: boolean; userAbility: number; createdAt: string }>>([]);

  const loadAll = async () => {
    try {
      const [f, m, mm, ib] = await Promise.all([
        fetch(`${base}/api/admin/flags`).then(r=>r.json()),
        fetch(`${base}/api/admin/mod/messages`).then(r=>r.json()),
        fetch(`${base}/api/admin/metrics`).then(r=>r.json()),
        fetch(`${base}/api/items`).then(r=>r.json()).catch(()=>({ items: [] })),
      ]);
      setFlags(f.flags || {});
      setMessages((m.messages || []).map((x: { id?: string; userId: string; content: string; createdAt?: string }) => ({ id: x.id || crypto.randomUUID(), userId: x.userId, content: x.content, createdAt: x.createdAt })));
      setMetrics(mm || {} as Record<string, unknown>);
      setItems((ib.items || []).map((x: any)=>({ id: x.id, topic: x.topic, subject: x.subject, difficulty: x.difficulty, question: x.question, tags: x.tags || [], skills: x.skills || [], standards: x.standards || [], graphNodes: x.graphNodes || [] })));
    } catch {}
  };

  useEffect(() => { void loadAll(); }, []);

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
        <div className="text-sm font-medium">Item Bank</div>
        <div className="flex items-center gap-2 text-xs">
          <button className="h-8 px-2 border rounded-md" onClick={loadAll}>Refresh</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            const r = await fetch(`${base}/api/items/export`); const d = await r.json(); const rows = [ ['id','subject','topic','difficulty','question'].join(',') ] as string[]; for (const it of (d.items||[])) rows.push([it.id,it.subject||'',it.topic||'',it.difficulty||'',(it.question||'').replace(/\n|\r|,/g,' ')].join(',')); setItemCsv(rows.join('\n'));
          }}>Export CSV</button>
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            const lines = itemCsv.split(/\r?\n/).slice(1).filter(Boolean); const items = lines.map((ln)=>{ const [id,subject,topic,difficulty,question] = ln.split(','); return { subject: subject||null, topic, difficulty: (['easy','medium','hard'].includes(difficulty||'')?difficulty:'medium'), question, options: [], correctAnswer: '', explanation: '' }; });
            await fetch(`${base}/api/items/import`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
            await loadAll();
          }}>Import CSV</button>
        </div>
        <textarea className="w-full min-h-[120px] border rounded-md p-2 text-xs" placeholder="CSV here" value={itemCsv} onChange={(e)=>setItemCsv(e.target.value)} />
        <div className="grid gap-2 text-xs max-h-[260px] overflow-auto">
          {items.map((it)=> (
            <div key={it.id} className={`border rounded-md p-2 ${selectedItemId===it.id?'ring-1 ring-blue-500':''}`} onClick={async ()=>{
              setSelectedItemId(it.id); setIrt(null); setAttempts([]);
              try {
                const r1 = await fetch(`${base}/api/items/${encodeURIComponent(it.id)}/attempts`); const a = await r1.json(); setAttempts(a.attempts||[]);
                const r2 = await fetch(`${base}/api/items/${encodeURIComponent(it.id)}`); const d = await r2.json(); if (d.item && d.item.irt) setIrt(d.item.irt);
              } catch {}
            }}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{it.topic} — {it.difficulty}</div>
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
            <div className="border rounded-md p-2">
              <div className="font-medium mb-1">IRT Estimation</div>
              <div className="flex items-center gap-2">
                <button className="h-7 px-2 border rounded-md" onClick={async ()=>{ const r = await fetch(`${base}/api/items/${encodeURIComponent(selectedItemId)}/irt/estimate`, { method: 'POST' }); const d = await r.json(); setIrt(d.irt || null); }}>Estimate IRT</button>
                {irt && (<div className="text-[11px]">a={irt.aDiscrimination/1000} b={irt.bDifficulty}</div>)}
              </div>
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
        </div>
      </div>
    </div>
  );
}
