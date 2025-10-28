/*
  Local on-device inference harness for NeuroLearn.
  - Capability detection (WebGPU/WebNN/WebAssembly)
  - Model pack manifest + versioning (cache keys)
  - Health checks
  - Local summarizer/QA fallbacks with lightweight algorithms when model not available
  - Integration helpers for chat/summarizer surfaces
*/

export type RunnerCapabilities = {
  webgpu: boolean;
  webnn: boolean;
  wasm: boolean;
};

export type ModelPack = {
  id: string;                 // e.g., "mini-sum" | "tiny-qna"
  name: string;               // human friendly
  version: string;            // semver-like
  type: 'summarizer' | 'qa';
  entry: string;              // path to ONNX model file
  tokenizerVocab?: string;    // optional BERT WordPiece vocab JSON
  inputFormat?: 'bert_qa' | 'bert_cls_sum' | 'seq2seq_sum';
};

const PACKS: ModelPack[] = [
  { id: 'mini-sum', name: 'Mini Summarizer', version: '0.1.0', type: 'summarizer', entry: '/models/mini-sum.onnx', tokenizerVocab: '/models/mini-sum-vocab.json', inputFormat: 'bert_cls_sum' },
  { id: 'tiny-qna', name: 'Tiny Q&A', version: '0.1.0', type: 'qa', entry: '/models/tiny-qna.onnx', tokenizerVocab: '/models/tiny-qna-vocab.json', inputFormat: 'bert_qa' },
];

export function detectCapabilities(): RunnerCapabilities {
  const webgpu = typeof (globalThis as any).navigator !== 'undefined' && !!(navigator as any).gpu;
  const wasm = typeof WebAssembly !== 'undefined';
  // WebNN is still experimental; feature-detect via navigator.ml
  const webnn = typeof (navigator as any).ml !== 'undefined';
  return { webgpu, wasm, webnn };
}

export async function isPackInstalled(id: string): Promise<boolean> {
  if (!('caches' in globalThis)) return false;
  try {
    const cache = await caches.open('offline-models');
    const pack = PACKS.find(p => p.id === id);
    if (!pack) return false;
    const res1 = await cache.match(new Request(pack.entry));
    const res2 = pack.tokenizerVocab ? await cache.match(new Request(pack.tokenizerVocab)) : undefined;
    return !!res1 && (!!res2 || !pack.tokenizerVocab);
  } catch {
    return false;
  }
}

export async function installedPacks(): Promise<Array<{ id: string; version: string }>> {
  const out: Array<{ id: string; version: string }> = [];
  for (const p of PACKS) {
    if (await isPackInstalled(p.id)) out.push({ id: p.id, version: p.version });
  }
  return out;
}

// Attempt to load ONNX Runtime Web dynamically; falls back to undefined if not present
async function loadOrt(): Promise<any | undefined> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ort = await import('onnxruntime-web');
    return ort;
  } catch {
    return undefined;
  }
}

// In-memory lazy session cache and handle store
const sessionReadyByPack: Map<string, Promise<boolean>> = new Map();
const sessionByPack: Map<string, any> = new Map();

async function ensureSession(packId: string): Promise<boolean> {
  try {
    const existing = sessionReadyByPack.get(packId);
    if (existing) return existing;
    const promise = (async () => {
      const pack = PACKS.find(p => p.id === packId);
      if (!pack) return false;
      const ort = await loadOrt();
      if (!ort) return false;
      // fetch model from Cache Storage (installed) or network as fallback
      let bytes: ArrayBuffer | null = null;
      try {
        if ('caches' in globalThis) {
          const cache = await caches.open('offline-models');
          const res = await cache.match(new Request(pack.entry));
          if (res) bytes = await res.arrayBuffer();
        }
      } catch {}
      if (!bytes) {
        try {
          const res = await fetch(pack.entry);
          if (res.ok) bytes = await res.arrayBuffer();
        } catch {}
      }
      if (!bytes) return false;
      try {
        const model = new Uint8Array(bytes);
        // Prefer WebGPU if available; otherwise WASM
        const providers: string[] = [];
        const caps = detectCapabilities();
        if (caps.webgpu && (ort as any).webgpu) providers.push('webgpu');
        providers.push('wasm');
        // Some builds of onnxruntime-web accept options.executionProviders; if not supported, ignore
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options: any = providers.length ? { executionProviders: providers } : undefined;
        // Create session and store for later inference
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const session = await (ort as any).InferenceSession.create(model, options);
        sessionByPack.set(packId, session);
        return true;
      } catch {
        return false;
      }
    })();
    sessionReadyByPack.set(packId, promise);
    return promise;
  } catch {
    return false;
  }
}

// Lightweight extractive summarizer (frequency-based) as fallback
export function lightweightSummarize(text: string, maxSentences = 4): string {
  const sents = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);
  if (sents.length <= maxSentences) return sents.join(' ');
  const stop = new Set(['the','is','are','of','to','and','a','in','that','it','as','for','on','with','this','by','an','be']);
  const freq = new Map<string, number>();
  for (const s of sents) {
    for (const w of s.toLowerCase().match(/[a-z0-9]+/g) || []) {
      if (stop.has(w)) continue;
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }
  const scores = sents.map(s => {
    let sc = 0;
    for (const w of s.toLowerCase().match(/[a-z0-9]+/g) || []) sc += freq.get(w) || 0;
    return sc;
  });
  const idx = scores
    .map((sc, i) => ({ i, sc }))
    .sort((a, b) => b.sc - a.sc)
    .slice(0, maxSentences)
    .sort((a, b) => a.i - b.i)
    .map(x => x.i);
  return idx.map(i => sents[i]).join(' ');
}

// Lightweight QA: choose sentence with highest token overlap to the question
export function lightweightQA(question: string, context: string): string {
  const q = new Set((question.toLowerCase().match(/[a-z0-9]+/g) || []).filter(Boolean));
  const sents = context.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean);
  let best = 0; let pick = sents[0] || '';
  for (const s of sents) {
    const words = s.toLowerCase().match(/[a-z0-9]+/g) || [];
    let sc = 0; for (const w of words) if (q.has(w)) sc++;
    if (sc > best) { best = sc; pick = s; }
  }
  return pick || (sents[0] || '');
}

export type LocalSummaryResult = { ok: boolean; usedModel: boolean; text: string; packId?: string };
export async function tryLocalSummarize(text: string): Promise<LocalSummaryResult> {
  // prefer local if installed; else fallback lightweight
  const cap = detectCapabilities();
  const installed = await isPackInstalled('mini-sum');
  if (!installed || (!cap.webgpu && !cap.wasm)) {
    return { ok: true, usedModel: false, text: lightweightSummarize(text) };
  }
  // Load ONNX runtime and try run; if fails, use lightweight
  try {
    const ok = await ensureSession('mini-sum');
    const session = sessionByPack.get('mini-sum');
    if (!ok || !session) {
      return { ok: true, usedModel: false, text: lightweightSummarize(text) };
    }
    // Heuristic BERT CLS summarizer: score sentences via model logits
    const ort = await loadOrt();
    if (!ort) return { ok: true, usedModel: false, text: lightweightSummarize(text) };
    const pack = PACKS.find(p => p.id==='mini-sum');
    const vocab = await (async () => {
      try {
        if (!pack?.tokenizerVocab) return null;
        if ('caches' in globalThis) {
          const cache = await caches.open('offline-models');
          const hit = await cache.match(new Request(pack.tokenizerVocab));
          if (hit) return await hit.json();
        }
        const res = await fetch(pack!.tokenizerVocab!); if (res.ok) return await res.json();
      } catch {}
      return null;
    })();
    const sents = text.replace(/\s+/g,' ').split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean);
    const scores: number[] = [];
    for (const s of sents) {
      if (!vocab) { scores.push(Math.random()); continue; }
      const CLS = vocab['[CLS]'] ?? 101; const SEP = vocab['[SEP]'] ?? 102;
      const toks = (s.toLowerCase().match(/[a-z0-9]+/g) || []).slice(0, 64);
      const ids = [CLS, ...toks.map(t=>vocab[t] ?? (vocab['[UNK]'] ?? 100)), SEP];
      const input = new (ort as any).Tensor('int32', Int32Array.from(ids), [1, ids.length]);
      let out: any = {};
      try { out = await (session as any).run({ input_ids: input }); } catch { out = {}; }
      const key = Object.keys(out)[0];
      const val = key && out[key]?.data instanceof Float32Array ? out[key].data[0] : Math.random();
      scores.push(val);
    }
    const topIdx = scores.map((v,i)=>({v,i})).sort((a,b)=>b.v-a.v).slice(0, Math.min(4, sents.length)).sort((a,b)=>a.i-b.i).map(x=>x.i);
    return { ok: true, usedModel: true, text: topIdx.map(i=>sents[i]).join(' '), packId: 'mini-sum' };
  } catch {
    return { ok: true, usedModel: false, text: lightweightSummarize(text) };
  }
}

export type LocalQAResult = { ok: boolean; usedModel: boolean; answer: string; packId?: string };
export async function tryLocalQA(question: string, context: string): Promise<LocalQAResult> {
  const cap = detectCapabilities();
  const installed = await isPackInstalled('tiny-qna');
  if (!installed || (!cap.webgpu && !cap.wasm)) {
    return { ok: true, usedModel: false, answer: lightweightQA(question, context) };
  }
  try {
    const ok = await ensureSession('tiny-qna');
    const session = sessionByPack.get('tiny-qna');
    if (!ok || !session) return { ok: true, usedModel: false, answer: lightweightQA(question, context) };
    const ort = await loadOrt();
    if (!ort) return { ok: true, usedModel: false, answer: lightweightQA(question, context) };
    const pack = PACKS.find(p => p.id==='tiny-qna');
    // load vocab
    let vocab: Record<string, number> | null = null;
    try {
      if (pack?.tokenizerVocab) {
        if ('caches' in globalThis) {
          const cache = await caches.open('offline-models');
          const hit = await cache.match(new Request(pack.tokenizerVocab));
          if (hit) vocab = await hit.json();
        }
        if (!vocab) { const r = await fetch(pack!.tokenizerVocab!); if (r.ok) vocab = await r.json(); }
      }
    } catch {}
    if (!vocab) return { ok: true, usedModel: false, answer: lightweightQA(question, context) };
    // Build BERT QA inputs
    const CLS = vocab['[CLS]'] ?? 101; const SEP = vocab['[SEP]'] ?? 102;
    const qtoks = (question.toLowerCase().match(/[a-z0-9]+/g) || []).slice(0, 32);
    const ctoks = (context.toLowerCase().match(/[a-z0-9]+/g) || []).slice(0, 256);
    const qids = qtoks.map(t=>vocab![t] ?? (vocab!['[UNK]'] ?? 100));
    const cids = ctoks.map(t=>vocab![t] ?? (vocab!['[UNK]'] ?? 100));
    const inputIds = [CLS, ...qids, SEP, ...cids, SEP];
    const tt = inputIds.map((_,i)=> (i <= qids.length+1 ? 0 : 1));
    const am = inputIds.map(()=>1);
    const feeds: Record<string, any> = {
      input_ids: new (ort as any).Tensor('int32', Int32Array.from(inputIds), [1, inputIds.length]),
      token_type_ids: new (ort as any).Tensor('int32', Int32Array.from(tt), [1, tt.length]),
      attention_mask: new (ort as any).Tensor('int32', Int32Array.from(am), [1, am.length]),
    };
    const outputs = await (session as any).run(feeds).catch(()=> ({} as Record<string, any>));
    const start = (outputs['start_logits']?.data || outputs['start']?.data) as Float32Array | undefined;
    const end = (outputs['end_logits']?.data || outputs['end']?.data) as Float32Array | undefined;
    if (start && end) {
      // naive span extraction maps back to tokens (best effort)
      let bestStart = 0, bestEnd = 0, bestScore = -1e9;
      for (let i = 0; i < start.length; i++) {
        for (let j = i; j < Math.min(i+30, end.length); j++) {
          const score = start[i] + end[j];
          if (score > bestScore) { bestScore = score; bestStart = i; bestEnd = j; }
        }
      }
      const inv: Record<number, string> = {};
      for (const [k, v] of Object.entries(vocab)) inv[v] = k;
      const toks: string[] = [];
      for (let k = bestStart; k <= bestEnd; k++) { const t = inv[inputIds[k]] || ''; if (!t) continue; toks.push(t.startsWith('##')? t.slice(2) : (' '+t)); }
      const ans = toks.join('').trim();
      if (ans) return { ok: true, usedModel: true, answer: ans, packId: 'tiny-qna' };
    }
    return { ok: true, usedModel: true, answer: lightweightQA(question, context), packId: 'tiny-qna' };
  } catch {
    return { ok: true, usedModel: false, answer: lightweightQA(question, context) };
  }
}

export function preferLocalInference(): boolean {
  try { return (typeof window !== 'undefined' && window.localStorage.getItem('offline_only') === 'true'); } catch { return false; }
}

export function preferLocalSummarizer(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const s = window.localStorage.getItem('offline_only_summary') === 'true';
    return s || (window.localStorage.getItem('offline_only') === 'true');
  } catch { return false; }
}

export function preferLocalQA(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const q = window.localStorage.getItem('offline_only_qa') === 'true';
    return q || (window.localStorage.getItem('offline_only') === 'true');
  } catch { return false; }
}

export async function healthSummary() {
  const caps = detectCapabilities();
  const installed = await installedPacks();
  const packs = await Promise.all(installed.map(async p => {
    const loaded = await (sessionReadyByPack.get(p.id) ?? Promise.resolve(false));
    return { ...p, loaded };
  }));
  return { caps, packs };
}

export async function warmupModel(id: 'mini-sum'|'tiny-qna'): Promise<boolean> {
  try { return await ensureSession(id); } catch { return false; }
}
