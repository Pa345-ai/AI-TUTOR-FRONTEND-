"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateInteractiveLesson } from "@/lib/api";
type Step = { title: string; content: string; check?: { question: string; answer: string } };
type InteractiveLesson = { title: string; overview: string; steps: Step[]; summary?: string; script?: string; srt?: string };

export default function InteractiveLessonPage() {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<InteractiveLesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setLesson(null);
    try {
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) as "en"|"si"|"ta"|null;
      const res = await generateInteractiveLesson({ topic, grade, language: language ?? 'en' });
      setLesson(res.lesson);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Interactive Lesson</h1>
      <div className="grid sm:grid-cols-3 gap-2">
        <Input className="sm:col-span-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g., Photosynthesis)" />
        <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade (optional)" />
      </div>
      <Button onClick={run} disabled={!topic.trim() || loading}>{loading ? 'Generating…' : 'Generate'}</Button>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {lesson && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">{lesson.title || topic}</div>
          {lesson.overview && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Overview</div>
              <div className="border rounded-md p-2 text-sm whitespace-pre-wrap">{lesson.overview}</div>
            </div>
          )}
          {Array.isArray(lesson.steps) && lesson.steps.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Steps</div>
              <div className="grid gap-2">
                {lesson.steps.map((s: Step, i: number) => (
                  <div key={i} className="border rounded-md p-2 text-sm space-y-1">
                    <div className="font-medium">{s.title || `Step ${i+1}`}</div>
                    <div className="whitespace-pre-wrap">{s.content}</div>
                    {s.check && (
                      <div className="text-xs text-muted-foreground">Self-check: {s.check.question} — Answer: {s.check.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {(lesson.script || lesson.srt) && (
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium">Narration Script</div>
                <Textarea readOnly className="min-h-[160px]" value={lesson.script || ''} />
              </div>
              <div>
                <div className="text-sm font-medium">SRT Captions</div>
                <Textarea readOnly className="min-h-[160px]" value={lesson.srt || ''} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
