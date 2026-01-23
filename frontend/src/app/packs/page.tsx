"use client";

import { useEffect, useState } from "react";

export default function PacksPage() {
  const [installed, setInstalled] = useState<Array<{ id: string; installedAt?: string }>>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const cache = await caches.open('offline-models');
        const keys = await cache.keys();
        const list: Array<{ id: string; installedAt?: string }> = [];
        for (const req of keys) {
          const m = req.url.match(/\/models\/(.+?)\.manifest$/);
          if (m) {
            const res = await cache.match(req); const data = await res?.json().catch(()=>null);
            list.push({ id: m[1], installedAt: data?.installedAt });
          }
        }
        setInstalled(list);
      } catch {}
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Offline Packs</h1>
      <div className="text-xs text-muted-foreground">Downloadable notes, quizzes, and flashcards for offline mode. Installed packs are listed below and used automatically when offline or when local-only is enabled.</div>
      <div className="grid gap-2">
        {installed.map((p,i)=> (
          <div key={i} className="border rounded-md p-2 flex items-center justify-between">
            <div><div className="font-medium">{p.id}</div><div className="text-xs text-muted-foreground">Installed {p.installedAt ? new Date(p.installedAt).toLocaleString() : ''}</div></div>
            <button className="h-8 px-3 border rounded-md text-sm" onClick={async ()=>{
              try { const cache = await caches.open('offline-models'); await cache.delete(`/models/${p.id}.bin`); await cache.delete(`/models/${p.id}.manifest`); setStatus('Removed'); setInstalled(prev => prev.filter(x => x.id !== p.id)); } catch (e) { setStatus(String(e)); }
            }}>Remove</button>
          </div>
        ))}
        {installed.length===0 && <div className="text-xs text-muted-foreground">No packs installed yet. Install from the Offline page.</div>}
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  );
}
