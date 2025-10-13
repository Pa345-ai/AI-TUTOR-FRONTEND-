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

  useEffect(() => { if (typeof window !== 'undefined') { const uid = window.localStorage.getItem('userId'); if (uid) setUserId(uid); } }, []);

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
        } catch {}
      }
    } catch {}
  }, [sections, count, difficulty, topic, timeLimit, proctor]);

  const submit = useCallback(async () => {
    setRunning(false);
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null; }
    const correct = questions.reduce((acc, q, i) => acc + ((q.correctAnswer && answers[i]!=null && q.options[answers[i] as number]===q.correctAnswer) ? 1 : 0), 0);
    alert(`Exam submitted. Score: ${correct}/${questions.length}`);
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
    </div>
  );
}
