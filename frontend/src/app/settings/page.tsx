"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { grades, getSubjects } from "@/lib/syllabus";

export default function SettingsPage() {
  const [userId, setUserId] = useState("123");
  const [baseUrl, setBaseUrl] = useState("");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [mode, setMode] = useState<"socratic" | "exam" | "friendly" | "motivational">("friendly");
  const [level, setLevel] = useState<"eli5" | "normal" | "expert">("normal");
  const [voice, setVoice] = useState<boolean>(true);
  const [camera, setCamera] = useState<boolean>(false);
  const [role, setRole] = useState<'student'|'teacher'|'parent'|'admin'>('student');
  const [status, setStatus] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [curriculum, setCurriculum] = useState<"lk" | "international">("lk");
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');
  const [quietStart, setQuietStart] = useState<string>('21:00');
  const [quietEnd, setQuietEnd] = useState<string>('07:00');

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedUserId = window.localStorage.getItem("userId");
    if (storedUserId) setUserId(storedUserId);
    setBaseUrl(process.env.NEXT_PUBLIC_BASE_URL ?? "");
    const storedLanguage = window.localStorage.getItem("language");
    if (storedLanguage === "en" || storedLanguage === "si" || storedLanguage === "ta") setLanguage(storedLanguage);
    const storedMode = window.localStorage.getItem("mode");
    if (storedMode === "socratic" || storedMode === "exam" || storedMode === "friendly" || storedMode === "motivational") setMode(storedMode);
    const storedLevel = window.localStorage.getItem("level");
    if (storedLevel === "eli5" || storedLevel === "normal" || storedLevel === "expert") setLevel(storedLevel);
    const storedVoice = window.localStorage.getItem("voiceEnabled");
    if (storedVoice === "true" || storedVoice === "false") setVoice(storedVoice === "true");
    const storedCam = window.localStorage.getItem("cameraEnabled");
    if (storedCam === "true" || storedCam === "false") setCamera(storedCam === "true");
    const storedSubject = window.localStorage.getItem("defaultSubject");
    if (storedSubject) setSubject(storedSubject);
    const storedGrade = window.localStorage.getItem("defaultGrade");
    if (storedGrade) setGrade(storedGrade);
    const storedCurr = window.localStorage.getItem("defaultCurriculum");
    if (storedCurr === "lk" || storedCurr === "international") setCurriculum(storedCurr);
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') setTheme(storedTheme);
    const qs = window.localStorage.getItem('quietStart');
    const qe = window.localStorage.getItem('quietEnd');
    if (qs) setQuietStart(qs);
    if (qe) setQuietEnd(qe);
  }, []);

  const save = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("userId", userId);
    window.localStorage.setItem("language", language);
    window.localStorage.setItem("mode", mode);
    window.localStorage.setItem("level", level);
    window.localStorage.setItem("voiceEnabled", voice ? "true" : "false");
    window.localStorage.setItem("cameraEnabled", camera ? "true" : "false");
    window.localStorage.setItem("defaultSubject", subject);
    window.localStorage.setItem("defaultGrade", grade);
    window.localStorage.setItem("defaultCurriculum", curriculum);
    window.localStorage.setItem('theme', theme);
    window.localStorage.setItem('quietStart', quietStart);
    window.localStorage.setItem('quietEnd', quietEnd);
  };

  const applyRole = async () => {
    try {
      setStatus('Updating role...');
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const res = await fetch(`${base}/api/auth/role`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) });
      if (!res.ok) {
        const t = await res.text().catch(()=> '');
        throw new Error(t || `Failed (${res.status})`);
      }
      setStatus('Role updated.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <AuthPanel onLogin={(u) => setUserId(u)} />
      <div className="space-y-2">
        <label className="text-sm font-medium">Theme</label>
        <div className="flex items-center gap-3 text-sm">
          {(['system','light','dark'] as const).map(t => (
            <label key={t} className="flex items-center gap-2">
              <input type="radio" name="theme" checked={theme===t} onChange={()=>setTheme(t)} />
              <span className="capitalize">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Do Not Disturb</label>
        <div className="flex items-center gap-2 text-sm">
          <span>From</span>
          <input type="time" value={quietStart} onChange={(e)=>setQuietStart(e.target.value)} className="h-9 px-2 border rounded-md" />
          <span>to</span>
          <input type="time" value={quietEnd} onChange={(e)=>setQuietEnd(e.target.value)} className="h-9 px-2 border rounded-md" />
        </div>
        <p className="text-xs text-muted-foreground">Suppresses reminders during quiet hours.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">User ID</label>
        <Input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter user id" />
        <p className="text-xs text-muted-foreground">Used when sending chat messages.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">API Base URL</label>
        <Input value={baseUrl} readOnly />
        <p className="text-xs text-muted-foreground">Configured via NEXT_PUBLIC_BASE_URL.</p>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Language</label>
        <div className="flex gap-3 text-sm">
          {(["en", "si", "ta"] as const).map((l) => (
            <label key={l} className="flex items-center gap-2">
              <input type="radio" name="language" checked={language === l} onChange={() => setLanguage(l)} />
              <span className="uppercase">{l}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Tutor Mode</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {(["friendly", "socratic", "exam", "motivational"] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 border rounded-md p-2">
              <input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />
              <span className="capitalize">{m}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Explanation Level</label>
        <div className="flex gap-3 text-sm">
          {(["eli5", "normal", "expert"] as const).map((v) => (
            <label key={v} className="flex items-center gap-2">
              <input type="radio" name="level" checked={level === v} onChange={() => setLevel(v)} />
              <span className="uppercase">{v}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Role (demo)</label>
        <div className="flex items-center gap-3 text-sm">
          {(['student','teacher','parent','admin'] as const).map(r => (
            <label key={r} className="flex items-center gap-2">
              <input type="radio" name="role" checked={role===r} onChange={()=>setRole(r)} />
              <span className="capitalize">{r}</span>
            </label>
          ))}
          <Button size="sm" variant="outline" onClick={applyRole}>Apply</Button>
        </div>
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} />
          <span>Enable speech synthesis</span>
        </label>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default Subject</label>
        <select className="h-9 px-2 border rounded-md text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
          <option value="">Subject</option>
          {getSubjects(curriculum).map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default Grade</label>
        <select className="h-9 px-2 border rounded-md text-sm" value={grade} onChange={(e) => setGrade(e.target.value)}>
          <option value="">Grade</option>
          {grades.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Default Curriculum</label>
        <div className="flex items-center gap-2 text-sm">
          {(["lk", "international"] as const).map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input type="radio" name="curriculum" checked={curriculum === c} onChange={() => setCurriculum(c)} />
              <span>{c === "lk" ? "Sri Lanka" : "International"}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Camera (Emotion Recognition)</label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={camera} onChange={(e) => setCamera(e.target.checked)} />
          <span>Enable camera (premium feature placeholder)</span>
        </label>
      </div>
      <Button onClick={save}>Save</Button>
    </div>
  );
}

function AuthPanel({ onLogin }: { onLogin: (userId: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string>("");

  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  const login = async () => {
    setStatus("Logging in...");
    try {
      const res = await fetch(`${base}/api/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      const uid = data.user?.id || data.user?.userId || '';
      if (uid) {
        if (typeof window !== 'undefined') window.localStorage.setItem('userId', uid);
        onLogin(uid);
      }
      setStatus('Logged in');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  const register = async () => {
    setStatus("Registering...");
    try {
      const res = await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name: email.split('@')[0] || 'Student' }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Register failed');
      setStatus('Registered. Now login.');
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  const me = async () => {
    setStatus('Fetching session...');
    try {
      const res = await fetch(`${base}/api/auth/me`);
      const data = await res.json();
      setStatus(data.user ? `Logged in as ${data.user.email || data.user.id}` : 'Not logged in');
    } catch {
      setStatus('Not logged in');
    }
  };

  const logout = async () => {
    await fetch(`${base}/api/auth/logout`, { method: 'POST' });
    setStatus('Logged out');
  };

  return (
    <div className="border rounded-md p-3 space-y-2">
      <div className="text-sm font-medium">Session</div>
      <div className="grid sm:grid-cols-2 gap-2">
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={login}>Login</Button>
        <Button size="sm" variant="outline" onClick={register}>Register</Button>
        <Button size="sm" variant="outline" onClick={me}>Me</Button>
        <Button size="sm" variant="outline" onClick={logout}>Logout</Button>
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  );
}
