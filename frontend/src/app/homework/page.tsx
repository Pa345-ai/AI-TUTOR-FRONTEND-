"use client";

import { useEffect, useState } from "react";
import { requestHomeworkFeedback, fetchHomeworkReviews, type HomeworkReview, type HomeworkRubricCategory, exportToDocs } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function HomeworkFeedbackPage() {
  const [userId, setUserId] = useState("123");
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [gradeLevel, setGradeLevel] = useState<string | number>("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [review, setReview] = useState<HomeworkReview | null>(null);
  const [history, setHistory] = useState<HomeworkReview[]>([]);
  const [token, setToken] = useState("");
  const [exporting, setExporting] = useState(false);

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
        const res = await fetchHomeworkReviews(userId);
        if (!mounted) return;
        setHistory(res.reviews ?? []);
      } catch {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [userId]);

  const submit = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const res = await requestHomeworkFeedback({ userId, title, subject, gradeLevel: Number(gradeLevel) || undefined, content });
      setReview(res.review);
      // refresh history
      const h = await fetchHomeworkReviews(userId);
      setHistory(h.reviews ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const exportDoc = async () => {
    if (!review) return;
    setExporting(true);
    try {
      const titleText = review.title || review.subject || 'Homework Feedback';
      const content = [
        `# ${titleText}`,
        `\n## Summary\n${review.summary || ''}`,
        `\n## Rubric`,
        ...((review.rubric?.categories || []).map((c) => `- ${c.name}: ${c.score}/${c.outOf} — ${c.comment}`)),
        `\n## Suggestions`,
        ...((review.suggestions || []).map((s) => `- ${s}`)),
        `\n## Revision Plan\n${review.revisions || ''}`,
        `\n## Original Submission\n${review.contentText || ''}`,
      ].join('\n');
      const res = await exportToDocs({ title: titleText, content, token: token || undefined });
      if (res.docUrl) window.open(res.docUrl, '_blank');
      if (res.docContent && navigator.clipboard) await navigator.clipboard.writeText(res.docContent);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Homework & Essay Feedback</h1>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="grid gap-2">
            <input className="h-9 px-2 border rounded-md text-sm" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input className="h-9 px-2 border rounded-md text-sm" placeholder="Subject (optional)" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <input className="h-9 px-2 border rounded-md text-sm" placeholder="Grade level (optional)" value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} />
          </div>
          <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Paste your homework or essay text here..." className="min-h-[200px]" />
          <div className="flex items-center gap-2">
            <Button onClick={submit} disabled={loading || !content.trim()}>{loading ? "Analyzing…" : "Get Feedback"}</Button>
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
        </div>
        <div className="space-y-3">
          <div className="text-sm font-medium">Your Reviews</div>
          <div className="border rounded-md divide-y">
            {history.length === 0 && <div className="p-2 text-xs text-muted-foreground">No reviews yet.</div>}
            {history.map((r) => (
              <div key={r.id} className="p-2 text-sm">
                <div className="font-medium truncate">{r.title || r.subject || r.createdAt}</div>
                <div className="text-xs text-muted-foreground">Score: {r.overallScore ?? '-'} | {new Date(r.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {review && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Feedback</h2>
          <div className="flex items-center gap-2 text-xs">
            <input className="h-8 px-2 border rounded-md" placeholder="Google OAuth token (optional)" value={token} onChange={(e)=>setToken(e.target.value)} />
            <button className="inline-flex items-center gap-1 rounded-md border px-2 py-1" onClick={exportDoc} disabled={exporting}>
              {exporting ? 'Exporting…' : 'Export to Docs'}
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium">Summary</div>
              <div className="border rounded-md p-2 text-sm whitespace-pre-wrap">{review.summary}</div>
              <div className="text-sm font-medium">Revision Plan</div>
              <div className="border rounded-md p-2 text-sm whitespace-pre-wrap">{review.revisions}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Rubric</div>
              <div className="border rounded-md p-2 text-sm">
                {(review.rubric?.categories ?? []).map((c: HomeworkRubricCategory, i: number) => (
                  <div key={i} className="py-1">
                    <div className="flex items-center justify-between">
                      <div>{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.score}/{c.outOf}</div>
                    </div>
                    <div className="text-xs text-muted-foreground">{c.comment}</div>
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">Suggestions</div>
              <ul className="list-disc list-inside text-sm">
                {(review.suggestions ?? []).map((s: string, i: number) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
