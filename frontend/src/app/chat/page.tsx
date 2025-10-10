"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { chat } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);
    try {
      const res = await chat({ userId: "123", message: trimmed });
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Something went wrong";
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${errorText}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  }, [input]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) void sendMessage();
      }
    },
    [canSend, sendMessage]
  );

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">AI Tutor Chat</h1>
      <Separator />
      <div className="flex-1 min-h-0 rounded-md border">
        <ScrollArea className="h-full w-full p-3">
          <div ref={viewportRef} className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">Say hello to your AI Tutor.</div>
            ) : (
              messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="grid gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          className="min-h-[88px]"
        />
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => void sendMessage()} disabled={!canSend}>
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ role, content }: { role: Role; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-foreground text-background" : "bg-muted"
        )}
      >
        {content}
      </div>
    </div>
  );
}
