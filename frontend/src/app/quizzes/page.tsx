"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logLearningEvent } from "@/lib/api";
import { updateLocalMastery, getWeakTopics } from "@/lib/mastery";
import { grades, getSubjects } from "@/lib/syllabus";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string; // backend returns text, we'll compare by text
};

export default function QuizzesPage() {
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [curriculum, setCurriculum] = useState<"lk" | "international">("lk");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [weakList, setWeakList] = useState<Array<{ topic: string; accuracy: number }>>([]);

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
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const res = await fetch(`${base}/api/quizzes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: `${subject ? subject + ": " : ""}${topic}`, difficulty: "medium", count: 5, language: (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en" }),
      });
      const data = await res.json();
      // Expect shape: { questions: [...] } where each has question, options, correctAnswer
      const items = (data.questions?.questions ?? data.questions ?? []) as QuizQuestion[];
      setQuestions(items);
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    const correct = questions.reduce((acc, q, idx) => {
      const pickedIndex = selected[idx];
      const picked = typeof pickedIndex === "number" ? q.options[pickedIndex] : undefined;
      return acc + (picked && picked === q.correctAnswer ? 1 : 0);
    }, 0);
    setResult(`Score: ${correct} / ${questions.length}`);
    const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const pickedIndex = selected[i];
      const picked = typeof pickedIndex === "number" ? q.options[pickedIndex] : undefined;
      const isCorrect = picked === q.correctAnswer;
      await logLearningEvent({ userId, subject: topic, topic: q.question, correct: isCorrect, difficulty: "medium" });
      updateLocalMastery(userId, q.question, isCorrect);
    }
    const weak = getWeakTopics(userId, 1).slice(0, 5).map(({ topic, accuracy }) => ({ topic, accuracy }));
    setWeakList(weak);
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Quiz Generator</h1>
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
              <input type="radio" name="curr-quiz" checked={curriculum===c} onChange={() => setCurriculum(c)} />
              <span>{c === "lk" ? "Sri Lanka" : "International"}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Topic</label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis" />
      </div>
      <Button onClick={generate} disabled={!topic.trim() || loading}>{loading ? "Generating..." : "Generate Quiz"}</Button>
      {questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((q, i) => (
            <div key={i} className="border rounded-md p-3">
              <div className="font-medium mb-2">Q{i + 1}. {q.question}</div>
              <div className="space-y-2">
                {q.options.map((c, j) => (
                  <label key={j} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={`q-${i}`} checked={selected[i] === j} onChange={() => setSelected({ ...selected, [i]: j })} />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <Button onClick={submit}>Submit</Button>
          {result && <Textarea value={result} readOnly />}
          {weakList.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Weak Topics (lowest accuracy)</div>
              <ul className="text-sm space-y-1">
                {weakList.map((w, i) => (
                  <li key={i}>{w.topic} — {(w.accuracy * 100).toFixed(0)}%</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
