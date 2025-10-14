"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { fetchKnowledgeGraph, fetchMastery } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function KnowledgeGraphPage() {
  const [userId, setUserId] = useState("123");
  const [graph, setGraph] = useState<any | null>(null);
  const [mastery, setMastery] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [subject, setSubject] = useState("math");
  const [topic, setTopic] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const router = useRouter();

  // pan/zoom state for graph canvas
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const panningRef = useRef<{ active: boolean; x: number; y: number }>({ active: false, x: 0, y: 0 });

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

  // Build simple layered DAG layout using prereq depth
  const layout = useMemo(() => {
    const subjectData = graph?.[subject];
    if (!subjectData) return { positions: {} as Record<string,{x:number;y:number}>, edges: [] as Array<[string,string]> };
    const prereqsMap: Record<string,string[]> = subjectData.prereqs || {};
    const nextMap: Record<string,string[]> = subjectData.next || {};
    const allTopics = Object.keys(prereqsMap);
    const indeg: Record<string,number> = {}; allTopics.forEach(t=> indeg[t] = (prereqsMap[t]||[]).length);
    const depth: Record<string,number> = {}; const queue: string[] = [];
    allTopics.forEach(t=> { if (indeg[t]===0) { depth[t] = 0; queue.push(t); } });
    while (queue.length) {
      const u = queue.shift()!;
      const nxt = nextMap[u] || [];
      for (const v of nxt) {
        const cand = (depth[u]||0)+1;
        depth[v] = Math.max(depth[v]||0, cand);
        indeg[v] = Math.max(0, (indeg[v]||1)-1);
        if (indeg[v]===0) queue.push(v);
      }
    }
    // Group by depth
    const levels: Record<number,string[]> = {};
    for (const t of allTopics) {
      const d = depth[t]||0;
      if (!levels[d]) levels[d] = [];
      levels[d].push(t);
    }
    const positions: Record<string,{x:number;y:number}> = {};
    const levelKeys = Object.keys(levels).map(n=>parseInt(n)).sort((a,b)=>a-b);
    const colW = 220; const rowH = 90; const margin = 40;
    levelKeys.forEach((lk, colIdx) => {
      const arr = levels[lk]; arr.sort();
      arr.forEach((t, rowIdx) => {
        positions[t] = { x: margin + colIdx*colW, y: margin + rowIdx*rowH };
      });
    });
    const edges: Array<[string,string]> = [];
    for (const u of allTopics) {
      for (const v of (nextMap[u]||[])) edges.push([u,v]);
    }
    return { positions, edges };
  }, [graph, subject]);

  const readyToAdvance = useMemo(() => {
    if (!topic) return { ready: false, weak: [] as string[] };
    const node = nodes.find(n => n.id === topic);
    if (!node) return { ready: false, weak: [] as string[] };
    const weak = node.prereqs.filter(p => {
      const s = mastery[p]; const acc = s ? (s.correct || 0) / Math.max(1, s.attempts || 0) : 0; return acc < 0.7;
    });
    return { ready: weak.length === 0, weak };
  }, [nodes, topic, mastery]);

  // Path suggestions from weak prereqs to selected topic (following prereq chain)
  const suggestedPaths = useMemo(() => {
    if (!graph || !subject || !topic) return [] as string[][];
    const subj = graph[subject]; const prereqsMap: Record<string,string[]> = subj?.prereqs || {};
    const paths: string[][] = [];
    const target = topic;
    const dfs = (cur: string, seek: string, path: string[], visited: Set<string>): boolean => {
      if (cur === seek) { path.push(cur); return true; }
      if (visited.has(cur)) return false; visited.add(cur);
      const pres = prereqsMap[cur] || [];
      for (const p of pres) { if (dfs(p, seek, path, visited)) { path.push(cur); return true; } }
      return false;
    };
    for (const w of readyToAdvance.weak) {
      const path: string[] = [];
      dfs(target, w, path, new Set());
      if (path.length>0) paths.push(path); // path is w..target (ascending)
    }
    return paths;
  }, [graph, subject, topic, readyToAdvance.weak]);

  const highlightEdges = useMemo(() => {
    const set = new Set<string>();
    for (const p of suggestedPaths) {
      for (let i=0;i<p.length-1;i++) {
        const a = p[i]; const b = p[i+1];
        set.add(`${a}>${b}`);
      }
    }
    return set;
  }, [suggestedPaths]);

  const onWheel: React.WheelEventHandler<SVGSVGElement> = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    const ns = Math.max(0.5, Math.min(2.5, scale * delta));
    setScale(ns);
  };
  const onPointerDown: React.PointerEventHandler<SVGSVGElement> = (e) => {
    panningRef.current = { active: true, x: e.clientX, y: e.clientY };
  };
  const onPointerMove: React.PointerEventHandler<SVGSVGElement> = (e) => {
    if (!panningRef.current.active) return;
    const dx = e.clientX - panningRef.current.x; const dy = e.clientY - panningRef.current.y;
    panningRef.current.x = e.clientX; panningRef.current.y = e.clientY;
    setTx((v)=> v + dx);
    setTy((v)=> v + dy);
  };
  const onPointerUp: React.PointerEventHandler<SVGSVGElement> = () => { panningRef.current.active = false; };
  const resetView = () => { setScale(1); setTx(0); setTy(0); };

  const practice = (t: string) => {
    router.push(`/adaptive?subject=${encodeURIComponent(subject)}&topic=${encodeURIComponent(t)}`);
  };

  return (
    <div className="mx-auto max-w-5xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Knowledge Graph</h1>
      <div className="flex items-center gap-2 text-sm">
        <select className="h-9 px-2 border rounded-md" value={subject} onChange={(e)=>setSubject(e.target.value)}>
          {['math','science','cs','history'].map(s => (<option key={s} value={s}>{s}</option>))}
        </select>
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Interactive graph</div>
          <div className="flex items-center gap-2 text-xs">
            <button className="h-7 px-2 border rounded-md" onClick={resetView}>Reset view</button>
          </div>
        </div>
        <div className="w-full h-[380px] bg-white border rounded relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp}>
            <g transform={`translate(${tx},${ty}) scale(${scale})`}>
              {/* edges */}
              {layout.edges.map(([a,b],i)=>{
                const pa = layout.positions[a]; const pb = layout.positions[b]; if (!pa || !pb) return null;
                const key = `${a}>${b}`; const hl = highlightEdges.has(key);
                return <line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={hl? '#dc2626':'#94a3b8'} strokeWidth={hl? 2.5:1.2} />;
              })}
              {/* nodes */}
              {nodes.map((n)=>{
                const p = layout.positions[n.id]; if (!p) return null; const col = n.acc>=0.85?'#16a34a': n.acc>=0.6?'#ca8a04':'#dc2626';
                return (
                  <g key={n.id} transform={`translate(${p.x},${p.y})`} onClick={()=>setTopic(n.id)}>
                    <circle r={18} fill={topic===n.id? '#1d4ed8' : '#e2e8f0'} stroke="#64748b" />
                    <text x={0} y={-24} textAnchor="middle" fontSize="10" fill="#0f172a">{n.id}</text>
                    <text x={0} y={4} textAnchor="middle" fontSize="9" fill={topic===n.id? '#ffffff':'#0f172a'}>{Math.round(n.acc*100)}%</text>
                    <rect x={-22} y={10} width={44} height={14} rx={3} fill="#ffffff" stroke="#cbd5e1" onClick={(e)=>{ e.stopPropagation(); practice(n.id); }} />
                    <text x={0} y={20} textAnchor="middle" fontSize="9" fill="#0f172a" pointerEvents="none">Practice</text>
                  </g>
                );
              })}
            </g>
          </svg>
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
            {topic && suggestedPaths.length>0 && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-1">Suggested paths</div>
                <ul className="text-xs list-disc pl-5 space-y-1">
                  {suggestedPaths.map((p, idx)=> (
                    <li key={idx}>
                      {p.join(' → ')}
                      <span className="ml-2 inline-flex gap-1">
                        {p.map(t => (
                          <button key={t} className="h-6 px-2 border rounded" onClick={()=>practice(t)}>Practice {t}</button>
                        ))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
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
