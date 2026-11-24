/**
 * School Discipline Tracker - Service Worker
 * Enables 100% offline functionality, caching static assets with Network-First strategy
 * for navigation to ensure live updates sync seamlessly.
 */

const CACHE_NAME = 'discipline-tracker-v6';
const ASSETS_TO_CACHE = [
  './index.html',
  './discipline.html',
  './issues.html',
  './manifest.json',
  './discipline-manifest.json',
  './assets/css/discipline.css?v=v20diff',
  './assets/js/firebase-config.js?v=v20diff',
  './assets/js/discipline-auth.js?v=v20diff',
  './assets/js/discipline-app.js?v=v20diff',
  './assets/images/logo.png',
  './assets/images/hadi-education-logo.jpg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline discipline tracker assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Clearing old cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Network-First for everything when online to ensure fresh code
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then(res => res || caches.match('./index.html')))
  );
});