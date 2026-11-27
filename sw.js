const CACHE_NAME = "salary-app-v69-qr-photo-compression-20261127";
const APP_FILES = ["./", "./index.html", "./1.html", "./manifest.webmanifest", "./icon.svg", "./qrcode.min.js"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith("salary-app-") && key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Keep the app shell available offline after the first successful visit.
  if (request.mode === "navigate" && url.origin === self.location.origin) {
    const cacheKey = new Request(url.origin + url.pathname, { method: "GET" });
    event.respondWith(
      fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, copy));
        }
        return response;
      }).catch(() =>
        caches.match(cacheKey).then(cached => cached || caches.match("./1.html"))
      )
    );
    return;
  }

  // Cache same-origin files and external libraries/fonts after they load online.
  // This lets cached Excel/PDF/QR libraries remain available offline on later visits.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && (response.ok || response.type === "opaque")) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      });
    })
  );
});
