// SW v2: очищає старі кеші, пропускає всі запити через мережу
self.addEventListener('install', function(event) {
  self.skipWaiting();
});
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(cacheName) {
        return caches.delete(cacheName);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});
// fetch не перехоплюємо — браузер сам ходить в мережу
