/*
  SACAR Mart Service Worker
  - Caches the static app shell (HTML/CSS/JS) and images so repeat visits
    load instantly and never show a blank page while offline/slow.
  - NEVER caches calls to the Google Apps Script backend — product data,
    orders, and wallet requests always stay live/network-driven.
  - Bump CACHE_VERSION whenever a deployed CSS/JS file changes so old
    cached assets are replaced instead of served stale forever.
*/
const CACHE_VERSION = 'v1';
const STATIC_CACHE = `sacar-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `sacar-images-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './style.css',
  './business-card.css',
  './cursor.css',
  './script.js',
  './cursor.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => {}) // never block install on a single failed asset
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names
          .filter((name) => name !== STATIC_CACHE && name !== IMAGE_CACHE)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

function isApiRequest(url) {
  return url.hostname.includes('script.google.com') || url.hostname.includes('googleusercontent.com');
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return; // never intercept POST (order/admin/wallet actions)

  const url = new URL(req.url);

  // Never cache backend API calls — data must always be live.
  if (isApiRequest(url)) return;

  // Images: cache-first, so a product/category image is only ever downloaded once.
  if (req.destination === 'image') {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Same-origin static assets (HTML/CSS/JS): stale-while-revalidate —
  // instant response from cache, silently refreshed in the background.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(req).then((cached) => {
          const network = fetch(req).then((res) => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          }).catch(() => cached);
          return cached || network;
        })
      )
    );
    return;
  }

  // Everything else (fonts, third-party CSS/JS like Font Awesome): cache-first.
  event.respondWith(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
      })
    )
  );
});
