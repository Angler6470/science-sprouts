/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'readingsprouts-v1';
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

// Fetch event - cache-first for static assets, network-first for others
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Cache new static assets (like theme-specific plants) as they are loaded
        if (response.status === 200 && (
          event.request.url.includes('/assets/') || 
          event.request.url.includes('/static/')
        )) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // If both network and cache fail, and it's a navigation request, return index.html
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
      });
    })
  );
});
