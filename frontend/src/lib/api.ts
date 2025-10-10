export interface ChatRequest {
  userId: string;
  message: string;
}

export interface ChatResponse {
  reply: string;
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
  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Chat API error ${res.status}: ${text || res.statusText}`);
  }
  const data = (await res.json()) as ChatResponse;
  if (!data || typeof data.reply !== "string") {
    throw new Error("Invalid response from Chat API");
  }
  return data;
}
