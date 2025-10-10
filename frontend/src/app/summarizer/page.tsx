"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { chat } from "@/lib/api";

export default function SummarizerPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const storedLang = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en";
      const res = await chat({ userId, message: `Summarize this content concisely in bullet points:\n\n${text}`, language: storedLang as "en" | "si" | "ta" });
      setSummary(res.reply);
    } catch (e) {
      setSummary(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">AI Summarizer</h1>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text to summarize..." className="min-h-[200px]" />
      <div className="flex items-center gap-2">
        <Button onClick={summarize} disabled={!text.trim() || loading}>{loading ? "Summarizing..." : "Summarize"}</Button>
      </div>
      {summary && <Textarea value={summary} readOnly className="min-h-[200px]" />}
    </div>
  );
}
