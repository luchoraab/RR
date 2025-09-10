<<<<<<< HEAD
const CACHE_NAME = "rr-v5";
const ASSETS = [
  "/", "/index.html",
  "/cadeteria.html", "/transporte.html",
  "/style.css", "/rr-overrides.css",
  "/cadeteria.js", "/transporte.js",
=======
const CACHE_NAME = "rr-v1";
const ASSETS = [
  "/", "/index.html",
  "/cadeteria.html", "/transporte.html",
  "/style.css", "/cadeteria.js", "/transporte.js",
>>>>>>> cef24ed (Reparación: restaurar formularios + botón Instalar APP + WhatsApp flotante)
  "/logo.png", "/manifest.webmanifest"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

<<<<<<< HEAD
=======
// Network-first para HTML; cache-first para estáticos
>>>>>>> cef24ed (Reparación: restaurar formularios + botón Instalar APP + WhatsApp flotante)
self.addEventListener("fetch", (e) => {
  const req = e.request;
  const isHTML = req.headers.get("accept")?.includes("text/html");

  if (isHTML) {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match("/index.html")))
    );
  } else {
    e.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(req, copy));
        return res;
      }))
    );
  }
});
