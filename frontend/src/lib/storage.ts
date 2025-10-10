import { Message } from "./types";

export interface ConversationIndexItem {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
}

const INDEX_KEY = "conversationsIndex";
const ACTIVE_ID_KEY = "activeConversationId";

function readIndex(): ConversationIndexItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    return raw ? (JSON.parse(raw) as ConversationIndexItem[]) : [];
  } catch {
    return [];
  }
}

function writeIndex(index: ConversationIndexItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

export function loadConversation(id: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(`conversation:${id}`);
    return raw ? (JSON.parse(raw) as Message[]) : [];
  } catch {
    return [];
  }
}

export function saveConversation(id: string, messages: Message[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`conversation:${id}`, JSON.stringify(messages));
  // update index
  const index = readIndex();
  const now = Date.now();
  const firstUser = messages.find((m) => m.role === "user");
  const title = firstUser ? truncate(firstUser.content, 80) : "New chat";
  const existing = index.find((i) => i.id === id);
  if (existing) {
    existing.updatedAt = now;
    existing.messageCount = messages.length;
    if (title) existing.title = title;
  } else {
    index.unshift({ id, title, createdAt: now, updatedAt: now, messageCount: messages.length });
  }
  writeIndex(index);
}

export function deleteConversation(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(`conversation:${id}`);
  const index = readIndex().filter((i) => i.id !== id);
  writeIndex(index);
}

export function getConversations(): ConversationIndexItem[] {
  return readIndex();
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + "…";
}

export function setActiveConversationId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACTIVE_ID_KEY, id);
}

export function getActiveConversationId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_ID_KEY);
}
