"use client";

import { useCallback, useEffect, useState } from "react";

export default function OfflineModelsPage() {
  const [supported, setSupported] = useState<{ stt: boolean; tts: boolean; wasm: boolean } | null>(null);
  const [packs, setPacks] = useState<Array<{ id: string; name: string; size: string; status: 'not-installed'|'installed'|'updating' }>>([
    { id: 'tiny-qna', name: 'Tiny Q&A model (~40MB)', size: '40MB', status: 'not-installed' },
    { id: 'mini-sum', name: 'Mini Summarizer (~60MB)', size: '60MB', status: 'not-installed' },
  ]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Device checks
    const stt = !!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition;
    const tts = 'speechSynthesis' in window && typeof (window as any).SpeechSynthesisUtterance !== 'undefined';
    const wasm = typeof WebAssembly !== 'undefined';
    setSupported({ stt, tts, wasm });
  }, []);

  const install = useCallback(async (id: string) => {
    setDownloading(id); setStatus('Downloading…');
    try {
      // Simulate download and cache using Cache Storage (placeholder)
      const cache = await caches.open('offline-models');
      const blob = new Blob([new Uint8Array(1024*1024)], { type: 'application/octet-stream' });
      const res = new Response(blob);
      await cache.put(new Request(`/models/${id}.bin`), res);
      setPacks(prev => prev.map(p => p.id===id? { ...p, status: 'installed' } : p));
      setStatus('Installed');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    } finally {
      setDownloading(null);
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setStatus('Removing…');
    try {
      const cache = await caches.open('offline-models');
      await cache.delete(new Request(`/models/${id}.bin`));
      setPacks(prev => prev.map(p => p.id===id? { ...p, status: 'not-installed' } : p));
      setStatus('Removed');
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  }, []);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Offline Models</h1>
      {supported && (
        <div className="grid sm:grid-cols-3 gap-3 text-sm">
          <div className={`border rounded p-2 ${supported.stt?'':'opacity-60'}`}><div className="font-medium">Speech‑to‑Text</div><div>{supported.stt? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.tts?'':'opacity-60'}`}><div className="font-medium">Text‑to‑Speech</div><div>{supported.tts? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.wasm?'':'opacity-60'}`}><div className="font-medium">WebAssembly</div><div>{supported.wasm? 'Supported' : 'Not available'}</div></div>
        </div>
      )}
      <div className="grid gap-3">
        {packs.map(p => (
          <div key={p.id} className="border rounded-md p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.size} • {p.status}</div>
            </div>
            <div className="flex items-center gap-2">
              {p.status !== 'installed' ? (
                <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>void install(p.id)} disabled={!!downloading}>{downloading===p.id? 'Installing…':'Install'}</button>
              ) : (
                <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>void remove(p.id)}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
      <div className="text-xs text-muted-foreground">Note: This page simulates model download using Cache Storage. Integrate a real on‑device model and switch local Q&A/summarizer to use it when online AI is unavailable.</div>
    </div>
  );
}
