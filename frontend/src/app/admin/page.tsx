"use client";

import { useEffect, useMemo, useState } from "react";

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
    </div>
  );
}
