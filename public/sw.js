self.addEventListener('install', e => {
  e.waitUntil(caches.open('rr-clean-v1').then(cache => {
    return cache.addAll([
      '/',
      '/index.html',
      '/cadeteria.html',
      '/transporte.html',
      '/style.css'
    ]);
  }));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});