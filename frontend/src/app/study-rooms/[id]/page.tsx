"use client";

import { useEffect, useRef, useState } from "react";
import { fetchRoomMessages, joinRoom } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function StudyRoomPage({ params }: { params: { id: string } }) {
  const roomId = params.id;
  const [userId, setUserId] = useState("123");
  const [messages, setMessages] = useState<Array<{ id: string; userId: string | null; type: string; content: string; createdAt?: string }>>([]);
  const [input, setInput] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState<string>("#111827");
  const [stroke, setStroke] = useState<number>(2);
  const undoStack = useRef<ImageData[]>([]);
  const redoStack = useRef<ImageData[]>([]);
  const [userColors, setUserColors] = useState<Record<string, string>>({});
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [roles, setRoles] = useState<Record<string, 'owner'|'moderator'|'member'>>({});
  const [muted, setMuted] = useState<Record<string, boolean>>({});
  const [banned, setBanned] = useState<Record<string, boolean>>({});
  const [name, setName] = useState<string>("");
  const [myColor, setMyColor] = useState<string>("#1d4ed8");
  const timelineRef = useRef<Array<{ ts: number; type: string; userId?: string|null; content?: string; payload?: any }>>([]);
  const [timelineView, setTimelineView] = useState<Array<{ ts: number; type: string; userId?: string|null; content?: string }>>([]);
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number; name?: string; color?: string }>>({});
  const vectorRef = useRef<Array<{ color: string; stroke: number; points: Array<{ x: number; y: number }> }>>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await joinRoom(roomId, userId);
      const res = await fetchRoomMessages(roomId);
      const list = (res.messages || []).reverse().map((m) => ({ id: crypto.randomUUID(), ...m }));
      setMessages(list);
      const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/^http/i, "ws");
      const ws = new WebSocket(`${base}/ws`);
      wsRef.current = ws;
      ws.onopen = () => ws.send(JSON.stringify({ type: 'room:join', roomId, userId, name, color: myColor }));
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data?.type === 'room:message' && data.roomId === roomId) {
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), userId: data.userId ?? null, type: 'chat', content: data.content }]);
            timelineRef.current.push({ ts: Date.now(), type: 'chat', userId: data.userId ?? null, content: data.content });
            setTimelineView([...timelineRef.current].slice(-200));
          } else if (data?.type === 'room:audio' && data.roomId === roomId && typeof data.audio === 'string') {
            const src = data.audio; // data URL
            const audio = new Audio(src);
            audio.play().catch(()=>{});
          } else if (data?.type === 'room:wb' && data.roomId === roomId && data.payload) {
            const ctx = canvasRef.current?.getContext('2d');
            if (!ctx) return;
            ctx.strokeStyle = data.payload.color || '#111827';
            ctx.lineWidth = data.payload.stroke || 2;
            const pts = data.payload.points as Array<{ x: number; y: number }>;
            ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
            }
            ctx.stroke();
            timelineRef.current.push({ ts: Date.now(), type: 'wb', userId: data.userId, payload: data.payload });
            setTimelineView([...timelineRef.current].slice(-200));
          } else if (data?.type === 'room:wb:undo' && data.roomId === roomId) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx && canvasRef.current && undoStack.current.length > 0) {
              const last = undoStack.current.pop()!;
              redoStack.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
              ctx.putImageData(last, 0, 0);
            }
            timelineRef.current.push({ ts: Date.now(), type: 'wb:undo', userId: data.userId });
            setTimelineView([...timelineRef.current].slice(-200));
          } else if (data?.type === 'room:wb:redo' && data.roomId === roomId) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx && canvasRef.current && redoStack.current.length > 0) {
              const next = redoStack.current.pop()!;
              undoStack.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
              ctx.putImageData(next, 0, 0);
            }
            timelineRef.current.push({ ts: Date.now(), type: 'wb:redo', userId: data.userId });
            setTimelineView([...timelineRef.current].slice(-200));
          } else if (data?.type === 'room:wb:snapshot' && data.roomId === roomId && data.payload?.image) {
            const ctx = canvasRef.current?.getContext('2d');
            const img = new Image(); img.onload = () => { ctx?.clearRect(0,0,canvasRef.current!.width, canvasRef.current!.height); ctx?.drawImage(img, 0, 0); }; img.src = data.payload.image;
            timelineRef.current.push({ ts: Date.now(), type: 'wb:snapshot', userId: data.userId });
            setTimelineView([...timelineRef.current].slice(-200));
          } else if (data?.type === 'room:cursor' && data.roomId === roomId && data.payload) {
            setCursors(prev => ({ ...prev, [data.userId]: { x: data.payload.x, y: data.payload.y, name: data.payload.name, color: data.payload.color } }));
          }
          else if (data?.type === 'room:state' && data.roomId === roomId) {
            setRoles(data.roles || {});
            const muteObj: Record<string, boolean> = {};
            (Array.isArray(data.mutes) ? data.mutes : []).forEach((e: [string, number]) => { muteObj[e[0]] = e[1] > Date.now(); });
            setMuted(muteObj);
            const banObj: Record<string, boolean> = {};
            (Array.isArray(data.bans) ? data.bans : []).forEach((u: string) => { banObj[u] = true; });
            setBanned(banObj);
            setParticipants(Array.isArray(data.participants) ? data.participants : []);
          } else if (data?.type === 'room:roles' && data.roomId === roomId) {
            setRoles(data.roles || {});
          } else if (data?.type === 'room:participant' && data.roomId === roomId) {
            setParticipants((prev)=>{
              const set = new Set(prev);
              if (data.action === 'join') set.add(data.userId);
              if (data.action === 'leave') set.delete(data.userId);
              return Array.from(set);
            });
          } else if (data?.type === 'room:timeline' && data.roomId === roomId) {
            timelineRef.current = Array.isArray(data.events) ? data.events : [];
            setTimelineView([...timelineRef.current].slice(-200));
          }
        } catch {}
      };
      ws.onclose = () => {};
    })();
    return () => { wsRef.current?.close(); };
  }, [roomId, userId]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    wsRef.current?.send(JSON.stringify({ type: 'room:message', roomId, userId, content: text }));
    setInput("");
  };

  const pushToTalk = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRef.current = media;
      chunksRef.current = [];
      media.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      media.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          const buf = await blob.arrayBuffer();
          const b64 = `data:audio/webm;base64,${btoa(String.fromCharCode(...new Uint8Array(buf)))}`;
          wsRef.current?.send(JSON.stringify({ type: 'room:audio', roomId, userId, audio: b64, mime: 'audio/webm' }));
        } catch {}
        stream.getTracks().forEach((t) => t.stop());
      };
      media.start();
      setTimeout(()=> media.stop(), 3000);
    } catch {}
  };

  // Whiteboard handlers
  const onPointer = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !wsRef.current) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    wsRef.current.send(JSON.stringify({ type: 'room:cursor', roomId, userId, payload: { x, y, name: name || userId, color: myColor } }));
  };
  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext('2d');
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!ctx || !rect) return;
    // push snapshot for undo
    if (canvasRef.current) {
      undoStack.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
      redoStack.current = [];
    }
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext('2d');
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!ctx || !rect || !wsRef.current) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = stroke;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    wsRef.current.send(JSON.stringify({ type: 'room:wb', roomId, userId, payload: { points: [{ x, y }], color, stroke } }));
  };
  const onPointerUp = () => setDrawing(false);

  const takeSnapshot = () => {
    const url = canvasRef.current?.toDataURL('image/png') || '';
    if (!url || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'room:wb:snapshot', roomId, userId, payload: { image: url } }));
  };
  const undo = () => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'room:wb:undo', roomId, userId }));
  };
  const redo = () => {
    if (!wsRef.current) return;
    wsRef.current.send(JSON.stringify({ type: 'room:wb:redo', roomId, userId }));
  };

  const exportPDF = async () => {
    const c = canvasRef.current; if (!c) return;
    const dataUrl = c.toDataURL('image/png');
    // Simple client-only PDF via canvas; minimal A4 portrait
    const w = 595; const h = 842; // pt
    const html = `<!doctype html><html><head><meta charset="utf-8"></head><body style="margin:0"><img src="${dataUrl}" style="width:100%"/></body></html>`;
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `whiteboard-${roomId}.html`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportSVG = () => {
    const c = canvasRef.current; if (!c) return;
    const w = c.width; const h = c.height;
    // Build vector paths from timeline events by connecting successive wb points per user
    const paths: Array<{ color: string; stroke: number; d: string }> = [];
    const lastByUser: Record<string, { x: number; y: number; color: string; stroke: number } | undefined> = {} as any;
    for (const e of timelineRef.current) {
      if (e.type === 'wb' && e.userId && e.payload && Array.isArray(e.payload.points) && e.payload.points.length > 0) {
        const p = e.payload.points[0];
        const color = e.payload.color || '#111827';
        const stroke = e.payload.stroke || 2;
        const last = lastByUser[e.userId];
        if (!last) {
          lastByUser[e.userId] = { x: p.x, y: p.y, color, stroke };
          continue;
        }
        const d = `M ${last.x} ${last.y} L ${p.x} ${p.y}`;
        paths.push({ color, stroke, d });
        lastByUser[e.userId] = { x: p.x, y: p.y, color, stroke };
      }
    }
    const svgParts = [
      `<?xml version="1.0" encoding="UTF-8"?>`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`,
      ...paths.map(p => `<path d="${p.d}" stroke="${p.color}" stroke-width="${p.stroke}" fill="none" stroke-linecap="round" stroke-linejoin="round" />`),
      `</svg>`
    ];
    const blob = new Blob([svgParts.join('\n')], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `whiteboard-${roomId}.svg`; a.click(); URL.revokeObjectURL(url);
  };

  // Timeline replay
  const replayTimer = useRef<number | null>(null);
  const replayTimeline = () => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0,0,c.width,c.height);
    const events = [...timelineRef.current];
    const lastByUser: Record<string, { x: number; y: number; color: string; stroke: number } | undefined> = {} as any;
    let i = 0;
    const step = () => {
      if (i >= events.length) { replayTimer.current = null; return; }
      const e = events[i++];
      if (e.type === 'wb' && e.userId && e.payload && e.payload.points && e.payload.points[0]) {
        const { x, y } = e.payload.points[0];
        const color = e.payload.color || '#111827';
        const stroke = e.payload.stroke || 2;
        const last = lastByUser[e.userId];
        ctx.strokeStyle = color; ctx.lineWidth = stroke;
        ctx.beginPath();
        if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); } else { ctx.moveTo(x, y); ctx.lineTo(x+0.01, y+0.01); }
        ctx.stroke();
        lastByUser[e.userId] = { x, y, color, stroke };
      }
      replayTimer.current = window.setTimeout(step, 8);
    };
    step();
  };
  // Advanced scrubber: play/pause and manual position
  const [scrubPos, setScrubPos] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const playFrom = (idx: number) => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0,0,c.width,c.height);
    const events = [...timelineRef.current];
    const lastByUser: Record<string, { x: number; y: number; color: string; stroke: number } | undefined> = {} as any;
    let i = Math.max(0, Math.min(idx, events.length-1));
    const step = () => {
      if (!playing) return; if (i >= events.length) { setPlaying(false); return; }
      const e = events[i++]; setScrubPos(i);
      if (e.type === 'wb' && e.userId && e.payload && e.payload.points && e.payload.points[0]) {
        const { x, y } = e.payload.points[0]; const color = e.payload.color || '#111827'; const stroke = e.payload.stroke || 2; const last = lastByUser[e.userId];
        ctx.strokeStyle = color; ctx.lineWidth = stroke; ctx.beginPath(); if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(x,y); } else { ctx.moveTo(x,y); ctx.lineTo(x+0.01,y+0.01); } ctx.stroke(); lastByUser[e.userId] = { x, y, color, stroke };
      }
      replayTimer.current = window.setTimeout(step, 8);
    };
    step();
  };
  const stopReplay = () => { if (replayTimer.current) { clearTimeout(replayTimer.current); replayTimer.current = null; } };

  const setRole = (targetUserId: string, role: 'moderator'|'member') => {
    wsRef.current?.send(JSON.stringify({ type: 'room:role', roomId, userId, payload: { targetUserId, role } }));
  };
  const moderate = (action: 'mute'|'unmute'|'ban'|'unban', targetUserId: string, durationMs?: number) => {
    wsRef.current?.send(JSON.stringify({ type: 'room:moderate', roomId, userId, payload: { action, targetUserId, durationMs } }));
  };

  const myRole = roles[userId] || 'member';

  const facilitate = async () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    await fetch(`${base}/api/rooms/${encodeURIComponent(roomId)}/facilitate`, { method: 'POST' });
  };

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">Study Room</h1>
      <div className="flex-1 min-h-0 rounded-md border p-3 space-y-2">
        <div className="text-xs text-muted-foreground">Room ID: {roomId}</div>
        <div className="grid md:grid-cols-2 gap-2 max-h-[55vh]">
          <div className="space-y-2 overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="text-xs text-muted-foreground mr-2">{m.userId ?? 'system'}</span>
              {m.content}
            </div>
          ))}
          </div>
          <div className="relative space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <label>Name <input className="border rounded px-1" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Display name"/></label>
              <label>Cursor <input type="color" value={myColor} onChange={(e)=>setMyColor(e.target.value)} /></label>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <label>Color <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} /></label>
              <label>Stroke <input type="range" min={1} max={8} value={stroke} onChange={(e)=>setStroke(parseInt(e.target.value))} /></label>
              <button className="h-7 px-2 border rounded-md" onClick={undo}>Undo</button>
              <button className="h-7 px-2 border rounded-md" onClick={redo}>Redo</button>
              <button className="h-7 px-2 border rounded-md" onClick={takeSnapshot}>Save snapshot</button>
              <button className="h-7 px-2 border rounded-md" onClick={() => { const c = canvasRef.current; if (!c) return; const url = c.toDataURL('image/png'); const a = document.createElement('a'); a.href = url; a.download = `whiteboard-${roomId}.png`; a.click(); }}>Export PNG</button>
              <button className="h-7 px-2 border rounded-md" onClick={exportPDF}>Export PDF</button>
              <button className="h-7 px-2 border rounded-md" onClick={exportSVG}>Export SVG</button>
            </div>
            <canvas ref={canvasRef} className="w-full h-64 bg-white rounded border" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerOut={onPointer} />
            {Object.entries(cursors).map(([uid, c]) => (
              <div key={uid} className="absolute flex items-center gap-1 pointer-events-none" style={{ left: (c?.x||0), top: (c?.y||0) }}>
                <div className="w-2 h-2 rounded-full" style={{ background: c?.color || '#1f2937' }} />
                <div className="text-[10px] px-1 py-0.5 rounded bg-white border" style={{ borderColor: c?.color || '#1f2937' }}>{c?.name || uid}</div>
              </div>
            ))}
          </div>
          <div className="border rounded-md p-2 space-y-2">
            <div className="text-xs font-medium">Participants</div>
            <div className="flex flex-wrap gap-2">
              {participants.map(pid => (
                <div key={pid} className="text-xs border rounded px-2 py-1 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full" style={{ background: userColors[pid] || '#64748b' }} />
                  <span>{pid}</span>
                  <span className="uppercase text-[10px] text-muted-foreground">{roles[pid] || 'member'}</span>
                  {myRole === 'owner' && pid !== userId && (
                    <>
                      <button className="h-6 px-2 border rounded" onClick={()=>setRole(pid, 'moderator')}>Make Moderator</button>
                      <button className="h-6 px-2 border rounded" onClick={()=>setRole(pid, 'member')}>Make Member</button>
                    </>
                  )}
                  {['owner','moderator'].includes(myRole) && pid !== userId && (
                    <>
                      <button className="h-6 px-2 border rounded" onClick={()=>moderate(muted[pid] ? 'unmute' : 'mute', pid, 10*60_000)}>{muted[pid] ? 'Unmute' : 'Mute 10m'}</button>
                      <button className="h-6 px-2 border rounded" onClick={()=>moderate(banned[pid] ? 'unban' : 'ban', pid)}>{banned[pid] ? 'Unban' : 'Ban'}</button>
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="text-xs font-medium">Timeline</div>
            <ul className="text-xs grid gap-1 max-h-24 overflow-auto">
              {timelineView.map((e, i) => (
                <li key={i} className="flex items-center gap-2"><span className="text-[10px] text-muted-foreground">{new Date(e.ts).toLocaleTimeString()}</span><span>{e.type}</span><span className="text-muted-foreground">{e.userId || ''}</span></li>
              ))}
            </ul>
            <div className="flex items-center gap-2">
              <button className="h-7 px-2 border rounded-md" onClick={()=>wsRef.current?.send(JSON.stringify({ type: 'room:timeline:request', roomId }))}>Refresh Timeline</button>
              <button className="h-7 px-2 border rounded-md" onClick={()=>{ setPlaying(true); playFrom(scrubPos||0); }}>Play</button>
              <button className="h-7 px-2 border rounded-md" onClick={()=>{ setPlaying(false); stopReplay(); }}>Pause</button>
              <input type="range" min={0} max={Math.max(0, timelineRef.current.length-1)} value={scrubPos} onChange={(e)=>{ const v = parseInt(e.target.value||'0'); setScrubPos(v); }} className="flex-1" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="min-h-[88px]" />
        <div className="flex items-center justify-between gap-2">
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs" onClick={facilitate}>Ask AI to facilitate</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs" onClick={pushToTalk}>Push to talk (3s)</button>
          <Button onClick={send} disabled={!input.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
