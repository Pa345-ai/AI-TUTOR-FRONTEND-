"use client";

import { useMemo, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { chat, exportToDocs, generateFlashcards } from "@/lib/api";
import { preferLocalInference, tryLocalSummarize } from "@/lib/local-inference";

export default function SummarizerPage() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const [subject, setSubject] = useState("");
  const [exporting, setExporting] = useState(false);
  const [creatingCards, setCreatingCards] = useState(false);
  const [highlights, setHighlights] = useState<Array<{ page: number; quote: string; reason?: string }>>([]);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const summarize = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const forceLocal = preferLocalInference();
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      if (forceLocal || offline) {
        const r = await tryLocalSummarize(text);
        setSummary(r.text);
      } else {
        const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
        const storedLang = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en";
        const res = await chat({ userId, message: `Summarize this content concisely in bullet points:\n\n${text}`, language: storedLang as "en" | "si" | "ta" });
        setSummary(res.reply);
      }
    } catch (e) {
      setSummary(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const downloadSummary = () => {
    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySummary = async () => {
    if (!navigator.clipboard) return;
    await navigator.clipboard.writeText(summary);
  };

  const doExport = async () => {
    if (!summary.trim()) return;
    setExporting(true);
    try {
      const res = await exportToDocs({ title: subject || 'AI Summary', content: summary, token: token || undefined });
      if (res.docUrl) window.open(res.docUrl, '_blank');
      if (res.docContent && navigator.clipboard) await navigator.clipboard.writeText(res.docContent);
    } finally {
      setExporting(false);
    }
  };

  const makeFlashcards = async () => {
    if (!summary.trim()) return;
    setCreatingCards(true);
    try {
      const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en";
      await generateFlashcards({ userId, content: summary, subject: subject || undefined, language });
      // Navigate to flashcards
      if (typeof window !== 'undefined') window.location.href = '/flashcards';
    } finally {
      setCreatingCards(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">AI Summarizer</h1>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <input className="h-9 px-2 border rounded-md" placeholder="Subject (optional)" value={subject} onChange={(e)=>setSubject(e.target.value)} />
        <input className="h-9 px-2 border rounded-md" placeholder="Google OAuth token (optional for Docs export)" value={token} onChange={(e)=>setToken(e.target.value)} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <input type="file" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button
          disabled={!file || loading}
          className="inline-flex items-center gap-1 border rounded-md px-2 py-1"
          onClick={async () => {
            if (!file) return;
            setLoading(true);
            try {
              const form = new FormData();
              form.append('file', file);
              const lang = (typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) || 'en';
              form.append('language', lang);
              const base = process.env.NEXT_PUBLIC_BASE_URL!;
              const res = await fetch(`${base}/api/summarize/upload`, { method: 'POST', body: form });
              const data = await res.json();
              setSummary(data.summary || '');
              setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
              setNumPages(typeof data.pages === 'number' ? data.pages : null);
              // create a blob url for PDF preview if uploaded file is PDF
              if (file && file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                setPdfUrl(url);
              } else {
                setPdfUrl(null);
              }
            } catch (e) {
              setSummary(e instanceof Error ? e.message : String(e));
            } finally {
              setLoading(false);
            }
          }}
        >Upload & Summarize</button>
      </div>
      <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste text to summarize..." className="min-h-[200px]" />
      <div className="flex items-center gap-2">
        <Button onClick={summarize} disabled={!text.trim() || loading}>{loading ? "Summarizing..." : "Summarize"}</Button>
        {summary && (
          <>
            <Button variant="outline" onClick={copySummary}>Copy</Button>
            <Button variant="outline" onClick={downloadSummary}>Export .txt</Button>
            <Button variant="outline" onClick={doExport} disabled={exporting}>{exporting ? 'Exporting…' : 'Export to Docs'}</Button>
            <Button onClick={makeFlashcards} disabled={creatingCards}>{creatingCards ? 'Creating…' : 'Create Flashcards'}</Button>
          </>
        )}
      </div>
      {summary && <Textarea value={summary} readOnly className="min-h-[200px]" />}
      {pdfUrl && highlights.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded-md p-2">
            <div className="text-sm font-medium mb-2">Highlights</div>
            <ul className="text-sm space-y-1">
              {highlights.map((h, i) => (
                <li key={i}>
                  <button className="underline" onClick={() => {
                    // navigate pdf.js viewer to page
                    const frame = iframeRef.current;
                    if (frame && frame.contentWindow) {
                      frame.contentWindow.postMessage({ type: 'pdf:setPage', page: h.page, quote: h.quote }, '*');
                    }
                  }}>p.{h.page}</button>
                  : “{h.quote.slice(0, 120)}{h.quote.length>120?'…':''}”
                  {h.reason ? <div className="text-xs text-muted-foreground">{h.reason}</div> : null}
                </li>
              ))}
            </ul>
          </div>
          <div className="border rounded-md">
            {/* Embed a lightweight PDF.js viewer page with postMessage API */}
            <iframe ref={iframeRef} src={`/pdf-viewer.html#${encodeURIComponent(pdfUrl)}`} className="w-full h-[480px]" />
          </div>
        </div>
      )}
    </div>
  );
}
