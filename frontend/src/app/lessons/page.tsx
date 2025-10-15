"use client";

import { useState, useEffect, useRef } from "react";
import { preferLocalInference, preferLocalSummarizer, tryLocalSummarize } from "@/lib/local-inference";
import { retrieveMemory } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { grades, getSubjects } from "@/lib/syllabus";

export default function LessonsPage() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [curriculum, setCurriculum] = useState<"lk" | "international">("lk");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const recRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ds = window.localStorage.getItem("defaultSubject");
    if (ds) setSubject(ds);
    const dg = window.localStorage.getItem("defaultGrade");
    if (dg) setGrade(dg);
    const dc = window.localStorage.getItem("defaultCurriculum");
    if (dc === "lk" || dc === "international") setCurriculum(dc);
  }, []);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const forceLocal = preferLocalSummarizer() || preferLocalInference() || (typeof navigator !== 'undefined' && !navigator.onLine);
      let prompt = `Create a concise lesson outline with sections and bullet points for: ${subject ? subject + ': ' : ''}${topic}. Target grade ${grade || 'level'}.`;
      try {
        const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
        const mem = await retrieveMemory({ userId: uid, surface: 'lessons', query: topic, k: 5 });
        if (mem.items?.length) {
          const ctx = mem.items.map(i=>i.text).join('\n');
          prompt += `\n\nContext (prior work):\n${ctx}`;
        }
      } catch {}
      if (forceLocal) {
        const r = await tryLocalSummarize(prompt);
        setPlan(r.text);
      } else {
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        const res = await fetch(`${base}/api/lessons/plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic: `${subject ? subject + ": " : ""}${topic}`, grade, language: (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en" }),
        });
        const data = await res.json();
        setPlan(typeof data.plan === "string" ? data.plan : JSON.stringify(data, null, 2));
      }
    } catch (e) {
      setPlan(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.lang = ((typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) || 'en') === 'si' ? 'si-LK' : ((typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) || 'en') === 'ta' ? 'ta-IN' : 'en-US';
      rec.interimResults = true; rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const results = e.results; const idx = results.length - 1; const res: any = results[idx];
        const transcript = (res && res[0] && res[0].transcript) ? String(res[0].transcript) : '';
        if (!transcript) return; setTopic(transcript);
        if (res.isFinal || transcript.endsWith('.')) { void generate(); }
      };
      rec.onend = () => { if (recording) { try { rec.start(); } catch {} } else { recRef.current = null; } };
      rec.onerror = () => { try { rec.start(); } catch {} };
      recRef.current = rec; setRecording(true); rec.start();
    } catch {}
  };
  const stopVoice = () => { try { recRef.current?.stop?.(); } catch {}; recRef.current = null; setRecording(false); };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Lesson Planner</h1>
      <div className="text-xs text-muted-foreground">Voice: <button className="underline" onClick={()=> recording ? stopVoice() : startVoice()}>{recording ? 'Stop' : 'Push‑to‑talk'}</button></div>
      <div className="grid sm:grid-cols-3 gap-2">
        <select className="h-9 px-2 border rounded-md text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Subject</option>
          {getSubjects(curriculum).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select className="h-9 px-2 border rounded-md text-sm" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">Grade</option>
          {grades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <div className="flex items-center gap-2 text-sm">
          {(["lk","international"] as const).map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input type="radio" name="curr" checked={curriculum===c} onChange={() => setCurriculum(c)} />
              <span>{c === "lk" ? "Sri Lanka" : "International"}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Topic</label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Introduction to Calculus" />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={generate} disabled={!topic.trim() || loading}>{loading ? "Generating..." : "Generate Plan"}</Button>
        <Button variant="outline" onClick={() => recording ? stopVoice() : startVoice()}>{recording ? 'Stop voice' : 'Push‑to‑talk'}</Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Plan</label>
        <Textarea value={plan} readOnly className="min-h-[240px]" />
      </div>
    </div>
  );
}
