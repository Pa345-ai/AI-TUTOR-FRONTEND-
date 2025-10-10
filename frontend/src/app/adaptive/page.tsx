"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { logLearningEvent, adaptiveNext, adaptiveGrade } from "@/lib/api";
import { updateLocalMastery, getWeakTopics } from "@/lib/mastery";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
};

type Difficulty = "easy" | "medium" | "hard";

export default function AdaptivePracticePage() {
  return (
    <Suspense>
      <AdaptiveInner />
    </Suspense>
  );
}

function AdaptiveInner() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<string>("");
  const [history, setHistory] = useState<Array<{ q: string; correct: boolean }>>([]);
  const [loading, setLoading] = useState(false);
  const [weakList, setWeakList] = useState<Array<{ topic: string; accuracy: number }>>([]);

  useEffect(() => {
    const t = searchParams.get('topic');
    if (t) setTopic(t);
    // do not auto-start to let user control; could auto if desired
  }, [searchParams]);

  const nextQuestion = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const data = await adaptiveNext({ userId, topic });
      const q = data?.question as QuizQuestion | null;
      setQuestion(q ?? null);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
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
    const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
    await adaptiveGrade({ userId, topic: question.question, correct, difficulty });
    await logLearningEvent({ userId, subject: topic, topic: question.question, correct, difficulty });
    updateLocalMastery(userId, question.question, correct);
    const weak = getWeakTopics(userId, 1).slice(0, 5).map(({ topic, accuracy }) => ({ topic, accuracy }));
    setWeakList(weak);
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
  );
}
