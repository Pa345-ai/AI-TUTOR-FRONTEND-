"use client";

import { useEffect, useState } from "react";
import { listClasses, createClass, listClassMembers, addClassMember, fetchStudentTrends, fetchStudentSummary, fetchStudentSuggestions } from "@/lib/api";

export default function ClassesPage() {
  const [teacherId, setTeacherId] = useState<string>("t-1");
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [name, setName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [members, setMembers] = useState<Array<{ studentId: string }>>([]);
  const [newStudent, setNewStudent] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [trends, setTrends] = useState<Array<{ date: string; attempts: number; correct: number }>>([]);
  const [summary, setSummary] = useState<{ progress?: { xp: number; level: number; streak: number }; weak: Array<{ topic: string; accuracy: number }>; strong: Array<{ topic: string; accuracy: number }> } | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ topic: string; pCorrect: number; difficulty: 'easy'|'medium'|'hard' }>>([]);

  const load = async () => {
    const tid = (typeof window !== 'undefined' ? window.localStorage.getItem('teacherId') : null) || teacherId;
    const res = await listClasses(tid);
    setClasses(res.classes || []);
  };

  useEffect(() => { void load(); }, []);

  const createC = async () => {
    if (!name.trim()) return;
    const tid = (typeof window !== 'undefined' ? window.localStorage.getItem('teacherId') : null) || teacherId;
    await createClass({ name, teacherId: tid });
    setName("");
    await load();
  };

  const openClass = async (id: string) => {
    setSelectedClass(id);
    const res = await listClassMembers(id);
    setMembers(res.members || []);
  };

  const addMember = async () => {
    if (!selectedClass || !newStudent.trim()) return;
    await addClassMember(selectedClass, newStudent.trim());
    setNewStudent("");
    const res = await listClassMembers(selectedClass);
    setMembers(res.members || []);
  };

  const openStudent = async (studentId: string) => {
    setSelectedStudent(studentId);
    const res = await fetchStudentTrends(studentId, 14);
    setTrends(res.trends || []);
    try { const s = await fetchStudentSummary(studentId); setSummary(s); } catch { setSummary(null); }
    try { const sug = await fetchStudentSuggestions(studentId); setSuggestions(sug.suggestions || []); } catch { setSuggestions([]); }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Classes</h1>
      <div className="flex items-center gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" value={teacherId} onChange={(e)=>setTeacherId(e.target.value)} placeholder="Teacher ID" />
        <button className="h-9 px-3 border rounded-md text-sm" onClick={load}>Load</button>
      </div>
      <div className="flex items-center gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" value={name} onChange={(e)=>setName(e.target.value)} placeholder="New class name" />
        <button className="h-9 px-3 border rounded-md text-sm" onClick={createC}>Create</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-2">Your classes</div>
          <ul className="text-sm space-y-1">
            {classes.map((c) => (
              <li key={c.id}>
                <button className="underline" onClick={() => void openClass(c.id)}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-2">Members</div>
          {selectedClass ? (
            <>
              <div className="flex items-center gap-2 mb-2">
                <input className="h-9 px-2 border rounded-md text-sm" value={newStudent} onChange={(e)=>setNewStudent(e.target.value)} placeholder="Student ID" />
                <button className="h-9 px-3 border rounded-md text-sm" onClick={addMember}>Add</button>
              </div>
              <ul className="text-sm space-y-1">
                {members.map((m) => (
                  <li key={m.studentId}>
                    <button className="underline" onClick={() => void openStudent(m.studentId)}>{m.studentId}</button>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-xs text-muted-foreground">Select a class to manage members</div>
          )}
        </div>
      </div>
      {selectedStudent && (
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">{selectedStudent} — Last 14 days</div>
            {summary?.progress && (
              <div className="text-xs text-muted-foreground">XP {summary.progress.xp} • Lv {summary.progress.level} • Streak {summary.progress.streak}</div>
            )}
          </div>
          <div className="grid gap-1 text-xs">
            {trends.map((t) => (
              <div key={t.date} className="flex items-center gap-2">
                <div className="w-24">{t.date}</div>
                <div className="flex-1 h-2 bg-muted rounded">
                  <div className="h-full bg-blue-600 rounded" style={{ width: `${Math.min(100, t.attempts * 10)}%` }} />
                </div>
                <div className="w-24 text-right">{t.correct}/{t.attempts} correct</div>
              </div>
            ))}
          </div>
          {summary && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div>
                <div className="text-sm font-medium">Weak topics</div>
                <ul className="text-sm space-y-1">
                  {summary.weak.map((w,i)=> (
                    <li key={i}>{w.topic} — {(w.accuracy*100).toFixed(0)}%</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-sm font-medium">Strong topics</div>
                <ul className="text-sm space-y-1">
                  {summary.strong.map((w,i)=> (
                    <li key={i}>{w.topic} — {(w.accuracy*100).toFixed(0)}%</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="mt-3">
              <div className="text-sm font-medium">Suggested next topics</div>
              <ul className="text-sm space-y-1">
                {suggestions.map((s,i)=> (
                  <li key={i}>{s.topic} — {(s.pCorrect*100).toFixed(0)}% p(correct) • {s.difficulty}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
