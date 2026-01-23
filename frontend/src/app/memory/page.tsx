"use client";

import { useCallback, useEffect, useState } from "react";
import { addMemoryPin, addMemoryRedaction, deleteMemoryPin, deleteMemoryRedaction, listMemoryPins, listMemoryRedactions } from "@/lib/api";

export default function MemoryPage() {
  const [userId, setUserId] = useState("123");
  const [pins, setPins] = useState<Array<{ id: string; text: string; createdAt: string }>>([]);
  const [reds, setReds] = useState<Array<{ id: string; term: string; createdAt: string }>>([]);
  const [newPin, setNewPin] = useState("");
  const [newRed, setNewRed] = useState("");
  const [status, setStatus] = useState("");

  useEffect(()=>{ if (typeof window !== 'undefined') { const uid = window.localStorage.getItem('userId'); if (uid) setUserId(uid); } }, []);

  const load = useCallback(async () => {
    try {
      const p = await listMemoryPins(userId); setPins(p.pins || []);
      const r = await listMemoryRedactions(userId); setReds(r.redactions || []);
    } catch (e) { setStatus(e instanceof Error ? e.message : String(e)); }
  }, [userId]);

  useEffect(()=>{ void load(); }, [load]);

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Memory Controls</h1>
      <div className="grid md:grid-cols-2 gap-3">
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-2">Pins</div>
          <div className="flex items-center gap-2 text-sm">
            <input className="h-9 px-2 border rounded-md flex-1" value={newPin} onChange={(e)=>setNewPin(e.target.value)} placeholder="Pin a note (kept in tutor context)" />
            <button className="h-9 px-3 border rounded-md" onClick={async ()=>{ if (!newPin.trim()) return; await addMemoryPin(userId, newPin.trim()); setNewPin(""); await load(); }}>Add</button>
          </div>
          <ul className="mt-2 text-sm space-y-1">
            {pins.map(p => (
              <li key={p.id} className="flex items-center justify-between border rounded p-2">
                <span>{p.text}</span>
                <button className="h-7 px-2 border rounded-md text-xs" onClick={async ()=>{ await deleteMemoryPin(p.id); await load(); }}>Remove</button>
              </li>
            ))}
            {pins.length===0 && <li className="text-xs text-muted-foreground">No pins.</li>}
          </ul>
        </div>
        <div className="border rounded-md p-3">
          <div className="text-sm font-medium mb-2">Redactions</div>
          <div className="flex items-center gap-2 text-sm">
            <input className="h-9 px-2 border rounded-md flex-1" value={newRed} onChange={(e)=>setNewRed(e.target.value)} placeholder="Add a term to redact from context" />
            <button className="h-9 px-3 border rounded-md" onClick={async ()=>{ if (!newRed.trim()) return; await addMemoryRedaction(userId, newRed.trim()); setNewRed(""); await load(); }}>Add</button>
          </div>
          <ul className="mt-2 text-sm space-y-1">
            {reds.map(r => (
              <li key={r.id} className="flex items-center justify-between border rounded p-2">
                <span>{r.term}</span>
                <button className="h-7 px-2 border rounded-md text-xs" onClick={async ()=>{ await deleteMemoryRedaction(r.id); await load(); }}>Remove</button>
              </li>
            ))}
            {reds.length===0 && <li className="text-xs text-muted-foreground">No redactions.</li>}
          </ul>
        </div>
      </div>
      {status && <div className="text-xs text-muted-foreground">{status}</div>}
    </div>
  );
}
