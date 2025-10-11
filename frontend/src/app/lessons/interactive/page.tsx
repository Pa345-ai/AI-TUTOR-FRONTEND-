"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLessonSession, answerLessonStep, listLessonSessions, fetchLessonSession, getLessonHint, exportToDocs } from "@/lib/api";
type Step = { title: string; content: string; check?: { question: string; answer: string } };
type InteractiveLesson = { title: string; overview: string; steps: Step[]; summary?: string; script?: string; srt?: string };

export default function InteractiveLessonPage() {
  const [topic, setTopic] = useState("");
  const [grade, setGrade] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<InteractiveLesson | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answer, setAnswer] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [hint, setHint] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Array<{ id: string; topic: string; currentStepIndex: number; score: number }>>([]);
  const [token, setToken] = useState<string>("");
  const [exporting, setExporting] = useState(false);
  const [ytToken, setYtToken] = useState("");
  const [voice, setVoice] = useState<string>("en-US");
  const [ytUploading, setYtUploading] = useState(false);
  const [ytUrl, setYtUrl] = useState<string>("");

  const run = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setError(null);
    setLesson(null);
    try {
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) as "en"|"si"|"ta"|null;
      const uid = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const started = await startLessonSession({ userId: uid, topic, grade, language: language ?? 'en' });
      setSessionId(started.id);
      setLesson(started.lesson as unknown as InteractiveLesson);
      setCurrentIndex(0);
      setScore(0);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!sessionId) return;
    const res = await answerLessonStep(sessionId, answer);
    setScore(res.score);
    setCurrentIndex(res.nextIndex);
    setAnswer("");
    setHint("");
  };

  const fetchHint = async () => {
    if (!sessionId) return;
    const res = await getLessonHint(sessionId);
    setHint(res.hint || "");
  };

  const loadSessions = async () => {
    const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
    const res = await listLessonSessions(uid);
    setSessions(res.sessions.map(s => ({ id: s.id, topic: s.topic, currentStepIndex: s.currentStepIndex, score: s.score })));
  };

  const resume = async (id: string) => {
    const res = await fetchLessonSession(id);
    const s = res.session;
    setSessionId(s.id);
    setLesson(s.lesson as unknown as InteractiveLesson);
    setCurrentIndex(s.currentStepIndex || 0);
    setScore(s.score || 0);
  };

  const exportDoc = async () => {
    if (!lesson) return;
    setExporting(true);
    try {
      const title = lesson.title || topic || 'AI Tutor Lesson';
      const content = [
        `# ${title}`,
        lesson.overview ? `\n${lesson.overview}\n` : '',
        ...lesson.steps.map((s, i) => `\n## Step ${i+1}: ${s.title}\n${s.content}\n${s.check ? `\nCheck: ${s.check.question}\n` : ''}`),
        lesson.summary ? `\n## Summary\n${lesson.summary}` : ''
      ].join('\n');
      const res = await exportToDocs({ title, content, token: token || undefined });
      if (res.docUrl) window.open(res.docUrl, '_blank');
      if (res.docContent && navigator.clipboard) await navigator.clipboard.writeText(res.docContent);
    } finally {
      setExporting(false);
    }
  };

  const uploadYouTube = async () => {
    if (!lesson) return;
    setYtUploading(true);
    setYtUrl("");
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL!;
      const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
      const steps = Array.isArray(lesson.steps) ? lesson.steps.map(s => ({ title: s.title, content: s.content })) : [];
      const resp = await fetch(`${base}/api/youtube/render-upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, title: lesson.title || topic || 'AI Tutor Lesson', steps, script: lesson.script || undefined, accessToken: ytToken || undefined, voice }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Render/upload failed');
      setYtUrl(data.url || `https://youtu.be/${data.videoId}`);
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    } finally {
      setYtUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Interactive Lesson</h1>
      {lesson && (
        <div className="w-full h-2 bg-muted rounded">
          <div className="h-full bg-green-600 rounded" style={{ width: `${Math.round(((currentIndex+1)/Math.max(1, lesson.steps.length))*100)}%` }} />
        </div>
      )}
      <div className="grid sm:grid-cols-3 gap-2">
        <Input className="sm:col-span-2" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g., Photosynthesis)" />
        <Input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="Grade (optional)" />
      </div>
      <Button onClick={run} disabled={!topic.trim() || loading}>{loading ? 'Generating…' : 'Generate'}</Button>
      <div>
        <Button variant="outline" size="sm" onClick={loadSessions}>Load Sessions</Button>
        <div className="mt-2 flex items-center gap-2 text-xs">
          <input className="h-8 px-2 border rounded-md" placeholder="Google OAuth token (optional)" value={token} onChange={(e)=>setToken(e.target.value)} />
          <Button size="sm" variant="outline" onClick={exportDoc} disabled={!lesson || exporting}>{exporting ? 'Exporting…' : 'Export to Docs'}</Button>
          <input className="h-8 px-2 border rounded-md" placeholder="YouTube token (optional)" value={ytToken} onChange={(e)=>setYtToken(e.target.value)} />
          <select className="h-8 px-2 border rounded-md" value={voice} onChange={(e)=>setVoice(e.target.value)}>
            <option value="off">Voice: Off</option>
            <option value="en-US">Voice: en-US</option>
            <option value="en-GB">Voice: en-GB</option>
          </select>
          <Button size="sm" variant="outline" onClick={uploadYouTube} disabled={!lesson || ytUploading}>{ytUploading ? 'Uploading…' : 'Render & Upload to YouTube'}</Button>
        </div>
        {ytUrl && (
          <div className="mt-2 text-xs">Video: <a className="underline" href={ytUrl} target="_blank" rel="noreferrer">{ytUrl}</a></div>
        )}
        {sessions.length > 0 && (
          <div className="mt-2 grid gap-1 text-sm">
            {sessions.map((s) => (
              <button key={s.id} className="text-left underline" onClick={() => void resume(s.id)}>
                Resume: {s.topic} — Step {s.currentStepIndex + 1}, Score {s.score}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {lesson && (
        <div className="space-y-3">
          <div className="text-lg font-semibold">{lesson.title || topic}</div>
          {lesson.overview && (
            <div className="space-y-1">
              <div className="text-sm font-medium">Overview</div>
              <div className="border rounded-md p-2 text-sm whitespace-pre-wrap">{lesson.overview}</div>
            </div>
          )}
          {Array.isArray(lesson.steps) && lesson.steps.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Steps</div>
              <div className="grid gap-2">
                <div className="border rounded-md p-2 text-sm space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Step {currentIndex + 1} of {lesson.steps.length}</div>
                    <div className="text-xs text-muted-foreground">Score: {score}</div>
                  </div>
                  <div className="font-medium">{lesson.steps[currentIndex]?.title || `Step ${currentIndex+1}`}</div>
                  <div className="whitespace-pre-wrap">{lesson.steps[currentIndex]?.content}</div>
                  {lesson.steps[currentIndex]?.check && (
                    <div className="space-y-2">
                      <div className="text-xs">Self-check: {lesson.steps[currentIndex]?.check?.question}</div>
                      <Input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Your answer" />
                      <div className="flex items-center gap-2">
                        <Button size="sm" onClick={submitAnswer} disabled={!answer.trim()}>Submit</Button>
                        <Button size="sm" variant="outline" onClick={fetchHint}>Get Hint</Button>
                      </div>
                      {hint && <div className="text-xs text-muted-foreground">Hint: {hint}</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          {sessionId && currentIndex >= (lesson.steps.length - 1) && (
            <div className="text-sm text-green-700">Session complete! XP awarded and mastery updated.</div>
          )}
          {(lesson.script || lesson.srt) && (
            <div className="grid sm:grid-cols-2 gap-2">
              <div>
                <div className="text-sm font-medium">Narration Script</div>
                <Textarea readOnly className="min-h-[160px]" value={lesson.script || ''} />
              </div>
              <div>
                <div className="text-sm font-medium">SRT Captions</div>
                <Textarea readOnly className="min-h-[160px]" value={lesson.srt || ''} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
