"use client";

import { useEffect, useState } from "react";

export default function IntegrationsPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [userId, setUserId] = useState<string>("123");
  const [gToken, setGToken] = useState<string>("");
  const [mToken, setMToken] = useState<string>("");
  const [courses, setCourses] = useState<Array<{ id: string; name: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: string; name?: string }>>([]);
  const [teams, setTeams] = useState<Array<{ id: string; name: string }>>([]);
  const [members, setMembers] = useState<Array<{ id: string; name?: string }>>([]);
  const [status, setStatus] = useState<string>("");
  const [driveFiles, setDriveFiles] = useState<Array<{ id: string; name: string }>>([]);
  const [oneFiles, setOneFiles] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => { if (typeof window !== undefined) { const uid = window.localStorage.getItem(userId); if (uid) setUserId(uid); } }, []);

  const saveToken = async (provider: google|quizlet|microsoft, accessToken: string) => {
    try {
      const res = await fetch(`${base}/api/integrations/tokens`, { method: POST, headers: { Content-Type: application/json }, body: JSON.stringify({ userId, provider: provider===microsoft ? google : provider, accessToken }) });
      if (!res.ok) throw new Error(await res.text());
      setStatus(Saved
token);
    } catch (e: any) { setStatus(e.message); }
  };

  const listCourses = async () => {
    try { const r = await fetch(`${base}/api/integrations/gclass/courses?userId=${encodeURIComponent(userId)}`); const d = await r.json(); setCourses(d.courses || []); } catch (e: any) { setStatus(e.message); }
  };
  const listRoster = async (courseId: string) => {
    try { const r = await fetch(`${base}/api/integrations/gclass/courses/${encodeURIComponent(courseId)}/students?userId=${encodeURIComponent(userId)}`); const d = await r.json(); setStudents(d.students || []); } catch (e: any) { setStatus(e.message); }
  };
  const syncGclass = async (courseId: string) => {
    try { const r = await fetch(`${base}/api/integrations/gclass/sync`, { method: POST, headers: { Content-Type:application/json }, body: JSON.stringify({ userId, courseId }) }); if (!r.ok) throw new Error(await r.text()); setStatus(Synced
Google
Classroom); } catch (e: any) { setStatus(e.message); }
  };

  const listTeams = async () => {
    try { const r = await fetch(`${base}/api/integrations/teams/list?userId=${encodeURIComponent(userId)}`); const d = await r.json(); setTeams(d.teams || []); } catch (e: any) { setStatus(e.message); }
  };
  const listTeamMembers = async (teamId: string) => {
    try { const r = await fetch(`${base}/api/integrations/teams/${encodeURIComponent(teamId)}/members?userId=${encodeURIComponent(userId)}`); const d = await r.json(); setMembers(d.members || []); } catch (e: any) { setStatus(e.message); }
  };
  const syncTeams = async (teamId: string) => {
    try { const r = await fetch(`${base}/api/integrations/teams/sync`, { method: POST, headers: { Content-Type:application/json }, body: JSON.stringify({ userId, teamId }) }); if (!r.ok) throw new Error(await r.text()); setStatus(Synced
Microsoft
Teams); } catch (e: any) { setStatus(e.message); }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Integrations</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Google Classroom</div>
          <div className="text-xs flex items-center gap-2">
            <input className="h-8 px-2 border rounded-md flex-1" placeholder="Paste Google OAuth token" value={gToken} onChange={(e)=>setGToken(e.target.value)} />
            <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>void saveToken(google, gToken)}>Save token</button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button className="h-8 px-3 border rounded-md" onClick={listCourses}>List courses</button>
          </div>
          {courses.length>0 && (
            <div className="mt-2 text-xs">
              <div className="font-medium">Courses</div>
              <ul className="grid gap-1">
                {courses.map(c => (
                  <li key={c.id} className="flex items-center justify-between border rounded px-2 py-1">
                    <span>{c.name}</span>
                    <span className="flex items-center gap-2">
                      <button className="h-7 px-2 border rounded" onClick={()=>void listRoster(c.id)}>Roster</button>
                      <button className="h-7 px-2 border rounded" onClick={()=>void syncGclass(c.id)}>Sync</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {students.length>0 && (
            <div className="mt-2 text-xs">
              <div className="font-medium">Students</div>
              <ul className="grid gap-1">
                {students.map(s => (<li key={s.id} className="border rounded px-2 py-1">{s.name || s.id}</li>))}
              </ul>
            </div>
          )}
        </div>
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Microsoft Teams</div>
          <div className="text-xs flex items-center gap-2">
            <input className="h-8 px-2 border rounded-md flex-1" placeholder="Paste Microsoft OAuth token" value={mToken} onChange={(e)=>setMToken(e.target.value)} />
            <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>void saveToken(microsoft, mToken)}>Save token</button>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button className="h-8 px-3 border rounded-md" onClick={listTeams}>List teams</button>
          </div>
          {teams.length>0 && (
            <div className="mt-2 text-xs">
              <div className="font-medium">Teams</div>
              <ul className="grid gap-1">
                {teams.map(t => (
                  <li key={t.id} className="flex items-center justify-between border rounded px-2 py-1">
                    <span>{t.name}</span>
                    <span className="flex items-center gap-2">
                      <button className="h-7 px-2 border rounded" onClick={()=>void listTeamMembers(t.id)}>Members</button>
                      <button className="h-7 px-2 border rounded" onClick={()=>void syncTeams(t.id)}>Sync</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {members.length>0 && (
            <div className="mt-2 text-xs">
              <div className="font-medium">Members</div>
              <ul className="grid gap-1">
                {members.map(s => (<li key={s.id} className="border rounded px-2 py-1">{s.name || s.id}</li>))}
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Drive / OneDrive Pickers</div>
        <div className="text-xs text-muted-foreground">Paste a share URL from Google Drive or OneDrive and we will store a token‑free reference for later export flows.</div>
        <div className="grid sm:grid-cols-2 gap-2 text-xs">
          <div className="border rounded-md p-2">
            <div className="font-medium">Drive</div>
            <input className="w-full h-8 px-2 border rounded" placeholder="https://drive.google.com/file/..." onKeyDown={(e)=>{ if (e.key===Enter) setDriveFiles(prev => [...prev, { id: crypto.randomUUID(), name: (e.target as HTMLInputElement).value }]); }} />
            <ul className="mt-2 grid gap-1">
              {driveFiles.map(f => (<li key={f.id} className="border rounded px-2 py-1 text-xs">{f.name}</li>))}
            </ul>
          </div>
          <div className="border rounded-md p-2">
            <div className="font-medium">OneDrive</div>
            <input className="w-full h-8 px-2 border rounded" placeholder="https://1drv.ms/..." onKeyDown={(e)=>{ if (e.key===Enter) setOneFiles(prev => [...prev, { id: crypto.randomUUID(), name: (e.target as HTMLInputElement).value }]); }} />
            <ul className="mt-2 grid gap-1">
              {oneFiles.map(f => (<li key={f.id} className="border rounded px-2 py-1 text-xs">{f.name}</li>))}
            </ul>
          </div>
        </div>
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  );
}

