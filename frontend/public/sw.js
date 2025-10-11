/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'tutor-cache-v1';
const API_PREFIX = self.location.origin + '/api/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
    try { await self.registration.sync?.register('flush-queue'); } catch {}
  })());
});

// Simple IndexedDB wrapper
const DB_NAME = 'sw-queue';
const STORE = 'requests';
function withDB(fn) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB_NAME, 1);
    open.onupgradeneeded = () => {
      const db = open.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
    };
    open.onerror = () => reject(open.error);
    open.onsuccess = () => fn(open.result).then(resolve, reject);
  });
}
async function queueRequest(record) {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).add(record);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}
async function getAllQueued() {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  }));
}
async function deleteQueued(id) {
  return withDB((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }));
}

async function replayQueued() {
  const entries = await getAllQueued();
  for (const entry of entries) {
    try {
      const headers = new Headers(entry.headers || {});
      const init = { method: entry.method, headers, body: entry.body, mode: 'same-origin', credentials: 'same-origin' };
      const res = await fetch(entry.url, init);
      if (res.ok) {
        await deleteQueued(entry.id);
      }
    } catch {}
  }
}

self.addEventListener('message', (event) => {
  if (!event.data) return;
  const { type } = event.data;
  if (type === 'FLUSH_QUEUE') {
    event.waitUntil((async () => {
      await replayQueued();
      try { event.source?.postMessage({ type: 'FLUSH_DONE' }); } catch {}
    })());
  } else if (type === 'GET_QUEUE_SIZE') {
    event.waitUntil((async () => {
      const all = await getAllQueued();
      try { event.source?.postMessage({ type: 'QUEUE_SIZE', count: all.length }); } catch {}
    })());
  }
  else if (type === 'REMIND_DUE') {
    const { userId } = event.data || {};
    if (!userId) return;
    event.waitUntil((async () => {
      try {
        // Respect quiet hours from localStorage if provided via a broadcast in the future
        // For now, keep behavior simple to avoid SW-localStorage limitations
        const res = await fetch(`/api/learning/review/${encodeURIComponent(userId)}?limit=3`);
        if (!res.ok) return;
        const data = await res.json();
        const items = (data.due || []).map((d) => (typeof d === 'string' ? d : d.topic));
        const body = items && items.length ? `Due topics: ${items.join(', ')}` : 'No reviews due. Keep your streak!';
        await self.registration.showNotification('AI Tutor', { body, tag: 'ai-tutor-due', icon: '/icon-192.png' });
      } catch {}
    })());
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'flush-queue') {
    event.waitUntil(replayQueued());
  }
});

function shouldCacheGET(url) {
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/_next/')) return true;
  if (url.pathname.startsWith('/api/')) return true;
  return true; // pages and assets
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Handle GET with stale-while-revalidate
  if (req.method === 'GET' && shouldCacheGET(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then((response) => {
        if (response && response.ok) cache.put(req, response.clone());
        return response;
      }).catch(() => undefined);
      return cached || fetchPromise || new Response('', { status: 504, statusText: 'Offline' });
    })());
    return;
  }

  // Queue JSON POST/PUT/PATCH/DELETE to same-origin /api when offline/fails
  if (req.url.startsWith(API_PREFIX) && req.method !== 'GET') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req.clone());
        return res;
      } catch {
        // Only queue JSON payloads
        const headers = {};
        req.headers.forEach((v, k) => headers[k] = v);
        let body = null;
        try {
          const ct = req.headers.get('content-type') || '';
          if (ct.includes('application/json') || ct.startsWith('text/')) {
            body = await req.clone().text();
          } else {
            // unsupported body type for offline queue
            return new Response(JSON.stringify({ error: 'offline', queued: false }), { headers: { 'Content-Type': 'application/json' }, status: 503 });
          }
        } catch {}
        await queueRequest({ url: req.url, method: req.method, headers, body, ts: Date.now() });
        return new Response(JSON.stringify({ ok: true, queued: true }), { headers: { 'Content-Type': 'application/json' }, status: 202 });
      }
    })());
    return;
  }
});
