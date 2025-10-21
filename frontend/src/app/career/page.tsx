"use client";

import { useEffect, useState } from "react";
import { getCareerAdvice, type CareerAdvice, type CareerPath } from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function CareerAdvisorPage() {
  const [userId, setUserId] = useState("123");
  const [interests, setInterests] = useState<string>("");
  const [strengths, setStrengths] = useState<string>("");
  const [region, setRegion] = useState<string>("global");
  const [advice, setAdvice] = useState<CareerAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("userId");
      if (stored) setUserId(stored);
    }
  }, []);

  const run = async () => {
    setLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) as "en"|"si"|"ta"|null;
      const res = await getCareerAdvice({ userId, interests: interests.split(',').map(s=>s.trim()).filter(Boolean), strengths: strengths.split(',').map(s=>s.trim()).filter(Boolean), region, language: language ?? 'en' });
      setAdvice(res.advice);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl w-full p-4 space-y-4">
      <h1 className="text-xl font-semibold">Career & Goal Advisor</h1>
      <div className="grid gap-2">
        <input className="h-9 px-2 border rounded-md text-sm" placeholder="Interests (comma-separated)" value={interests} onChange={(e)=>setInterests(e.target.value)} />
        <input className="h-9 px-2 border rounded-md text-sm" placeholder="Strengths (comma-separated)" value={strengths} onChange={(e)=>setStrengths(e.target.value)} />
        <input className="h-9 px-2 border rounded-md text-sm" placeholder="Region (e.g., Sri Lanka, global)" value={region} onChange={(e)=>setRegion(e.target.value)} />
      </div>
      <Button onClick={run} disabled={loading}>{loading ? 'Analyzing…' : 'Get Advice'}</Button>
      {error && <div className="text-sm text-red-600">{error}</div>}
      {advice && (
        <div className="space-y-3">
          <div className="text-sm font-medium">Summary</div>
          <div className="border rounded-md p-2 text-sm whitespace-pre-wrap">{advice.summary}</div>
          <div className="text-sm font-medium">Recommended Subjects</div>
          <ul className="list-disc list-inside text-sm">
            {(advice.recommendedSubjects || []).map((s: string, i: number) => (<li key={i}>{s}</li>))}
          </ul>
          <div className="text-sm font-medium">Career Paths</div>
          <div className="grid gap-2">
            {(advice.careerPaths || []).map((c: CareerPath, i: number) => (
              <div key={i} className="border rounded-md p-2 text-sm space-y-1">
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.why}</div>
                {Array.isArray(c.requiredSkills) && c.requiredSkills.length > 0 && (
                  <div className="text-xs">Skills: {c.requiredSkills.join(', ')}</div>
                )}
                {Array.isArray(c.sampleUniversities) && c.sampleUniversities.length > 0 && (
                  <div className="text-xs">Universities: {c.sampleUniversities.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm font-medium">Roadmap</div>
          <div className="grid sm:grid-cols-3 gap-2 text-sm">
            <div>
              <div className="font-medium text-xs">Next 3 Months</div>
              <div className="border rounded-md p-2 whitespace-pre-wrap min-h-16">{(advice.roadmap?.next3Months || []).join('\n')}</div>
            </div>
            <div>
              <div className="font-medium text-xs">Next Year</div>
              <div className="border rounded-md p-2 whitespace-pre-wrap min-h-16">{(advice.roadmap?.nextYear || []).join('\n')}</div>
            </div>
            <div>
              <div className="font-medium text-xs">Resources</div>
              <div className="border rounded-md p-2 whitespace-pre-wrap min-h-16">{(advice.roadmap?.resources || []).join('\n')}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
