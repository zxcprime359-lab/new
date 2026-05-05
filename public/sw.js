const VERSION = "__BUILD_ID__";
const CACHE_NAME = `zxc-${VERSION}`;
const RUNTIME_CACHE = `zxc-runtime-${VERSION}`;

// Files to cache immediately on install
const PRECACHE_URLS = ["/", "/offline.html"];

const BYPASS_DOMAINS = [
  "www.googletagmanager.com",
  "www.google-analytics.com",
  "analytics.google.com",
];

// Install event - cache essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - strategy based on request type
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1️⃣ Bypass analytics / GA domains
  if (BYPASS_DOMAINS.includes(url.hostname)) {
    return; // Let browser handle it
  }

  // Strategy 1: Network First for API calls (TMDB)
  if (url.hostname === "api.themoviedb.org") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache the response
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            // cache.put(request, responseClone);
            if (request.method === "GET") {
              cache.put(request, responseClone);
            }
          });
          return response;
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(request);
        })
    );
    return;
  }

  // Strategy 2: Cache First for TMDB images
  if (url.hostname === "image.tmdb.org") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          // Cache images for future use
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Strategy 3: Network First with cache fallback for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        const responseClone = response.clone();
        caches.open(RUNTIME_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If no cache, return offline page for navigation requests
          if (request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
      })
  );
});
