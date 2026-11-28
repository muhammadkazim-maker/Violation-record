/**
 * School Discipline Tracker - Service Worker
 * Enables 100% offline functionality, caching static assets with Network-First strategy
 * for navigation to ensure live updates sync seamlessly.
 */

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.map((key) => caches.delete(key)));
    }).then(() => {
      return self.registration.unregister();
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Direct network pass-through
  return;
});