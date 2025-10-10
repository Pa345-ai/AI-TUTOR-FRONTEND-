"use client";

import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { chat, fetchChatHistory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { saveConversation, loadConversation, deleteConversation, getActiveConversationId, setActiveConversationId } from "@/lib/storage";
import { Mic, Volume2, PencilLine, Eraser, Download } from "lucide-react";

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
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [curriculum, setCurriculum] = useState<"lk" | "international">("lk");
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
      const defaultSubject = window.localStorage.getItem("defaultSubject");
      if (defaultSubject) setSubject(defaultSubject);
      const defaultGrade = window.localStorage.getItem("defaultGrade");
      if (defaultGrade) setGrade(defaultGrade);
      const defaultCurr = window.localStorage.getItem("defaultCurriculum");
      if (defaultCurr === "lk" || defaultCurr === "international") setCurriculum(defaultCurr);
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
      const res = await chat({ userId, message: trimmed, language, mode, level, subject: subject || undefined, grade: grade || undefined, curriculum });
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

  const transcriptText = useMemo(() => {
    return messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
  }, [messages]);

  const downloadTranscript = useCallback(() => {
    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-tutor-chat-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transcriptText]);

  const exportToDocs = useCallback(async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(transcriptText);
    window.open("https://docs.new", "_blank");
  }, [transcriptText]);

  const exportToQuizlet = useCallback(async () => {
    // Simple placeholder: copy transcript; user can paste into Quizlet import
    if (navigator.clipboard) await navigator.clipboard.writeText(transcriptText);
    window.open("https://quizlet.com/create-set", "_blank");
  }, [transcriptText]);

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold">AI Tutor Chat</h1>
      <div className="flex flex-col gap-2">
        <div className="text-xs text-muted-foreground">Mode: <span className="capitalize">{mode}</span> • Level: <span className="uppercase">{level}</span> • Lang: <span className="uppercase">{language}</span></div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Lang</span>
            {(["en","si","ta"] as const).map((l) => (
              <Button
                key={l}
                variant={language === l ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setLanguage(l);
                  if (typeof window !== "undefined") window.localStorage.setItem("language", l);
                }}
              >{l.toUpperCase()}</Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Mode</span>
            {(["friendly","socratic","exam","motivational"] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode(m);
                  if (typeof window !== "undefined") window.localStorage.setItem("mode", m);
                }}
              >{m.charAt(0).toUpperCase() + m.slice(1)}</Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Level</span>
            {(["eli5","normal","expert"] as const).map((v) => (
              <Button
                key={v}
                variant={level === v ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setLevel(v);
                  if (typeof window !== "undefined") window.localStorage.setItem("level", v);
                }}
              >{v.toUpperCase()}</Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              className="h-9 px-2 border rounded-md text-sm"
              placeholder="Subject (e.g., Math, Science)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              className="h-9 px-2 border rounded-md text-sm w-24"
              placeholder="Grade"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            />
            <div className="flex items-center gap-1 text-sm">
              <span className="text-xs text-muted-foreground mr-1">Curriculum</span>
              {(["lk", "international"] as const).map((c) => (
                <Button key={c} variant={curriculum === c ? "default" : "outline"} size="sm" onClick={() => setCurriculum(c)}>
                  {c === "lk" ? "Sri Lanka" : "International"}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <Whiteboard />
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
            <Button variant="outline" onClick={downloadTranscript} disabled={messages.length === 0}>
              Export .txt
            </Button>
            <Button variant="outline" onClick={exportToDocs} disabled={messages.length === 0}>
              Docs
            </Button>
            <Button variant="outline" onClick={exportToQuizlet} disabled={messages.length === 0}>
              Quizlet
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

function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#111827");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const onPointerUp = () => setDrawing(false);

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `whiteboard-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="border rounded-md p-2 space-y-2">
      <div className="flex items-center gap-2">
        <PencilLine className="h-4 w-4" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} />
        <button onClick={clear} className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"><Eraser className="h-4 w-4" /> Clear</button>
        <button onClick={download} className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"><Download className="h-4 w-4" /> Download</button>
      </div>
      <div className="h-48 w-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full bg-white rounded-md border"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
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
        {isUser ? (
          content
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        )}
        {!isUser && (
          <div className="mt-2 flex gap-2">
            <InlineRephraseButtons text={content} />
          </div>
        )}
      </div>
    </div>
  );
}

function InlineRephraseButtons({ text }: { text: string }) {
  const [busy, setBusy] = useState<false | "eli5" | "expert">(false);
  const doRephrase = async (mode: "eli5" | "expert") => {
    if (!text.trim()) return;
    setBusy(mode);
    try {
      const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en";
      const level = mode;
      const res = await chat({ userId, message: `Rephrase this ${mode.toUpperCase()}:\n\n${text}`, language: language as "en"|"si"|"ta", level: level as "eli5"|"normal"|"expert" });
      if (navigator.clipboard) await navigator.clipboard.writeText(res.reply);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => void doRephrase("eli5")} disabled={!!busy}>
        {busy === "eli5" ? "…" : "ELI5"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => void doRephrase("expert")} disabled={!!busy}>
        {busy === "expert" ? "…" : "Expert"}
      </Button>
    </>
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
