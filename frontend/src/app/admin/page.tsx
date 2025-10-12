"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ id: string; userId: string; content: string; createdAt?: string }>>([]);
  const [metrics, setMetrics] = useState<Record<string, unknown>>({});
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const loadAll = async () => {
    try {
      const [f, m, mm] = await Promise.all([
        fetch(`${base}/api/admin/flags`).then(r=>r.json()),
        fetch(`${base}/api/admin/mod/messages`).then(r=>r.json()),
        fetch(`${base}/api/admin/metrics`).then(r=>r.json()),
      ]);
      setFlags(f.flags || {});
      setMessages((m.messages || []).map((x: { id?: string; userId: string; content: string; createdAt?: string }) => ({ id: x.id || crypto.randomUUID(), userId: x.userId, content: x.content, createdAt: x.createdAt })));
      setMetrics(mm || {} as Record<string, unknown>);
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
    </div>
  );
}
