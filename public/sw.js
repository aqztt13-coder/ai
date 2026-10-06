// Service Worker: Hybrid Caching Strategy for Iraq Tourism Guide
// - Cache-First for static images (Zero-latency instant image display)
// - Network-First for dynamic places data & API endpoints (Fresh data with offline fallback)
// - Robust Error-Handling Module & Client Broadcasts for Cache Failures
// دليل العراق السياحي | Iraq Tourism Guide

const STATIC_CACHE = 'iraq-tourism-static-v4';
const IMAGE_CACHE = 'iraq-tourism-images-v4';
const PLACES_DATA_CACHE = 'iraq-tourism-places-data-v4';

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/apple-touch-icon.png',
];

// Broadcast error/alert message to all active client tabs
async function notifyClientsOfCacheError(errorDetail) {
  try {
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach((client) => {
      client.postMessage({
        type: 'CACHE_UPDATE_ERROR',
        timestamp: Date.now(),
        ...errorDetail,
      });
    });
  } catch (err) {
    console.warn('[SW Error Handler] Failed to notify window clients:', err);
  }
}

// Helper: Detect static image request
function isImage(request, url) {
  if (request.destination === 'image') return true;
  const path = url.pathname.toLowerCase();
  return (
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.svg') ||
    path.endsWith('.webp') ||
    path.endsWith('.ico') ||
    path.endsWith('.avif') ||
    url.hostname.includes('images.unsplash.com')
  );
}

// Helper: Detect dynamic places data or API request
function isPlacesData(url) {
  return (
    url.pathname.startsWith('/api/places') ||
    url.pathname.startsWith('/api/governorates') ||
    url.pathname.startsWith('/api/trips') ||
    url.pathname.startsWith('/api/reviews') ||
    url.pathname.startsWith('/api/events') ||
    url.pathname.startsWith('/api/articles') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('iraq_guide_places')
  );
}

// 1. Install Event: Pre-cache App Shell & Core Assets with Error Catching
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache warning:', err);
        notifyClientsOfCacheError({
          reason: 'PRECACHE_WARNING',
          target: 'static',
          message: 'تعذر تنزيل بعض ملفات الواجهة الأساسية مسبقاً، سيتم تحميلها عند الطلب.',
        });
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      const allowedCaches = [STATIC_CACHE, IMAGE_CACHE, PLACES_DATA_CACHE];
      return Promise.all(
        keys.map((key) => {
          if (!allowedCaches.includes(key)) {
            console.log('[SW] Deleting obsolete cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Intelligent Strategy Routing with Error Handling
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POST AI chat or analytics)
  if (request.method !== 'GET') {
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY 1: CACHE-FIRST FOR STATIC IMAGES
  // Returns cached image immediately; falls back to network only on cache miss.
  // -------------------------------------------------------------
  if (isImage(request, url)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          return cachedResponse; // Instant 0ms load
        }

        // Cache miss: fetch from network and persist
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone()).catch((writeErr) => {
              console.warn('[SW Image Cache] Failed to persist image to cache:', writeErr);
              notifyClientsOfCacheError({
                reason: 'IMAGE_CACHE_WRITE_ERROR',
                target: 'images',
                url: request.url,
                message: 'تعذر حفظ بعض الصور في الذاكرة المؤقتة بسبب سعة التخزين.',
              });
            });
          }
          return networkResponse;
        } catch (err) {
          // If offline and image not cached, fallback to default brand SVG icon
          const fallback = await caches.match('/icon.svg');
          if (fallback) return fallback;
          return new Response('', { status: 404, statusText: 'Not Found' });
        }
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY 2: NETWORK-FIRST FOR DYNAMIC PLACES DATA & APIS
  // Always attempts network first for freshest data; falls back to cached data if offline.
  // -------------------------------------------------------------
  if (isPlacesData(url)) {
    event.respondWith(
      caches.open(PLACES_DATA_CACHE).then(async (cache) => {
        try {
          // 1. Try Network first with timeout (3.5 seconds)
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500);

          const networkResponse = await fetch(request, { signal: controller.signal });
          clearTimeout(timeoutId);

          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone()).catch((putErr) => {
              console.warn('[SW Places Cache] Cache write error:', putErr);
              notifyClientsOfCacheError({
                reason: 'CACHE_WRITE_ERROR',
                target: 'places-data',
                url: request.url,
                message: 'تعذر كتابة تحديث بيانات المعالم في الذاكرة المؤقتة.',
              });
            });
          }
          return networkResponse;
        } catch (networkErr) {
          // 2. Network unavailable / Offline: fallback to cached places data
          console.log('[SW Places Data] Network unavailable; serving cached places data:', request.url);
          
          // Notify active user tab that fresh sync failed and offline fallback was activated
          notifyClientsOfCacheError({
            reason: 'NETWORK_SYNC_FAILED',
            target: 'places-data',
            url: request.url,
            message: 'تعذر الاتصال بالخادم لتحديث بيانات المعالم. تم تفعيل النسخة المحفوظة محلياً لضمان استمرارية التصفح.',
          });

          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }

          // Fallback offline JSON payload
          return new Response(
            JSON.stringify({
              offline: true,
              message: 'أنت تتصفح حالياً في وضع عدم الاتصال بالإنترنت · البيانات المحفوظة محلياً متاحة بالكامل.',
              data: [],
            }),
            {
              headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'X-Offline-Fallback': 'true',
              },
            }
          );
        }
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY 3: NAVIGATION REQUESTS (HTML App Shell)
  // -------------------------------------------------------------
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (err) {
          const cached = await cache.match(request);
          if (cached) return cached;
          const indexFallback = await cache.match('/index.html');
          return indexFallback || new Response('Offline - دليل العراق السياحي', {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
          });
        }
      })
    );
    return;
  }

  // -------------------------------------------------------------
  // STRATEGY 4: STATIC ASSETS (CSS, JS, Fonts) -> STALE-WHILE-REVALIDATE
  // -------------------------------------------------------------
  event.respondWith(
    caches.open(STATIC_CACHE).then(async (cache) => {
      const cachedResponse = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// 4. Message Handler for manual updates or strategy overrides
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
