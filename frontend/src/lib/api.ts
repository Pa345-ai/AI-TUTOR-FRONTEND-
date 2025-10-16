export interface ChatRequest {
  userId: string;
  message: string;
  language?: "en" | "si" | "ta";
  mode?: "socratic" | "exam" | "friendly" | "motivational";
  level?: "eli5" | "normal" | "expert";
  subject?: string;
  grade?: number | string;
  curriculum?: "lk" | "international";
  personaSocratic?: number;
  personaStrictness?: number;
  personaEncouragement?: number;
}

export interface ChatResponse {
  reply: string;
}

export async function getSubjectAbility(userId: string, subject: string): Promise<number> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/calibration/ability?userId=${encodeURIComponent(userId)}&subject=${encodeURIComponent(subject)}`);
  if (!res.ok) throw new Error(`Ability get error ${res.status}`);
  const data = await res.json() as { rating?: number };
  return data.rating ?? 1500;
}

export async function setSubjectAbility(userId: string, subject: string, rating: number): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/calibration/complete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, subject, rating }) });
  if (!res.ok) throw new Error(`Ability set error ${res.status}`);
}

export interface BackendMessage {
  role: "user" | "assistant";
  content: string;
  language?: string;
  createdAt?: string;
}

import { MOCK_BACKEND, mockChat, mockProgress, mockAchievements, mockFlashcards, mockLearningPaths, mockNotifications, mockStudyRooms, mockLeaderboard } from './mock-api';
import { 
  chatWithSupabase, 
  fetchProgressWithSupabase, 
  fetchAchievementsWithSupabase, 
  fetchStudyRoomsWithSupabase, 
  fetchLeaderboardWithSupabase, 
  fetchFlashcardsWithSupabase, 
  fetchLearningPathsWithSupabase, 
  fetchNotificationsWithSupabase,
  processVoiceWithSupabase,
  processEmotionWithSupabase,
  generateQuizWithSupabase,
  getCareerAdviceWithSupabase,
  getHomeworkFeedbackWithSupabase
} from './supabase-api';

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
    if (!fromEnv) {
      if (MOCK_BACKEND) {
        return 'mock://api';
      }
      throw new Error("NEXT_PUBLIC_BASE_URL is not set");
    }
    return fromEnv;
  }
  // Server: also rely on NEXT_PUBLIC_BASE_URL for now
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (!fromEnv) {
    if (MOCK_BACKEND) {
      return 'mock://api';
    }
    throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  }
  return fromEnv;
};

export async function chat(request: ChatRequest, init?: RequestInit): Promise<ChatResponse> {
  const baseUrl = getBaseUrl();
  
  // Use mock data if backend is not available
  if (baseUrl === 'mock://api') {
    return await mockChat(request);
  }
  
  // Try Supabase backend first
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return await chatWithSupabase(request);
    }
  } catch (error) {
    console.warn('Supabase chat failed, trying fallback:', error);
  }
  
  try {
    const res = await fetch(`${baseUrl}/api/chat/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: request.userId,
        content: request.message,
        language: request.language ?? "en",
        mode: request.mode,
        level: request.level,
        subject: request.subject,
        grade: request.grade,
        curriculum: request.curriculum,
        personaSocratic: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaSocratic') || '0') : 0) || undefined,
        personaStrictness: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaStrictness') || '0') : 0) || undefined,
        personaEncouragement: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaEncouragement') || '0') : 0) || undefined,
      }),
      ...init,
    });
    
    if (!res.ok) {
      // If backend is not available, fall back to mock data
      if (res.status === 404 || res.status >= 500) {
        console.warn('Backend not available, using mock data');
        return await mockChat(request);
      }
      
      const text = await res.text().catch(() => "");
      throw new Error(`Chat API error ${res.status}: ${text || res.statusText}`);
    }
    
    const data = (await res.json()) as { message?: { content?: string } };
    const reply = data?.message?.content;
    if (!reply) {
      throw new Error("Invalid response from Chat API");
    }
    return { reply };
  } catch (error) {
    // If network error or backend unavailable, use mock data
    console.warn('Backend connection failed, using mock data:', error);
    return await mockChat(request);
  }
}

export async function fetchChatHistory(userId: string): Promise<BackendMessage[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/chat/history?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`History API error ${res.status}: ${text || res.statusText}`);
  }
  const data = (await res.json()) as { messages?: Array<{ role: string; content: string; language?: string; createdAt?: string }> };
  return (data.messages ?? [])
    .filter((m) => typeof m.content === "string" && (m.role === "user" || m.role === "assistant"))
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content, language: m.language, createdAt: m.createdAt }));
}

export interface ProgressResponse {
  progress: {
    xp: number;
    level: number;
    streak: number;
    totalAssignmentsCompleted?: number;
    totalQuizzesCompleted?: number;
    averageScore?: number;
  };
}

export async function fetchProgress(userId: string): Promise<ProgressResponse["progress"]> {
  const baseUrl = getBaseUrl();
  
  if (baseUrl === 'mock://api') {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockProgress();
  }
  
  // Try Supabase backend first
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return await fetchProgressWithSupabase(userId);
    }
  } catch (error) {
    console.warn('Supabase progress fetch failed, trying fallback:', error);
  }
  
  try {
    const res = await fetch(`${baseUrl}/api/progress/${encodeURIComponent(userId)}`);
    if (!res.ok) {
      if (res.status === 404 || res.status >= 500) {
        console.warn('Backend not available, using mock data');
        return mockProgress();
      }
      throw new Error(`Progress error ${res.status}`);
    }
    const data = (await res.json()) as ProgressResponse;
    return data.progress;
  } catch (error) {
    console.warn('Backend connection failed, using mock data:', error);
    return mockProgress();
  }
}

export async function streakCheckin(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/streak/checkin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
  if (!res.ok) throw new Error(`Check-in error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; streak: number; xp: number }>;
}

export async function streakFreeze(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/streak/freeze`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
  if (!res.ok) throw new Error(`Freeze error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; streak: number }>;
}

export interface AchievementItem {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export async function fetchAchievements(): Promise<AchievementItem[]> {
  const baseUrl = getBaseUrl();
  
  if (baseUrl === 'mock://api') {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAchievements();
  }
  
  try {
    const res = await fetch(`${baseUrl}/api/achievements`);
    if (!res.ok) {
      if (res.status === 404 || res.status >= 500) {
        console.warn('Backend not available, using mock data');
        return mockAchievements();
      }
      throw new Error(`Achievements error ${res.status}`);
    }
    const data = (await res.json()) as { achievements?: AchievementItem[] };
    return data.achievements ?? [];
  } catch (error) {
    console.warn('Backend connection failed, using mock data:', error);
    return mockAchievements();
  }
}

export async function fetchUserAchievements(userId: string): Promise<AchievementItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/achievements/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`User achievements error ${res.status}`);
  const data = (await res.json()) as { achievements?: AchievementItem[] };
  return data.achievements ?? [];
}

export interface LeaderboardItem {
  userId: string;
  name?: string;
  xp: number;
  level?: number;
}

export async function fetchLeaderboard(limit = 10, season?: string): Promise<LeaderboardItem[]> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/leaderboard`);
  url.searchParams.set('limit', String(limit));
  if (season) url.searchParams.set('season', season);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Leaderboard error ${res.status}`);
  const data = (await res.json()) as { leaderboard?: LeaderboardItem[] };
  return data.leaderboard ?? [];
}

// Gamification: seasons & anti-cheat
export async function fetchSeasons(): Promise<Array<{ id: string; name: string; startAt?: string; endAt?: string; current?: boolean }>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard/seasons`);
  if (!res.ok) throw new Error(`Seasons error ${res.status}`);
  const data = await res.json() as { seasons?: Array<{ id: string; name: string; startAt?: string; endAt?: string; current?: boolean }> };
  return data.seasons || [];
}
export async function fetchSeasonInfo(season: string): Promise<{ id: string; name: string; startAt?: string; endAt?: string; rolloverAt?: string; winners?: Array<{ userId: string; xp: number; name?: string }> }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard/season/${encodeURIComponent(season)}`);
  if (!res.ok) throw new Error(`Season info error ${res.status}`);
  return res.json();
}
export async function fetchLeaderboardFlags(season: string): Promise<Array<{ userId: string; reason: string; severity?: number; events?: string[] }>> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/leaderboard/flags`);
  url.searchParams.set('season', season);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Flags error ${res.status}`);
  const data = await res.json() as { flags?: Array<{ userId: string; reason: string; severity?: number; events?: string[] }> };
  return data.flags || [];
}
export async function reportSuspicious(userId: string, reason: string): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard/flags`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, reason }) });
  if (!res.ok) throw new Error(`Report error ${res.status}`);
}
export async function penalizeUser(userId: string, season: string, xpPenalty: number): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard/penalize`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, season, xpPenalty }) });
  if (!res.ok) throw new Error(`Penalize error ${res.status}`);
}
export async function rolloverSeason(season: string): Promise<{ nextSeason: string }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard/rollover`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ season }) });
  if (!res.ok) throw new Error(`Rollover error ${res.status}`);
  return res.json();
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  subject?: string;
  deckId?: string | null;
  tags?: string[];
}

export async function fetchFlashcards(userId: string): Promise<FlashcardItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Flashcards error ${res.status}`);
  const data = (await res.json()) as { flashcards?: FlashcardItem[] };
  return data.flashcards ?? [];
}

export async function listDecks(userId: string): Promise<Array<{ id: string; name: string }>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/decks?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Decks error ${res.status}`);
  const data = await res.json() as { decks?: Array<{ id: string; name: string }> };
  return data.decks ?? [];
}

// Flashcards SRS helpers (due/review/deck ops)
export async function getDueFlashcards(userId: string, deck?: string, limit = 50) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/flashcards/due/${encodeURIComponent(userId)}`);
  if (deck) url.searchParams.set('deck', deck);
  if (limit) url.searchParams.set('limit', String(limit));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Due flashcards error ${res.status}`);
  return res.json() as Promise<{ cards: FlashcardItem[] }>;
}
export async function reviewFlashcard(userId: string, flashcardId: string, quality: 0|1|2|3|4|5) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards/review`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, flashcardId, quality, cardId: flashcardId }) });
  if (!res.ok) throw new Error(`Review error ${res.status}`);
  return res.json();
}
export async function renameDeck(userId: string, from: string, to: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards/decks/rename`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, from, to }) });
  if (!res.ok) throw new Error(`Rename deck error ${res.status}`);
}
export async function deleteDeck(userId: string, subject: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards/decks/delete`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, subject }) });
  if (!res.ok) throw new Error(`Delete deck error ${res.status}`);
}

export async function createDeck(userId: string, name: string): Promise<{ id: string; name: string }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/decks`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, name }) });
  if (!res.ok) throw new Error(`Create deck error ${res.status}`);
  return res.json() as Promise<{ deck: { id: string; name: string } }> as any;
}

export async function moveCardToDeck(cardId: string, deckId: string | null): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/decks/move`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId, deckId }) });
  if (!res.ok) throw new Error(`Move card error ${res.status}`);
}

export async function generateFlashcards(params: { userId: string; content: string; subject?: string; language?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Generate flashcards error ${res.status}`);
  const data = await res.json();
  return data;
}

export interface LearningPathItem {
  id: string;
  subject: string;
  currentTopic: string;
  completedTopics?: string[];
  recommendedResources?: Array<{ title: string; url: string; type: string }>;
}

export async function fetchLearningPaths(userId: string): Promise<LearningPathItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning-paths/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Learning paths error ${res.status}`);
  const data = (await res.json()) as { paths?: LearningPathItem[] };
  return data.paths ?? [];
}

export async function createLearningPath(input: { userId: string; subject: string; currentTopic: string; completedTopics?: string[]; recommendedResources?: Array<{ title: string; url: string; type: string }> }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning-paths`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Create learning path error ${res.status}`);
  return res.json() as Promise<{ id: string }>;
}

export async function updateLearningPath(id: string, data: Partial<{ currentTopic: string; completedTopics: string[]; recommendedResources: Array<{ title: string; url: string; type: string }> }>) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning-paths/${encodeURIComponent(id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error(`Update learning path error ${res.status}`);
  return res.json() as Promise<{ ok: boolean }>;
}

// Schedule & catch-up
export type ScheduleItem = { id: string; userId: string; pathId?: string|null; subject?: string|null; topic: string; startAt: string; durationMinutes: number; status: 'planned'|'completed'|'missed'|'rescheduled' };
export type SchedulePrefs = { userId: string; timezone?: string; dailyMinutes?: number; quietStartMin?: number; quietEndMin?: number; daysAvailable?: string[] };
export async function fetchSchedule(userId: string, range?: { from?: string; to?: string }): Promise<ScheduleItem[]> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/schedule/${encodeURIComponent(userId)}`);
  if (range?.from) url.searchParams.set('from', range.from);
  if (range?.to) url.searchParams.set('to', range.to);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Schedule fetch error ${res.status}`);
  const data = await res.json() as { schedule: ScheduleItem[] };
  return data.schedule || [];
}
export async function upsertSchedule(items: Array<Omit<ScheduleItem, 'id'>>): Promise<{ count: number }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/schedule/upsert`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
  if (!res.ok) throw new Error(`Schedule upsert error ${res.status}`);
  return res.json();
}
export async function setScheduleStatus(id: string, status: ScheduleItem['status']): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/schedule/${encodeURIComponent(id)}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error(`Schedule status error ${res.status}`);
}
export async function getSchedulePrefs(userId: string): Promise<{ prefs?: SchedulePrefs }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/schedule/prefs/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Prefs fetch error ${res.status}`);
  return res.json();
}
export async function setSchedulePrefs(prefs: SchedulePrefs): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/schedule/prefs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(prefs) });
  if (!res.ok) throw new Error(`Prefs set error ${res.status}`);
}
export async function fetchCatchUp(userId: string, since?: string): Promise<Array<{ topic: string; minutes: number }>> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/schedule/catchup/${encodeURIComponent(userId)}`);
  if (since) url.searchParams.set('since', since);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Catch-up fetch error ${res.status}`);
  const data = await res.json() as { plan: Array<{ topic: string; minutes: number }> };
  return data.plan || [];
}
export async function exportICS(userId: string, range?: { from?: string; to?: string }): Promise<string> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/schedule/ics/${encodeURIComponent(userId)}`);
  if (range?.from) url.searchParams.set('from', range.from);
  if (range?.to) url.searchParams.set('to', range.to);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`ICS export error ${res.status}`);
  return res.text();
}

// Knowledge graph
export async function fetchKnowledgeGraph() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/knowledge/graph`);
  if (!res.ok) throw new Error(`Knowledge graph error ${res.status}`);
  return res.json();
}

// Memory controls
export async function listMemoryPins(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/pins/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Pins fetch error ${res.status}`);
  return res.json() as Promise<{ pins: Array<{ id: string; text: string; createdAt: string }> }>;
}
export async function addMemoryPin(userId: string, text: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/pins`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, text }) });
  if (!res.ok) throw new Error(`Add pin error ${res.status}`);
  return res.json();
}
export async function deleteMemoryPin(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/pins/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete pin error ${res.status}`);
}
export async function listMemoryRedactions(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/redactions/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Redactions fetch error ${res.status}`);
  return res.json() as Promise<{ redactions: Array<{ id: string; term: string; createdAt: string }> }>;
}
export async function addMemoryRedaction(userId: string, term: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/redactions`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, term }) });
  if (!res.ok) throw new Error(`Add redaction error ${res.status}`);
  return res.json();
}
export async function deleteMemoryRedaction(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/redactions/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Delete redaction error ${res.status}`);
}

export async function logLearningEvent(params: { userId: string; subject?: string; topic: string; correct: boolean; difficulty?: 'easy'|'medium'|'hard' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning/log`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Learning log error ${res.status}`);
  return res.json();
}

export async function adaptiveNext(params: { userId: string; subject?: string; topic?: string; language?: 'en'|'si'|'ta' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/adaptive/next`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Adaptive next error ${res.status}`);
  return res.json();
}

export async function adaptiveGrade(params: { userId: string; topic: string; correct: boolean; difficulty?: 'easy'|'medium'|'hard'; subject?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/adaptive/grade`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Adaptive grade error ${res.status}`);
  return res.json();
}

// Item bank ops: exposure caps, drift scan, recalibration
export type ExposureConfig = {
  capPerItemPerUser?: number;          // e.g., 3
  windowDays?: number;                 // e.g., 7
  perTopicDailyCap?: number;           // optional per-topic cap
};
export async function setExposureConfig(cfg: ExposureConfig): Promise<{ ok: boolean }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/exposure/config`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cfg) });
  if (!res.ok) throw new Error(`Exposure config error ${res.status}`);
  return res.json();
}
export async function getExposureConfig(): Promise<{ config?: ExposureConfig }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/exposure/config`);
  if (!res.ok) throw new Error(`Exposure get error ${res.status}`);
  return res.json();
}
export async function getExposureHotlist(): Promise<{ items: Array<{ id: string; topic?: string; subject?: string; exposures: number }> }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/exposure`);
  if (!res.ok) throw new Error(`Exposure list error ${res.status}`);
  return res.json();
}
export async function enforceExposureNow(): Promise<{ ok: boolean; updated?: number }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/exposure/enforce`, { method: 'POST' });
  if (!res.ok) throw new Error(`Exposure enforce error ${res.status}`);
  return res.json();
}
export async function scanItemDrift(params: { aRelThreshold?: number; bAbsThreshold?: number; minAttempts?: number }): Promise<{ drifted: Array<{ id: string; topic?: string; subject?: string; aPrev?: number; aNow?: number; bPrev?: number; bNow?: number; attempts?: number }> }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/drift/scan`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Drift scan error ${res.status}`);
  return res.json();
}
export async function recalibrateItemBank(input?: { itemIds?: string[] }): Promise<{ ok: boolean; count?: number }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/recalibrate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input || {}) });
  if (!res.ok) throw new Error(`Recalibrate error ${res.status}`);
  return res.json();
}
export async function reestimateIRTAll(): Promise<{ ok: boolean }>{
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/items/irt/reestimate-all`, { method: 'POST' });
  if (!res.ok) throw new Error(`IRT reestimate error ${res.status}`);
  return res.json();
}
export async function recalibrateAbilitiesNow(): Promise<{ ok: boolean; users?: number }>{
  const baseUrl = getBaseUrl();
  // Support either endpoint if backend varies
  let res = await fetch(`${baseUrl}/api/calibration/recalibrate-abilities`, { method: 'POST' });
  if (!res.ok) res = await fetch(`${baseUrl}/api/calibration/recalibrate`, { method: 'POST' });
  if (!res.ok) throw new Error(`Ability recalibration error ${res.status}`);
  return res.json();
}

export async function fetchMastery(userId: string): Promise<Record<string, { correct: number; attempts: number }>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning/mastery/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Mastery fetch error ${res.status}`);
  const data = await res.json();
  return data.mastery ?? {};
}

export async function fetchMasteryTimeSeries(params: { userId?: string; classId?: string; days?: number }): Promise<Array<{ date: string; accuracy: number; attempts: number }>> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/analytics/mastery/timeseries`);
  if (params.userId) url.searchParams.set('userId', params.userId);
  if (params.classId) url.searchParams.set('classId', params.classId);
  if (params.days) url.searchParams.set('days', String(params.days));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Mastery timeseries error ${res.status}`);
  const data = await res.json() as { points?: Array<{ date: string; accuracy: number; attempts: number }> };
  return data.points || [];
}

export async function fetchCohortComparisons(params: { classId: string; days?: number }): Promise<Array<{ userId: string; accuracy: number; attempts: number }>> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/analytics/cohort/comparisons`);
  url.searchParams.set('classId', params.classId);
  if (params.days) url.searchParams.set('days', String(params.days));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Cohort compare error ${res.status}`);
  const data = await res.json() as { cohort?: Array<{ userId: string; accuracy: number; attempts: number }> };
  return data.cohort || [];
}

export async function fetchReviewAdherence(params: { userId?: string; classId?: string; days?: number }): Promise<{ adherence: number; missed: number; completed: number }>{
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/analytics/reviews/adherence`);
  if (params.userId) url.searchParams.set('userId', params.userId);
  if (params.classId) url.searchParams.set('classId', params.classId);
  if (params.days) url.searchParams.set('days', String(params.days));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Review adherence error ${res.status}`);
  return res.json();
}

export async function fetchDueTopics(userId: string, limit = 20): Promise<Array<{ topic: string; subject: string | null; nextReviewDate: string | null }>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning/review/${encodeURIComponent(userId)}?limit=${limit}`);
  if (!res.ok) throw new Error(`Due fetch error ${res.status}`);
  const data = await res.json();
  const rows = (data.due ?? []) as Array<{ topic: string; subject?: string | null; nextReviewDate?: string | null }>;
  return rows.map((r) => ({ topic: r.topic, subject: r.subject ?? null, nextReviewDate: r.nextReviewDate ?? null }));
}

export interface DueTopicReview {
  topic: string;
  subject?: string | null;
  nextReviewDate?: string | null;
}

export async function fetchDueReviews(userId: string, limit = 20): Promise<DueTopicReview[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning/review/${encodeURIComponent(userId)}?limit=${limit}`);
  if (!res.ok) throw new Error(`Due reviews fetch error ${res.status}`);
  const data = (await res.json()) as { due?: DueTopicReview[] | string[] };
  // backend now returns array of objects; fallback if older string[]
  const due = data.due ?? [];
  if (Array.isArray(due) && typeof due[0] === 'string') {
    return (due as string[]).map((t) => ({ topic: t }));
  }
  return due as DueTopicReview[];
}

export async function* streamChat(request: ChatRequest): AsyncGenerator<string, void, unknown> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/chat/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: request.userId,
      content: request.message,
      language: request.language ?? 'en',
      mode: request.mode,
      level: request.level,
      personaSocratic: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaSocratic') || '0') : 0) || undefined,
      personaStrictness: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaStrictness') || '0') : 0) || undefined,
      personaEncouragement: (typeof window !== 'undefined' ? parseInt(window.localStorage.getItem('personaEncouragement') || '0') : 0) || undefined,
    }),
  });
  if (!res.ok || !res.body) {
    throw new Error(`Chat stream error ${res.status}`);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    for (const line of chunk.split(/\n\n/)) {
      if (!line.startsWith('data:')) continue;
      const data = line.slice(5).trim();
      if (!data) continue;
      if (data === '[DONE]') return;
      yield data;
    }
  }
}

export async function fetchGoals(userId: string, timeframe: 'daily'|'weekly', language: 'en'|'si'|'ta' = 'en') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, timeframe, language }),
  });
  if (!res.ok) throw new Error(`Goals error ${res.status}`);
  return res.json();
}

export async function getSavedGoals(userId: string, timeframe: 'daily'|'weekly') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/goals/${encodeURIComponent(userId)}?timeframe=${timeframe}`);
  if (!res.ok) throw new Error(`Get goals error ${res.status}`);
  return res.json() as Promise<{ goals: Array<{ title: string; steps: string[]; focusTopic?: string }>; progress: Record<string, boolean> }>;
}

export async function updateGoalsProgress(userId: string, timeframe: 'daily'|'weekly', progress: Record<string, boolean>) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/goals/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timeframe, progress }),
  });
  if (!res.ok) throw new Error(`Update goals error ${res.status}`);
  return res.json() as Promise<{ goals: Array<{ title: string; steps: string[]; focusTopic?: string }>; progress: Record<string, boolean> }>;
}

export async function fetchMemory(userId: string, period: 'daily'|'weekly' = 'daily') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/${encodeURIComponent(userId)}?period=${period}`);
  if (!res.ok) throw new Error(`Fetch memory error ${res.status}`);
  return res.json() as Promise<{ memory?: { summary: string } }>;
}

export async function summarizeMemory(userId: string, period: 'daily'|'weekly' = 'daily') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/summarize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, period }),
  });
  if (!res.ok) throw new Error(`Summarize memory error ${res.status}`);
  return res.json() as Promise<{ memory?: { summary: string } }>;
}

// Vector store retrieval for long-term context per surface
export async function retrieveMemory(params: { userId: string; surface: 'chat'|'lessons'|'quizzes'; query: string; k?: number }): Promise<{ items: Array<{ text: string; score?: number }> }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/memory/retrieve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Memory retrieve error ${res.status}`);
  const data = await res.json() as { items?: Array<{ text: string; score?: number }> };
  return { items: data.items || [] };
}

export type HomeworkRubricCategory = { name: string; score: number; outOf: number; comment: string };
export type HomeworkRubric = { categories: HomeworkRubricCategory[] };
export interface HomeworkReview {
  id: string;
  userId: string;
  title?: string;
  subject?: string;
  gradeLevel?: number;
  contentText: string;
  summary?: string;
  rubric?: HomeworkRubric;
  suggestions?: string[];
  revisions?: string;
  overallScore?: number;
  createdAt: string;
  updatedAt: string;
}

export async function requestHomeworkFeedback(params: { userId: string; title?: string; subject?: string; gradeLevel?: number; content: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/homework/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Homework feedback error ${res.status}`);
  return res.json() as Promise<{ review: HomeworkReview }>;
}

export async function fetchHomeworkReviews(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/homework/reviews?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Homework reviews error ${res.status}`);
  return res.json() as Promise<{ reviews: HomeworkReview[] }>;
}

export async function fetchHomeworkReview(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/homework/reviews/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Homework review error ${res.status}`);
  return res.json() as Promise<{ review: HomeworkReview }>;
}

// Study Rooms
export interface StudyRoom { id: string; name: string; topic?: string }
export async function createRoom(params: { name: string; topic?: string; ownerId: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/rooms`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Create room error ${res.status}`);
  return res.json() as Promise<{ room: StudyRoom }>;
}
export async function listRooms() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/rooms`);
  if (!res.ok) throw new Error(`List rooms error ${res.status}`);
  return res.json() as Promise<{ rooms: StudyRoom[] }>;
}
export async function joinRoom(roomId: string, userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/rooms/${encodeURIComponent(roomId)}/join`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
  if (!res.ok) throw new Error(`Join room error ${res.status}`);
  return res.json();
}
export async function fetchRoomMessages(roomId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/rooms/${encodeURIComponent(roomId)}/messages`);
  if (!res.ok) throw new Error(`Fetch room messages error ${res.status}`);
  return res.json() as Promise<{ messages: Array<{ userId: string | null; type: string; content: string; createdAt: string }> }>;
}

// Engagement API
export async function postEngagement(params: { userId: string; attention?: number; frustration?: number; cameraEnabled?: boolean }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/engagement`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Engagement post error ${res.status}`);
  return res.json();
}
export async function fetchEngagement(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/engagement/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Engagement get error ${res.status}`);
  return res.json() as Promise<{ engagement?: { attention: number; frustration: number; cameraEnabled: boolean } }>;
}

export async function fetchPrereqs(params: { userId: string; subject?: string; topic: string }) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/knowledge/prereqs`);
  url.searchParams.set('userId', params.userId);
  url.searchParams.set('topic', params.topic);
  if (params.subject) url.searchParams.set('subject', params.subject);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Prereqs error ${res.status}`);
  return res.json() as Promise<{ prereqs: string[] }>;
}

export async function generateInteractiveLesson(params: { topic: string; grade?: string|number; language?: 'en'|'si'|'ta' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/interactive`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Interactive lesson error ${res.status}`);
  return res.json() as Promise<{ lesson: { title: string; overview: string; steps: Array<{ title: string; content: string; check?: { question: string; answer: string } }>; summary?: string; script?: string; srt?: string } }>;
}

// YouTube generation and publish
export async function generateLessonVideo(params: { title: string; description?: string; script?: string; srt?: string; thumbnail?: File }) {
  const baseUrl = getBaseUrl();
  const form = new FormData();
  form.append('title', params.title);
  if (params.description) form.append('description', params.description);
  if (params.script) form.append('script', params.script);
  if (params.srt) form.append('srt', params.srt);
  if (params.thumbnail) form.append('thumbnail', params.thumbnail);
  const res = await fetch(`${baseUrl}/api/youtube/generate`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`Video generate error ${res.status}`);
  return res.json() as Promise<{ videoUrl?: string; jobId?: string; status?: string }>;
}
export async function publishYouTube(params: { title: string; description?: string; tags?: string[]; videoUrl?: string; videoFile?: File; thumbnail?: File; chapters?: string; captionsSrt?: string }) {
  const baseUrl = getBaseUrl();
  const form = new FormData();
  form.append('title', params.title);
  if (params.description) form.append('description', params.description);
  if (params.tags) form.append('tags', JSON.stringify(params.tags));
  if (params.videoFile) form.append('video', params.videoFile);
  if (params.videoUrl) form.append('videoUrl', params.videoUrl);
  if (params.thumbnail) form.append('thumbnail', params.thumbnail);
  if (params.chapters) form.append('chapters', params.chapters);
  if (params.captionsSrt) form.append('captions', params.captionsSrt);
  const res = await fetch(`${baseUrl}/api/youtube/publish`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`YouTube publish error ${res.status}`);
  return res.json() as Promise<{ url?: string; videoId?: string }>;
}

export type CareerPath = { name: string; why: string; requiredSkills: string[]; sampleUniversities: string[] };
export type CareerAdvice = { summary: string; recommendedSubjects: string[]; careerPaths: CareerPath[]; roadmap: { next3Months: string[]; nextYear: string[]; resources: string[] } };
export async function getCareerAdvice(params: { userId: string; interests?: string[]; strengths?: string[]; region?: string; language?: 'en'|'si'|'ta' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/career/advice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Career advice error ${res.status}`);
  return res.json() as Promise<{ advice: CareerAdvice }>;
}

// Interactive sessions
export interface LessonSession { id: string; userId: string; topic: string; currentStepIndex: number; score: number; completed?: boolean; completedAt?: string; lesson: { title: string; overview?: string; steps: Array<{ title: string; content: string; check?: { question: string; answer: string } }> } }
export async function startLessonSession(params: { userId: string; topic: string; grade?: string|number; language?: 'en'|'si'|'ta' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/session/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Start session error ${res.status}`);
  return res.json() as Promise<{ id: string; lesson: LessonSession['lesson'] }>;
}
export async function fetchLessonSession(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/session/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Get session error ${res.status}`);
  return res.json() as Promise<{ session: LessonSession }>;
}
export async function answerLessonStep(id: string, answer: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/session/${encodeURIComponent(id)}/answer`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ answer }) });
  if (!res.ok) throw new Error(`Answer step error ${res.status}`);
  return res.json() as Promise<{ correct: boolean; nextIndex: number; score: number }>;
}
export async function getLessonHint(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/session/${encodeURIComponent(id)}/hint`, { method: 'POST' });
  if (!res.ok) throw new Error(`Hint error ${res.status}`);
  return res.json() as Promise<{ hint: string }>;
}

// Notifications
export type Notification = { id: string; userId?: string; type: string; title: string; message: string; isRead?: boolean; relatedId?: string; createdAt: string };
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/notifications/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Notifications error ${res.status}`);
  const data = (await res.json()) as { notifications?: Notification[] };
  return data.notifications ?? [];
}
export async function markNotificationRead(id: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
  if (!res.ok) throw new Error(`Mark read error ${res.status}`);
  return res.json() as Promise<{ success: boolean }>;
}

export async function exportToDocs(params: { title: string; content: string; token?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/export/docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error(`Export docs error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; docUrl?: string; docId?: string; docContent?: string }>;
}

export async function saveIntegrationToken(params: { userId: string; provider: 'google'|'quizlet'; accessToken: string; refreshToken?: string; expiry?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/integrations/tokens`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Save token error ${res.status}`);
  return res.json();
}

export async function exportQuizletSet(params: { userId: string; title?: string; accessToken?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/quizlet/export`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Quizlet export error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; setId?: string; url?: string }>;
}

// Native Anki .apkg import/export
export async function exportApkg(params: { userId: string; deckId?: string; includeMedia?: boolean }) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/flashcards/apkg/export`);
  url.searchParams.set('userId', params.userId);
  if (params.deckId) url.searchParams.set('deckId', params.deckId);
  if (params.includeMedia) url.searchParams.set('includeMedia', 'true');
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`APKG export error ${res.status}`);
  const blob = await res.blob();
  return blob;
}
export async function importApkg(params: { userId: string; file: File }) {
  const baseUrl = getBaseUrl();
  const form = new FormData();
  form.append('userId', params.userId);
  form.append('file', params.file);
  const res = await fetch(`${baseUrl}/api/flashcards/apkg/import`, { method: 'POST', body: form });
  if (!res.ok) throw new Error(`APKG import error ${res.status}`);
  return res.json() as Promise<{ imported: number; decks?: Array<{ id: string; name: string }> }>;
}

export async function generateQuiz(params: { topic: string; difficulty: 'easy'|'medium'|'hard'; count?: number; language?: 'en'|'si'|'ta' }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/quizzes/generate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) });
  if (!res.ok) throw new Error(`Generate quiz error ${res.status}`);
  return res.json() as Promise<{ questions: { questions: Array<{ question: string; options: string[]; correctAnswer: string }> } }>;
}
export async function listLessonSessions(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/lessons/sessions/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`List sessions error ${res.status}`);
  return res.json() as Promise<{ sessions: LessonSession[] }>;
}

// Assignments (teacher workflows)
export async function listAssignments(params: { teacherId?: string; studentId?: string }) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/assignments`);
  if (params.teacherId) url.searchParams.set('teacherId', params.teacherId);
  if (params.studentId) url.searchParams.set('studentId', params.studentId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`List assignments error ${res.status}`);
  return res.json() as Promise<{ assignments: Array<{ id: string; title: string; description: string; subject: string; dueDate: string }> }>;
}
export async function listSubmissions(assignmentId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/assignments/${encodeURIComponent(assignmentId)}/submissions`);
  if (!res.ok) throw new Error(`List submissions error ${res.status}`);
  return res.json() as Promise<{ submissions: Array<{ id: string; studentId: string; content?: string; attachments?: string[]; submittedAt: string; grade?: number; feedback?: string }> }>;
}
export async function gradeSubmission(submissionId: string, grade: number, feedback: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/assignments/submissions/${encodeURIComponent(submissionId)}/grade`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ grade, feedback }) });
  if (!res.ok) throw new Error(`Grade submission error ${res.status}`);
  return res.json() as Promise<{ submission: any }>;
}

export async function translate(text: string, target: 'en'|'si'|'ta'|'hi'|'zh') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/translate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, target }) });
  if (!res.ok) throw new Error(`Translate error ${res.status}`);
  return res.json() as Promise<{ text: string }>;
}

// Low-latency neural TTS (server-backed)
export async function ttsStream(text: string, voice?: string): Promise<ReadableStream<Uint8Array>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/tts/stream`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice }) });
  if (!res.ok || !res.body) throw new Error(`TTS stream error ${res.status}`);
  return res.body as unknown as ReadableStream<Uint8Array>;
}

export async function fetchNextTopics(params: { userId: string; subject?: string; topic: string }) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/knowledge/next`);
  url.searchParams.set('userId', params.userId);
  url.searchParams.set('topic', params.topic);
  if (params.subject) url.searchParams.set('subject', params.subject);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Next topics error ${res.status}`);
  return res.json() as Promise<{ next: string[] }>;
}

// Dashboards
export async function fetchTeacherDashboard(teacherId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/dashboard/teacher/${encodeURIComponent(teacherId)}`);
  if (!res.ok) throw new Error(`Teacher dashboard error ${res.status}`);
  return res.json() as Promise<{ students: Array<{ userId: string; progress?: { xp: number; level: number; streak: number }; weak: Array<{ topic: string; accuracy: number }>; strong: Array<{ topic: string; accuracy: number }> }> }>;
}

export async function fetchParentDashboard(parentId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/dashboard/parent/${encodeURIComponent(parentId)}`);
  if (!res.ok) throw new Error(`Parent dashboard error ${res.status}`);
  return res.json() as Promise<{ children: Array<{ userId: string; name?: string; progress?: { xp: number; level: number; streak: number }; weak: Array<{ topic: string; accuracy: number }>; strong: Array<{ topic: string; accuracy: number }> }> }>;
}

export async function generateHomeActivities(input: { childId: string; timeframe?: 'daily'|'weekly'; language?: 'en'|'si'|'ta'; count?: number }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/parent/home-activities`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Home activities error ${res.status}`);
  return res.json() as Promise<{ timeframe: 'daily'|'weekly'; items: Array<{ title: string; description: string; steps: string[]; materials?: string[] }> }>;
}

// Classes and student trends
export async function listClasses(teacherId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(teacherId)}`);
  if (!res.ok) throw new Error(`List classes error ${res.status}`);
  return res.json() as Promise<{ classes: Array<{ id: string; name: string }> }>;
}
export async function createClass(input: { name: string; teacherId: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Create class error ${res.status}`);
  return res.json() as Promise<{ id: string }>;
}
export async function listClassMembers(classId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(classId)}/members`);
  if (!res.ok) throw new Error(`List members error ${res.status}`);
  return res.json() as Promise<{ members: Array<{ studentId: string }> }>;
}
export async function addClassMember(classId: string, studentId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(classId)}/members`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentId }) });
  if (!res.ok) throw new Error(`Add member error ${res.status}`);
  return res.json() as Promise<{ ok: boolean }>;
}

export async function fetchClassGaps(classId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(classId)}/gaps`);
  if (!res.ok) throw new Error(`Class gaps error ${res.status}`);
  return res.json() as Promise<{ gaps: Array<{ topic: string; accuracy: number; attempts: number }> }>;
}

export async function assignClassPractice(classId: string, input: { teacherId: string; topics: string[]; dueDate?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(classId)}/assign-practice`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Assign practice error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; count: number }>;
}
export async function assignClassQuiz(classId: string, input: { teacherId: string; topic: string; difficulty?: 'easy'|'medium'|'hard'; count?: number; dueDate?: string }) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/classes/${encodeURIComponent(classId)}/assign-quiz`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  if (!res.ok) throw new Error(`Assign quiz error ${res.status}`);
  return res.json() as Promise<{ ok: boolean; count: number }>;
}
export async function fetchStudentTrends(userId: string, days = 14) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/dashboard/student/${encodeURIComponent(userId)}/trends?days=${days}`);
  if (!res.ok) throw new Error(`Trends error ${res.status}`);
  return res.json() as Promise<{ trends: Array<{ date: string; attempts: number; correct: number }> }>;
}
export async function fetchStudentSummary(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/dashboard/student/${encodeURIComponent(userId)}/summary`);
  if (!res.ok) throw new Error(`Summary error ${res.status}`);
  return res.json() as Promise<{ progress?: { xp: number; level: number; streak: number }; weak: Array<{ topic: string; accuracy: number }>; strong: Array<{ topic: string; accuracy: number }> }>;
}
export async function fetchStudentSuggestions(userId: string) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/dashboard/student/${encodeURIComponent(userId)}/suggestions`);
  if (!res.ok) throw new Error(`Suggestions error ${res.status}`);
  return res.json() as Promise<{ suggestions: Array<{ topic: string; pCorrect: number; difficulty: 'easy'|'medium'|'hard' }> }>;
}

// =====================================================
// META-LEARNING CORE API FUNCTIONS
// =====================================================

// Teaching Optimization Engine
export async function fetchTeachingStrategies() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/teaching-strategies`);
  if (!res.ok) throw new Error(`Teaching strategies error ${res.status}`);
  return res.json() as Promise<{ strategies: any[] }>;
}

export async function logTeachingInteraction(interaction: any) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/teaching-interactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(interaction)
  });
  if (!res.ok) throw new Error(`Teaching interaction error ${res.status}`);
  return res.json();
}

// Self-Improving Curriculum AI
export async function fetchCurriculumPerformance(subject?: string, difficulty?: string) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/meta-learning/curriculum-performance`);
  if (subject) url.searchParams.set('subject', subject);
  if (difficulty) url.searchParams.set('difficulty', difficulty);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Curriculum performance error ${res.status}`);
  return res.json() as Promise<{ performance: any[] }>;
}

export async function createCurriculumRule(rule: any) {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/curriculum-rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rule)
  });
  if (!res.ok) throw new Error(`Create curriculum rule error ${res.status}`);
  return res.json();
}

// Federated Learning Network
export async function fetchFederatedModels() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/federated-models`);
  if (!res.ok) throw new Error(`Federated models error ${res.status}`);
  return res.json() as Promise<{ models: any[] }>;
}

export async function fetchFederatedRounds(modelId?: string) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/meta-learning/federated-rounds`);
  if (modelId) url.searchParams.set('modelId', modelId);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Federated rounds error ${res.status}`);
  return res.json() as Promise<{ rounds: any[] }>;
}

// Meta-Learning Insights
export async function fetchMetaLearningInsights(insightType?: string) {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/meta-learning/insights`);
  if (insightType) url.searchParams.set('type', insightType);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Meta-learning insights error ${res.status}`);
  return res.json() as Promise<{ insights: any[] }>;
}

export async function fetchMetaLearningExperiments() {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/experiments`);
  if (!res.ok) throw new Error(`Meta-learning experiments error ${res.status}`);
  return res.json() as Promise<{ experiments: any[] }>;
}

// Meta-Learning Analytics
export async function fetchMetaLearningAnalytics(timeRange: string = '30d') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/meta-learning/analytics?timeRange=${timeRange}`);
  if (!res.ok) throw new Error(`Meta-learning analytics error ${res.status}`);
  return res.json() as Promise<{ analytics: any }>;
}

// A/B testing helpers
export type AbAssignment = { userId: string; testName: string; bucket: 'A'|'B'; createdAt?: string };
export async function abAssign(userId: string): Promise<{ bucket: 'A'|'B' }> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/ab/assign`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) });
  if (!res.ok) throw new Error(`AB assign error ${res.status}`);
  return res.json() as Promise<{ bucket: 'A'|'B' }>;
}
export async function abSet(userId: string, bucket: 'A'|'B', testName = 'adaptive-strategy'): Promise<void> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/ab/set`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, testName, bucket }) });
  if (!res.ok) throw new Error(`AB set error ${res.status}`);
}
export async function listAbAssignments(): Promise<AbAssignment[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/ab/assignments`);
  if (!res.ok) throw new Error(`AB assignments error ${res.status}`);
  const data = await res.json() as { assignments?: AbAssignment[] };
  return data.assignments || [];
}
export async function adminListEvents(namePrefix?: string): Promise<Array<{ name: string; userId?: string; createdAt?: string; props?: any }>> {
  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}/api/admin/events`);
  if (namePrefix) url.searchParams.set('name', namePrefix);
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Admin events error ${res.status}`);
  const data = await res.json() as { events?: Array<{ name: string; userId?: string; createdAt?: string; props?: any }> };
  return data.events || [];
}
