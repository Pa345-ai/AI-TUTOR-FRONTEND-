"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ExamsPage() {
  const [userId, setUserId] = useState("123");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<'easy'|'medium'|'hard'>("medium");
  const [count, setCount] = useState(10);
  const [sections, setSections] = useState<Array<{ name: string; count: number; difficulty: 'easy'|'medium'|'hard' }>>([{ name: 'Section A', count: 5, difficulty: 'medium' }]);
  const [questions, setQuestions] = useState<Array<{ question: string; options: string[]; correctAnswer?: string }>>([]);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [timeLimit, setTimeLimit] = useState(10); // minutes
  const [remaining, setRemaining] = useState<number>(0);
  const [running, setRunning] = useState(false);
  const [proctor, setProctor] = useState(false);
  const [variant, setVariant] = useState<'A'|'B'|'none'>('none');
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [cheatEvents, setCheatEvents] = useState<Array<{ at: string; type: string; detail?: string }>>([]);
  const presenceRef = useRef<{ seen: number; frames: number }>({ seen: 0, frames: 0 });
  const proctorTimerRef = useRef<number | null>(null);

  useEffect(() => { if (typeof window !== 'undefined') { const uid = window.localStorage.getItem('userId'); if (uid) setUserId(uid); } }, []);

  // Restore unfinished session
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('examSession');
      if (!raw) return;
      const s = JSON.parse(raw) as any;
      if (s && s.questions && Array.isArray(s.questions) && s.remaining>0) {
        setSessionId(s.sessionId || null);
        setTopic(s.topic || '');
        setDifficulty(s.difficulty || 'medium');
        setQuestions(s.questions || []);
        setAnswers(s.answers || {});
        setRemaining(s.remaining || 0);
        setRunning(true);
      }
    } catch {}
  }, []);

  // Persist session periodically
  useEffect(() => {
    if (!running) return;
    if (typeof window === 'undefined') return;
    const payload = { sessionId, topic, difficulty, questions, answers, remaining };
    try { window.localStorage.setItem('examSession', JSON.stringify(payload)); } catch {}
  }, [running, sessionId, topic, difficulty, questions, answers, remaining]);

  // Anti-cheat: blur/tab switch/fullscreen + copy/paste
  useEffect(() => {
    const onBlur = () => setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'blur' }]);
    const onVis = () => { if (document.visibilityState !== 'visible') setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'hidden' }]); };
    const onFs = () => { if (!document.fullscreenElement) setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'exit-fullscreen' }]); };
    const onCopy = () => setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'copy' }]);
    const onPaste = () => setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'paste' }]);
    window.addEventListener('blur', onBlur);
    document.addEventListener('visibilitychange', onVis);
    document.addEventListener('fullscreenchange', onFs);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    return () => {
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('visibilitychange', onVis);
      document.removeEventListener('fullscreenchange', onFs);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
    };
  }, []);

  const addSection = () => setSections(prev => [...prev, { name: `Section ${String.fromCharCode(65+prev.length)}`, count: 5, difficulty: 'medium' }]);
  const removeSection = (idx: number) => setSections(prev => prev.filter((_,i)=>i!==idx));

  const assignVariant = useCallback(async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const r = await fetch(`${base}/api/ab/assign`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ userId }) });
      const d = await r.json();
      setVariant((d.bucket==='A'||d.bucket==='B')? d.bucket : 'none');
    } catch {}
  }, [userId]);

  const startExam = useCallback(async () => {
    try {
      setRunning(false); setQuestions([]); setAnswers({});
      setCheatEvents([]); setReviewMode(false);
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const qs: Array<{ question: string; options: string[]; correctAnswer?: string }> = [];
      const plan = sections.length>0 ? sections : [{ name:'Exam', count, difficulty } as any];
      for (const s of plan) {
        const r = await fetch(`${base}/api/quizzes/generate`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ topic: topic || 'General Knowledge', difficulty: s.difficulty, count: s.count, language: 'en' }) });
        const d = await r.json();
        const list = (d.questions?.questions || []) as Array<{ question: string; options: string[]; correctAnswer?: string }>;
        qs.push(...list);
      }
      setQuestions(qs);
      setRemaining(timeLimit * 60);
      setRunning(true);
      setSessionId(crypto.randomUUID());
      // start timer
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => setRemaining(r => {
        if (r <= 1) { window.clearInterval(timerRef.current!); timerRef.current = null; setRunning(false); return 0; }
        return r - 1;
      }), 1000);
      // webcam proctoring
      if (proctor && videoRef.current) {
        try {
          const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
          videoRef.current.srcObject = s; await videoRef.current.play().catch(()=>{});
          // basic face presence using FaceDetector if available
          const FaceDetectorCtor = (window as any).FaceDetector as (new (opts?: any) => any) | undefined;
          if (FaceDetectorCtor) {
            const det = new FaceDetectorCtor({ fastMode: true });
            const tick = async () => {
              try {
                if (!videoRef.current) return;
                const faces = await det.detect(videoRef.current);
                presenceRef.current.frames += 1;
                if (faces && faces.length>0) presenceRef.current.seen += 1;
              } catch {}
              proctorTimerRef.current = window.setTimeout(tick, 1500);
            };
            tick();
          }
        } catch {}
      }
    } catch {}
  }, [sections, count, difficulty, topic, timeLimit, proctor]);

  const submit = useCallback(async () => {
    setRunning(false);
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
    const correct = questions.reduce((acc, q, i) => acc + ((q.correctAnswer && answers[i]!=null && q.options[answers[i] as number]===q.correctAnswer) ? 1 : 0), 0);
    // stop proctor timers & camera
    if (proctorTimerRef.current) { window.clearTimeout(proctorTimerRef.current); proctorTimerRef.current = null; }
    const stream = (videoRef.current?.srcObject as MediaStream | null); if (stream) stream.getTracks().forEach(t => t.stop());
    // clear persisted session
    try { if (typeof window !== 'undefined') window.localStorage.removeItem('examSession'); } catch {}
    setReviewMode(true);
    const presencePct = presenceRef.current.frames>0? Math.round((presenceRef.current.seen/presenceRef.current.frames)*100) : 0;
    setCheatEvents((e)=>[...e, { at: new Date().toISOString(), type: 'result', detail: `score ${correct}/${questions.length}; presence ${presencePct}%` }]);
    // send result
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const sectionsPayload = sections.map(s => ({ name: s.name, correct: 0, total: s.count }));
      await fetch(`${base}/api/exams/result`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ userId, sessionId, score: correct, total: questions.length, sections: sectionsPayload, cheat: { events: cheatEvents } }) });
    } catch {}
  }, [answers, questions]);

  const remainingClock = useMemo(() => {
    const m = Math.floor(remaining/60); const s = remaining%60; return `${m}:${String(s).padStart(2,'0')}`;
  }, [remaining]);

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Exam Mode</h1>
      <div className="grid gap-2 border rounded-md p-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Input value={topic} onChange={(e)=>setTopic(e.target.value)} placeholder="Topic (optional)" />
          <select className="h-9 px-2 border rounded-md" value={difficulty} onChange={(e)=>setDifficulty(e.target.value as any)}>
            {(['easy','medium','hard'] as const).map(d => (<option key={d} value={d}>{d}</option>))}
          </select>
          <Input type="number" value={count} onChange={(e)=>setCount(parseInt(e.target.value||'0'))} placeholder="# questions" />
          <Input type="number" value={timeLimit} onChange={(e)=>setTimeLimit(parseInt(e.target.value||'10'))} placeholder="Minutes" />
          <label className="text-xs flex items-center gap-1"><input type="checkbox" checked={proctor} onChange={(e)=>setProctor(e.target.checked)} /> Webcam proctor</label>
          <Button variant="outline" onClick={assignVariant}>Assign A/B</Button>
          <span className="text-xs text-muted-foreground">Variant: {variant}</span>
        </div>
        <div className="grid gap-2">
          <div className="text-sm font-medium">Sections</div>
          <div className="grid gap-2">
            {sections.map((s, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <Input value={s.name} onChange={(e)=> setSections(prev => prev.map((x,idx)=> idx===i? { ...x, name: e.target.value } : x))} />
                <Input type="number" value={s.count} onChange={(e)=> setSections(prev => prev.map((x,idx)=> idx===i? { ...x, count: parseInt(e.target.value||'0') } : x))} />
                <select className="h-8 px-2 border rounded-md" value={s.difficulty} onChange={(e)=> setSections(prev => prev.map((x,idx)=> idx===i? { ...x, difficulty: e.target.value as any } : x))}>
                  {(['easy','medium','hard'] as const).map(d => (<option key={d} value={d}>{d}</option>))}
                </select>
                <Button variant="outline" size="sm" onClick={()=>removeSection(i)}>Remove</Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addSection}>Add section</Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={startExam}>Start exam</Button>
          {running && <span className="text-sm">Time left: {remainingClock}</span>}
          {!running && questions.length>0 && !reviewMode && (
            <button className="h-8 px-3 border rounded-md text-sm" onClick={()=> setRunning(true)}>Resume</button>
          )}
          <button className="h-8 px-3 border rounded-md text-sm" onClick={async ()=>{ try { await document.documentElement.requestFullscreen?.(); } catch {} }}>Enter full-screen</button>
          <button className="h-8 px-3 border rounded-md text-sm" onClick={async ()=>{ try { await document.exitFullscreen?.(); } catch {} }}>Exit full-screen</button>
        </div>
        {proctor && (<video ref={videoRef} className="w-full max-h-48 bg-black rounded" muted playsInline />)}
      </div>

      {questions.length > 0 && (
        <div className="grid gap-3 border rounded-md p-3">
          {questions.map((q, i) => (
            <div key={i} className="border rounded-md p-2">
              <div className="text-sm font-medium">Q{i+1}. {q.question}</div>
              <div className="mt-2 grid gap-1">
                {q.options.map((o, j) => (
                  <label key={j} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={`q${i}`} checked={answers[i]===j} onChange={()=> setAnswers(prev => ({ ...prev, [i]: j }))} />
                    <span>{o}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Button onClick={submit} disabled={running}>Submit</Button>
          </div>
        </div>
      )}

      {reviewMode && (
        <div className="grid gap-3 border rounded-md p-3">
          <div className="text-sm font-medium">Result review</div>
          <div className="grid gap-2">
            {questions.map((q, i) => {
              const picked = answers[i] as number | undefined;
              const correct = q.correctAnswer ? q.options[picked ?? -1] === q.correctAnswer : undefined;
              return (
                <div key={i} className={`border rounded p-2 ${correct===true?'border-green-600':correct===false?'border-red-600':''}`}>
                  <div className="text-sm font-medium">Q{i+1}. {q.question}</div>
                  {typeof picked === 'number' && (
                    <div className="text-xs mt-1">Your answer: {q.options[picked]}</div>
                  )}
                  {q.correctAnswer && (
                    <div className="text-xs text-muted-foreground">Correct: {q.correctAnswer}</div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="mt-2">
            <div className="text-sm font-medium">Proctoring & anti‑cheat evidence</div>
            <ul className="text-xs list-disc pl-5">
              {cheatEvents.map((e, idx) => (<li key={idx}>{e.at} — {e.type}{e.detail? ` (${e.detail})`: ''}</li>))}
              {cheatEvents.length===0 && (<li className="text-muted-foreground">No events recorded.</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
