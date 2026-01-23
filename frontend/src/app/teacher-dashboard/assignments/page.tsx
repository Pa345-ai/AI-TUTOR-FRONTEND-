"use client";

import { useCallback, useEffect, useState } from "react";
import { listClasses } from "@/lib/api";

export default function AssignmentsPage() {
  const [teacherId, setTeacherId] = useState<string>("t-1");
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [classId, setClassId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState<number>(9);
  const [due, setDue] = useState<string>("");
  const [attachments, setAttachments] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  const load = useCallback(async () => {
    try {
      const res = await listClasses(teacherId);
      setClasses(res.classes || []);
      if ((res.classes||[])[0]) setClassId(res.classes[0].id);
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  }, [teacherId]);

  useEffect(()=>{ void load(); }, [load]);

  const create = async () => {
    setStatus("Creating assignment…");
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const payload = { teacherId, title, description, subject: subject || 'General', grade, dueDate: new Date(due).toISOString(), attachments: attachments.split(/\s+/).filter(Boolean) };
      const r = await fetch(`${base}/api/assignments`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || `Failed (${r.status})`);
      // Optionally push to classroom/teams later, or assign to class roster
      setStatus('Created.');
      setTitle(""); setDescription(""); setSubject(""); setDue(""); setAttachments("");
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Assignments</h1>
      <div className="flex items-center gap-2 text-sm">
        <input className="h-9 px-2 border rounded-md" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} placeholder="Teacher ID" />
        <select className="h-9 px-2 border rounded-md" value={classId} onChange={(e)=>setClassId(e.target.value)}>
          {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
      </div>
      <div className="grid gap-2 border rounded-md p-3">
        <div className="grid sm:grid-cols-2 gap-2">
          <input className="h-9 px-2 border rounded-md" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" />
          <input className="h-9 px-2 border rounded-md" value={subject} onChange={(e)=>setSubject(e.target.value)} placeholder="Subject" />
          <input className="h-9 px-2 border rounded-md" type="number" value={grade} onChange={(e)=>setGrade(parseInt(e.target.value||'0'))} placeholder="Grade" />
          <input className="h-9 px-2 border rounded-md" type="datetime-local" value={due} onChange={(e)=>setDue(e.target.value)} placeholder="Due" />
        </div>
        <textarea className="w-full min-h-[120px] border rounded-md p-2 text-sm" value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" />
        <div className="text-xs text-muted-foreground">Attachments (space-separated URLs)</div>
        <input className="h-9 px-2 border rounded-md" value={attachments} onChange={(e)=>setAttachments(e.target.value)} placeholder="https://…" />
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 border rounded-md text-sm" onClick={create}>Create</button>
          {status && <span className="text-xs text-muted-foreground">{status}</span>}
        </div>
      </div>
    </div>
  );
}
