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
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

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
      ws.onopen = () => ws.send(JSON.stringify({ type: 'room:join', roomId, userId }));
      ws.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data?.type === 'room:message' && data.roomId === roomId) {
            setMessages((prev) => [...prev, { id: crypto.randomUUID(), userId: data.userId ?? null, type: 'chat', content: data.content }]);
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
          } else if (data?.type === 'room:wb:undo' && data.roomId === roomId) {
            const ctx = canvasRef.current?.getContext('2d');
            if (ctx && canvasRef.current && undoStack.current.length > 0) {
              const last = undoStack.current.pop()!;
              redoStack.current.push(ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height));
              ctx.putImageData(last, 0, 0);
            }
          } else if (data?.type === 'room:wb:snapshot' && data.roomId === roomId) {
            // ignore; snapshots persisted on server
          } else if (data?.type === 'room:cursor' && data.roomId === roomId && data.payload) {
            setCursor({ x: data.payload.x, y: data.payload.y });
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
    wsRef.current.send(JSON.stringify({ type: 'room:cursor', roomId, userId, payload: { x, y } }));
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
              <label>Color <input type="color" value={color} onChange={(e)=>setColor(e.target.value)} /></label>
              <label>Stroke <input type="range" min={1} max={8} value={stroke} onChange={(e)=>setStroke(parseInt(e.target.value))} /></label>
              <button className="h-7 px-2 border rounded-md" onClick={undo}>Undo</button>
              <button className="h-7 px-2 border rounded-md" onClick={takeSnapshot}>Save snapshot</button>
            </div>
            <canvas ref={canvasRef} className="w-full h-64 bg-white rounded border" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} onPointerOut={onPointer} />
            {cursor && <div className="absolute text-[10px]" style={{ left: cursor.x, top: cursor.y }}>+</div>}
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
