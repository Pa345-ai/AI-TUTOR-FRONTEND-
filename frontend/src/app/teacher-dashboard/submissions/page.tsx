"use client";

import { useCallback, useEffect, useState } from "react";
import { listAssignments, listSubmissions, gradeSubmission } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function SubmissionsPage() {
  const [teacherId, setTeacherId] = useState<string>("t-1");
  const [assignments, setAssignments] = useState<Array<{ id: string; title: string; description: string; subject: string; dueDate: string }>>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [subs, setSubs] = useState<Array<{ id: string; studentId: string; content?: string; attachments?: string[]; submittedAt: string; grade?: number; feedback?: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const loadAssign = useCallback(async () => {
    setLoading(true); setStatus('');
    try {
      const d = await listAssignments({ teacherId });
      setAssignments(d.assignments || []);
      if ((d.assignments||[])[0]) setSelected(d.assignments[0].id);
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, [teacherId]);

  const loadSubs = useCallback(async () => {
    if (!selected) return;
    setLoading(true); setStatus('');
    try {
      const d = await listSubmissions(selected);
      setSubs(d.submissions || []);
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
    finally { setLoading(false); }
  }, [selected]);

  useEffect(() => { void loadAssign(); }, [loadAssign]);
  useEffect(() => { void loadSubs(); }, [loadSubs]);

  const grade = async (sid: string, g: number, fb: string) => {
    setStatus('Grading…');
    try { await gradeSubmission(sid, g, fb); await loadSubs(); setStatus('Graded'); } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Submissions</h1>
      <div className="flex items-center gap-2 text-sm">
        <input className="h-9 px-2 border rounded-md" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} placeholder="Teacher ID" />
        <Button variant="outline" onClick={loadAssign} disabled={loading}>{loading? 'Loading…' : 'Load assignments'}</Button>
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="border rounded-md p-2">
          <div className="text-sm font-medium mb-1">Assignments</div>
          <ul className="text-sm space-y-1 max-h-64 overflow-auto">
            {assignments.map(a => (
              <li key={a.id} className={`p-2 rounded border ${selected===a.id?'bg-accent':''}`} onClick={()=>setSelected(a.id)}>
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.subject} • due {new Date(a.dueDate).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded-md p-2">
          <div className="text-sm font-medium mb-1">Submissions</div>
          <ul className="text-sm space-y-2 max-h-64 overflow-auto">
            {subs.map(s => (
              <li key={s.id} className="border rounded p-2">
                <div className="flex items-center justify-between"><div className="font-medium">{s.studentId}</div><div className="text-xs text-muted-foreground">{new Date(s.submittedAt).toLocaleString()}</div></div>
                {s.content && <div className="mt-1 text-xs whitespace-pre-wrap">{s.content}</div>}
                {Array.isArray(s.attachments) && s.attachments.length>0 && (
                  <ul className="text-xs list-disc pl-4">{s.attachments.map((x,i)=>(<li key={i}><a className="underline" href={x} target="_blank" rel="noreferrer">Attachment {i+1}</a></li>))}</ul>
                )}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <input className="h-8 px-2 border rounded-md w-20" type="number" defaultValue={s.grade ?? 0} id={`g-${s.id}`} />
                  <input className="h-8 px-2 border rounded-md flex-1" defaultValue={s.feedback ?? ''} id={`f-${s.id}`} placeholder="Feedback" />
                  <Button size="sm" onClick={()=>{
                    const g = parseInt((document.getElementById(`g-${s.id}`) as HTMLInputElement).value||'0');
                    const fb = (document.getElementById(`f-${s.id}`) as HTMLInputElement).value||'';
                    void grade(s.id, g, fb);
                  }}>Grade</Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
