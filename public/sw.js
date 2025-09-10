self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('rr-app').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/style.css',
        '/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
