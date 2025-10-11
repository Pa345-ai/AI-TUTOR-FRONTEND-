"use client";

import { useEffect, useState } from "react";
import { fetchFlashcards, generateFlashcards, exportQuizletSet, saveIntegrationToken, type FlashcardItem } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FlashcardsPage() {
  const [userId, setUserId] = useState("123");
  const [items, setItems] = useState<FlashcardItem[]>([]);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizletToken, setQuizletToken] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchFlashcards(userId);
        if (!mounted) return;
        setItems(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const generate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await generateFlashcards({ userId, content, subject: subject || undefined, language });
      const data = await fetchFlashcards(userId);
      setItems(data);
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const saveToken = async () => {
    if (!quizletToken.trim()) return;
    await saveIntegrationToken({ userId, provider: 'quizlet', accessToken: quizletToken });
  };

  const exportQuizlet = async () => {
    if (items.length === 0) return;
    setExporting(true);
    try {
      const res = await exportQuizletSet({ userId });
      if (res.url) window.open(res.url, '_blank');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Flashcards</h1>
      <div className="grid gap-3">
        <div className="grid sm:grid-cols-3 gap-2">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" />
          <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language (en/si/ta)" />
        </div>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste notes or text to generate flashcards" className="min-h-[160px]" />
        <div className="flex items-center gap-2">
          <Button onClick={generate} disabled={!content.trim() || loading}>{loading ? "Generating..." : "Generate"}</Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <input className="h-8 px-2 border rounded-md" placeholder="Quizlet access token (optional)" value={quizletToken} onChange={(e)=>setQuizletToken(e.target.value)} />
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1" onClick={saveToken}>Save Token</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1" onClick={exportQuizlet} disabled={exporting || items.length===0}>{exporting ? 'Exporting…' : 'Export to Quizlet'}</button>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.id} className="border rounded-md p-3">
            <div className="font-medium">{c.front}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.back}</div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <div className="text-sm text-muted-foreground">No flashcards yet.</div>
        )}
      </div>
    </div>
  );
}
