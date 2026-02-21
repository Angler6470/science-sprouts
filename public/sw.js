/* eslint-disable no-restricted-globals */
// Dynamic cache name with timestamp - forces cache invalidation on each deployment
const CACHE_BASE = 'sciencesprouts';
const CACHE_VERSION = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
const CACHE_NAME = `${CACHE_BASE}-${CACHE_VERSION}`;
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/assets/mascot-garden.png',
  '/assets/mascot-ocean.png',
  '/assets/mascot-space.png',
  '/assets/helper-bee.png',
  '/assets/helper-fish.png',
  '/assets/helper-stars.png',
  '/assets/feedback-success.png',
  '/assets/feedback-error.png',
  '/assets/balance-seed.png',
  '/assets/balance-whale.png',
  '/assets/balance-asteroid.png',
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network-first for HTML, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  const isHtmlRequest = event.request.headers.get('accept')?.includes('text/html');
  const isStaticAsset = event.request.url.includes('/assets/') || 
                        event.request.url.includes('/static/');

  if (isHtmlRequest) {
    // Network-first for HTML - always try to get latest version
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            // Cache successful HTML responses
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request) || caches.match('/');
        })
    );
  } else {
    // Cache-first for static assets
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then((response) => {
          // Cache successful responses for static assets
          if (response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        }).catch(() => {
          // Return blank response for failed asset requests
          return new Response('', { status: 404 });
        });
      })
    );
  }
});
