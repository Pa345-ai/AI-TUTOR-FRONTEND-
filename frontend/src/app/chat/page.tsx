"use client";

import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { chat, fetchChatHistory, streamChat, postEngagement, translate, adaptiveNext, adaptiveGrade, addMemoryPin, addMemoryRedaction, fetchDueReviews, fetchMemory, summarizeMemory, retrieveMemory } from "@/lib/api";
import { preferLocalInference, preferLocalQA as preferLocalQAFlag, tryLocalQA } from "@/lib/local-inference";
import { queryLocalQa } from "@/lib/offline-qa";
import { localTutorReply } from "@/lib/offline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { CodeRunner } from "@/components/CodeRunner";
import { saveConversation, loadConversation, deleteConversation, getActiveConversationId, setActiveConversationId } from "@/lib/storage";
import { Mic, Volume2, PencilLine, Eraser, Download, Radio, FlaskConical } from "lucide-react";
import { ttsStream } from "@/lib/api";
import { grades, getSubjects } from "@/lib/syllabus";

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

type WhiteboardHandle = { autoDraw: (text: string) => Promise<void>; setBackground?: (dataUrl: string) => void };

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [attachments, setAttachments] = useState<Record<string, string[]>>({});
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  // removed unused lastFailed state
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [userId, setUserId] = useState("123");
  const [language, setLanguage] = useState<"en" | "si" | "ta">("en");
  const [mode, setMode] = useState<"socratic" | "exam" | "friendly" | "motivational">("friendly");
  const [level, setLevel] = useState<"eli5" | "normal" | "expert">("normal");
  const [personaSocratic, setPersonaSocratic] = useState<number>(50);
  const [personaStrictness, setPersonaStrictness] = useState<number>(20);
  const [personaEncouragement, setPersonaEncouragement] = useState<number>(70);
  // Preset manager
  const [presetName, setPresetName] = useState<string>("");
  const [presetList, setPresetList] = useState<string[]>([]);
  const personaBySubjectRef = useRef<Record<string, { mode: typeof mode; level: typeof level; personaSocratic: number; personaStrictness: number; personaEncouragement: number }>>({});
  const [subject, setSubject] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [curriculum, setCurriculum] = useState<"lk" | "international">("lk");
  const [translateTo, setTranslateTo] = useState<""|"en"|"si"|"ta"|"hi"|"zh">("");
  const [engagement, setEngagement] = useState<{ attention: number; frustration: number; cameraEnabled: boolean }>({ attention: 50, frustration: 0, cameraEnabled: false });
  const [engagementEnabled, setEngagementEnabled] = useState(false);
  const [showCameraConsent, setShowCameraConsent] = useState(false);
  const [cameraConsent, setCameraConsent] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('cameraConsent') === 'true';
    }
    return false;
  });
  const [cameraPermission, setCameraPermission] = useState<"prompt" | "granted" | "denied" | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const [sttSupported, setSttSupported] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return window.localStorage.getItem('cameraDeviceId');
    return null;
  });
  const [selectedMicId, setSelectedMicId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') return window.localStorage.getItem('micDeviceId');
    return null;
  });
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const previewStreamRef = useRef<MediaStream | null>(null);
  const micTestStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const micAnalyserRef = useRef<AnalyserNode | null>(null);
  const micLevelTimerRef = useRef<number | null>(null);
  const [micLevel, setMicLevel] = useState(0);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // Voice Tutor mode
  const [voiceTutorOn, setVoiceTutorOn] = useState(false);
  const [voiceName, setVoiceName] = useState<string>("");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  type SR = { lang: string; interimResults?: boolean; maxAlternatives?: number; onresult?: (e: { results: ArrayLike<{ 0: { transcript: string } }> }) => void; onend?: () => void; onerror?: () => void; start: () => void; stop?: () => void };
  const recRef = useRef<SR | null>(null);
  const speakingRef = useRef<boolean>(false);
  // Quick practice state
  const [qpTopic, setQpTopic] = useState<string>("");
  const [qpLoading, setQpLoading] = useState(false);
  const [qpQ, setQpQ] = useState<{ question: string; options: string[] } | null>(null);
  const [qpPick, setQpPick] = useState<number | null>(null);
  const [qpInfo, setQpInfo] = useState<string>("");
  type FaceBox = { x: number; y: number; width: number; height: number; left?: number; top?: number };
  type FaceDetection = { boundingBox?: FaceBox; boundingClientRect?: FaceBox };
  type FaceDetectorLike = { detect(input: HTMLVideoElement | HTMLCanvasElement | ImageBitmap): Promise<FaceDetection[]> };
  const detectorRef = useRef<FaceDetectorLike | null>(null);
  const detectTimerRef = useRef<number | null>(null);
  const lastCenterRef = useRef<{ x: number; y: number } | null>(null);
  const stillCounterRef = useRef<number>(0);
  type MeshLandmark = { x: number; y: number; z?: number };
  type MeshResults = { multiFaceLandmarks?: MeshLandmark[][] };
  type FaceMeshLike = {
    setOptions(opts: {
      maxNumFaces?: number;
      refineLandmarks?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;
    onResults(cb: (r: MeshResults) => void): void;
    send(input: { image: HTMLVideoElement | HTMLCanvasElement | ImageBitmap }): Promise<void>;
    close?: () => void;
  };
  const faceMeshRef = useRef<FaceMeshLike | null>(null);
  const meshTimerRef = useRef<number | null>(null);
  // Memory refresher
  const [dueReviews, setDueReviews] = useState<Array<{ topic: string; subject?: string|null; nextReviewDate?: string|null }>>([]);
  const [memorySummary, setMemorySummary] = useState<string>("");
  const [showRefresher, setShowRefresher] = useState<boolean>(true);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
  }, [messages]);

  // Persist the active conversation (single session id for now)
  useEffect(() => {
    const id = getActiveConversationId() ?? "current";
    if (messages.length === 0) return;
    saveConversation(id, messages);
  }, [messages]);

  // Load existing conversation and user id on mount
  useEffect(() => {
    const id = getActiveConversationId() ?? "current";
    setActiveConversationId(id);
    const saved = loadConversation(id);
    if (saved.length > 0) setMessages(saved);
    if (typeof window !== "undefined") {
      const storedUserId = window.localStorage.getItem("userId");
      if (storedUserId) setUserId(storedUserId);
      const storedLanguage = window.localStorage.getItem("language");
      if (storedLanguage === "en" || storedLanguage === "si" || storedLanguage === "ta") setLanguage(storedLanguage);
      const storedMode = window.localStorage.getItem("mode");
      if (storedMode === "socratic" || storedMode === "exam" || storedMode === "friendly" || storedMode === "motivational") setMode(storedMode);
      const storedLevel = window.localStorage.getItem("level");
      if (storedLevel === "eli5" || storedLevel === "normal" || storedLevel === "expert") setLevel(storedLevel);
      const defaultSubject = window.localStorage.getItem("defaultSubject");
      if (defaultSubject) setSubject(defaultSubject);
      const defaultGrade = window.localStorage.getItem("defaultGrade");
      if (defaultGrade) setGrade(defaultGrade);
      const defaultCurr = window.localStorage.getItem("defaultCurriculum");
      if (defaultCurr === "lk" || defaultCurr === "international") setCurriculum(defaultCurr);
      const ps = window.localStorage.getItem('personaSocratic'); if (ps) setPersonaSocratic(parseInt(ps));
      const pst = window.localStorage.getItem('personaStrictness'); if (pst) setPersonaStrictness(parseInt(pst));
      const pe = window.localStorage.getItem('personaEncouragement'); if (pe) setPersonaEncouragement(parseInt(pe));
      const enabled = window.localStorage.getItem("cameraEnabled");
      if (enabled === 'true') setEngagement((e) => ({ ...e, cameraEnabled: true }));
      // Track permission state if supported
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const perms = (navigator as any).permissions;
        if (perms?.query) {
          perms.query({ name: 'camera' as PermissionName }).then((p: PermissionStatus) => {
            setCameraPermission(p.state as "prompt"|"granted"|"denied");
            p.onchange = () => setCameraPermission(p.state as "prompt"|"granted"|"denied");
          }).catch(() => {});
        }
      } catch {}
      // Load memory refresher
      try { const due = await fetchDueReviews(storedUserId || '123', 10); setDueReviews(due || []); } catch {}
      try { const m = await fetchMemory(storedUserId || '123', 'daily'); setMemorySummary(m?.memory?.summary || ""); } catch {}
      // Detect Web Speech STT support
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const w = window as any;
        setSttSupported(!!(w.SpeechRecognition || w.webkitSpeechRecognition));
      } catch {}
      // Emotion/affect consent log bootstrap
      try { const consent = window.localStorage.getItem('cameraConsent'); if (consent === 'true') { await fetch(`${process.env.NEXT_PUBLIC_BASE_URL!}/api/consent`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: storedUserId || '123', feature: 'emotion', granted: true }) }); } } catch {}
      // Load TTS voices
      try {
        if ('speechSynthesis' in window) {
          const loadVoices = () => {
            const vs = window.speechSynthesis.getVoices();
            setVoices(vs);
            if (!voiceName && vs.length > 0) setVoiceName(vs[0].name);
          };
          window.speechSynthesis.onvoiceschanged = loadVoices;
          loadVoices();
        }
      } catch {}
      // Load persona presets list
      try { const raw = window.localStorage.getItem('personaPresets'); if (raw) setPresetList(Object.keys(JSON.parse(raw))); } catch {}
      // Load devices list
      if (navigator.mediaDevices?.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then(setDevices).catch(() => {});
        navigator.mediaDevices.addEventListener('devicechange', () => {
          navigator.mediaDevices.enumerateDevices().then(setDevices).catch(() => {});
        });
      }
      try { const map = JSON.parse(window.localStorage.getItem('personaBySubject') || '{}'); if (map && typeof map === 'object') personaBySubjectRef.current = map; } catch {}
    }
    // Also try to load server history if we have a userId (defaults to "123")
    const uid = typeof window !== "undefined" ? window.localStorage.getItem("userId") || "123" : "123";
    fetchChatHistory(uid)
      .then((msgs) => {
        if (msgs.length > 0) {
          const loaded = msgs.map((m) => ({ id: crypto.randomUUID(), role: m.role, content: m.content }));
          setMessages(loaded);
        }
      })
      .catch(() => {
        // ignore history fetch errors
      });
  }, [voiceName]);

  // Persist persona per subject and load on subject change
  useEffect(() => {
    if (!subject) return;
    const map = personaBySubjectRef.current || {};
    const ps = map[subject];
    if (ps) {
      setMode(ps.mode);
      setLevel(ps.level);
      setPersonaSocratic(ps.personaSocratic);
      setPersonaStrictness(ps.personaStrictness);
      setPersonaEncouragement(ps.personaEncouragement);
    } else {
      // save current as default for this subject
      map[subject] = { mode, level, personaSocratic, personaStrictness, personaEncouragement };
      personaBySubjectRef.current = map;
      try { window.localStorage.setItem('personaBySubject', JSON.stringify(map)); } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  useEffect(() => {
    if (!subject) return;
    const map = personaBySubjectRef.current || {};
    map[subject] = { mode, level, personaSocratic, personaStrictness, personaEncouragement };
    personaBySubjectRef.current = map;
    try { window.localStorage.setItem('personaBySubject', JSON.stringify(map)); } catch {}
  }, [subject, mode, level, personaSocratic, personaStrictness, personaEncouragement]);

  const getVideoConstraints = useCallback(() => ({
    video: selectedCameraId ? { deviceId: { exact: selectedCameraId } } : { facingMode: 'user' as const },
    audio: false as const,
  }), [selectedCameraId]);

  // Engagement tracker (keyboard/mouse activity + optional camera toggle only; no image upload)
  useEffect(() => {
    const update = () => {
      setEngagement((e) => {
        const att = Math.min(100, Math.max(0, e.attention + 5));
        const fr = Math.max(0, e.frustration - 2);
        return { ...e, attention: att, frustration: fr };
      });
    };
    const decay = setInterval(() => {
      setEngagement((e) => ({ ...e, attention: Math.max(0, e.attention - 1) }));
    }, 2000);
    const onMove = () => update();
    const onKey = () => update();
    window.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    return () => {
      clearInterval(decay);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    if (!engagementEnabled) return;
    const t = setInterval(() => {
      void postEngagement({ userId, attention: engagement.attention, frustration: engagement.frustration, cameraEnabled: engagement.cameraEnabled });
    }, 5000);
    return () => clearInterval(t);
  }, [engagementEnabled, userId, engagement.attention, engagement.frustration, engagement.cameraEnabled]);

  // Webcam face presence detection (Shape Detection API) to refine attention/frustration
  useEffect(() => {
    const effectVideo = videoRef.current;
    const run = async () => {
      if (!engagement.cameraEnabled) return;
      try {
        const localVideo = videoRef.current;
        if (!localVideo) return;
        // start camera
        const localStream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
        localVideo.srcObject = localStream;
        await localVideo.play().catch(() => {});
        // init FaceDetector if available
        const FD = (window as unknown as { FaceDetector?: new (opts?: { fastMode?: boolean }) => FaceDetectorLike }).FaceDetector;
        if (FD && !detectorRef.current) detectorRef.current = new FD({ fastMode: true });
        if (detectorRef.current) {
          // Native FaceDetector path
          const detectLoop = async () => {
            if (!videoRef.current || !detectorRef.current) return;
            try {
              const faces = await detectorRef.current.detect(videoRef.current);
              const face = faces?.[0];
              if (!face) {
                setEngagement((e) => ({ ...e, attention: Math.max(0, e.attention - 3), frustration: Math.min(100, e.frustration + 2) }));
                lastCenterRef.current = null;
              } else {
                const box = face.boundingBox ?? face.boundingClientRect;
                if (box) {
                  const cx = (box.x ?? box.left ?? 0) + (box.width ?? 0) / 2;
                  const cy = (box.y ?? box.top ?? 0) + (box.height ?? 0) / 2;
                  const prev = lastCenterRef.current;
                  lastCenterRef.current = { x: cx, y: cy };
                  if (prev) {
                    const dx = Math.abs(cx - prev.x);
                    const dy = Math.abs(cy - prev.y);
                    const moved = Math.sqrt(dx * dx + dy * dy);
                    if (moved < 5) {
                      stillCounterRef.current += 1;
                    } else {
                      stillCounterRef.current = 0;
                    }
                  }
                }
                setEngagement((e) => ({
                  ...e,
                  attention: Math.min(100, e.attention + 2),
                  frustration: Math.max(0, e.frustration - (stillCounterRef.current > 10 ? 0 : 1)),
                }));
              }
            } catch {
              // ignore
            }
          };
          const tick = async () => {
            await detectLoop();
            detectTimerRef.current = window.setTimeout(tick, 2000);
          };
          tick();
        } else {
          // Fallback: load MediaPipe FaceMesh from CDN and detect landmarks
          const loadScript = (src: string) =>
            new Promise<void>((resolve, reject) => {
              const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null;
              if (existing) {
                if (existing.getAttribute('data-loaded') === 'true') return resolve();
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', () => reject(new Error('script load error')));
                return;
              }
              const s = document.createElement('script');
              s.src = src;
              s.async = true;
              s.crossOrigin = 'anonymous';
              s.addEventListener('load', () => {
                s.setAttribute('data-loaded', 'true');
                resolve();
              });
              s.addEventListener('error', () => reject(new Error('script load error')));
              document.head.appendChild(s);
            });
          const base = 'https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh';
          await loadScript(`${base}/face_mesh.js`);
          type FaceMeshGlobal = { FaceMesh?: new (init: { locateFile: (path: string) => string }) => FaceMeshLike };
          const FaceMeshCtor = (window as unknown as FaceMeshGlobal).FaceMesh;
          if (!FaceMeshCtor) return;
          const faceMesh = new FaceMeshCtor({ locateFile: (path) => `${base}/${path}` });
          faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: false, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
          faceMesh.onResults((res: MeshResults) => {
            const face = res.multiFaceLandmarks?.[0];
            if (!face || face.length === 0) {
              setEngagement((e) => ({ ...e, attention: Math.max(0, e.attention - 3), frustration: Math.min(100, e.frustration + 2) }));
              lastCenterRef.current = null;
              return;
            }
            let minX = 1, minY = 1, maxX = 0, maxY = 0;
            for (const lm of face) {
              if (lm.x < minX) minX = lm.x;
              if (lm.y < minY) minY = lm.y;
              if (lm.x > maxX) maxX = lm.x;
              if (lm.y > maxY) maxY = lm.y;
            }
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const prev = lastCenterRef.current;
            lastCenterRef.current = { x: cx, y: cy };
            if (prev) {
              const dx = Math.abs(cx - prev.x);
              const dy = Math.abs(cy - prev.y);
              const moved = Math.sqrt(dx * dx + dy * dy);
              if (moved < 0.01) {
                stillCounterRef.current += 1;
              } else {
                stillCounterRef.current = 0;
              }
            }
            setEngagement((e) => ({
              ...e,
              attention: Math.min(100, e.attention + 2),
              frustration: Math.max(0, e.frustration - (stillCounterRef.current > 10 ? 0 : 1)),
            }));
          });
          faceMeshRef.current = faceMesh;
          const meshTick = async () => {
            const vid = videoRef.current;
            const mesh = faceMeshRef.current;
            if (!vid || !mesh) return;
            try {
              await mesh.send({ image: vid });
            } catch {
              // ignore
            }
            meshTimerRef.current = window.setTimeout(meshTick, 2000);
          };
          meshTick();
        }
      } catch {
        // camera disabled or permission denied
      }
    };
    run();
    return () => {
      if (detectTimerRef.current) {
        clearTimeout(detectTimerRef.current);
        detectTimerRef.current = null;
      }
      const localVideo = effectVideo;
      const src = localVideo?.srcObject as MediaStream | null | undefined;
      if (src) {
        src.getTracks().forEach((t) => t.stop());
        if (localVideo) localVideo.srcObject = null;
      }
      if (meshTimerRef.current) {
        clearTimeout(meshTimerRef.current);
        meshTimerRef.current = null;
      }
      if (faceMeshRef.current && faceMeshRef.current.close) {
        try { faceMeshRef.current.close(); } catch { /* noop */ }
        faceMeshRef.current = null;
      }
      lastCenterRef.current = null;
      stillCounterRef.current = 0;
    };
  }, [engagement.cameraEnabled, getVideoConstraints]);

  const requestCameraPreflight = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia(getVideoConstraints());
      // stop immediately (useEffect will restart hidden video when enabled)
      stream.getTracks().forEach((t) => t.stop());
      setEngagement((e) => ({ ...e, cameraEnabled: true }));
      if (typeof window !== 'undefined') window.localStorage.setItem('cameraEnabled', 'true');
    } catch (err) {
      setEngagement((e) => ({ ...e, cameraEnabled: false }));
      if (typeof window !== 'undefined') window.localStorage.setItem('cameraEnabled', 'false');
      const msg = err instanceof Error ? err.message : 'Permission denied or unavailable';
      setCameraError(msg);
    }
  }, [getVideoConstraints]);

  const onToggleCamera = useCallback(async () => {
    if (!engagement.cameraEnabled) {
      if (!cameraConsent) {
        setShowCameraConsent(true);
        return;
      }
      await requestCameraPreflight();
    } else {
      setEngagement((e) => ({ ...e, cameraEnabled: false }));
      if (typeof window !== 'undefined') window.localStorage.setItem('cameraEnabled', 'false');
    }
  }, [engagement.cameraEnabled, cameraConsent, requestCameraPreflight]);

  const addToast = useCallback((text: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  // Persist input draft offline
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('chatDraft');
    if (saved && !input) setInput(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem('chatDraft', input); } catch {}
  }, [input]);
  const canSend = useMemo(() => input.trim().length > 0 && !isSending, [input, isSending]);
  // Autosave draft
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = window.localStorage.getItem('chatDraft');
    if (saved) setInput(saved);
  }, []);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const t = setTimeout(() => {
      try { window.localStorage.setItem('chatDraft', input); } catch {}
    }, 200);
    return () => clearTimeout(t);
  }, [input]);

  // Voice Tutor helpers
  type SpeechRecognitionType = new () => SR;
  const getSpeechRecognition = useCallback((): SpeechRecognitionType | null => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const w = window as any;
      return (w.SpeechRecognition || w.webkitSpeechRecognition) as SpeechRecognitionType | null;
    } catch { return null; }
  }, []);

  const localeFor = useCallback((l: "en"|"si"|"ta"): string => {
    if (l === 'si') return 'si-LK';
    if (l === 'ta') return 'ta-IN';
    return 'en-US';
  }, []);

  const speak = useCallback(async (text: string) => {
    if (typeof window === 'undefined') return;
    // Respect global voice toggle
    try { if (window.localStorage.getItem('mm_voice') === 'false') return; } catch {}
    speakingRef.current = true;
    // Prefer server neural TTS; fallback to Web Speech
    try {
      const stream = await ttsStream(text, voiceName || undefined);
      const reader = (stream as any).getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { value, done } = await reader.read(); if (done) break; if (value) chunks.push(value);
      }
      const blob = new Blob(chunks, { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      await new Audio(url).play().catch(()=>{});
      URL.revokeObjectURL(url);
    } catch {
      if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') { speakingRef.current = false; return; }
      await new Promise<void>((resolve) => {
        const utter = new SpeechSynthesisUtterance(text);
        // Tone/pace adaptation based on engagement state
        try {
          const tone = (typeof window !== 'undefined' ? window.localStorage.getItem('engagementTone') : null) || 'neutral';
          if (tone === 'calm') { utter.rate = 0.9; utter.pitch = 1.0; }
          else if (tone === 'energetic') { utter.rate = 1.15; utter.pitch = 1.05; }
          else if (tone === 'soothing') { utter.rate = 0.85; utter.pitch = 0.95; }
        } catch {}
        if (voiceName && voices.length > 0) {
          const pick = voices.find(v => v.name === voiceName);
          if (pick) utter.voice = pick;
        }
        utter.onend = () => { resolve(); };
        utter.onerror = () => { resolve(); };
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
      });
    } finally {
      speakingRef.current = false;
    }
  }, [voiceName, voices]);

  const stopRecognition = useCallback(() => {
    try { recRef.current?.stop?.(); } catch {}
    recRef.current = null;
  }, []);

  const attachToMessage = useCallback((id: string, dataUrl: string) => {
    setAttachments((prev) => {
      const list = prev[id] ? [...prev[id], dataUrl] : [dataUrl];
      return { ...prev, [id]: list };
    });
  }, []);

  const generateDiagramFromText = useCallback(async (text: string): Promise<string> => {
    const canvas = document.createElement('canvas');
    const width = 1024;
    const height = 768;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, width, height);
    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textBaseline = 'top';
    const lines = text.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean).slice(0, 8);
    const nodes = lines.length > 0 ? lines : ['Key idea', 'Step 1', 'Step 2', 'Conclusion'];
    const nodeWidth = Math.min(900, Math.floor(width * 0.85));
    const marginX = Math.floor((width - nodeWidth) / 2);
    const nodeHeight = 80;
    const gap = 20;
    const startY = Math.floor((height - nodes.length * (nodeHeight + gap) + gap) / 2);
    const wrapText = (t: string, maxWidth: number): string[] => {
      const words = t.split(/\s+/);
      const lines: string[] = [];
      let cur = '';
      for (const w of words) {
        const test = (cur ? cur + ' ' : '') + w;
        if (ctx.measureText(test).width > maxWidth) {
          if (cur) lines.push(cur);
          cur = w;
        } else {
          cur = test;
        }
      }
      if (cur) lines.push(cur);
      return lines.slice(0, 3);
    };
    nodes.forEach((n, i) => {
      const y = startY + i * (nodeHeight + gap);
      // box
      ctx.fillStyle = i === 0 ? '#2563EB' : i === nodes.length - 1 ? '#16A34A' : '#334155';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      const radius = 10;
      const x = marginX;
      const w = nodeWidth;
      const h = nodeHeight;
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + w - radius, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
      ctx.lineTo(x + w, y + h - radius);
      ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      ctx.lineTo(x + radius, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // text
      ctx.fillStyle = '#FFFFFF';
      const textLines = wrapText(n, w - 24);
      const lineH = 20 + 4;
      const textTotalH = textLines.length * lineH;
      let ty = y + (h - textTotalH) / 2;
      for (const ln of textLines) {
        ctx.fillText(ln, x + 12, ty);
        ty += lineH;
      }
      // arrows
      if (i < nodes.length - 1) {
        const ax = x + w / 2;
        const ay = y + h;
        const by = y + h + gap;
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ax, ay + 2);
        ctx.lineTo(ax, by - 2);
        ctx.stroke();
        // arrow head
        ctx.beginPath();
        ctx.moveTo(ax - 6, by - 6);
        ctx.lineTo(ax, by);
        ctx.lineTo(ax + 6, by - 6);
        ctx.stroke();
      }
    });
    return canvas.toDataURL('image/png');
  }, []);

  const visualizeMessage = useCallback(async (id: string, content: string) => {
    try {
      // Respect global diagram toggle
      try { if (window.localStorage.getItem('mm_diagram') === 'false') return; } catch {}
      const url = await generateDiagramFromText(content);
      if (url) attachToMessage(id, url);
    } catch {}
  }, [generateDiagramFromText, attachToMessage]);

  const whiteboardRef = useRef<WhiteboardHandle | null>(null);

  const voiceSend = useCallback(async (text: string) => {
    // mirror sendMessage but capture final text and auto-TTS
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMessage]);
    try {
      const forceLocal = preferLocalQAFlag() || preferLocalInference();
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      if (forceLocal || offline) {
        // Local QA over offline corpus (best-effort)
        let context = '';
        try {
          // augment with server vector store if reachable
          const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
          const mem = await retrieveMemory({ userId: uid, surface: 'chat', query: trimmed, k: 5 }).catch(()=>({ items: [] }));
          const localHits = await queryLocalQa(trimmed, 5).catch(()=>[]);
          const all = [...(mem.items||[]).map(i=>i.text), ...localHits.map(h=>h.text)];
          context = all.slice(0,8).join('\n\n');
        } catch {}
        const r = await tryLocalQA(trimmed, context);
        const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: r.answer };
        setMessages(prev => [...prev, assistantMessage]);
        await speak(r.answer);
        return;
      }
      let assembled = "";
      for await (const chunk of streamChat({ userId, message: trimmed, language, mode, level })) {
        assembled += chunk;
        const partial: Message = { id: 'voice-stream', role: 'assistant', content: assembled };
        setMessages(prev => {
          const without = prev.filter(m => m.id !== 'voice-stream');
          return [...without, partial];
        });
      }
      // finalize
      setMessages(prev => prev.map(m => (m.id === 'voice-stream' ? { ...m, id: crypto.randomUUID() } : m)));
      await speak(assembled);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Voice flow error';
      const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: `Error: ${errorText}` };
      setMessages(prev => [...prev, assistantMessage]);
    }
  }, [userId, language, mode, level, speak]);

  const startRecognition = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) return false;
    try {
      const rec = new Ctor();
      rec.lang = localeFor(language);
      // Enable partial results
      try { (rec as unknown as { interimResults?: boolean }).interimResults = true; } catch {}
      try { (rec as unknown as { maxAlternatives?: number }).maxAlternatives = 1; } catch {}
      // Barge-in: cancel any ongoing TTS
      try { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel(); } catch {}
      rec.onresult = async (event: any) => {
        try {
          const results: SpeechRecognitionResultList = event.results;
          const idx = results.length - 1;
          const res: any = results[idx];
          const transcript = (res && res[0] && res[0].transcript) ? String(res[0].transcript) : '';
          if (!transcript) return;
          // show partial in input
          setInput(transcript);
          // if final, send
          if ((res && typeof res.isFinal === 'boolean' && res.isFinal) || transcript.endsWith('.')) {
            await voiceSend(transcript);
            setInput('');
          }
        } catch {}
      };
      rec.onend = () => {
        if (voiceTutorOn && !speakingRef.current) {
          try { rec.start(); } catch {}
        }
      };
      rec.onerror = () => {
        try { rec.start(); } catch {}
      };
      recRef.current = rec as unknown as SR;
      rec.start();
      return true;
    } catch { return false; }
  }, [getSpeechRecognition, localeFor, language, voiceTutorOn, voiceSend]);

  useEffect(() => {
    if (!voiceTutorOn) {
      stopRecognition();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch {}
      }
      return;
    }
    // Start listening loop
    const ok = startRecognition();
    if (!ok) {
      setVoiceTutorOn(false);
      addToast('Voice recognition not supported in this browser.');
    }
    return () => { stopRecognition(); };
  }, [voiceTutorOn, startRecognition, stopRecognition, addToast]);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    if (typeof window !== 'undefined') try { window.localStorage.removeItem('chatDraft'); } catch {}
    setIsSending(true);
    try {
      const forceLocal = preferLocalQAFlag() || preferLocalInference();
      const offline = typeof navigator !== 'undefined' && !navigator.onLine;
      if (forceLocal || offline) {
        // Local QA path
        let context = '';
        try {
          const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
          const mem = await retrieveMemory({ userId: uid, surface: 'chat', query: trimmed, k: 5 }).catch(()=>({ items: [] }));
          const localHits = await queryLocalQa(trimmed, 5).catch(()=>[]);
          const all = [...(mem.items||[]).map(i=>i.text), ...localHits.map(h=>h.text)];
          context = all.slice(0,8).join('\n\n');
        } catch {}
        const r = await tryLocalQA(trimmed, context);
        const assistantMessage: Message = { id: crypto.randomUUID(), role: 'assistant', content: r.answer };
        setMessages((prev) => [...prev, assistantMessage]);
        return;
      }
      // streaming path
      let assembled = "";
      const spokenUpToRef = { current: 0 } as { current: number };
      for await (const chunk of streamChat({ userId, message: trimmed, language, mode, level })) {
        assembled += chunk;
        const partial: Message = { id: "stream", role: "assistant", content: assembled };
        setMessages((prev) => {
          const withoutStream = prev.filter((m) => m.id !== "stream");
          return [...withoutStream, partial];
        });
        // Low-latency TTS: speak complete sentences as they stream in
        try {
          if (typeof window !== 'undefined' && 'speechSynthesis' in window && voiceTutorOn) {
            const upto = assembled.lastIndexOf('.') + 1 || assembled.lastIndexOf('!') + 1 || assembled.lastIndexOf('?') + 1;
            if (upto > spokenUpToRef.current) {
              const seg = assembled.slice(spokenUpToRef.current, upto).trim();
              if (seg) {
                // cancel queued to reduce lag (barge-in TTS)
                window.speechSynthesis.cancel();
                void speak(seg);
              }
              spokenUpToRef.current = upto;
            }
          }
        } catch {}
      }
      // finalize stream message id
      let finalText = assembled;
      if (translateTo) {
        try {
          const t = await translate(assembled, translateTo);
          finalText = t.text || assembled;
        } catch {}
      }
      setMessages((prev) => prev.map((m) => (m.id === "stream" ? { ...m, id: crypto.randomUUID(), content: finalText } : m)));
      // create a small practice suggestion
      const short = assembled.replace(/\s+/g, ' ').slice(0, 120);
      setSuggestion(`Practice now: ${subject || 'subject'} • ${short}`);
    } catch (err: unknown) {
      const errorText = err instanceof Error ? err.message : "Something went wrong";
      // Offline/local fallback tutor reply
      const fallback = localTutorReply(trimmed, { mode, level, subject, grade });
      const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
      const content = isOffline ? fallback : `Error: ${errorText}\n\nLocal guidance:\n${fallback}`;
      const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsSending(false);
    }
  }, [input, userId, language, mode, level, subject, grade, translateTo]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) void sendMessage();
      }
    },
    [canSend, sendMessage]
  );

  const retryLast = useCallback(async () => {
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser) return;
    setInput(lastUser.content);
    await sendMessage();
  }, [messages, sendMessage]);

  const copyLastAnswer = useCallback(async () => {
    const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
    if (!lastAssistant || !navigator.clipboard) return;
    await navigator.clipboard.writeText(lastAssistant.content);
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    deleteConversation("current");
  }, []);

  const transcriptText = useMemo(() => {
    return messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n");
  }, [messages]);

  const downloadTranscript = useCallback(() => {
    const blob = new Blob([transcriptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-tutor-chat-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [transcriptText]);

  const exportToDocs = useCallback(async () => {
    if (navigator.clipboard) await navigator.clipboard.writeText(transcriptText);
    window.open("https://docs.new", "_blank");
  }, [transcriptText]);

  const exportToQuizlet = useCallback(async () => {
    // Simple placeholder: copy transcript; user can paste into Quizlet import
    if (navigator.clipboard) await navigator.clipboard.writeText(transcriptText);
    window.open("https://quizlet.com/create-set", "_blank");
  }, [transcriptText]);

  return (
    <div className="mx-auto max-w-3xl w-full flex flex-col h-[calc(100svh-4rem)] gap-2 py-4 px-3 sm:px-4">
      <h1 className="text-xl font-semibold flex items-center gap-2">AI Tutor Chat {(() => {
        // Show visible A/B variant badge if present in localStorage
        try { const v = typeof window !== 'undefined' ? window.localStorage.getItem('ab:adaptive-strategy') : null; if (v === 'A' || v === 'B') return (<span className={`text-[10px] px-1.5 py-0.5 rounded border ${v==='A'?'bg-green-50 border-green-200 text-green-700':'bg-purple-50 border-purple-200 text-purple-700'}`}>Variant {v}</span>); } catch {}
      })()}</h1>
      <div className="flex flex-col gap-2">
        <div className="text-xs text-muted-foreground">Mode: <span className="capitalize">{mode}</span> • Level: <span className="uppercase">{level}</span> • Lang: <span className="uppercase">{language}</span></div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Lang</span>
            {(["en","si","ta"] as const).map((l) => (
              <Button
                key={l}
                variant={language === l ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setLanguage(l);
                  if (typeof window !== "undefined") window.localStorage.setItem("language", l);
                }}
              >{l.toUpperCase()}</Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Translate</span>
            {(["", "en","si","ta","hi","zh"] as const).map((l) => (
              <Button
                key={l||'none'}
                variant={translateTo === l ? "default" : "outline"}
                size="sm"
                onClick={() => setTranslateTo(l)}
              >{l ? l.toUpperCase() : 'OFF'}</Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Mode</span>
            {(["friendly","socratic","exam","motivational"] as const).map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setMode(m);
                  if (typeof window !== "undefined") window.localStorage.setItem("mode", m);
                }}
              >{m.charAt(0).toUpperCase() + m.slice(1)}</Button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground mr-1">Level</span>
            {(["eli5","normal","expert"] as const).map((v) => (
              <Button
                key={v}
                variant={level === v ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setLevel(v);
                  if (typeof window !== "undefined") window.localStorage.setItem("level", v);
                }}
              >{v.toUpperCase()}</Button>
            ))}
          </div>
        <div className="flex items-center gap-2">
            <select className="h-9 px-2 border rounded-md text-sm" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option value="">Subject</option>
              {getSubjects(curriculum).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select className="h-9 px-2 border rounded-md text-sm w-24" value={grade} onChange={(e) => setGrade(e.target.value)}>
              <option value="">Grade</option>
              {grades.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-xs text-muted-foreground mr-1">Curriculum</span>
              {(["lk", "international"] as const).map((c) => (
                <Button key={c} variant={curriculum === c ? "default" : "outline"} size="sm" onClick={() => setCurriculum(c)}>
                  {c === "lk" ? "Sri Lanka" : "International"}
                </Button>
              ))}
            </div>
          </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span>Persona</span>
            <label className="flex items-center gap-1">Socratic <input type="range" min={0} max={100} value={personaSocratic} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaSocratic(v); try { window.localStorage.setItem('personaSocratic', String(v)); } catch {} }} /></label>
            <label className="flex items-center gap-1">Strict <input type="range" min={0} max={100} value={personaStrictness} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaStrictness(v); try { window.localStorage.setItem('personaStrictness', String(v)); } catch {} }} /></label>
            <label className="flex items-center gap-1">Encourage <input type="range" min={0} max={100} value={personaEncouragement} onChange={(e)=>{ const v=parseInt(e.target.value); setPersonaEncouragement(v); try { window.localStorage.setItem('personaEncouragement', String(v)); } catch {} }} /></label>
            <input className="h-7 px-2 border rounded-md text-xs" placeholder="Preset name" value={presetName} onChange={(e)=>setPresetName(e.target.value)} />
            <Button size="sm" variant="outline" onClick={()=>{
              if (!presetName.trim()) return;
              const map = { mode, level, personaSocratic, personaStrictness, personaEncouragement };
              try {
                const raw = window.localStorage.getItem('personaPresets');
                const obj = raw ? JSON.parse(raw) : {};
                obj[presetName.trim()] = map; window.localStorage.setItem('personaPresets', JSON.stringify(obj));
                setPresetList(Object.keys(obj));
              } catch {}
            }}>Save preset</Button>
            <select className="h-7 px-2 border rounded-md text-xs" value={''} onChange={(e)=>{
              const key = e.target.value; if (!key) return; try { const raw = window.localStorage.getItem('personaPresets'); const obj = raw ? JSON.parse(raw) : {}; const p = obj[key]; if (p) { setMode(p.mode); setLevel(p.level); setPersonaSocratic(p.personaSocratic); setPersonaStrictness(p.personaStrictness); setPersonaEncouragement(p.personaEncouragement); } } catch {}
              e.currentTarget.value='';
            }}>
              <option value="">Load preset…</option>
              {presetList.map(n => (<option key={n} value={n}>{n}</option>))}
            </select>
          </div>
          <div className="flex items-center gap-2 mr-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1"><Radio className="h-3 w-3" /> Voice tutor</label>
            <Button size="sm" variant={voiceTutorOn ? 'default' : 'outline'} onClick={() => setVoiceTutorOn(v => !v)}>
              {voiceTutorOn ? 'On' : 'Off'}
            </Button>
            <select className="h-9 px-2 border rounded-md text-sm" value={voiceName} onChange={(e)=>setVoiceName(e.target.value)}>
              {voices.length === 0 ? <option value="">Default</option> : voices.map((v, i) => (
                <option key={`${v.name}-${i}`} value={v.name}>{v.name} {v.lang ? `(${v.lang})` : ''}</option>
              ))}
            </select>
          </div>
            <label className="text-xs text-muted-foreground">Engagement</label>
            <Button size="sm" variant={engagementEnabled ? "default" : "outline"} onClick={() => setEngagementEnabled((v) => !v)}>
              {engagementEnabled ? "On" : "Off"}
            </Button>
            <div className="text-xs text-muted-foreground">Attn {engagement.attention} / Frus {engagement.frustration}</div>
          <Button size="sm" variant={engagement.cameraEnabled ? "default" : "outline"} onClick={() => void onToggleCamera()}>
            {engagement.cameraEnabled ? "Camera On" : "Enable Camera"}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setShowCameraConsent(true)}>Privacy</Button>
          <Button size="sm" variant="ghost" onClick={() => setShowDeviceSettings(true)}>Devices</Button>
          {cameraPermission && (
            <span className="text-[11px] text-muted-foreground">Perm: {cameraPermission}</span>
          )}
          {cameraError && (
            <span className="text-[11px] text-red-600">{cameraError}</span>
          )}
          </div>
          {/* A/B quick toggle (client-side override) */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">A/B</span>
            {(['A','B'] as const).map((b) => (
              <Button key={b} variant={(typeof window !== 'undefined' && window.localStorage.getItem('ab:adaptive-strategy')===b)?'default':'outline'} size="sm" onClick={()=>{ try { if (typeof window !== 'undefined') { window.localStorage.setItem('ab:adaptive-strategy', b); } } catch {} }}>
                <FlaskConical className="h-3 w-3 mr-1"/> {b}
              </Button>
            ))}
          </div>
        </div>
        {/* Quick Practice */}
        <div className="w-full border rounded-md p-2">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-xs text-muted-foreground">Quick practice</span>
            <input
              className="h-8 px-2 border rounded-md text-xs"
              placeholder="Topic (optional)"
              value={qpTopic}
              onChange={(e)=>setQpTopic(e.target.value)}
              style={{ minWidth: 180 }}
            />
            <Button size="sm" variant="outline" onClick={async ()=>{
              try {
                setQpLoading(true); setQpQ(null); setQpPick(null); setQpInfo("");
                const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
                const res = await adaptiveNext({ userId: uid, topic: qpTopic || undefined, language });
                if (res?.question?.question && Array.isArray(res?.question?.options)) {
                  setQpQ({ question: res.question.question as string, options: res.question.options as string[] });
                  setQpInfo(`Difficulty: ${res?.difficulty || '—'}${res?.pCorrect ? ` • p(correct): ${Math.round(res.pCorrect*100)}%` : ''}`);
                } else {
                  setQpInfo('No question available.');
                }
              } catch (e) {
                setQpInfo(e instanceof Error ? e.message : String(e));
              } finally {
                setQpLoading(false);
              }
            }} disabled={qpLoading}>{qpLoading ? 'Loading…' : 'Get question'}</Button>
            {qpQ && (
              <Button size="sm" onClick={async ()=>{
                if (qpPick == null) return;
                try {
                  const uid = (typeof window !== 'undefined' ? window.localStorage.getItem('userId') : null) || '123';
                  const correctAns = (qpQ as unknown as { correctAnswer?: string }).correctAnswer;
                  const isCorrect = typeof correctAns === 'string' ? (qpQ.options[qpPick] === correctAns) : false;
                  const correct = isCorrect;
                  const r = await adaptiveGrade({ userId: uid, topic: qpTopic || qpQ.question, correct });
                  setQpInfo(`Submitted • ${correct ? 'Correct' : 'Incorrect'}${r?.pCorrect ? ` • new p(correct): ${Math.round(r.pCorrect*100)}%` : ''}`);
                } catch (e) { setQpInfo(e instanceof Error ? e.message : String(e)); }
              }} disabled={qpPick == null}>Submit</Button>
            )}
            {qpInfo && <span className="text-[11px] text-muted-foreground">{qpInfo}</span>}
          </div>
          {qpQ && (
            <div className="mt-2 text-sm">
              <div className="font-medium mb-1">{qpQ.question}</div>
              <div className="space-y-1">
                {qpQ.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 text-sm">
                    <input type="radio" name="qp" checked={qpPick === i} onChange={()=>setQpPick(i)} />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Separator />
      {/* hidden video for face presence detection */}
      <video ref={videoRef} style={{ display: 'none' }} playsInline muted />
    {showCameraConsent && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[92%] max-w-md rounded-md border bg-background p-4 shadow-lg">
          <h2 className="text-base font-semibold mb-2">Use your camera to personalize teaching?</h2>
          <ul className="list-disc pl-5 text-sm space-y-1 mb-3">
            <li>Processing happens on your device. We never upload camera frames.</li>
            <li>Used only to estimate attention and frustration to adapt pacing.</li>
            <li>You can turn this off anytime.</li>
          </ul>
          <div className="text-xs text-muted-foreground mb-3">
            Granting permission will enable the camera and start on-device detection.
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => { setShowCameraConsent(false); }}>
              Not now
            </Button>
            <Button size="sm" onClick={async () => {
              setCameraConsent(true);
              if (typeof window !== 'undefined') window.localStorage.setItem('cameraConsent', 'true');
              setShowCameraConsent(false);
              await requestCameraPreflight();
            }}>
              Allow and enable
            </Button>
          </div>
        </div>
      </div>
    )}
    {showDeviceSettings && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-[92%] max-w-lg rounded-md border bg-background p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Device settings</h2>
            <button className="text-xs text-muted-foreground" onClick={() => {
              // cleanup any previews
              if (previewStreamRef.current) { previewStreamRef.current.getTracks().forEach(t => t.stop()); previewStreamRef.current = null; }
              if (micLevelTimerRef.current) { clearTimeout(micLevelTimerRef.current); micLevelTimerRef.current = null; }
              if (micTestStreamRef.current) { micTestStreamRef.current.getTracks().forEach(t => t.stop()); micTestStreamRef.current = null; }
              if (audioContextRef.current) { try { audioContextRef.current.close(); } catch {} audioContextRef.current = null; }
              setShowDeviceSettings(false);
            }}>Close</button>
          </div>
          <div className="grid gap-3">
            <div>
              <div className="text-sm font-medium mb-1">Camera</div>
              <select
                className="h-9 px-2 border rounded-md text-sm w-full"
                value={selectedCameraId ?? ''}
                onChange={(e) => setSelectedCameraId(e.target.value || null)}
              >
                <option value="">Default (front)</option>
                {devices.filter(d => d.kind === 'videoinput').map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i+1}`}</option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  // start camera preview
                  try {
                    if (previewStreamRef.current) { previewStreamRef.current.getTracks().forEach(t => t.stop()); previewStreamRef.current = null; }
                    const constraints = selectedCameraId ? { video: { deviceId: { exact: selectedCameraId } } } : { video: { facingMode: 'user' as const } };
                    const s = await navigator.mediaDevices.getUserMedia({ ...constraints, audio: false });
                    previewStreamRef.current = s;
                    if (previewVideoRef.current) { previewVideoRef.current.srcObject = s; await previewVideoRef.current.play().catch(() => {}); }
                  } catch {}
                }}>Test camera</Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  if (previewStreamRef.current) { previewStreamRef.current.getTracks().forEach(t => t.stop()); previewStreamRef.current = null; }
                  if (previewVideoRef.current) previewVideoRef.current.srcObject = null;
                }}>Stop</Button>
              </div>
              <video ref={previewVideoRef} className="mt-2 w-full max-h-40 bg-black rounded" playsInline muted />
            </div>
            <div>
              <div className="text-sm font-medium mb-1">Microphone</div>
              <select
                className="h-9 px-2 border rounded-md text-sm w-full"
                value={selectedMicId ?? ''}
                onChange={(e) => setSelectedMicId(e.target.value || null)}
              >
                <option value="">Default</option>
                {devices.filter(d => d.kind === 'audioinput').map((d, i) => (
                  <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${i+1}`}</option>
                ))}
              </select>
              <div className="mt-2 flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={async () => {
                  try {
                    if (micLevelTimerRef.current) { clearTimeout(micLevelTimerRef.current); micLevelTimerRef.current = null; }
                    if (micTestStreamRef.current) { micTestStreamRef.current.getTracks().forEach(t => t.stop()); micTestStreamRef.current = null; }
                    if (audioContextRef.current) { try { audioContextRef.current.close(); } catch {} audioContextRef.current = null; }
                    const constraints = selectedMicId ? { audio: { deviceId: { exact: selectedMicId } } } : { audio: true };
                    const s = await navigator.mediaDevices.getUserMedia(constraints);
                    micTestStreamRef.current = s;
                    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext!)();
                    audioContextRef.current = ctx;
                    const source = ctx.createMediaStreamSource(s);
                    const analyser = ctx.createAnalyser();
                    analyser.fftSize = 1024;
                    source.connect(analyser);
                    micAnalyserRef.current = analyser;
                    const data = new Uint8Array(analyser.frequencyBinCount);
                    const tick = () => {
                      if (!micAnalyserRef.current) return;
                      micAnalyserRef.current.getByteTimeDomainData(data);
                      let sum = 0;
                      for (let i = 0; i < data.length; i++) {
                        const v = (data[i] - 128) / 128;
                        sum += v * v;
                      }
                      const rms = Math.sqrt(sum / data.length);
                      setMicLevel(Math.min(100, Math.round(rms * 200)));
                      micLevelTimerRef.current = window.setTimeout(tick, 100);
                    };
                    tick();
                  } catch {}
                }}>Test mic</Button>
                <Button size="sm" variant="ghost" onClick={() => {
                  if (micLevelTimerRef.current) { clearTimeout(micLevelTimerRef.current); micLevelTimerRef.current = null; }
                  if (micTestStreamRef.current) { micTestStreamRef.current.getTracks().forEach(t => t.stop()); micTestStreamRef.current = null; }
                  if (audioContextRef.current) { try { audioContextRef.current.close(); } catch {} audioContextRef.current = null; }
                  setMicLevel(0);
                }}>Stop</Button>
              </div>
              <div className="mt-2 h-2 bg-muted rounded">
                <div className="h-full bg-green-600 rounded" style={{ width: `${micLevel}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <Button size="sm" variant="outline" onClick={async () => {
                if (navigator.mediaDevices?.enumerateDevices) {
                  try { const list = await navigator.mediaDevices.enumerateDevices(); setDevices(list); } catch {}
                }
              }}>Refresh</Button>
              <Button size="sm" onClick={() => {
                if (typeof window !== 'undefined') {
                  if (selectedCameraId) window.localStorage.setItem('cameraDeviceId', selectedCameraId); else window.localStorage.removeItem('cameraDeviceId');
                  if (selectedMicId) window.localStorage.setItem('micDeviceId', selectedMicId); else window.localStorage.removeItem('micDeviceId');
                }
                addToast('Device preferences saved');
              }}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    )}
      <Whiteboard ref={whiteboardRef} onSend={(url) => {
        const msg: Message = { id: crypto.randomUUID(), role: 'user', content: 'Shared whiteboard sketch' };
        setMessages((prev) => [...prev, msg]);
        attachToMessage(msg.id, url);
      }} />
      <div className="flex-1 min-h-0 rounded-md border">
        <ScrollArea className="h-full w-full p-3">
          <div ref={viewportRef} className="flex flex-col gap-3">
            {showRefresher && (dueReviews.length > 0 || memorySummary) && (
              <div className="border rounded-md p-2 bg-accent/30 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Spaced refresher</div>
                  <button className="text-[11px] text-muted-foreground" onClick={()=>setShowRefresher(false)}>Dismiss</button>
                </div>
                {memorySummary && <div className="mt-1 text-xs">{memorySummary}</div>}
                {dueReviews.length>0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {dueReviews.slice(0,6).map((d,i)=> (
                      <button key={i} className="h-6 px-2 border rounded" onClick={() => { const prompt = `Quick refresher: 2 practice questions on ${d.topic}.`; setInput(prompt); }}>Review {d.topic}</button>
                    ))}
                  </div>
                )}
                <div className="mt-1 flex items-center gap-2">
                  <button className="h-6 px-2 border rounded" onClick={async ()=>{ try { const r = await summarizeMemory(userId, 'weekly'); setMemorySummary(r?.memory?.summary || memorySummary); } catch {} }}>Summarize week</button>
                </div>
              </div>
            )}
            {messages.length === 0 ? (
              <div className="text-sm text-muted-foreground">Say hello to your AI Tutor.</div>
            ) : (
              messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  role={m.role}
                  content={m.content}
                  images={attachments[m.id] || []}
                  onVisualize={m.role === 'assistant' ? () => void visualizeMessage(m.id, m.content) : undefined}
                  onSpeak={m.role === 'assistant' ? () => void speak(m.content) : undefined}
                  onWhiteboard={m.role === 'assistant' ? async () => { try { await whiteboardRef.current?.autoDraw(m.content); } catch {} } : undefined}
                  onPin={async () => {
                    try {
                      const sel = (typeof window !== 'undefined' ? window.getSelection()?.toString() : '')?.trim();
                      const text = (sel && sel.length >= 3 ? sel : m.content).slice(0, 500);
                      if (!text) return;
                      await addMemoryPin(userId, text);
                      addToast('Pinned to memory');
                    } catch {}
                  }}
                  onForget={async () => {
                    const term = (typeof window !== 'undefined' ? window.getSelection()?.toString() : '')?.trim() || prompt('Term to forget/redact?') || '';
                    if (!term || term.length < 2) return;
                    try { await addMemoryRedaction(userId, term); addToast('Will redact this term from context'); } catch {}
                  }}
                  onPractice={(topic) => {
                    const short = topic.replace(/\s+/g, ' ').slice(0, 120);
                    const prompt = `Give me 3 practice problems in ${subject || 'subject'} for grade ${grade || 'level'} (${curriculum === 'lk' ? 'Sri Lanka' : 'International'}). Focus on: ${short}`;
                    setInput(prompt);
                  }}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      <div className="grid gap-2">
        <div className="border rounded-md p-2">
          <div className="text-sm font-medium mb-1">Runnable code cell</div>
          <CodeRunner />
        </div>
        {suggestion && (
          <div className="flex items-center justify-between border rounded-md px-3 py-2 text-xs bg-accent/40">
            <div className="truncate mr-2">{suggestion}</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => {
                const focus = suggestion.split('•')[1]?.trim() || '';
                const prompt = `Give me 3 practice problems in ${subject || 'subject'} for grade ${grade || 'level'} (${curriculum === 'lk' ? 'Sri Lanka' : 'International'}). Focus on: ${focus}`;
                setInput(prompt);
              }}>Practice</Button>
              <Button variant="ghost" size="sm" onClick={() => setSuggestion(null)}>Dismiss</Button>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const p = `Ask me a ${subject || 'subject'} question appropriate for grade ${grade || 'level'} (${curriculum === 'lk' ? 'Sri Lanka' : 'International'}) and wait for my answer. Then give feedback.`;
              setInput(p);
            }}
          >Ask me a question</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const p = `Give me 3 practice problems in ${subject || 'subject'} for grade ${grade || 'level'} (${curriculum === 'lk' ? 'Sri Lanka' : 'International'}). Ask one at a time and wait for my answer before revealing the solution.`;
              setInput(p);
            }}
          >Practice x3</Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const p = `Quiz me with one multiple-choice question in ${subject || 'subject'} for grade ${grade || 'level'} (${curriculum === 'lk' ? 'Sri Lanka' : 'International'}). Wait for my answer, then explain.`;
              setInput(p);
            }}
          >Quick quiz</Button>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type your message..."
          className="min-h-[88px]"
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <VoiceRecorder language={language} onResult={(t) => setInput((prev) => (prev ? prev + " " + t : t))} />
            <TTSButton lastMessage={messages.findLast?.((m) => m.role === "assistant")?.content ?? ""} />
            {!sttSupported && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  addToast(
                    "Voice input not supported by this browser. Try Chrome/Edge desktop or Safari iOS (webkitSpeechRecognition), and ensure microphone permission is allowed in site settings."
                  )
                }
              >
                Mic help
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={retryLast} disabled={messages.length === 0 || isSending}>
              Retry
            </Button>
            <Button variant="outline" onClick={() => void copyLastAnswer()} disabled={messages.length === 0}>
              Copy
            </Button>
            <Button variant="outline" onClick={clearChat} disabled={messages.length === 0}>
              Clear
            </Button>
            <Button variant="outline" onClick={downloadTranscript} disabled={messages.length === 0}>
              Export .txt
            </Button>
            <Button variant="outline" onClick={exportToDocs} disabled={messages.length === 0}>
              Docs
            </Button>
            <Button variant="outline" onClick={exportToQuizlet} disabled={messages.length === 0}>
              Quizlet
            </Button>
            <Button onClick={() => void sendMessage()} disabled={!canSend}>
              {isSending ? "Sending..." : "Send"}
            </Button>
            {isSending && (
              <span className="text-xs text-muted-foreground">Thinking…</span>
            )}
          </div>
        </div>
      </div>
      {/* lightweight toast container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((t) => (
            <div key={t.id} className="max-w-sm text-sm bg-background border rounded-md shadow-md p-3">
              <div className="flex items-start justify-between gap-3">
                <div>{t.text}</div>
                <button className="text-xs text-muted-foreground" onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Whiteboard = React.forwardRef<WhiteboardHandle, { onSend?: (dataUrl: string) => void }>(function Whiteboard({ onSend }, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#111827");
  const [lineWidth, setLineWidth] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const onPointerUp = () => setDrawing(false);

  const clear = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  };

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `whiteboard-${new Date().toISOString()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const sendToChat = () => {
    const canvas = canvasRef.current;
    if (!canvas || !onSend) return;
    const url = canvas.toDataURL("image/png");
    onSend(url);
  };

  // auto-draw simple diagram from text: draw boxes and arrows like generateDiagramFromText, but directly on board
  const autoDraw = useCallback(async (text: string) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width; const height = canvas.height;
    const lines = text.split(/\n|(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean).slice(0,6);
    const nodes = lines.length>0?lines:['Idea','Step 1','Step 2','Conclusion'];
    const nodeWidth = Math.min(width*0.8, 500);
    const gap = 12; const nodeHeight = 50; const startY = Math.max(10, Math.floor((height - nodes.length*(nodeHeight+gap)+gap)/2));
    ctx.font = '14px sans-serif'; ctx.textBaseline = 'middle'; ctx.lineWidth = 2;
    nodes.forEach((n,i)=>{
      const x = Math.floor((width - nodeWidth)/2); const y = startY + i*(nodeHeight+gap);
      ctx.fillStyle = i===0? '#2563EB' : i===nodes.length-1? '#16A34A' : '#334155';
      ctx.strokeStyle = '#FFFFFF';
      const r = 8; const w=nodeWidth; const h=nodeHeight;
      ctx.beginPath(); ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r); ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h); ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r); ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#FFF'; const txt = n.length>80? n.slice(0,77)+'…' : n; const tw = ctx.measureText(txt).width; ctx.fillText(txt, x + Math.max(10,(w-tw)/2), y + h/2);
      if (i<nodes.length-1) {
        const ax = x+w/2; const ay = y+h; const by = y+h+gap;
        ctx.strokeStyle = '#94A3B8'; ctx.beginPath(); ctx.moveTo(ax,ay+2); ctx.lineTo(ax,by-2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(ax-5,by-5); ctx.lineTo(ax,by); ctx.lineTo(ax+5,by-5); ctx.stroke();
      }
    });
  }, []);

  React.useImperativeHandle(ref, () => ({ autoDraw }));

  return (
    <div className="border rounded-md p-2 space-y-2">
      <div className="flex items-center gap-2">
        <PencilLine className="h-4 w-4" />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <input type="range" min={1} max={10} value={lineWidth} onChange={(e) => setLineWidth(parseInt(e.target.value))} />
        <button onClick={clear} className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"><Eraser className="h-4 w-4" /> Clear</button>
        <button onClick={download} className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs"><Download className="h-4 w-4" /> Download</button>
        <button onClick={sendToChat} className="inline-flex items-center gap-1 border rounded-md px-2 py-1 text-xs">Send to chat</button>
      </div>
      <div className="h-48 w-full">
        <canvas
          ref={canvasRef}
          className="h-full w-full bg-white rounded-md border"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        />
      </div>
    </div>
  );
});

function MessageBubble({ role, content, images, onPractice, onVisualize, onSpeak, onWhiteboard, onPin, onForget }: { role: Role; content: string; images?: string[]; onPractice?: (topic: string) => void; onVisualize?: () => void; onSpeak?: () => void; onWhiteboard?: () => void; onPin?: () => void; onForget?: () => void }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-foreground text-background" : "bg-muted"
        )}
      >
        {isUser ? (
          content
        ) : (
          <>
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex, rehypeRaw]}>{content}</ReactMarkdown>
            {/* Inline runnable cell trigger: gated by global mm_code */}
            {(() => {
              try { if (typeof window !== 'undefined' && window.localStorage.getItem('mm_code') === 'false') return false; } catch {}
              return /^```(js|javascript|python)/m.test(content);
            })() && (
              <div className="mt-2">
                <CodeRunner />
              </div>
            )}
          </>
        )}
        {images && images.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {images.map((src, i) => (
              <a key={i} href={src} target="_blank" rel="noreferrer" className="block">
                <img src={src} alt="diagram" className="w-full h-auto rounded border" />
              </a>
            ))}
          </div>
        )}
        {!isUser && (
          <div className="mt-2 flex gap-2">
            <InlineRephraseButtons text={content} />
            {onVisualize && (
              <Button variant="outline" size="sm" onClick={onVisualize}>
                Visualize
              </Button>
            )}
            {onSpeak && (
              <Button variant="outline" size="sm" onClick={onSpeak}>Speak</Button>
            )}
            {onWhiteboard && (
              <Button variant="outline" size="sm" onClick={onWhiteboard}>Draw</Button>
            )}
            {onPin && (
              <Button variant="outline" size="sm" onClick={onPin}>Pin</Button>
            )}
            {onForget && (
              <Button variant="outline" size="sm" onClick={onForget}>Forget</Button>
            )}
            {onPractice && (
              <Button variant="outline" size="sm" onClick={() => onPractice(content)}>
                Practice this
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InlineRephraseButtons({ text }: { text: string }) {
  const [busy, setBusy] = useState<false | "eli5" | "expert">(false);
  const doRephrase = async (mode: "eli5" | "expert") => {
    if (!text.trim()) return;
    setBusy(mode);
    try {
      const userId = (typeof window !== "undefined" ? window.localStorage.getItem("userId") : null) || "123";
      const language = (typeof window !== "undefined" ? window.localStorage.getItem("language") : null) || "en";
      const level = mode;
      const res = await chat({ userId, message: `Rephrase this ${mode.toUpperCase()}:\n\n${text}`, language: language as "en"|"si"|"ta", level: level as "eli5"|"normal"|"expert" });
      if (navigator.clipboard) await navigator.clipboard.writeText(res.reply);
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => void doRephrase("eli5")} disabled={!!busy}>
        {busy === "eli5" ? "…" : "ELI5"}
      </Button>
      <Button variant="outline" size="sm" onClick={() => void doRephrase("expert")} disabled={!!busy}>
        {busy === "expert" ? "…" : "Expert"}
      </Button>
    </>
  );
}

function VoiceRecorder({ onResult, language }: { onResult: (text: string) => void; language: "en"|"si"|"ta" }) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [sttAvailable, setSttAvailable] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check Web Speech API availability
    type SpeechRecognitionType = new () => {
      lang: string;
      onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
      start: () => void;
    };
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).SpeechRecognition ||
      (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).webkitSpeechRecognition;
    setSttAvailable(!!SpeechRecognition);
    return () => {
      if (mediaRef.current && mediaRef.current.state !== "inactive") {
        mediaRef.current.stop();
      }
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream);
      mediaRef.current = media;
      chunksRef.current = [];
      media.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      media.onstop = async () => {
        const _blob = new Blob(chunksRef.current, { type: "audio/webm" });
        try {
          if (audioUrl) URL.revokeObjectURL(audioUrl);
          const url = URL.createObjectURL(_blob);
          setAudioUrl(url);
        } catch {}
        // Basic offline speech recognition via Web Speech API if available
        type SpeechRecognitionType = new () => {
          lang: string;
          onresult: (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => void;
          start: () => void;
        };
        const SpeechRecognition =
          (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).SpeechRecognition ||
          (window as unknown as { SpeechRecognition?: SpeechRecognitionType; webkitSpeechRecognition?: SpeechRecognitionType }).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const rec = new SpeechRecognition();
          rec.lang = language === 'si' ? 'si-LK' : language === 'ta' ? 'ta-IN' : 'en-US';
          rec.onresult = (event: { results: ArrayLike<{ 0: { transcript: string } }> }) => {
            const result0 = event.results[0] as unknown as { 0: { transcript: string } };
            const text = result0?.[0]?.transcript ?? "";
            if (text) onResult(text);
          };
          rec.start();
        }
        // Release tracks
        stream.getTracks().forEach((t) => t.stop());
      };
      media.start();
      setRecording(true);
    } catch {
      setRecording(false);
    }
  };

  const stop = () => {
    if (mediaRef.current && mediaRef.current.state !== "inactive") {
      mediaRef.current.stop();
    }
    setRecording(false);
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={recording ? stop : start}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs",
          recording ? "bg-red-600 text-white border-transparent" : "",
        )}
        title={sttAvailable ? "Voice input (on-device)" : "Voice input (browser unsupported)"}
        disabled={!sttAvailable && !recording}
        aria-disabled={!sttAvailable}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        <Mic className="h-4 w-4" /> {recording ? "Stop" : "Voice"}
      </button>
      {audioUrl && (
        <>
          <audio controls className="h-8">
            <source src={audioUrl} type="audio/webm" />
          </audio>
          <a
            href={audioUrl}
            download={`voice-note-${new Date().toISOString()}.webm`}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
          >
            Save audio
          </a>
        </>
      )}
    </div>
  );
}

function TTSButton({ lastMessage }: { lastMessage: string }) {
  const speak = () => {
    if (!lastMessage) return;
    if (typeof window === "undefined") return;
    if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') return;
    const utter = new SpeechSynthesisUtterance(lastMessage);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs"
      aria-label="Play last answer"
      disabled={!(typeof window !== 'undefined' && 'speechSynthesis' in window)}
      title={typeof window !== 'undefined' && 'speechSynthesis' in window ? 'Listen' : 'TTS not supported'}
    >
      <Volume2 className="h-4 w-4" /> Listen
    </button>
  );
}
