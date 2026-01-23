"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface WSMessage {
  type: string;
  message?: { content: string; role: "user" | "assistant" };
  error?: string;
}

export default function StudyRoomPage() {
  const [userId, setUserId] = useState("123");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([]);
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const endpoint = useMemo(() => {
    const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/^http/i, "ws");
    return `${base}/ws`;
  }, []);

  useEffect(() => {
    setStatus("connecting");
    const ws = new WebSocket(endpoint);
    wsRef.current = ws;
    ws.onopen = () => setStatus("connected");
    ws.onclose = () => setStatus("disconnected");
    ws.onerror = () => setStatus("disconnected");
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data) as WSMessage;
        if (data?.type === "chat" && typeof data?.message?.content === "string") {
          const content = data.message.content;
          setMessages((prev) => [
            ...prev,
            { id: crypto.randomUUID(), role: "assistant", content },
          ]);
        }
      } catch {
        // ignore
      }
    };
    return () => {
      ws.close();
    };
  }, [endpoint]);

  const send = () => {
    const trimmed = input.trim();
    if (!trimmed || status !== "connected") return;
    const payload = { type: "chat", userId, content: trimmed };
    wsRef.current?.send(JSON.stringify(payload));
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "user", content: trimmed }]);
    setInput("");
  };

  return (
    <div className="mx-auto max-w-4xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">Study Room</h1>
      <div className="text-xs text-muted-foreground">Status: {status}</div>
      <Separator />
      <div className="flex-1 min-h-0 rounded-md border">
        <ScrollArea className="h-full w-full p-3">
          <div className="flex flex-col gap-3">
            {messages.map((m) => (
              <div key={m.id} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "self-end bg-foreground text-background" : "self-start bg-muted"}`}>
                {m.content}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="grid gap-2">
        <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." className="min-h-[88px]" />
        <div className="flex items-center justify-end gap-2">
          <Button onClick={send} disabled={status !== "connected" || !input.trim()}>Send</Button>
        </div>
      </div>
    </div>
  );
}
