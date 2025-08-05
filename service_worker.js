// service-worker.js
self.addEventListener('install', event => {
  console.log('Service Worker instalado com sucesso');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker ativado');
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
