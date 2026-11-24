// AMAZ Product Costing — Service Worker (offline-first, resilient)
const CACHE = 'amaz-costing-v19.95';
const LIBS = 'amaz-libs-v1'; // CDN libraries — kept across versions
const SHELL = ['./index.html', './', './manifest.webmanifest', './app-icon-192.png', './app-icon-512.png', './app-icon-maskable.png', './app-apple-touch.png'];
const CDN = /(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|unpkg\.com|fonts\.googleapis\.com|fonts\.gstatic\.com)/;

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    // one by one — a missing file must never abort the whole install
    await Promise.all(SHELL.map(u => fetch(u, {cache: 'reload'}).then(r => { if (r && r.ok) return c.put(u, r); }).catch(() => {})));
    // make sure the app page is stored under both keys
    const idx = await c.match('./index.html') || await c.match('./');
    if (idx) { await c.put('./index.html', idx.clone()); await c.put('./', idx.clone()); }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const cur = await caches.open(CACHE);
    const ok = await cur.match('./index.html');
    const keys = await caches.keys();
    // delete old app caches only when the new one really has the app page
    if (ok) await Promise.all(keys.filter(k => k !== CACHE && k !== LIBS && k.indexOf('amaz-costing-') === 0).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function anyIndex() {
  return (await caches.match('./index.html', {ignoreSearch: true})) ||
         (await caches.match('./', {ignoreSearch: true})) ||
         (await caches.match('index.html', {ignoreSearch: true}));
}

function offlinePage() {
  return new Response('<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AMAZ Costing — Offline</title><body style="font-family:sans-serif;padding:30px;text-align:center"><h2>ইন্টারনেট নেই</h2><p>অ্যাপটি এখনো এই ডিভাইসে অফলাইনের জন্য সেভ হয়নি। একবার ইন্টারনেট সহ খুলুন — এরপর ইন্টারনেট ছাড়াই চলবে।</p><button onclick="location.reload()" style="padding:10px 20px;font-size:16px">আবার চেষ্টা</button></body>', {headers: {'Content-Type': 'text/html; charset=utf-8'}});
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.pathname.endsWith('version.json')) {
    e.respondWith(fetch(req, {cache: 'no-store'}).catch(() => new Response('{}', {headers: {'Content-Type': 'application/json'}})));
    return;
  }

  // App page: network first (3.5s), fall back to cache — never fail
  if (req.mode === 'navigate' || (url.origin === location.origin && /\/(index\.html)?$/.test(url.pathname))) {
    e.respondWith((async () => {
      try {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), 3500);
        const r = await fetch(req, {signal: ctl.signal});
        clearTimeout(t);
        if (r && r.ok) {
          const c = await caches.open(CACHE);
          c.put('./index.html', r.clone()); c.put('./', r.clone());
          return r;
        }
        return (await anyIndex()) || r;
      } catch (err) {
        return (await anyIndex()) || offlinePage();
      }
    })());
    return;
  }

  // CDN libraries: cache first, stored in the persistent libs cache
  if (CDN.test(url.hostname)) {
    e.respondWith((async () => {
      const hit = await caches.match(req);
      if (hit) return hit;
      try {
        const r = await fetch(req);
        if (r && (r.ok || r.type === 'opaque')) { const c = await caches.open(LIBS); c.put(req, r.clone()); }
        return r;
      } catch (err) { return new Response('', {status: 504}); }
    })());
    return;
  }

  // Other same-origin files: cache first, then network
  e.respondWith((async () => {
    const hit = await caches.match(req, {ignoreSearch: true});
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r && r.ok && url.origin === location.origin) { const c = await caches.open(CACHE); c.put(req, r.clone()); }
      return r;
    } catch (err) { return new Response('', {status: 504}); }
  })());
});
