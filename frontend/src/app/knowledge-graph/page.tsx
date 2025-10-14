"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchKnowledgeGraph, fetchMastery } from "@/lib/api";

export default function KnowledgeGraphPage() {
  const [userId, setUserId] = useState("123");
  const [graph, setGraph] = useState<any | null>(null);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [subject, setSubject] = useState("math");
  const [topic, setTopic] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => { if (typeof window !== 'undefined') { const uid = window.localStorage.getItem('userId'); if (uid) setUserId(uid); } }, []);

  useEffect(() => {
    (async () => {
      try {
        const g = await fetchKnowledgeGraph();
        setGraph(g);
        const m = await fetchMastery(userId);
        setMastery(m);
      } catch (e) {
        setStatus(e instanceof Error ? e.message : String(e));
      }
    })();
  }, [userId]);

  const nodes = useMemo(() => {
    const list: Array<{ id: string; prereqs: string[]; next: string[]; acc: number }> = [];
    if (!graph) return list;
    const subj = graph?.[subject] || {};
    const topics: string[] = Object.keys(subj?.prereqs || {});
    for (const t of topics) {
      const s = mastery[t];
      const acc = s ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0;
      const prereqs: string[] = subj.prereqs[t] || [];
      const next: string[] = subj.next?.[t] || [];
      list.push({ id: t, prereqs, next, acc });
    }
    return list.sort((a,b)=> a.id.localeCompare(b.id));
  }, [graph, mastery, subject]);

  const readyToAdvance = useMemo(() => {
    if (!topic) return { ready: false, weak: [] as string[] };
    const node = nodes.find(n => n.id === topic);
    if (!node) return { ready: false, weak: [] as string[] };
    const weak = node.prereqs.filter(p => {
      const s = mastery[p]; const acc = s ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0; return acc < 0.7;
    });
    return { ready: weak.length === 0, weak };
  }, [nodes, topic, mastery]);

  return (
    <div className="mx-auto max-w-5xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Knowledge Graph</h1>
      <div className="flex items-center gap-2 text-sm">
        <select className="h-9 px-2 border rounded-md" value={subject} onChange={(e)=>setSubject(e.target.value)}>
          {['math','science','cs','history'].map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
      </div>
      <div className="border rounded-md p-3">
        <div className="text-sm font-medium mb-2">Topics</div>
        <div className="grid md:grid-cols-3 gap-2">
          {nodes.map(n => (
            <button key={n.id} className={`text-left border rounded-md p-2 ${topic===n.id?'ring-1 ring-blue-500':''}`} onClick={()=>setTopic(n.id)}>
              <div className="flex items-center justify-between">
                <div className="font-medium">{n.id}</div>
                <div className={`text-[11px] ${n.acc>=0.85?'text-green-600':n.acc>=0.6?'text-yellow-600':'text-red-600'}`}>{Math.round(n.acc*100)}%</div>
              </div>
              <div className="text-xs text-muted-foreground">Prereqs: {n.prereqs.join(', ') || 'none'}</div>
              <div className="text-xs text-muted-foreground">Next: {n.next.join(', ') || '—'}</div>
            </button>
          ))}
        </div>
      </div>
      {topic && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium mb-1">Ready to advance?</div>
            <div className="text-sm">{readyToAdvance.ready ? 'Yes' : 'Not yet'}</div>
            {!readyToAdvance.ready && (
              <ul className="mt-2 text-sm list-disc pl-5">
                {readyToAdvance.weak.map(w => (<li key={w}>{w} — {Math.round(((mastery[w]?.correct||0)/Math.max(1, mastery[w]?.attempts||0))*100)}%</li>))}
              </ul>
            )}
          </div>
          <div className="border rounded-md p-3">
            <div className="text-sm font-medium mb-1">Gap propagation & remediation</div>
            {readyToAdvance.weak.length===0 ? (
              <div className="text-xs text-muted-foreground">No remediation needed.</div>
            ) : (
              <ul className="text-sm list-disc pl-5">
                {readyToAdvance.weak.map(w => (
                  <li key={w}>Review prerequisite "{w}" first. Suggested steps: practice 3 questions on {w}, then retake a quick check on {topic}.
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
