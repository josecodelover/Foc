// Service worker : met l'app en cache pour qu'elle fonctionne hors ligne.
// Change VERSION à chaque mise à jour des fichiers pour forcer le rafraîchissement.
const VERSION = "foc-v2.1";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "img/foc-fleche.png",
  "img/icon-192.png",
  "img/icon-512.png",
  "img/icon-maskable-512.png",
  "img/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request))
  );
});
