const CACHE_NAME = 'enrollmate-static-v2';
const OFFLINE_URLS = [
  'favicon.ico',
  'favicon.svg',
  'apple-touch-icon.png',
  'manifest.webmanifest',
  'images/icons/Hsm-icon-192x192.png',
  'images/icons/512x512-logo-github-icon-35.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  console.log('Service worker: install');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  console.log('Service worker: activate');
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isStatic = OFFLINE_URLS.includes(url.pathname);

  if (isStatic && isSameOrigin) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(request).then((cached) =>
          cached ||
          fetch(request).then((response) => {
            cache.put(request, response.clone());
            console.log('Service worker: cached', url.pathname);
            return response;
          })
        )
      )
    );
    return;
  }

  // Default: try network, fallback to cache if available
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
