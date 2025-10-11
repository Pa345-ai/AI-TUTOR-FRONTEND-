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

  const facilitate = async () => {
    const base = process.env.NEXT_PUBLIC_BASE_URL!;
    await fetch(`${base}/api/rooms/${encodeURIComponent(roomId)}/facilitate`, { method: 'POST' });
  };

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">Study Room</h1>
      <div className="flex-1 min-h-0 rounded-md border p-3 space-y-2">
        <div className="text-xs text-muted-foreground">Room ID: {roomId}</div>
        <div className="space-y-2 max-h-[55vh] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="text-sm">
              <span className="text-xs text-muted-foreground mr-2">{m.userId ?? 'system'}</span>
              {m.content}
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="min-h-[88px]" />
        <div className="flex items-center justify-between gap-2">
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs" onClick={facilitate}>Ask AI to facilitate</button>
          <Button onClick={send} disabled={!input.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
