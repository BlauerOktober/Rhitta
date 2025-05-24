const CACHE_NAME = 'rhitta-v1';
const PRECACHE_URLS = [
  '/', // fallback route for SPA
  '/index.html',
  '/manifest.json',
  '/css/styles.css',
  '/css/vendor.css',
  '/js/main.js',
  '/js/modal.js',
  '/js/modernizr.js',
  '/js/bountys.js',
  '/js/plugins.js',
  '/js/calc_num.js',
  '/icon512_rounded.png',
  '/icon512_maskable.png'
];

const RUNTIME_CDN_HOSTS = [
  'cdn.datatables.net',
  'code.jquery.com',
  'js/fontawesome'
];

// Install: precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: clean old cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, then runtime fallback
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Only GET requests are handled
  if (request.method !== 'GET') return;

  // Runtime caching for CDN assets
  if (RUNTIME_CDN_HOSTS.some(host => url.hostname.includes(host))) {
    event.respondWith(
      caches.open('cdn-cache').then(cache =>
        cache.match(request).then(response => {
          const fetchPromise = fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        })
      )
    );
    return;
  }

  // App shell routing: fallback to index.html for navigation
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => response || fetch(request))
    );
    return;
  }

  // Cache-first strategy for static files
  event.respondWith(
    caches.match(request).then(response => {
      return response || fetch(request);
    })
  );
});
