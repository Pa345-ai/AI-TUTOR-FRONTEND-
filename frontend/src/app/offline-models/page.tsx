"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { healthSummary, warmupModel } from "@/lib/local-inference";

export default function OfflineModelsPage() {
  const [supported, setSupported] = useState<{ stt: boolean; tts: boolean; wasm: boolean; webrtc: boolean; webgpu: boolean } | null>(null);
  const [packs, setPacks] = useState<Array<{ id: string; name: string; size: string; status: 'not-installed'|'installed'|'updating', downloadedBytes?: number; totalBytes?: number }>>([
    { id: 'tiny-qna', name: 'Tiny Q&A model (~40MB)', size: '40MB', status: 'not-installed', downloadedBytes: 0, totalBytes: 40*1024*1024 },
    { id: 'mini-sum', name: 'Mini Summarizer (~60MB)', size: '60MB', status: 'not-installed', downloadedBytes: 0, totalBytes: 60*1024*1024 },
    { id: 'topic-notes', name: 'Topic Notes Pack (~2MB)', size: '2MB', status: 'not-installed', downloadedBytes: 0, totalBytes: 2*1024*1024 },
    { id: 'topic-quizzes', name: 'Topic Quizzes Pack (~1MB)', size: '1MB', status: 'not-installed', downloadedBytes: 0, totalBytes: 1*1024*1024 },
    { id: 'topic-flashcards', name: 'Topic Flashcards Pack (~1MB)', size: '1MB', status: 'not-installed', downloadedBytes: 0, totalBytes: 1*1024*1024 },
  ]);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [quota, setQuota] = useState<{ usage: number; quota: number } | null>(null);
  const [health, setHealth] = useState<{ caps: any; packs: Array<{ id: string; version: string }> } | null>(null);

  useEffect(() => {
    // Device checks
    const stt = !!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition;
    const tts = 'speechSynthesis' in window && typeof (window as any).SpeechSynthesisUtterance !== 'undefined';
    const wasm = typeof WebAssembly !== 'undefined';
    const webrtc = typeof (window as any).RTCPeerConnection !== 'undefined';
    const webgpu = typeof (navigator as any).gpu !== 'undefined';
    setSupported({ stt, tts, wasm, webrtc, webgpu });
    (async () => { try { setHealth(await healthSummary()); } catch {} })();
    // Storage quota
    (async () => {
      try {
        if ((navigator as any).storage && (navigator as any).storage.estimate) {
          const est = await (navigator as any).storage.estimate();
          setQuota({ usage: est.usage || 0, quota: est.quota || 0 });
        }
      } catch {}
    })();
  }, []);

  const install = useCallback(async (id: string) => {
    setDownloading(id); setStatus('Downloading…');
    try {
      // Real download with progress (HTTP range optional); here we stream and track progress
      const url = `/models/${id}.bin`;
      const resp = await fetch(url);
      if (!resp.ok || !resp.body) throw new Error(`Download failed: ${resp.status}`);
      const reader = resp.body.getReader();
      const cache = await caches.open('offline-models');
      const chunks: Uint8Array[] = [];
      let received = 0; const total = packs.find(p=>p.id===id)?.totalBytes || 0;
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) { chunks.push(value); received += value.length; }
        setPacks(prev => prev.map(p => p.id===id? { ...p, status: 'updating', downloadedBytes: received } : p));
      }
      const full = new Blob(chunks, { type: 'application/octet-stream' });
      await cache.put(new Request(url), new Response(full));
      // Optionally store a manifest entry for offline routing/sync
      try { await cache.put(new Request(`/models/${id}.manifest`), new Response(JSON.stringify({ id, installedAt: new Date().toISOString() }), { headers: { 'Content-Type':'application/json' } })); } catch {}
      setPacks(prev => prev.map(p => p.id===id? { ...p, status: 'installed', downloadedBytes: full.size } : p));
      // refresh quota
      try { const est = await (navigator as any).storage?.estimate?.(); if (est) setQuota({ usage: est.usage || 0, quota: est.quota || 0 }); } catch {}
      setStatus('Installed');
      try { setHealth(await healthSummary()); } catch {}
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
      try { setHealth(await healthSummary()); } catch {}
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  }, []);

  const usagePct = useMemo(()=> quota ? Math.round((quota.usage / Math.max(1, quota.quota)) * 100) : 0, [quota]);
  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Offline Models</h1>
      {supported && (
        <div className="grid sm:grid-cols-5 gap-3 text-sm">
          <div className={`border rounded p-2 ${supported.stt?'':'opacity-60'}`}><div className="font-medium">Speech‑to‑Text</div><div>{supported.stt? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.tts?'':'opacity-60'}`}><div className="font-medium">Text‑to‑Speech</div><div>{supported.tts? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.wasm?'':'opacity-60'}`}><div className="font-medium">WebAssembly</div><div>{supported.wasm? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.webrtc?'':'opacity-60'}`}><div className="font-medium">WebRTC</div><div>{supported.webrtc? 'Supported' : 'Not available'}</div></div>
          <div className={`border rounded p-2 ${supported.webgpu?'':'opacity-60'}`}><div className="font-medium">WebGPU</div><div>{supported.webgpu? 'Supported' : 'Not available'}</div></div>
        </div>
      )}
      <div className="border rounded-md p-3 text-xs space-y-2">
        <div className="text-sm font-medium">Local inference fallback</div>
        <div className="flex items-center gap-2">
          <button className="h-8 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only','true'); } catch {} }}>Force local (global)</button>
          <button className="h-8 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only','false'); } catch {} }}>Auto (online first)</button>
          <span className="text-muted-foreground">Global toggle for all surfaces.</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          <div className="border rounded p-2">
            <div className="font-medium">Summarizer</div>
            <div className="flex items-center gap-2 mt-1">
              <button className="h-7 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only_summary','true'); } catch {} }}>Force local</button>
              <button className="h-7 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only_summary','false'); } catch {} }}>Auto</button>
            </div>
          </div>
          <div className="border rounded p-2">
            <div className="font-medium">Chat Q&A</div>
            <div className="flex items-center gap-2 mt-1">
              <button className="h-7 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only_qa','true'); } catch {} }}>Force local</button>
              <button className="h-7 px-2 border rounded" onClick={()=>{ try { window.localStorage.setItem('offline_only_qa','false'); } catch {} }}>Auto</button>
            </div>
          </div>
        </div>
      </div>
      {health && (
        <div className="border rounded-md p-3 text-xs">
          <div className="text-sm font-medium mb-2">Local health</div>
          <div className="grid sm:grid-cols-3 gap-2">
            <div className="border rounded p-2">
              <div className="font-medium">Capabilities</div>
              <div>WebGPU: {health.caps.webgpu? 'Yes':'No'}</div>
              <div>WebNN: {health.caps.webnn? 'Yes':'No'}</div>
              <div>WASM: {health.caps.wasm? 'Yes':'No'}</div>
            </div>
            <div className="border rounded p-2">
              <div className="font-medium">Installed packs</div>
              {health.packs.length ? (
                <ul className="list-disc ml-4 space-y-1">
                  {health.packs.map(p => (
                    <li key={p.id} className="flex items-center gap-2">
                      <span>{p.id} v{p.version}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded border ${p.loaded? 'bg-green-50 border-green-200 text-green-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>{p.loaded? 'Warm' : 'Cold'}</span>
                      {!p.loaded && (
                        <button className="h-6 px-2 border rounded text-[11px]" onClick={()=>void warmupModel(p.id as 'mini-sum'|'tiny-qna')}>Warm up</button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-xs text-muted-foreground">None</div>
              )}
            </div>
            <div className="border rounded p-2">
              <div className="font-medium">Tips</div>
              <div>Install packs above to enable full on‑device inference.</div>
            </div>
          </div>
        </div>
      )}
      <div className="grid gap-3">
        {packs.map(p => (
          <div key={p.id} className="border rounded-md p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.size} • {p.status}{typeof p.downloadedBytes==='number' && p.totalBytes ? ` • ${Math.min(100, Math.round((p.downloadedBytes/p.totalBytes)*100))}%` : ''}</div>
              {p.status!=='not-installed' && typeof p.downloadedBytes==='number' && p.totalBytes && (
                <div className="mt-1 h-1.5 bg-muted rounded">
                  <div className="h-full bg-blue-600 rounded" style={{ width: `${Math.min(100, Math.round((p.downloadedBytes/p.totalBytes)*100))}%` }} />
                </div>
              )}
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
      {quota && (
        <div className="text-xs">
          Storage usage: {Math.round((quota.usage||0)/1024/1024)}MB / {Math.round((quota.quota||0)/1024/1024)}MB ({usagePct}%)
          <div className="mt-1 h-1.5 bg-muted rounded"><div className="h-full bg-green-600 rounded" style={{ width: `${usagePct}%` }} /></div>
        </div>
      )}
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
      <div className="text-xs text-muted-foreground">Models are cached for offline inference. Chat and summarizer will automatically fall back to on‑device models when the network is unavailable or disabled via feature flags.</div>
    </div>
  );
}
