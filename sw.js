/* AMAZ Product Costing — অফলাইন সার্ভিস ওয়ার্কার */
const CACHE = 'amaz-costing-v18.32';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable.png', './apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if(req.method !== 'GET') return;
  // অ্যাপ পেজ: আগে নেটওয়ার্ক (নতুন আপডেট পেতে), না পেলে ক্যাশ
  if(req.mode === 'navigate'){
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put('./index.html', cp)); return r; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // বাকি সব (আইকন, CDN লাইব্রেরি, ফন্ট): আগে ক্যাশ, নাহলে নেটওয়ার্ক থেকে এনে ক্যাশ (offline এর জন্য)
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if(r.ok || r.type === 'opaque'){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
