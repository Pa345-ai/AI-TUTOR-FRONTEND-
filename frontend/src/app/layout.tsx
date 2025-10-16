"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
// Removed unused imports: usePathname, useRouter
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// metadata cannot be exported in a client layout; keeping runtime only

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Removed unused pathname variable
  // Lightweight guarded wrapper component
  function Guarded({ children }: { children: React.ReactNode }) {
    // Only guard known protected sections
    if (typeof window === 'undefined') return <>{children}</>;
    const role = window.localStorage.getItem('role') || '';
    const path = window.location.pathname;
    const needsTeacher = path.startsWith('/teacher');
    const needsParent = path.startsWith('/parent');
    const needsAdmin = path.startsWith('/admin');
    if ((needsTeacher && role !== 'teacher') || (needsParent && role !== 'parent') || (needsAdmin && role !== 'admin')) {
      // redirect client-side to home
      if (typeof window !== 'undefined') {
        window.location.replace('/');
        return null;
      }
    }
    return <>{children}</>;
  }
  const [offline, setOffline] = useState(false);
  const [unread, setUnread] = useState<number>(0);
  const [queued, setQueued] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');
  // Global multi-modal toggles
  const [mmVoice, setMmVoice] = useState<boolean>(true);
  const [mmDiagram, setMmDiagram] = useState<boolean>(true);
  const [mmCode, setMmCode] = useState<boolean>(true);
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
    (async () => {
      try {
        await navigator.serviceWorker.register('/sw.js');
      } catch {}
    })();
    const onOnline = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    setOffline(!navigator.onLine);
    navigator.serviceWorker.addEventListener('message', (e: MessageEvent<{ type: string; count?: number }>) => {
      const data = e.data;
      if (data?.type === 'QUEUE_SIZE') setQueued(typeof data.count === 'number' ? data.count : 0);
      if (data?.type === 'FLUSH_DONE') setQueued(0);
    });
    const ping = () => navigator.serviceWorker.controller?.postMessage({ type: 'GET_QUEUE_SIZE' });
    const t = setInterval(ping, 5000);
    ping();
    // daily due reminder (foreground trigger; SW displays notification)
    const remind = () => navigator.serviceWorker.controller?.postMessage({ type: 'REMIND_DUE', userId: (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123' });
    const r = setInterval(remind, 60 * 60 * 1000);
    remind();
    // poll unread notifications (lightweight API call)
    const poll = async () => {
      try {
        const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        const res = await fetch(`${base}/api/notifications/${encodeURIComponent(uid)}`);
        if (!res.ok) return;
        const data = await res.json() as { notifications?: Array<{ isRead?: boolean }> };
        const count = (data.notifications || []).filter(n => !n.isRead).length;
        setUnread(count);
      } catch {}
    };
    const pn = setInterval(poll, 15000);
    // fetch streak for nav indicator
    const loadStreak = async () => {
      try {
        const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        const res = await fetch(`${base}/api/progress/${encodeURIComponent(uid)}`);
        if (!res.ok) return;
        const data = await res.json() as { progress?: { streak?: number } };
        setStreak(data.progress?.streak || 0);
      } catch {}
    };
    const ps = setInterval(loadStreak, 60000);
    loadStreak();
    poll();
    return () => { clearInterval(t); clearInterval(r); clearInterval(pn); clearInterval(ps); window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('theme') as 'light'|'dark'|'system'|null;
    const applied = stored || 'system';
    setTheme(applied);
    const root = document.documentElement;
    const apply = (t: 'light'|'dark'|'system') => {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const dark = t === 'dark' || (t === 'system' && prefersDark);
      root.classList.toggle('dark', dark);
    };
    apply(applied);
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      const storedTheme = window.localStorage.getItem('theme') as 'light'|'dark'|'system' | null;
      apply(storedTheme || 'system');
    };
    const listener = (e: MediaQueryListEvent) => onChange();
    mq.addEventListener?.('change', listener);
    return () => mq.removeEventListener?.('change', listener);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const v = window.localStorage.getItem('mm_voice');
    const d = window.localStorage.getItem('mm_diagram');
    const c = window.localStorage.getItem('mm_code');
    setMmVoice(v === null ? true : v === 'true');
    setMmDiagram(d === null ? true : d === 'true');
    setMmCode(c === null ? true : c === 'true');
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'mm_voice' && e.newValue != null) setMmVoice(e.newValue === 'true');
      if (e.key === 'mm_diagram' && e.newValue != null) setMmDiagram(e.newValue === 'true');
      if (e.key === 'mm_code' && e.newValue != null) setMmCode(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-svh flex flex-col">
          <header className="border-b">
            <div className="mx-auto max-w-5xl w-full flex items-center justify-between py-3 px-4">
              <Link href="/" className="font-semibold">AI Tutor</Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/chat" className="hover:underline">Chat</Link>
                <Link href="/progress" className="hover:underline">Progress</Link>
                <Link href="/flashcards" className="hover:underline">Flashcards</Link>
                <Link href="/learning-paths" className="hover:underline">Learning Paths</Link>
                <Link href="/adaptive" className="hover:underline">Adaptive</Link>
                <Link href="/summarizer" className="hover:underline">Summarizer</Link>
                <Link href="/landing" className="hover:underline">Landing</Link>
                <Link href="/offline-models" className="hover:underline">Offline</Link>
                <Link href="/packs" className="hover:underline">Packs</Link>
                <Link href="/mastery" className="hover:underline">Mastery</Link>
                <Link href="/knowledge-graph" className="hover:underline">Graph</Link>
                <Link href="/heatmap" className="hover:underline">Heatmap</Link>
                <Link href="/study-room" className="hover:underline">Study Room</Link>
                <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
                <Link href="/history" className="hover:underline">History</Link>
                <Link href="/achievements" className="hover:underline">Achievements</Link>
                {/* Client route guard: only show role links if permitted */}
                {typeof window !== 'undefined' && window.localStorage.getItem('role') === 'teacher' && (
                  <Link href="/teacher-dashboard" className="hover:underline">Teacher</Link>
                )}
                {typeof window !== 'undefined' && window.localStorage.getItem('role') === 'parent' && (
                  <Link href="/parent-dashboard" className="hover:underline">Parent</Link>
                )}
                {typeof window !== 'undefined' && window.localStorage.getItem('role') === 'admin' && (
                  <Link href="/admin" className="hover:underline">Admin</Link>
                )}
                <span className="text-xs text-muted-foreground">🔥 {streak}</span>
                <Link href="/onboarding" className="hover:underline">Onboarding</Link>
                <Link href="/notifications" className="hover:underline relative">Notifications{unread>0 && (<span className="ml-1 inline-flex items-center justify-center text-[10px] px-1.5 py-0.5 rounded-full bg-red-600 text-white align-middle">{unread}</span>)}</Link>
                <Link href="/memory" className="hover:underline">Memory</Link>
                <Link href="/integrations" className="hover:underline">Integrations</Link>
                <Link href="/ultra-intelligent" className="hover:underline">Ultra-Intelligent</Link>
                <Link href="/knowledge-graph-enhanced" className="hover:underline">Knowledge Graph</Link>
                <Link href="/multi-modal-memory" className="hover:underline">Multi-Modal</Link>
                <Link href="/enhanced-progress" className="hover:underline">Progress</Link>
                <Link href="/ai-flashcards" className="hover:underline">AI Flashcards</Link>
                {/* One-tap multi-modal toggles */}
                <div className="flex items-center gap-1">
                  <button
                    className={`text-xs border rounded px-2 py-1 ${mmVoice? 'bg-accent' : ''}`}
                    title="Voice on/off"
                    onClick={() => {
                      const next = !mmVoice; setMmVoice(next);
                      if (typeof window !== 'undefined') window.localStorage.setItem('mm_voice', String(next));
                    }}
                  >🔊</button>
                  <button
                    className={`text-xs border rounded px-2 py-1 ${mmDiagram? 'bg-accent' : ''}`}
                    title="Diagram auto-draw on/off"
                    onClick={() => {
                      const next = !mmDiagram; setMmDiagram(next);
                      if (typeof window !== 'undefined') window.localStorage.setItem('mm_diagram', String(next));
                    }}
                  >🖊️</button>
                  <button
                    className={`text-xs border rounded px-2 py-1 ${mmCode? 'bg-accent' : ''}`}
                    title="Runnable code cells on/off"
                    onClick={() => {
                      const next = !mmCode; setMmCode(next);
                      if (typeof window !== 'undefined') window.localStorage.setItem('mm_code', String(next));
                    }}
                  >&lt;/&gt;</button>
                </div>
                <button
                  className="text-xs border rounded px-2 py-1 hover:bg-accent"
                  onClick={() => {
                    const next = theme === 'system' ? 'light' : theme === 'light' ? 'dark' : 'system';
                    setTheme(next);
                    if (typeof window !== 'undefined') window.localStorage.setItem('theme', next);
                    const root = document.documentElement;
                    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                    const dark = next === 'dark' || (next === 'system' && prefersDark);
                    root.classList.toggle('dark', dark);
                  }}
                  title="Toggle theme"
                >{theme==='dark'?'🌙':theme==='light'?'☀️':'🖥️'}</button>
                <Link href="/settings" className="hover:underline">Settings</Link>
              </nav>
            </div>
          </header>
          {offline && (
            <div className="bg-yellow-100 text-yellow-900 text-xs py-1">
              <div className="mx-auto max-w-5xl w-full px-4 flex items-center justify-between">
                <span>Offline mode — actions will be queued{queued != null ? ` (${queued} pending)` : ''}.</span>
                <button
                  className="underline"
                  onClick={() => navigator.serviceWorker.controller?.postMessage({ type: 'FLUSH_QUEUE' })}
                >Retry sync</button>
              </div>
            </div>
          )}
          {/* Unified refreshers surfacing: show due topics across app */}
          <RefreshersBar />
          <main className="flex-1">
            {/* Client-side redirect guard for protected sections */}
            <Guarded>{children}</Guarded>
          </main>
        </div>
      </body>
    </html>
  );
}

function RefreshersBar() {
  const [due, setDue] = useState<Array<{ topic: string; subject?: string|null }>>([]);
  useEffect(() => {
    const load = async () => {
      try {
        const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
        const base = process.env.NEXT_PUBLIC_BASE_URL!;
        const res = await fetch(`${base}/api/learning/review/${encodeURIComponent(uid)}?limit=6`);
        if (!res.ok) return; const d = await res.json();
        const items = (d.due || []).map((x: any) => ({ topic: x.topic || x, subject: x.subject || null }));
        setDue(items);
      } catch {}
    };
    load();
    const t = setInterval(load, 60000);
    return () => clearInterval(t);
  }, []);
  if (due.length === 0) return null;
  return (
    <div className="border-b bg-accent/20">
      <div className="mx-auto max-w-5xl w-full px-4 py-1 text-xs flex items-center gap-2 overflow-x-auto">
        <span className="text-muted-foreground">Refreshers:</span>
        {due.map((d,i)=> (
          <a key={i} href={`/adaptive?topic=${encodeURIComponent(d.topic)}`} className="px-2 py-0.5 border rounded hover:bg-accent/40 whitespace-nowrap">{d.topic}</a>
        ))}
      </div>
    </div>
  );
}
