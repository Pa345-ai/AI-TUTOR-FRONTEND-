"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string; // backend returns text, we'll compare by text
};

export default function QuizzesPage() {
  const [topic, setTopic] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const res = await fetch(`${base}/api/quizzes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty: "medium", count: 5, language: "en" }),
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

  const submit = () => {
    const correct = questions.reduce((acc, q, idx) => {
      const pickedIndex = selected[idx];
      const picked = typeof pickedIndex === "number" ? q.options[pickedIndex] : undefined;
      return acc + (picked && picked === q.correctAnswer ? 1 : 0);
    }, 0);
    setResult(`Score: ${correct} / ${questions.length}`);
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Quiz Generator</h1>
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
        </div>
      )}
    </div>
  );
}
