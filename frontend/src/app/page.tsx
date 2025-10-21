"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { addQaDocLocal, listQaDocsLocal, deleteQaDocLocal, queryLocalQa } from "@/lib/offline-qa";
import { fetchDueReviews, listLessonSessions, fetchGoals, fetchNotifications, fetchProgress, streakCheckin, streakFreeze, type Notification } from "@/lib/api";

export default function Home() {
  const [userId, setUserId] = useState<string>("123");
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [resume, setResume] = useState<{ id: string; title: string } | null>(null);
  const [due, setDue] = useState<Array<{ topic: string }> | null>(null);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [goalsMsg, setGoalsMsg] = useState<string | null>(null);
  const [announce, setAnnounce] = useState<Notification | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [checkinDone, setCheckinDone] = useState<boolean>(false);
  const [checkinMsg, setCheckinMsg] = useState<string | null>(null);
  const [note, setNote] = useState<string>("");
  const [qaDocs, setQaDocs] = useState<Array<{ id: string; title: string; createdAt: string }>>([]);
  const [qaFile, setQaFile] = useState<File | null>(null);
  const [qaSync, setQaSync] = useState<boolean>(false);
  const [qaQuery, setQaQuery] = useState<string>("");
  const [qaAnswers, setQaAnswers] = useState<Array<{ text: string; score: number }>>([]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = window.localStorage.getItem('userId');
      if (uid) setUserId(uid);
      const saved = window.localStorage.getItem('quickNote');
      if (saved) setNote(saved);
    }
    (async () => { const list = await listQaDocsLocal(); setQaDocs(list); })();
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
        // resume last incomplete
        const incompletes = (sessions.sessions || []).filter((s) => !s.completed);
        if (incompletes[0]) setResume({ id: incompletes[0].id, title: incompletes[0].lesson?.title || incompletes[0].topic });
        try {
          const notifs = await fetchNotifications(userId);
          const sys = (notifs || []).find(n => n.type === 'system' && !n.isRead) || (notifs || [])[0];
          if (sys) setAnnounce(sys as Notification);
        } catch {}
        try {
          const p = await fetchProgress(userId);
          setStreak(p.streak || 0);
        } catch {}
      } catch {}
    })();
  }, [userId]);

  // Auto daily check-in once per day; allow manual check-in as well
  useEffect(() => {
    if (!userId) return;
    const now = new Date();
    const iso = now.toISOString().slice(0, 10);
    const key = `checkin:${userId}:${iso}`;
    const already = typeof window !== 'undefined' ? window.localStorage.getItem(key) : '1';
    if (already) {
      setCheckinDone(true);
      return;
    }
    (async () => {
      try {
        const res = await streakCheckin(userId);
        setStreak(res.streak);
        setCheckinDone(true);
        setCheckinMsg(`Checked in! +${Math.max(0, res.xp - 0)} XP`);
        if (typeof window !== 'undefined') window.localStorage.setItem(key, '1');
      } catch {}
    })();
  }, [userId]);
  return (
    <div className="mx-auto max-w-3xl w-full p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Welcome to AI Tutor</h1>
      {announce && (
        <div className="border rounded-md p-3 bg-accent/40">
          <div className="text-sm font-medium">{announce.title}</div>
          <div className="text-sm">{announce.message}</div>
        </div>
      )}
      <div className="border rounded-md p-3 flex items-center justify-between bg-green-50">
        <div className="text-sm">{checkinDone ? `Daily check-in complete — Streak ${streak} day${streak===1?'':'s'}.` : `Don't lose your streak (${streak} day${streak===1?'':'s'}).`}{checkinMsg ? ` ${checkinMsg}` : ''}</div>
        <div className="flex items-center gap-3">
          {!checkinDone && (
            <button
              className="text-sm underline"
              onClick={async ()=>{
                try {
                  const res = await streakCheckin(userId);
                  setStreak(res.streak);
                  setCheckinDone(true);
                  const iso = new Date().toISOString().slice(0,10);
                  if (typeof window !== 'undefined') window.localStorage.setItem(`checkin:${userId}:${iso}`, '1');
                } catch {}
              }}
            >Check-in</button>
          )}
          <button
            className="text-sm underline"
            onClick={async ()=>{
              try {
                const lastFreeze = typeof window !== 'undefined' ? window.localStorage.getItem('streakFreezeAt') : null;
                const now = Date.now();
                if (lastFreeze && now - parseInt(lastFreeze) < 7*24*60*60*1000) return;
                await streakFreeze(userId);
                if (typeof window !== 'undefined') window.localStorage.setItem('streakFreezeAt', String(now));
                setCheckinMsg('Streak frozen for today.');
              } catch {}
            }}
          >Freeze once</button>
        </div>
      </div>
      <div className="border rounded-md p-3">
        <div className="text-sm font-medium mb-1">Quick note</div>
        <textarea className="w-full h-24 border rounded-md p-2 text-sm" value={note} onChange={(e)=>{ setNote(e.target.value); if (typeof window!== 'undefined') window.localStorage.setItem('quickNote', e.target.value); }} placeholder="Write a quick thought or to-do..." />
      </div>
      <div className="border rounded-md p-3">
        <div className="text-sm font-medium">Offline Q&A (local corpus)</div>
        <div className="flex items-center gap-2 text-xs mb-2">
          <label className="flex items-center gap-1"><input type="checkbox" checked={qaSync} onChange={(e)=>setQaSync(e.target.checked)} /> Sync to cloud</label>
        </div>
        <div className="flex items-center gap-2 text-sm mb-2">
          <input type="file" accept=".pdf,.txt" onChange={(e)=>setQaFile(e.target.files?.[0]||null)} />
          <button className="h-8 px-2 border rounded-md" onClick={async ()=>{
            if (!qaFile) return;
            try {
              let content = '';
              if (qaFile.type === 'text/plain') { content = await qaFile.text(); }
              else if (qaFile.type === 'application/pdf') {
                const form = new FormData(); form.append('file', qaFile); form.append('language','en');
                const base = process.env.NEXT_PUBLIC_BASE_URL!;
                const r = await fetch(`${base}/api/summarize/upload`, { method: 'POST', body: form });
                const d = await r.json();
                content = Array.isArray(d?.highlights) ? d.highlights.map((h: any)=>h.quote).join('\n') : (d?.summary || '');
              }
              const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
              await addQaDocLocal(uid, qaFile.name, content);
              if (qaSync) {
                try { await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/qa/docs`, { method:'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ userId: uid, title: qaFile.name, content }) }); } catch {}
              }
              const list = await listQaDocsLocal(); setQaDocs(list); setQaFile(null);
            } catch {}
          }}>Ingest</button>
        </div>
        <div className="text-xs text-muted-foreground mb-2">Docs: {qaDocs.length}</div>
        <ul className="text-sm space-y-1 mb-2 max-h-32 overflow-auto">
          {qaDocs.map((d)=> (
            <li key={d.id} className="flex items-center justify-between gap-2">
              <span className="truncate">{d.title}</span>
              <button className="h-6 px-2 border rounded-md text-xs" onClick={async ()=>{ await deleteQaDocLocal(d.id); const list = await listQaDocsLocal(); setQaDocs(list); }}>Delete</button>
            </li>
          ))}
          {qaDocs.length === 0 && <li className="text-xs text-muted-foreground">No local docs yet.</li>}
        </ul>
        <div className="flex items-center gap-2">
          <input className="flex-1 h-9 px-2 border rounded-md text-sm" placeholder="Ask your local corpus (offline)" value={qaQuery} onChange={(e)=>setQaQuery(e.target.value)} />
          <button className="h-9 px-3 border rounded-md text-sm" onClick={async ()=>{ const res = await queryLocalQa(qaQuery, 5); setQaAnswers(res); }}>Ask</button>
        </div>
        {qaAnswers.length > 0 && (
          <div className="mt-2 space-y-1 text-xs">
            {qaAnswers.map((a,i)=> (
              <div key={i} className="border rounded-md p-2">
                <div className="opacity-70">Score: {(a.score*100).toFixed(0)}%</div>
                <div className="mt-1 whitespace-pre-wrap">{a.text}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="border rounded-md p-3 flex items-center justify-between">
        <div className="text-sm">Calendar</div>
        <div className="flex items-center gap-3">
          <a className="text-sm underline" href={`${process.env.NEXT_PUBLIC_BASE_URL}/api/calendar/${encodeURIComponent(userId)}.ics`}>Add to calendar (ICS)</a>
          <button className="text-sm underline" onClick={async ()=>{
            try {
              const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/calendar/${encodeURIComponent(userId)}.ics`;
              await navigator.clipboard.writeText(url);
            } catch {}
          }}>Copy link</button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        Start a conversation with your tutor, generate lessons, or create quizzes.
      </p>
      {continueUrl && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="text-sm">Continue learning</div>
          <Link href={continueUrl} className="text-sm underline">Go</Link>
        </div>
      )}
      {resume && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="text-sm truncate">Resume: {resume.title}</div>
          <Link href={`/lessons/interactive?session=${encodeURIComponent(resume.id)}`} className="text-sm underline">Open</Link>
        </div>
      )}
      <div className="border rounded-md p-3 flex items-center justify-between">
        <div className="text-sm">Weekly goals</div>
        <button
          className="text-sm underline"
          onClick={async () => {
            try {
              setGoalsLoading(true);
              setGoalsMsg(null);
              const lang = (typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) as 'en'|'si'|'ta'|null;
              await fetchGoals(userId, 'weekly', lang ?? 'en');
              setGoalsMsg('Weekly goals updated. See Mastery → Your Goals.');
            } catch (e) {
              setGoalsMsg(e instanceof Error ? e.message : String(e));
            } finally {
              setGoalsLoading(false);
            }
          }}
          disabled={goalsLoading}
        >{goalsLoading ? 'Generating…' : 'Generate weekly goals'}</button>
      </div>
      {goalsMsg && (
        <div className="text-xs text-muted-foreground">{goalsMsg}</div>
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
