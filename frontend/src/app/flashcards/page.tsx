"use client";

import { useEffect, useState } from "react";
import { fetchFlashcards, generateFlashcards, exportQuizletSet, saveIntegrationToken, type FlashcardItem, listDecks, createDeck, moveCardToDeck, getDueFlashcards, reviewFlashcard } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FlashcardsPage() {
  const [userId, setUserId] = useState("123");
  const [items, setItems] = useState<FlashcardItem[]>([]);
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizletToken, setQuizletToken] = useState("");
  const [exporting, setExporting] = useState(false);
  const [decks, setDecks] = useState<Array<{ id: string; name: string }>>([]);
  const [newDeck, setNewDeck] = useState("");
  const [due, setDue] = useState<FlashcardItem[]>([]);
  const [reviewing, setReviewing] = useState(false);
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [ankiText, setAnkiText] = useState("");
  const [apkgFile, setApkgFile] = useState<File | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, dks] = await Promise.all([fetchFlashcards(userId), listDecks(userId)]);
        if (!mounted) return;
        setItems(data);
        setDecks(dks);
        try { const d = await getDueFlashcards(userId, undefined, 200); setDue((d as any).cards || []); } catch {}
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const generate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await generateFlashcards({ userId, content, subject: subject || undefined, language });
      const data = await fetchFlashcards(userId);
      setItems(data);
      setContent("");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const saveToken = async () => {
    if (!quizletToken.trim()) return;
    await saveIntegrationToken({ userId, provider: 'quizlet', accessToken: quizletToken });
  };

  const exportQuizlet = async () => {
    if (items.length === 0) return;
    setExporting(true);
    try {
      const res = await exportQuizletSet({ userId });
      if (res.url) window.open(res.url, '_blank');
    } finally {
      setExporting(false);
    }
  };

  const addDeck = async () => {
    if (!newDeck.trim()) return;
    const d = await createDeck(userId, newDeck.trim());
    setDecks((prev) => [...prev, { id: (d as any).deck?.id || d.id, name: (d as any).deck?.name || d.name }]);
    setNewDeck("");
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Flashcards</h1>
      <div className="grid gap-3">
        <div className="grid sm:grid-cols-3 gap-2">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" />
          <Input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language (en/si/ta)" />
        </div>
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste notes or text to generate flashcards" className="min-h-[160px]" />
        <div className="flex items-center gap-2">
          <Button onClick={generate} disabled={!content.trim() || loading}>{loading ? "Generating..." : "Generate"}</Button>
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <input className="h-9 px-2 border rounded-md" placeholder="New deck name" value={newDeck} onChange={(e)=>setNewDeck(e.target.value)} />
          <button className="h-9 px-3 border rounded-md" onClick={addDeck}>Add Deck</button>
          {decks.length>0 && <span className="text-xs text-muted-foreground">Decks: {decks.map(d=>d.name).join(', ')}</span>}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <input className="h-8 px-2 border rounded-md" placeholder="Quizlet access token (optional)" value={quizletToken} onChange={(e)=>setQuizletToken(e.target.value)} />
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1" onClick={saveToken}>Save Token</button>
          <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1" onClick={exportQuizlet} disabled={exporting || items.length===0}>{exporting ? 'Exporting…' : 'Export to Quizlet'}</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div className="border rounded-md p-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Due queue</div>
              <div className="text-xs text-muted-foreground">{due.length} cards</div>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Cards due now for review. Click start to begin a focused session.</div>
            <DueBreakdown due={due} />
            <div className="mt-2"><button className="h-8 px-3 border rounded-md text-sm" disabled={due.length===0} onClick={()=>{ setReviewing(true); setIdx(0); setShowBack(false); }}>Start review</button></div>
          </div>
          <div className="border rounded-md p-2">
            <div className="text-sm font-medium">Anki import/export</div>
            <div className="text-xs text-muted-foreground mb-1">CSV format: front,back per line. Paste to import or copy to export.</div>
            <textarea className="w-full min-h-[120px] border rounded-md p-2 text-xs" placeholder="front,back" value={ankiText} onChange={(e)=>setAnkiText(e.target.value)} />
            <div className="mt-2 flex items-center gap-2">
              <button className="h-8 px-3 border rounded-md text-sm" onClick={async ()=>{
                const lines = ankiText.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
                const base = process.env.NEXT_PUBLIC_BASE_URL!;
                for (const ln of lines) {
                  const [front, back] = ln.split(',');
                  if (!front || !back) continue;
                  await fetch(`${base}/api/flashcards`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, front: front.trim(), back: back.trim(), subject: subject || 'General' }) });
                }
                const data = await fetchFlashcards(userId); setItems(data);
              }}>Import CSV</button>
              <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>{
                const rows = items.map(c => `${(c.front||'').replace(/\n|\r|,/g,' ')},${(c.back||'').replace(/\n|\r|,/g,' ')}`).join('\n');
                setAnkiText(rows);
              }}>Export CSV</button>
              <button className="h-8 px-3 border rounded-md text-sm" onClick={()=>{
                // Export simple APKG JSON (not native .apkg)
                const decksMap = new Map<string,string>(); decks.forEach(d=>decksMap.set(d.id, d.name));
                const payload = { deck: subject || 'My Deck', cards: items.map(c => ({ front: c.front, back: c.back, deck: c.deckId ? (decksMap.get(c.deckId) || '') : '' })) };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `deck-${(subject||'cards')}.apkg.json`; a.click(); URL.revokeObjectURL(url);
              }}>Export APKG (JSON)</button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">Import APKG (JSON)</div>
            <input type="file" accept=".json,.apkg,.apkg.json,application/json" onChange={(e)=>setApkgFile(e.target.files?.[0] || null)} />
            <div className="mt-2 flex items-center gap-2">
              <button className="h-8 px-3 border rounded-md text-sm" disabled={!apkgFile} onClick={async ()=>{
                if (!apkgFile) return;
                try {
                  const text = await apkgFile.text();
                  const data = JSON.parse(text || '{}');
                  const arr = Array.isArray(data.cards) ? data.cards : [];
                  const base = process.env.NEXT_PUBLIC_BASE_URL!;
                  for (const k of arr) {
                    const front = String(k.front || '').trim(); const back = String(k.back || '').trim();
                    if (!front || !back) continue;
                    await fetch(`${base}/api/flashcards`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, front, back, subject: subject || 'General' }) });
                  }
                  const dataCards = await fetchFlashcards(userId); setItems(dataCards);
                } catch {}
              }}>Import APKG (JSON)</button>
            </div>
          </div>
        </div>
        <DeckStats items={items} decks={decks} due={due} />
      </div>
      {!reviewing && (
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((c) => (
          <div key={c.id} className="border rounded-md p-3">
            <div className="font-medium">{c.front}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.back}</div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <label>Deck</label>
              <select className="h-8 px-2 border rounded-md" value={c.deckId ?? ''} onChange={async (e)=>{
                const val = e.target.value || null;
                await moveCardToDeck(c.id, val);
                const next = await fetchFlashcards(userId);
                setItems(next);
              }}>
                <option value="">None</option>
                {decks.map((d)=> (<option key={d.id} value={d.id}>{d.name}</option>))}
              </select>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button className="h-8 px-3 border rounded-md text-xs" onClick={async ()=>{
                // Simple due review: mark as reviewed now, next interval +1 day
                try {
                  const base = process.env.NEXT_PUBLIC_BASE_URL!;
                  await fetch(`${base}/api/flashcards/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, cardId: c.id, grade: 4 }) });
                } catch {}
              }}>I knew this</button>
              <button className="h-8 px-3 border rounded-md text-xs" onClick={async ()=>{
                try {
                  const base = process.env.NEXT_PUBLIC_BASE_URL!;
                  await fetch(`${base}/api/flashcards/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, cardId: c.id, grade: 2 }) });
                } catch {}
              }}>Unsure</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <div className="text-sm text-muted-foreground">No flashcards yet.</div>
        )}
      </div>
      )}
      {reviewing && due.length>0 && (
        <div className="border rounded-md p-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">Card {idx+1}/{due.length}</div>
            <button className="h-7 px-2 border rounded-md text-xs" onClick={()=>{ setReviewing(false); }}>End</button>
          </div>
          <div className="mt-3 text-lg font-medium">{showBack ? (due[idx] as any).back : (due[idx] as any).front}</div>
          <div className="mt-2"><button className="h-8 px-3 border rounded-md text-sm" onClick={()=>setShowBack(s=>!s)}>{showBack ? 'Show Front' : 'Show Back'}</button></div>
          <div className="mt-3 flex items-center gap-2">
            {([1,2,3,4,5] as const).map(q => (
              <button key={q} className="h-8 px-3 border rounded-md text-sm" onClick={async ()=>{
                try { await reviewFlashcard(userId, due[idx].id, q as any); } catch {}
                const nextIdx = idx+1;
                if (nextIdx>=due.length) { setReviewing(false); const d = await getDueFlashcards(userId); setDue((d as any).cards||[]); }
                else { setIdx(nextIdx); setShowBack(false); }
              }}>{q===1?'Again':q===2?'Hard':q===3?'OK':q===4?'Good':'Easy'}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DueBreakdown({ due }: { due: FlashcardItem[] }) {
  // Very simple heuristic: mark overdue if createdAt older than 2 days (placeholder without progress dates)
  const now = Date.now();
  const today = due.filter((c:any) => !c.progress || !c.progress.nextReviewDate || new Date(c.progress.nextReviewDate).getTime() <= now);
  const overdue = due.filter((c:any) => c.progress && c.progress.nextReviewDate && new Date(c.progress.nextReviewDate).getTime() < (now - 24*60*60*1000));
  return (
    <div className="mt-2 text-xs">
      <div>Today: {today.length}</div>
      <div>Overdue: {overdue.length}</div>
    </div>
  );
}

function DeckStats({ items, decks, due }: { items: FlashcardItem[]; decks: Array<{ id: string; name: string }>; due: FlashcardItem[] }) {
  const map: Record<string, number> = {};
  for (const d of decks) map[d.name] = 0;
  for (const c of items) {
    const name = decks.find(d => d.id === (c as any).deckId)?.name || 'None';
    map[name] = (map[name] || 0) + 1;
  }
  return (
    <div className="border rounded-md p-2">
      <div className="text-sm font-medium">Deck stats</div>
      <ul className="text-xs mt-1">
        {Object.entries(map).map(([k,v]) => (
          <li key={k}>{k}: {v} cards</li>
        ))}
      </ul>
    </div>
  );
}
