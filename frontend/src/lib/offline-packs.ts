export type OfflineLessonStep = { title: string; content: string; check?: { question: string; answer: string } };
export type OfflineLesson = { title: string; overview?: string; steps: OfflineLessonStep[]; summary?: string; script?: string; srt?: string };
export type LessonPack = { id: string; topic: string; grade?: string | number; createdAt: string; lesson: OfflineLesson };

const DB_NAME = 'ai-tutor-offline';
const STORE = 'lessonPacks';

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveLessonPack(input: { topic: string; grade?: string | number; lesson: OfflineLesson }): Promise<LessonPack> {
  const db = await openDb();
  const pack: LessonPack = { id: crypto.randomUUID(), topic: input.topic, grade: input.grade, createdAt: new Date().toISOString(), lesson: input.lesson };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.put(pack);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
  return pack;
}

export async function listLessonPacks(): Promise<Array<Pick<LessonPack, 'id'|'topic'|'grade'|'createdAt'>>> {
  const db = await openDb();
  const items: Array<Pick<LessonPack, 'id'|'topic'|'grade'|'createdAt'>> = [];
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result as IDBCursorWithValue | null;
      if (!cursor) return resolve();
      const v = cursor.value as LessonPack;
      items.push({ id: v.id, topic: v.topic, grade: v.grade, createdAt: v.createdAt });
      cursor.continue();
    };
    req.onerror = () => reject(req.error);
  });
  db.close();
  // newest first
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getLessonPack(id: string): Promise<LessonPack | undefined> {
  const db = await openDb();
  const pack = await new Promise<LessonPack | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result as LessonPack | undefined);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return pack;
}

export async function deleteLessonPack(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
  db.close();
}
