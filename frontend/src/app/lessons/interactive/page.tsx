"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { startLessonSession, answerLessonStep, listLessonSessions, fetchLessonSession, getLessonHint, exportToDocs } from "@/lib/api";
import { saveLessonPack, listLessonPacks, getLessonPack, deleteLessonPack, type LessonPack } from "@/lib/offline-packs";
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
  // Offline packs
  const [packs, setPacks] = useState<Array<Pick<LessonPack,'id'|'topic'|'grade'|'createdAt'>>>([]);
  const [showPacks, setShowPacks] = useState(false);
  // Animated lesson player state
  const [showAnimated, setShowAnimated] = useState(false);
  const [animPlaying, setAnimPlaying] = useState(false);
  const [animSpeedMs, setAnimSpeedMs] = useState<number>(1800);
  const [animTheme, setAnimTheme] = useState<"dark"|"light"|"ocean"|"sunset">("dark");
  const [animSlideIndex, setAnimSlideIndex] = useState<number>(0);
  const [animBulletIndex, setAnimBulletIndex] = useState<number>(0);
  const animTimerRef = useRef<number | null>(null);

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
    if (!sessionId || !lesson) return;
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('offline');
      const res = await getLessonHint(sessionId);
      setHint(res.hint || "");
    } catch {
      // Local fallback hint: pull a key sentence from the current step content.
      const step = lesson.steps[currentIndex];
      const text = (step?.content || '').split(/\n+/).join(' ');
      const first = text.split(/(?<=[.!?])\s+/)[0] || text.slice(0, 140);
      const clue = step?.check?.question ? ` Focus on: ${step.check.question}` : '';
      setHint(`Try this: ${first}${clue}`);
    }
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

  const saveOffline = async () => {
    if (!lesson) return;
    await saveLessonPack({ topic: lesson.title || topic, grade, lesson });
    const list = await listLessonPacks();
    setPacks(list);
    setShowPacks(true);
  };

  const loadPacks = useCallback(async () => {
    const list = await listLessonPacks();
    setPacks(list);
  }, []);

  const openPack = async (id: string) => {
    const pack = await getLessonPack(id);
    if (!pack) return;
    setLesson(pack.lesson as unknown as InteractiveLesson);
    setTopic(pack.topic);
    setGrade(pack.grade || "");
    setSessionId(null);
    setCurrentIndex(0);
    setScore(0);
    setShowPacks(false);
  };

  const removePack = async (id: string) => {
    await deleteLessonPack(id);
    const list = await listLessonPacks();
    setPacks(list);
  };

  // Helpers for animation content
  const slides = useMemo(() => {
    if (!lesson) return [] as Array<{ title: string; bullets: string[] }>;
    const toBullets = (text: string): string[] => {
      const raw = (text || "").split(/\n+/).map((s) => s.trim()).filter(Boolean);
      if (raw.length > 0) return raw.slice(0, 6);
      const sentences = (text || "").split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
      return sentences.slice(0, 6);
    };
    return lesson.steps.map((s) => ({ title: s.title || "Step", bullets: toBullets(s.content || "") }));
  }, [lesson]);

  const stopAnim = useCallback(() => {
    if (animTimerRef.current) { clearTimeout(animTimerRef.current); animTimerRef.current = null; }
    setAnimPlaying(false);
  }, []);

  const nextAnimTick = useCallback(() => {
    if (slides.length === 0) return;
    const current = slides[animSlideIndex];
    const atLastBullet = animBulletIndex >= Math.max(0, current?.bullets.length - 1);
    if (!atLastBullet) {
      setAnimBulletIndex((i) => i + 1);
      return;
    }
    // move to next slide
    const nextSlide = animSlideIndex + 1;
    if (nextSlide < slides.length) {
      setAnimSlideIndex(nextSlide);
      setAnimBulletIndex(0);
    } else {
      // end
      stopAnim();
    }
  }, [slides, animSlideIndex, animBulletIndex, stopAnim]);

  useEffect(() => {
    if (!animPlaying) return;
    animTimerRef.current = window.setTimeout(() => {
      nextAnimTick();
    }, Math.max(400, animSpeedMs));
    return () => {
      if (animTimerRef.current) { clearTimeout(animTimerRef.current); animTimerRef.current = null; }
    };
  }, [animPlaying, animSpeedMs, animSlideIndex, animBulletIndex, nextAnimTick]);

  const startAnim = useCallback(() => {
    if (slides.length === 0) return;
    setAnimSlideIndex(0);
    setAnimBulletIndex(0);
    setAnimPlaying(true);
  }, [slides.length]);

  const bgStyle = useMemo((): React.CSSProperties => {
    switch (animTheme) {
      case "light": return { background: "#F8FAFC", color: "#0F172A" };
      case "ocean": return { background: "linear-gradient(135deg,#0ea5e9,#1d4ed8)", color: "#FFFFFF" };
      case "sunset": return { background: "linear-gradient(135deg,#f97316,#dc2626)", color: "#FFFFFF" };
      default: return { background: "#0B1220", color: "#FFFFFF" };
    }
  }, [animTheme]);

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
          <span className="mx-2">|</span>
          <Button size="sm" onClick={() => setShowAnimated((v) => !v)} disabled={!lesson}>{showAnimated ? 'Hide Animated' : 'Show Animated'}</Button>
          <span className="mx-2">|</span>
          <Button size="sm" variant="outline" onClick={() => void saveOffline()} disabled={!lesson}>Save Offline</Button>
          <Button size="sm" variant="outline" onClick={() => { void loadPacks(); setShowPacks((v)=>!v); }}>Offline Packs</Button>
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
      {lesson && showAnimated && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">Animated Lesson</div>
            <div className="flex items-center gap-2 text-xs">
              <select className="h-8 px-2 border rounded-md" value={animTheme} onChange={(e)=>setAnimTheme((e.target.value as "dark"|"light"|"ocean"|"sunset"))}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="ocean">Ocean</option>
                <option value="sunset">Sunset</option>
              </select>
              <label>Speed</label>
              <input type="range" min={400} max={3000} step={200} value={animSpeedMs} onChange={(e)=>setAnimSpeedMs(parseInt(e.target.value))} />
              <Button size="sm" onClick={() => (animPlaying ? stopAnim() : startAnim())}>{animPlaying ? 'Pause' : 'Play'}</Button>
              <Button size="sm" variant="outline" onClick={() => { setAnimSlideIndex((i)=> Math.max(0, i-1)); setAnimBulletIndex(0); }}>Prev</Button>
              <Button size="sm" variant="outline" onClick={() => { setAnimSlideIndex((i)=> Math.min(slides.length-1, i+1)); setAnimBulletIndex(0); }}>Next</Button>
            </div>
          </div>
          <div className="w-full h-64 rounded-md overflow-hidden border" style={bgStyle}>
            <div className="h-full w-full p-4 flex flex-col">
              <div className="text-lg font-semibold">{slides[animSlideIndex]?.title || ''}</div>
              <div className="mt-2 flex-1">
                <ul className="list-disc pl-6 space-y-1">
                  {slides[animSlideIndex]?.bullets?.slice(0, animBulletIndex + 1).map((b, i) => (
                    <li key={i} className="text-sm opacity-95">{b}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs opacity-70">Slide {animSlideIndex + 1} / {slides.length}</div>
            </div>
          </div>
        </div>
      )}
      {showPacks && (
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm font-medium">Offline Lesson Packs</div>
          {packs.length === 0 ? (
            <div className="text-xs text-muted-foreground">No saved packs. Click &quot;Save Offline&quot; after generating a lesson.</div>
          ) : (
            <ul className="text-sm space-y-1">
              {packs.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <button className="underline" onClick={() => void openPack(p.id)}>
                    {p.topic} {p.grade ? `• G${p.grade}` : ''} — {new Date(p.createdAt).toLocaleString()}
                  </button>
                  <button className="text-xs text-red-600" onClick={() => void removePack(p.id)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
