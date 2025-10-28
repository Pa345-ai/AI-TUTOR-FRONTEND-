"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { logLearningEvent } from "@/lib/api";
import { preferLocalInference, preferLocalQA, tryLocalQA } from "@/lib/local-inference";
import { queryLocalQa } from "@/lib/offline-qa";
import { retrieveMemory } from "@/lib/api";
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [clusters, setClusters] = useState<Array<{ key: string; count: number; examples: Array<{ text: string }> }>>([]);
  const [rationale, setRationale] = useState<string>("");
  const [retest, setRetest] = useState<Array<{ question: string; options: string[]; correctAnswer: string }>>([]);
  const recRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const ds = window.localStorage.getItem("defaultSubject");
    if (ds) setSubject(ds);
    const dg = window.localStorage.getItem("defaultGrade");
    if (dg) setGrade(dg);
    const dc = window.localStorage.getItem("defaultCurriculum");
    if (dc === "lk" || dc === "international") setCurriculum(dc);
  }, []);
  // Persona presets
  const [mode, setMode] = useState<"socratic"|"exam"|"friendly"|"motivational">(()=> (typeof window!=='undefined' ? (window.localStorage.getItem('mode') as any) || 'friendly' : 'friendly'));
  const [level, setLevel] = useState<"eli5"|"normal"|"expert">(()=> (typeof window!=='undefined' ? (window.localStorage.getItem('level') as any) || 'normal' : 'normal'));
  const [personaSocratic, setPersonaSocratic] = useState<number>(()=> (typeof window!=='undefined' ? parseInt(window.localStorage.getItem('personaSocratic')||'50') : 50));
  const [personaStrictness, setPersonaStrictness] = useState<number>(()=> (typeof window!=='undefined' ? parseInt(window.localStorage.getItem('personaStrictness')||'20') : 20));
  const [personaEncouragement, setPersonaEncouragement] = useState<number>(()=> (typeof window!=='undefined' ? parseInt(window.localStorage.getItem('personaEncouragement')||'70') : 70));
  const [presetList, setPresetList] = useState<string[]>([]);
  useEffect(()=>{ try { const raw = window.localStorage.getItem('personaPresets'); if (raw) setPresetList(Object.keys(JSON.parse(raw))); } catch {}; }, []);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const forceLocal = preferLocalQA() || preferLocalInference() || (typeof navigator !== 'undefined' && !navigator.onLine);
      if (forceLocal) {
        // Build questions from local context best-effort
        const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
        const mem = await retrieveMemory({ userId: uid, surface: 'quizzes', query: `${subject ? subject + ': ' : ''}${topic}`, k: 5 }).catch(()=>({ items: [] }));
        const hits = await queryLocalQa(`${subject ? subject + ': ' : ''}${topic}`, 5);
        const ctx = [...(mem.items||[]).map(i=>i.text), ...hits.map(h => h.text)].join('\n\n');
        const baseQ = `Create one multiple-choice question with 4 options and indicate the correct option for topic: ${subject ? subject + ': ' : ''}${topic}.`;
        // Use local QA as a heuristic to pick the most relevant sentence as the correct answer context
        const picked = await tryLocalQA(baseQ, ctx);
        const question: QuizQuestion = {
          question: `Which of the following best relates to: ${topic}?`,
          options: [picked.answer, 'Option B', 'Option C', 'Option D'].sort(() => Math.random() - 0.5),
          correctAnswer: picked.answer,
        };
        setQuestions([question]);
      } else {
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
      }
    } catch (e) {
      setResult(`Error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w: any = window;
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.lang = ((typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) || 'en') === 'si' ? 'si-LK' : ((typeof window !== 'undefined' ? window.localStorage.getItem('language') : null) || 'en') === 'ta' ? 'ta-IN' : 'en-US';
      rec.interimResults = true; rec.maxAlternatives = 1;
      rec.onresult = (e: any) => {
        const results = e.results; const idx = results.length - 1; const res: any = results[idx];
        const transcript = (res && res[0] && res[0].transcript) ? String(res[0].transcript) : '';
        if (!transcript) return; setTopic(transcript);
        if (res.isFinal || transcript.endsWith('.')) { void generate(); }
      };
      rec.onend = () => { if (recording) { try { rec.start(); } catch {} } else { recRef.current = null; } };
      rec.onerror = () => { try { rec.start(); } catch {} };
      recRef.current = rec; setRecording(true); rec.start();
    } catch {}
  };
  const stopVoice = () => { try { recRef.current?.stop?.(); } catch {}; recRef.current = null; setRecording(false); };

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
      <h1 className="text-xl font-semibold flex items-center gap-2">Quiz Generator {(() => { try { const v = typeof window !== 'undefined' ? window.localStorage.getItem('ab:adaptive-strategy') : null; if (v === 'A' || v === 'B') return (<span className={`text-[10px] px-1.5 py-0.5 rounded border ${v==='A'?'bg-green-50 border-green-200 text-green-700':'bg-purple-50 border-purple-200 text-purple-700'}`}>Variant {v}</span>); } catch {} })()}</h1>
      <div className="text-xs text-muted-foreground">Voice: <button className="underline" onClick={()=> recording ? stopVoice() : startVoice()}>{recording ? 'Stop' : 'Push‑to‑talk'}</button></div>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span>Persona</span>
        <select className="h-8 px-2 border rounded-md" value={mode} onChange={(e)=>{ setMode(e.target.value as any); try { window.localStorage.setItem('mode', e.target.value); } catch {} }}>
          {(['socratic','exam','friendly','motivational'] as const).map(m => (<option key={m} value={m}>{m}</option>))}
        </select>
        <select className="h-8 px-2 border rounded-md" value={level} onChange={(e)=>{ setLevel(e.target.value as any); try { window.localStorage.setItem('level', e.target.value); } catch {} }}>
          {(['eli5','normal','expert'] as const).map(l => (<option key={l} value={l}>{l}</option>))}
        </select>
        <label className="flex items-center gap-1">Socratic <input type="range" min={0} max={100} value={personaSocratic} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaSocratic(v); try { window.localStorage.setItem('personaSocratic', String(v)); } catch {} }} /></label>
        <label className="flex items-center gap-1">Strict <input type="range" min={0} max={100} value={personaStrictness} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaStrictness(v); try { window.localStorage.setItem('personaStrictness', String(v)); } catch {} }} /></label>
        <label className="flex items-center gap-1">Encourage <input type="range" min={0} max={100} value={personaEncouragement} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaEncouragement(v); try { window.localStorage.setItem('personaEncouragement', String(v)); } catch {} }} /></label>
        <select className="h-8 px-2 border rounded-md" value={''} onChange={(e)=>{ const key=e.target.value; if (!key) return; try { const obj = JSON.parse(window.localStorage.getItem('personaPresets')||'{}'); const p = obj[key]; if (p) { setMode(p.mode); setLevel(p.level); setPersonaSocratic(p.personaSocratic); setPersonaStrictness(p.personaStrictness); setPersonaEncouragement(p.personaEncouragement); } } catch {}; e.currentTarget.value=''; }}>
          <option value="">Load preset…</option>
          {presetList.map(n => (<option key={n} value={n}>{n}</option>))}
        </select>
      </div>
      <div className="text-xs text-muted-foreground">Need analytics? <button className="underline" onClick={async ()=>{
        setShowAnalytics(true);
        try {
          const base = process.env.NEXT_PUBLIC_BASE_URL!;
          const r = await fetch(`${base}/api/quizzes/analytics`);
          const d = await r.json();
          const list = Object.entries(d.clusters||{}).map(([k,v]:[string, any])=>({ key: k, count: v.count||0, examples: (v.examples||[]).map((e:any)=>({ text: e.text })) }));
          setClusters(list.sort((a,b)=>b.count-a.count));
          setRationale(d.rationale?.top || "");
        } catch {}
      }}>Open analytics</button></div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-xs text-muted-foreground">A/B</span>
        {(['A','B'] as const).map((b) => (
          <button key={b} className={`h-7 px-2 border rounded ${typeof window!=='undefined' && window.localStorage.getItem('ab:adaptive-strategy')===b ? 'bg-accent' : ''}`} onClick={()=>{ try { if (typeof window !== 'undefined') window.localStorage.setItem('ab:adaptive-strategy', b); } catch {} }}>{b}</button>
        ))}
      </div>
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
      <div className="flex items-center gap-2">
        <Button onClick={generate} disabled={!topic.trim() || loading}>{loading ? "Generating..." : "Generate Quiz"}</Button>
        <Button variant="outline" onClick={() => recording ? stopVoice() : startVoice()}>{recording ? 'Stop voice' : 'Push‑to‑talk'}</Button>
      </div>
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
      {showAnalytics && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Common mistaken choices</div>
          <div className="grid gap-2">
            {clusters.map((c)=> (
              <div key={c.key} className="border rounded-md p-2 text-sm">
                <div className="flex items-center justify-between"><div className="font-medium">{c.key}</div><div className="text-xs text-muted-foreground">{c.count}</div></div>
                {c.examples.length>0 && (<ul className="text-xs list-disc pl-4">{c.examples.slice(0,3).map((e,i)=>(<li key={i}>{e.text}</li>))}</ul>)}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <button className="h-7 px-2 border rounded-md" onClick={async ()=>{
                    const base = process.env.NEXT_PUBLIC_BASE_URL!;
                    const rr = await fetch(`${base}/api/quizzes/retest`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topics: [c.key], count: 5 }) });
                    const dd = await rr.json(); setRetest(dd.questions || []);
                  }}>Generate re-test</button>
                  <button className="h-7 px-2 border rounded-md" onClick={()=>{
                    const rows = [ [ 'cluster','count','examples' ].join(',') ] as string[];
                    for (const x of clusters) rows.push([`"${x.key.replace(/"/g,'""')}"`, String(x.count), `"${x.examples.map(y=>y.text.replace(/\n|\r|,/g,' ')).join(' | ').replace(/"/g,'""')}"`].join(','));
                    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
                    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`quiz-analytics-${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
                  }}>Export CSV</button>
                </div>
              </div>
            ))}
          </div>
          {rationale && (
            <div className="border rounded-md p-2 text-xs whitespace-pre-wrap">
              <div className="font-medium mb-1">Rationales</div>
              {rationale}
            </div>
          )}
          {retest.length>0 && (
            <div className="border rounded-md p-2 text-sm">
              <div className="font-medium mb-1">Targeted Re-test</div>
              {retest.map((q,i)=> (
                <div key={i} className="mb-2">
                  <div className="font-medium">Q{i+1}. {q.question}</div>
                  <ul className="text-xs list-disc pl-4">{q.options.map((o,j)=>(<li key={j}>{o}</li>))}</ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
