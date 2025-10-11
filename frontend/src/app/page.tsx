"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchDueReviews, listLessonSessions } from "@/lib/api";

export default function Home() {
  const [userId, setUserId] = useState<string>("123");
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [due, setDue] = useState<Array<{ topic: string }> | null>(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = window.localStorage.getItem('userId');
      if (uid) setUserId(uid);
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const [dueItems, sessions] = await Promise.all([
          fetchDueReviews(userId, 3),
          listLessonSessions(userId),
        ]);
        setDue((dueItems as Array<{ topic: string }>));
        if (Array.isArray(dueItems) && dueItems[0]?.topic) {
          setContinueUrl(`/adaptive?topic=${encodeURIComponent(dueItems[0].topic)}`);
        } else {
          const incompletes = (sessions.sessions || []).filter((s) => !s.completed);
          if (incompletes[0]) setContinueUrl(`/lessons/interactive?session=${encodeURIComponent(incompletes[0].id)}`);
        }
      } catch {}
    })();
  }, [userId]);
  return (
    <div className="mx-auto max-w-3xl w-full p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to AI Tutor</h1>
      <p className="text-sm text-muted-foreground">
        Start a conversation with your tutor, generate lessons, or create quizzes.
      </p>
      {continueUrl && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="text-sm">Continue learning</div>
          <Link href={continueUrl} className="text-sm underline">Go</Link>
        </div>
      )}
      {due && due.length > 0 && (
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-1">Today&apos;s due reviews</div>
          <div className="flex flex-wrap gap-2">
            {due.map((d, i) => (
              <Link key={i} href={`/adaptive?topic=${encodeURIComponent(d.topic)}`} className="px-2 py-1 text-xs border rounded-md hover:bg-muted">{d.topic}</Link>
            ))}
          </div>
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card title="Chat" href="/chat" description="Converse with your AI tutor." />
        <Card title="Lessons" href="/lessons" description="Generate study plans." />
        <Card title="Quizzes" href="/quizzes" description="Create practice questions." />
      </div>
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href} className="block rounded-md border p-4 hover:bg-accent">
      <div className="font-medium mb-1">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </Link>
  );
}
