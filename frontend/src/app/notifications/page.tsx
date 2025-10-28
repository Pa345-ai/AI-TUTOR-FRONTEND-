"use client";

import { useEffect, useState } from "react";
import { fetchNotifications, markNotificationRead, type Notification } from "@/lib/api";

export default function NotificationsPage() {
  const [userId, setUserId] = useState<string>("123");
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications(userId);
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, [userId]);

  const read = async (id: string) => {
    try { await markNotificationRead(id); await load(); } catch {}
  };

  const actionHref = (n: Notification): string | null => {
    if (n.type === 'assignment') return '/adaptive';
    if (n.type === 'quiz' && n.relatedId) return `/quizzes?quizId=${encodeURIComponent(n.relatedId)}`;
    if (n.type === 'system') return '/';
    return null;
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Notifications</h1>
      <div className="flex items-center gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" value={userId} onChange={(e)=>setUserId(e.target.value)} placeholder="User ID" />
        <button className="h-9 px-3 border rounded-md text-sm" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="grid gap-2">
        {items.length === 0 && <div className="text-sm text-muted-foreground">No notifications.</div>}
        {items.map((n) => (
          <div key={n.id} className="border rounded-md p-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{n.title}</div>
              <div className="text-[11px] text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm">{n.message}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              {!n.isRead && <button className="h-7 px-2 border rounded-md" onClick={() => void read(n.id)}>Mark read</button>}
              {actionHref(n) && (
                <a className="h-7 px-2 border rounded-md inline-flex items-center" href={actionHref(n) || '#'}>Open</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
