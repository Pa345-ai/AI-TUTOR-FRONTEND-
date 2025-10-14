"use client";

import { useEffect, useState } from "react";

export default function PrivacyPage() {
  const base = process.env.NEXT_PUBLIC_BASE_URL!;
  const [userId, setUserId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [exporting, setExporting] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const uid = window.localStorage.getItem('userId');
      if (uid) setUserId(uid);
    }
  }, []);

  const doExport = async () => {
    if (!userId) return;
    try {
      setExporting(true); setStatus("");
      const res = await fetch(`${base}/api/export/user/${encodeURIComponent(userId)}.zip`);
      if (!res.ok) throw new Error(`Export failed ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `data-export-${userId}.zip`; a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) { setStatus(e.message || String(e)); }
    finally { setExporting(false); }
  };

  const requestDeletion = async () => {
    if (!userId) return;
    try {
      setStatus("");
      const r = await fetch(`${base}/api/privacy/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, reason }) });
      if (!r.ok) throw new Error(await r.text());
      setSubmitted(true); setReason("");
    } catch (e: any) { setStatus(e.message || String(e)); }
  };

  return (
    <div className="mx-auto max-w-2xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Privacy</h1>
      <div className="text-xs text-muted-foreground">Manage your data: export your information or request deletion. Deletions require admin approval.</div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Data export</div>
        <div className="text-xs">We'll generate a ZIP with your messages, progress, flashcards, assignments and related metadata.</div>
        <button className="h-9 px-3 border rounded-md text-sm" onClick={doExport} disabled={!userId || exporting}>{exporting ? 'Preparing…' : 'Export my data (.zip)'}</button>
      </div>
      <div className="border rounded-md p-3 space-y-2">
        <div className="text-sm font-medium">Request account deletion</div>
        <textarea className="w-full min-h-[80px] border rounded p-2 text-sm" placeholder="Optional reason (helps the team)" value={reason} onChange={(e)=>setReason(e.target.value)} />
        <button className="h-9 px-3 border rounded-md text-sm bg-red-600 text-white" onClick={requestDeletion} disabled={!userId}>Submit deletion request</button>
        {submitted && <div className="text-xs text-green-700">Request submitted. You'll be notified after admin review.</div>}
      </div>
      {status && <div className="text-xs text-red-600">{status}</div>}
    </div>
  );
}
