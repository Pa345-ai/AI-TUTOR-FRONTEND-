"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const steps = [
  { id: 'profile', title: 'Set your preferences', desc: 'Language, grade, curriculum' },
  { id: 'goals', title: 'Generate your goals', desc: 'Daily/weekly learning plan' },
  { id: 'practice', title: 'Start adaptive practice', desc: 'Personalized question flow' },
  { id: 'lessons', title: 'Try an interactive lesson', desc: 'Guided, step-by-step learning' },
];

export default function OnboardingPage() {
  const [userId, setUserId] = useState<string>('123');
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = window.localStorage.getItem('userId');
      if (uid) setUserId(uid);
      try {
        const raw = window.localStorage.getItem('onboarding');
        setDone(raw ? JSON.parse(raw) : {});
      } catch {}
    }
  }, []);

  const toggle = (id: string) => {
    const next = { ...done, [id]: !done[id] };
    setDone(next);
    if (typeof window !== 'undefined') window.localStorage.setItem('onboarding', JSON.stringify(next));
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Welcome</h1>
      <div className="text-sm text-muted-foreground">User: {userId}</div>
      <div className="grid gap-2">
        {steps.map((s) => (
          <div key={s.id} className="border rounded-md p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="h-4 w-4" checked={!!done[s.id]} onChange={() => toggle(s.id)} />
              {s.id === 'profile' && <Link className="text-xs underline" href={`/settings`}>Open</Link>}
              {s.id === 'goals' && <Link className="text-xs underline" href={`/mastery`}>Open</Link>}
              {s.id === 'practice' && <Link className="text-xs underline" href={`/adaptive`}>Open</Link>}
              {s.id === 'lessons' && <Link className="text-xs underline" href={`/lessons/interactive`}>Open</Link>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
