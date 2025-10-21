"use client";

import { useEffect, useState } from "react";
import { fetchProgress, fetchAchievements, fetchMastery, listLessonSessions, fetchDueReviews, type AchievementItem, fetchMasteryTimeSeries, fetchCohortComparisons, fetchReviewAdherence } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { getWeakTopics } from "@/lib/mastery";
import Link from "next/link";
import GoalsWidget from "./GoalsWidget";

export default function ProgressPage() {
  const [userId, setUserId] = useState("123");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    xp: number;
    level: number;
    streak: number;
    totalAssignmentsCompleted?: number;
    totalQuizzesCompleted?: number;
    averageScore?: number;
  } | null>(null);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [weakTopics, setWeakTopics] = useState<Array<{ topic: string; accuracy: number }>>([]);
  const [masteryMap, setMasteryMap] = useState<Record<string, { correct: number; attempts: number }>>({});
  const [lastLesson, setLastLesson] = useState<{ title: string; when: string } | null>(null);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [continueUrl, setContinueUrl] = useState<string | null>(null);
  const [ts, setTs] = useState<Array<{ date: string; accuracy: number; attempts: number }>>([]);
  const [cohort, setCohort] = useState<Array<{ userId: string; accuracy: number; attempts: number }>>([]);
  const [adherence, setAdherence] = useState<{ adherence: number; missed: number; completed: number } | null>(null);

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
        const [p, a, m, sessions, due] = await Promise.all([
          fetchProgress(userId),
          fetchAchievements(),
          fetchMastery(userId),
          listLessonSessions(userId),
          fetchDueReviews(userId, 1),
        ]);
        if (!mounted) return;
        setProgress(p);
        setAchievements(a);
        setMasteryMap(m);
        const completed = (sessions.sessions || []).filter((s) => s.completed).sort((x, y) => new Date(y.completedAt || '').getTime() - new Date(x.completedAt || '').getTime());
        setCompletedCount(completed.length);
        if (completed[0]) setLastLesson({ title: completed[0].lesson?.title || completed[0].topic, when: new Date(completed[0].completedAt || '').toLocaleString() });
        const weak = getWeakTopics(userId, 1).slice(0, 5).map(({ topic, accuracy }) => ({ topic, accuracy }));
        setWeakTopics(weak);
        try { const pts = await fetchMasteryTimeSeries({ userId, days: 30 }); setTs(pts); } catch {}
        try {
          const classId = (typeof window !== 'undefined' ? window.localStorage.getItem('classId') : '') || '';
          if (classId) { const cmp = await fetchCohortComparisons({ classId, days: 30 }); setCohort(cmp); }
        } catch {}
        try { const adh = await fetchReviewAdherence({ userId, days: 30 }); setAdherence(adh); } catch {}
        // Continue CTA
        if (Array.isArray(due) && due[0]?.topic) {
          setContinueUrl(`/adaptive?topic=${encodeURIComponent(due[0].topic)}`);
        } else {
          const incompletes = (sessions.sessions || []).filter((s) => !s.completed);
          if (incompletes[0]) setContinueUrl(`/lessons/interactive?session=${encodeURIComponent(incompletes[0].id)}`);
          else if (weak[0]) setContinueUrl(`/adaptive?topic=${encodeURIComponent(weak[0].topic)}`);
        }
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

  return (
    <div className="mx-auto max-w-4xl w-full p-4 space-y-6">
      <h1 className="text-xl font-semibold">Progress</h1>
      <div className="flex items-center gap-2 text-xs">
        <button className="h-7 px-2 border rounded-md" onClick={()=>{
          try {
            const rows = [ ['metric','value'].join(',') ] as string[];
            rows.push(['xp', String(progress?.xp||0)].join(','));
            rows.push(['level', String(progress?.level||0)].join(','));
            rows.push(['streak', String(progress?.streak||0)].join(','));
            for (const w of weakTopics) rows.push([`weak:${w.topic}`, String(Math.round(w.accuracy*100))+'%'].join(','));
            const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
            const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`progress-${new Date().toISOString()}.csv`; a.click(); URL.revokeObjectURL(url);
          } catch {}
        }}>Export CSV</button>
      </div>
      {loading && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && (
        <div className="grid sm:grid-cols-3 gap-4">
          <Stat label="XP" value={progress.xp} />
          <Stat label="Level" value={progress.level} />
          <Stat label="Streak" value={`${progress.streak} days`} />
          <Stat label="Assignments" value={progress.totalAssignmentsCompleted ?? 0} />
          <Stat label="Quizzes" value={progress.totalQuizzesCompleted ?? 0} />
          <Stat label="Avg Score" value={(progress.averageScore ?? 0) + "%"} />
        </div>
      )}
      <div>
        <h2 className="text-lg font-medium mb-2">Achievements</h2>
        {achievements.length === 0 && !loading ? (
          <p className="text-sm text-muted-foreground">No achievements yet.</p>
        ) : (
          <ul className="grid sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <li key={a.id} className="border rounded-md p-3">
                <div className="font-medium">{a.name}</div>
                <div className="text-sm text-muted-foreground">{a.description}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <GoalsWidget />
      {continueUrl && (
        <div className="border rounded-md p-3 flex items-center justify-between">
          <div className="text-sm">Continue learning</div>
          <Link href={continueUrl} className="text-sm underline">Go</Link>
        </div>
      )}
      {(completedCount > 0 || lastLesson) && (
        <div className="border rounded-md p-3">
          <div className="text-sm">Completed interactive lessons: <span className="font-medium">{completedCount}</span></div>
          {lastLesson && (
            <div className="text-xs text-muted-foreground">Last completed: {lastLesson.title} — {lastLesson.when}</div>
          )}
        </div>
      )}
      <TodayQueue masteryMap={masteryMap} />
      <MasteryTrend points={ts} />
      <AdherenceCard data={adherence} />
      <CohortCompare data={cohort} />
      <div>
        <h2 className="text-lg font-medium mb-2">Weak topics</h2>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-muted-foreground">No weak topics detected yet.</p>
        ) : (
          <ul className="space-y-2">
            {weakTopics.map((w, i) => (
              <li key={i} className="flex items-center justify-between border rounded-md p-3">
                <div className="text-sm">{w.topic} — {(w.accuracy * 100).toFixed(0)}%</div>
                <Link href={`/adaptive?topic=${encodeURIComponent(w.topic)}`} className="text-sm underline">
                  Practice now
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="border rounded-md p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function TodayQueue({ masteryMap }: { masteryMap: Record<string, { correct: number; attempts: number }> }) {
  const items = Object.entries(masteryMap)
    .map(([topic, s]) => ({ topic, acc: (s.correct || 0) / Math.max(1, s.attempts || 1) }))
    .sort((a, b) => a.acc - b.acc)
    .slice(0, 5);
  if (items.length === 0) return null;
  return (
    <div>
      <h2 className="text-lg font-medium mb-2">Today&apos;s practice</h2>
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.topic} className="flex items-center justify-between border rounded-md p-3">
            <div className="text-sm">{it.topic} — {(it.acc * 100).toFixed(0)}%</div>
            <Link href={`/adaptive?topic=${encodeURIComponent(it.topic)}`} className="text-sm underline">
              Practice now
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MasteryTrend({ points }: { points: Array<{ date: string; accuracy: number; attempts: number }> }) {
  if (!points || points.length === 0) return null;
  const w = 260, h = 120, pad = 20;
  const xs = (i: number) => pad + (i/(Math.max(1, points.length-1))) * (w - pad*2);
  const ys = (acc: number) => h - pad - (acc * (h - pad*2));
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm font-medium mb-1">Mastery progression (30d)</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        <line x1={pad} y1={h-pad} x2={w-pad} y2={h-pad} stroke="#cbd5e1" />
        <line x1={pad} y1={pad} x2={pad} y2={h-pad} stroke="#cbd5e1" />
        {points.map((p,i)=>{
          if (i===0) return null;
          const prev = points[i-1];
          return <path key={i} d={`M ${xs(i-1)} ${ys(prev.accuracy)} L ${xs(i)} ${ys(p.accuracy)}`} stroke="#2563eb" strokeWidth="2" fill="none" />
        })}
      </svg>
    </div>
  );
}

function AdherenceCard({ data }: { data: { adherence: number; missed: number; completed: number } | null }) {
  if (!data) return null;
  const pct = Math.round((data.adherence || 0) * 100);
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm font-medium mb-1">Review adherence (30d)</div>
      <div className="text-xs text-muted-foreground">Completed {data.completed}, missed {data.missed}</div>
      <div className="mt-1 h-2 bg-muted rounded"><div className="h-full bg-green-600 rounded" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

function CohortCompare({ data }: { data: Array<{ userId: string; accuracy: number; attempts: number }> }) {
  if (!data || data.length === 0) return null;
  const sorted = [...data].sort((a,b)=> b.accuracy - a.accuracy).slice(0, 10);
  return (
    <div className="border rounded-md p-3">
      <div className="text-sm font-medium mb-1">Cohort/section comparison (top 10)</div>
      <ul className="text-xs grid gap-1">
        {sorted.map((s,i)=> (
          <li key={s.userId} className="flex items-center justify-between"><span>{i+1}. {s.userId}</span><span>{Math.round(s.accuracy*100)}%</span></li>
        ))}
      </ul>
    </div>
  );
}
