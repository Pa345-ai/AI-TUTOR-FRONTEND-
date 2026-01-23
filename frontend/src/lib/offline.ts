// Simple offline helpers: tokenization, cosine similarity, extractive hint, local tutor reply

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function vectorize(tokens: string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const t of tokens) map.set(t, (map.get(t) || 0) + 1);
  return map;
}

function cosineSim(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let a2 = 0;
  let b2 = 0;
  for (const [k, v] of a) {
    a2 += v * v;
    if (b.has(k)) dot += v * (b.get(k) || 0);
  }
  for (const [, v] of b) b2 += v * v;
  if (a2 === 0 || b2 === 0) return 0;
  return dot / (Math.sqrt(a2) * Math.sqrt(b2));
}

export function splitSentences(text: string): string[] {
  const parts = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [text.trim()].filter(Boolean);
}

export function topKSentences(text: string, query: string, k = 1): string[] {
  const sents = splitSentences(text);
  const qv = vectorize(tokenize(query));
  const scored = sents.map((s) => ({ s, score: cosineSim(vectorize(tokenize(s)), qv) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k).map((x) => x.s);
}

export function summarize(text: string, maxSentences = 2): string {
  const sents = splitSentences(text);
  return sents.slice(0, maxSentences).join(" ");
}

export function localTutorReply(query: string, opts: { mode: "friendly"|"socratic"|"exam"|"motivational"; level: "eli5"|"normal"|"expert"; subject?: string; grade?: string|number }): string {
  const subj = opts.subject ? ` in ${opts.subject}` : "";
  const grade = opts.grade ? ` for grade ${opts.grade}` : "";
  const baseIntro = opts.level === "eli5" ? "Let’s keep it super simple." : opts.level === "expert" ? "Let’s go a bit deeper." : "Let’s break it down.";
  const q = query.replace(/\s+/g, " ").slice(0, 160);
  if (opts.mode === "socratic") {
    return `${baseIntro} Before answering${subj}${grade}, think about: \n- What is the problem really asking?\n- Which definition or formula applies?\n- Can you try a tiny example?\nNow, what would be your first step for: "${q}"?`;
  }
  if (opts.mode === "exam") {
    return `Quick check${subj}${grade}:\n- Identify knowns/unknowns.\n- Choose the method.\n- Compute carefully and verify units.\nYour turn: what method fits best for "${q}"?`;
  }
  if (opts.mode === "motivational") {
    return `${baseIntro} You’ve got this! Try: \n1) Restate the question in your own words.\n2) List the facts you know.\n3) Take a small step and see what happens.\nWhat’s your first step for: "${q}"?`;
  }
  // friendly
  return `${baseIntro} Try it step‑by‑step: \n1) Restate the problem${subj}${grade}.\n2) Pick the key idea/definition.\n3) Work a tiny example.\nWhat would you attempt first for: "${q}"?`;
}
