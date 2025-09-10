
self.addEventListener('install', (e)=>{
  e.waitUntil((async()=>{
    const cache = await caches.open('rr-static-v1');
    await cache.addAll(['/','/style.css','/logo.png','/index.html']);
  })());
  self.skipWaiting();
});
self.addEventListener('activate', (e)=> self.clients.claim());
self.addEventListener('fetch', (e)=>{
  e.respondWith((async()=>{
    const res = await caches.match(e.request);
    return res || fetch(e.request);
  })());
});
