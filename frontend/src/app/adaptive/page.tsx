"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Difficulty = "easy" | "medium" | "hard";

export default function AdaptivePracticePage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<Array<{ q: string; correct: boolean }>>([]);
  const [loading, setLoading] = useState(false);

  const nextQuestion = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const res = await fetch(`${base}/api/quizzes/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count: 1, language: "en" }),
      });
      const data = await res.json();
      const items = (data.questions?.questions ?? data.questions ?? []) as QuizQuestion[];
      setQuestion(items[0] ?? null);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    if (!question || selected == null) return;
    const picked = question.options[selected];
    const correct = picked === question.correctAnswer;
    setResult(correct ? "Correct!" : `Incorrect. Answer: ${question.correctAnswer}`);
    setHistory((prev) => [{ q: question.question, correct }, ...prev].slice(0, 10));
    // Adjust difficulty adaptively
    setDifficulty((prev) => {
      if (correct) return prev === "medium" ? "hard" : prev === "easy" ? "medium" : "hard";
      return prev === "medium" ? "easy" : prev === "hard" ? "medium" : "easy";
    });
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Adaptive Practice</h1>
      <div className="space-y-2">
        <label className="text-sm font-medium">Topic</label>
        <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Algebra" />
      </div>
      <div className="text-xs text-muted-foreground">Difficulty: {difficulty.toUpperCase()}</div>
      <div className="flex items-center gap-2">
        <Button onClick={nextQuestion} disabled={!topic.trim() || loading}>{loading ? "Loading..." : (question ? "Next" : "Start")}</Button>
        {question && <Button variant="outline" onClick={submit} disabled={selected == null}>Submit</Button>}
      </div>
      {question && (
        <div className="space-y-2 border rounded-md p-3">
          <div className="font-medium">{question.question}</div>
          <div className="space-y-2">
            {question.options.map((c, i) => (
              <label key={i} className="flex items-center gap-2 text-sm">
                <input type="radio" name="opt" checked={selected === i} onChange={() => setSelected(i)} />
                <span>{c}</span>
              </label>
            ))}
          </div>
          {result && <Textarea value={result} readOnly />}
        </div>
      )}
      {history.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Recent</div>
          <ul className="text-sm space-y-1">
            {history.map((h, i) => (
              <li key={i} className={h.correct ? "text-green-600" : "text-red-600"}>
                {h.correct ? "✓" : "✗"} {h.q}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
