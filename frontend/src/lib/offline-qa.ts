export type QaDoc = { id: string; userId: string; title: string; content: string; createdAt: string };
export type QaChunk = { id: string; docId: string; index: number; text: string; tokens: string[]; tf: Record<string, number>; norm: number };

const DB_NAME = 'ai-tutor-qa';
const STORE_DOCS = 'docs';
const STORE_CHUNKS = 'chunks';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_DOCS)) db.createObjectStore(STORE_DOCS, { keyPath: 'id' });
      if (!db.objectStoreNames.contains(STORE_CHUNKS)) db.createObjectStore(STORE_CHUNKS, { keyPath: 'id' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);
}

function vectorize(tokens: string[]): { tf: Record<string, number>; norm: number } {
  const tf: Record<string, number> = {};
  for (const t of tokens) tf[t] = (tf[t] || 0) + 1;
  let norm = 0;
  for (const v of Object.values(tf)) norm += v * v;
  return { tf, norm: Math.sqrt(norm) };
}

function cosineSim(a: { tf: Record<string, number>; norm: number }, b: { tf: Record<string, number>; norm: number }): number {
  if (!a.norm || !b.norm) return 0;
  let dot = 0;
  const smaller = Object.keys(a.tf).length <= Object.keys(b.tf).length ? a.tf : b.tf;
  const other = smaller === a.tf ? b.tf : a.tf;
  for (const k of Object.keys(smaller)) if (other[k]) dot += smaller[k] * other[k];
  return dot / (a.norm * b.norm);
}

function chunkText(text: string): string[] {
  // Split by double newlines, then further split large blocks
  const paras = text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const chunks: string[] = [];
  for (const p of paras) {
    if (p.length <= 800) { chunks.push(p); continue; }
    // sentence-based split
    const sents = p.split(/(?<=[.!?])\s+/).filter(Boolean);
    let cur = '';
    for (const s of sents) {
      if ((cur + ' ' + s).trim().length > 800) { chunks.push(cur.trim()); cur = s; } else { cur += ' ' + s; }
    }
    if (cur.trim()) chunks.push(cur.trim());
  }
  return chunks.slice(0, 3000); // cap
}

export async function addQaDocLocal(userId: string, title: string, content: string): Promise<QaDoc> {
  const db = await openDb();
  const id = crypto.randomUUID();
  const doc: QaDoc = { id, userId, title, content, createdAt: new Date().toISOString() };
  const chunksRaw = chunkText(content);
  const chunks: QaChunk[] = chunksRaw.map((text, i) => {
    const tokens = tokenize(text);
    const { tf, norm } = vectorize(tokens);
    return { id: crypto.randomUUID(), docId: id, index: i, text, tokens, tf, norm };
  });
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_DOCS, STORE_CHUNKS], 'readwrite');
    tx.objectStore(STORE_DOCS).put(doc);
    const cs = tx.objectStore(STORE_CHUNKS);
    for (const c of chunks) cs.put(c);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return doc;
}

export async function listQaDocsLocal(): Promise<Array<Pick<QaDoc, 'id'|'title'|'createdAt'>>> {
  const db = await openDb();
  const out: Array<Pick<QaDoc, 'id'|'title'|'createdAt'>> = [];
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_DOCS, 'readonly');
    const req = tx.objectStore(STORE_DOCS).getAll();
    req.onsuccess = () => {
      const arr = (req.result || []) as QaDoc[];
      for (const d of arr) out.push({ id: d.id, title: d.title, createdAt: d.createdAt });
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function deleteQaDocLocal(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([STORE_DOCS, STORE_CHUNKS], 'readwrite');
    tx.objectStore(STORE_DOCS).delete(id);
    // delete chunks by scanning (simple)
    const req = tx.objectStore(STORE_CHUNKS).getAll();
    req.onsuccess = () => {
      const arr = (req.result || []) as QaChunk[];
      for (const c of arr) if (c.docId === id) tx.objectStore(STORE_CHUNKS).delete(c.id);
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
}

export async function queryLocalQa(query: string, topN: number = 5): Promise<Array<{ text: string; score: number }>> {
  const db = await openDb();
  const qTokens = tokenize(query);
  const qVec = vectorize(qTokens);
  const results: Array<{ text: string; score: number }> = [];
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_CHUNKS, 'readonly');
    const req = tx.objectStore(STORE_CHUNKS).getAll();
    req.onsuccess = () => {
      const arr = (req.result || []) as QaChunk[];
      for (const c of arr) {
        const sim = cosineSim(qVec, { tf: c.tf, norm: c.norm });
        if (sim > 0) results.push({ text: c.text, score: sim });
      }
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  return results.sort((a, b) => b.score - a.score).slice(0, topN);
}
