"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [offline, setOffline] = useState(false);
  const [unread, setUnread] = useState<number>(0);
  const [queued, setQueued] = useState<number | null>(null);
  const [streak, setStreak] = useState<number>(0);
  const [theme, setTheme] = useState<'light'|'dark'|'system'>('system');
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
                <Link href="/mastery" className="hover:underline">Mastery</Link>
                <Link href="/heatmap" className="hover:underline">Heatmap</Link>
                <Link href="/study-room" className="hover:underline">Study Room</Link>
                <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
                <Link href="/history" className="hover:underline">History</Link>
                <Link href="/achievements" className="hover:underline">Achievements</Link>
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
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
