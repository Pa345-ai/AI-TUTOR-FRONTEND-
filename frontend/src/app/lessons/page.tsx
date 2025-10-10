"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LessonsPage() {
  const [topic, setTopic] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const res = await fetch(`${base}/lessons/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setPlan(typeof data.plan === "string" ? data.plan : JSON.stringify(data, null, 2));
    } catch (e) {
      setPlan(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Lesson Planner</h1>
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
