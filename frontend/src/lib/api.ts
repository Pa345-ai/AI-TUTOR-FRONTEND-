export interface ChatRequest {
  userId: string;
  message: string;
  language?: "en" | "si" | "ta";
  mode?: "socratic" | "exam" | "friendly" | "motivational";
  level?: "eli5" | "normal" | "expert";
  subject?: string;
  grade?: number | string;
  curriculum?: "lk" | "international";
}

export interface ChatResponse {
  reply: string;
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
  tags?: string[];
}

export async function fetchFlashcards(userId: string): Promise<FlashcardItem[]> {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/flashcards?userId=${encodeURIComponent(userId)}`);
  if (!res.ok) throw new Error(`Flashcards error ${res.status}`);
  const data = (await res.json()) as { flashcards?: FlashcardItem[] };
  return data.flashcards ?? [];
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
