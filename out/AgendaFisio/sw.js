// Ultra-safe Pass-Through Service Worker for AgendaFisio PWA
// Guarantees Android PWA installability while ensuring 0% risk of white screen caching errors.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Always fetch directly from the network so live JS/CSS React bundles load perfectly!
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
