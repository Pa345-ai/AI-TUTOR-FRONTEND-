"use client";

import { useState, useEffect } from "react";
import { preferLocalInference, preferLocalSummarizer, tryLocalSummarize } from "@/lib/local-inference";
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
      const prompt = `Create a concise lesson outline with sections and bullet points for: ${subject ? subject + ': ' : ''}${topic}. Target grade ${grade || 'level'}.`;
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

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Lesson Planner</h1>
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
      <Button onClick={generate} disabled={!topic.trim() || loading}>{loading ? "Generating..." : "Generate Plan"}</Button>
      <div className="space-y-2">
        <label className="text-sm font-medium">Plan</label>
        <Textarea value={plan} readOnly className="min-h-[240px]" />
      </div>
    </div>
  );
}
