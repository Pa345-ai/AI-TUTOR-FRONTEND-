"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { chat, fetchChatHistory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { saveConversation, loadConversation, deleteConversation, getActiveConversationId, setActiveConversationId } from "@/lib/storage";
import { Mic, Volume2 } from "lucide-react";

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
  const [lastFailed, setLastFailed] = useState<string | null>(null);
  const [userId, setUserId] = useState("123");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [mode, setMode] = useState<"socratic" | "exam" | "friendly" | "motivational">("friendly");
  const [level, setLevel] = useState<"eli5" | "normal" | "expert">("normal");
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages]);

  // Persist the active conversation (single session id for now)
  useEffect(() => {
    const id = getActiveConversationId() ?? "current";
    if (messages.length === 0) return;
    saveConversation(id, messages);
  }, [messages]);

  // Load existing conversation and user id on mount
  useEffect(() => {
    const id = getActiveConversationId() ?? "current";
    setActiveConversationId(id);
    const saved = loadConversation(id);
    if (saved.length > 0) setMessages(saved);
    if (typeof window !== "undefined") {
      const storedUserId = window.localStorage.getItem("userId");
      if (storedUserId) setUserId(storedUserId);
      const storedLanguage = window.localStorage.getItem("language");
      if (storedLanguage === "en" || storedLanguage === "si" || storedLanguage === "ta") setLanguage(storedLanguage);
      const storedMode = window.localStorage.getItem("mode");
      if (storedMode === "socratic" || storedMode === "exam" || storedMode === "friendly" || storedMode === "motivational") setMode(storedMode);
      const storedLevel = window.localStorage.getItem("level");
      if (storedLevel === "eli5" || storedLevel === "normal" || storedLevel === "expert") setLevel(storedLevel);
    }
    // Also try to load server history if we have a userId (defaults to "123")
    const uid = typeof window !== "undefined" ? window.localStorage.getItem("userId") || "123" : "123";
    fetchChatHistory(uid)
      .then((msgs) => {
        if (msgs.length > 0) {
          const loaded = msgs.map((m) => ({ id: crypto.randomUUID(), role: m.role, content: m.content }));
          setMessages(loaded);
        }
      })
      .catch(() => {
        // ignore history fetch errors
      });
  }, []);

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
      const res = await chat({ userId, message: trimmed, language, mode, level });
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: res.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastFailed(null);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Something went wrong";
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Error: ${errorText}`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastFailed(userMessage.id);
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

  const retryLast = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setInput(lastUser.content);
    await sendMessage();
  }, [messages, sendMessage]);

  const copyLastAnswer = useCallback(async () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant || !navigator.clipboard) return;
    await navigator.clipboard.writeText(lastAssistant.content);
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    deleteConversation("current");
  }, []);

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">AI Tutor Chat</h1>
      <div className="text-xs text-muted-foreground">Mode: <span className="capitalize">{mode}</span> • Level: <span className="uppercase">{level}</span> • Lang: <span className="uppercase">{language}</span></div>
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
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <VoiceRecorder onResult={(t) => setInput((prev) => (prev ? prev + " " + t : t))} />
            <TTSButton lastMessage={messages.findLast?.((m) => m.role === "assistant")?.content ?? ""} />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={retryLast} disabled={messages.length === 0 || isSending}>
              Retry
            </Button>
            <Button variant="outline" onClick={() => void copyLastAnswer()} disabled={messages.length === 0}>
              Copy
            </Button>
            <Button variant="outline" onClick={clearChat} disabled={messages.length === 0}>
              Clear
            </Button>
            <Button onClick={() => void sendMessage()} disabled={!canSend}>
              {isSending ? "Sending..." : "Send"}
            </Button>
            {isSending && (
              <span className="text-xs text-muted-foreground">Thinking…</span>
            )}
          </div>
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

function VoiceRecorder({ onResult }: { onResult: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    return () => {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
    };
  }, []);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream);
      mediaRef.current = media;
      chunksRef.current = [];
      media.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      media.onstop = async () => {
        const _blob = new Blob(chunksRef.current, { type: "audio/webm" });
        // Basic offline speech recognition via Web Speech API if available
        // If not available, gracefully no-op
        type SpeechRecognitionType = new () => {
          lang: string;
          onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
          start: () => void;
        };
        const SpeechRecognition =
          (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).SpeechRecognition ||
          (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const rec = new SpeechRecognition();
          rec.lang = "en-US";
          rec.onresult = (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => {
            const result0 = event.results[0] as unknown as { 0: { transcript: string } };
            const text = result0?.[0]?.transcript ?? "";
            if (text) onResult(text);
          };
          rec.start();
        }
        // Release tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      media.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const stop = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <button
      type="button"
      onClick={recording ? stop : start}
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
        recording ? "bg-red-600 text-white border-transparent" : ""
      )}
      aria-label={recording ? "Stop recording" : "Start recording"}
    >
      <Mic className="h-4 w-4" /> {recording ? "Stop" : "Voice"}
    </button>
  );
}

function TTSButton({ lastMessage }: { lastMessage: string }) {
  const speak = () => {
    if (!lastMessage) return;
    if (typeof window === "undefined") return;
    const utter = new SpeechSynthesisUtterance(lastMessage);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
      aria-label="Play last answer"
    >
      <Volume2 className="h-4 w-4" /> Listen
    </button>
  );
}
