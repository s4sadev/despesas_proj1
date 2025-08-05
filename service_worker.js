// service-worker.js

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('meu-app-cache').then(cache => {
      return cache.addAll([
        '/',          // Página inicial
        '/index.html', // SPA base
        '/manifest.json',
        '/favicon.ico'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se o recurso já está no cache, retorna ele
      if (response) return response;

      // Caso contrário, tenta buscar na rede
      return fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
