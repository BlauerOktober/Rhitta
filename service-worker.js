const CACHE_NAME = 'rhitta-v2';
const PRECACHE_URLS = [
  '/',
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

// Install event - precache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting(); // Activate new SW ASAP
});

// Activate event - clean old caches + notify clients
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );

  // Notify clients about the new service worker activation
  event.waitUntil(
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({ type: 'NEW_VERSION_AVAILABLE' });
      });
    })
  );
});

// Fetch event - handle runtime caching & fallback
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // Runtime caching for CDN assets with stale-while-revalidate
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

  // App shell fallback for navigation (SPA)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html').then(response => response || fetch(request))
    );
    return;
  }

  // Default cache-first strategy
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
