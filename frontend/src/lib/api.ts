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

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
    if (!fromEnv) {
      throw new Error("NEXT_PUBLIC_BASE_URL is not set");
    }
    return fromEnv;
  }
  // Server: also rely on NEXT_PUBLIC_BASE_URL for now
  const fromEnv = process.env.NEXT_PUBLIC_BASE_URL;
  if (!fromEnv) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not set");
  }
  return fromEnv;
};

export async function chat(request: ChatRequest, init?: RequestInit): Promise<ChatResponse> {
  const baseUrl = getBaseUrl();
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
    const text = await res.text().catch(() => "");
    throw new Error(`Chat API error ${res.status}: ${text || res.statusText}`);
  }
  const data = (await res.json()) as { message?: { content?: string } };
  const reply = data?.message?.content;
  if (!reply) {
    throw new Error("Invalid response from Chat API");
  }
  return { reply };
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
  const res = await fetch(`${baseUrl}/api/progress/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Progress error ${res.status}`);
  const data = (await res.json()) as ProgressResponse;
  return data.progress;
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
  const res = await fetch(`${baseUrl}/api/achievements`);
  if (!res.ok) throw new Error(`Achievements error ${res.status}`);
  const data = (await res.json()) as { achievements?: AchievementItem[] };
  return data.achievements ?? [];
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

export async function fetchLeaderboard(limit = 10): Promise<LeaderboardItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/leaderboard?limit=${limit}`);
  if (!res.ok) throw new Error(`Leaderboard error ${res.status}`);
  const data = (await res.json()) as { leaderboard?: LeaderboardItem[] };
  return data.leaderboard ?? [];
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

export async function fetchMastery(userId: string): Promise<Record<string, { correct: number; attempts: number }>> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/learning/mastery/${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Mastery fetch error ${res.status}`);
  const data = await res.json();
  return data.mastery ?? {};
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

export async function translate(text: string, target: 'en'|'si'|'ta'|'hi'|'zh') {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/translate`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, target }) });
  if (!res.ok) throw new Error(`Translate error ${res.status}`);
  return res.json() as Promise<{ text: string }>;
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
