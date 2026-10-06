/**
 * Service Worker Registration & Hybrid Caching Strategy with Error-Handling
 * دليل العراق السياحي | Iraq Tourism Guide
 *
 * Implements:
 * 1. Cache-First Strategy for Static Images:
 *    - Instantaneous load times for images, logos, thumbnails, and heritage covers.
 *    - Looks up image in CacheStorage first; falls back to network only if missing.
 *    - Persists network responses into IMAGE_CACHE_NAME.
 *    - Graceful offline fallback to default brand SVG icon if uncached.
 *
 * 2. Network-First Strategy for Dynamic Places Data:
 *    - Keeps dynamic places, governorate lists, itineraries, and reviews fresh from the server.
 *    - If network is online, fetches fresh data and updates PLACES_DATA_CACHE_NAME.
 *    - If network is slow (timeout) or offline, falls back seamlessly to cached data.
 *    - Automatic seeding to guarantee offline usability even before all pages are visited.
 *
 * 3. Error Handling & Alert Module (وحدة معالجة الأخطاء والتنبيهات):
 *    - Catches cache update failures, storage quota limits, and network timeouts.
 *    - Dispatches user-friendly alert events to the UI with retry functionality.
 *    - Ensures uninterrupted user experience through graceful fallback states.
 */

import { PLACES } from './data/places';
import { GOVERNORATES } from './data/governorates';
import { INITIAL_TRIPS } from './data/extraData';

export const STATIC_CACHE_NAME = 'iraq-tourism-static-v4';
export const IMAGE_CACHE_NAME = 'iraq-tourism-images-v4';
export const PLACES_DATA_CACHE_NAME = 'iraq-tourism-places-data-v4';

export interface RegistrationConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
  onCacheError?: (error: CacheErrorInfo) => void;
}

export interface CacheStats {
  imagesCount: number;
  placesDataCount: number;
  staticCount: number;
  isServiceWorkerActive: boolean;
}

export type CacheErrorType = 
  | 'NETWORK_SYNC_FAILED' 
  | 'CACHE_WRITE_ERROR' 
  | 'QUOTA_EXCEEDED' 
  | 'PRECACHE_FAILED' 
  | 'REGISTRATION_FAILED';

export interface CacheErrorInfo {
  id: string;
  type: CacheErrorType;
  target: 'places-data' | 'images' | 'static' | 'general';
  message_ar: string;
  message_en: string;
  url?: string;
  timestamp: number;
  retry?: () => Promise<boolean>;
}

// Global subscribers for cache errors
type CacheErrorSubscriber = (error: CacheErrorInfo) => void;
const cacheErrorSubscribers: Set<CacheErrorSubscriber> = new Set();
let lastErrorTimestamp = 0;

/**
 * Subscribes a listener to receive cache error notifications.
 */
export function subscribeToCacheErrors(listener: CacheErrorSubscriber): () => void {
  cacheErrorSubscribers.add(listener);
  return () => {
    cacheErrorSubscribers.delete(listener);
  };
}

/**
 * Dispatches a cache error notification to all registered UI subscribers.
 * Includes throttling to prevent duplicate alert storms.
 */
export function dispatchCacheError(error: CacheErrorInfo): void {
  const now = Date.now();
  // Throttle alerts of identical type within 4 seconds
  if (now - lastErrorTimestamp < 1500) {
    return;
  }
  lastErrorTimestamp = now;

  console.warn(`[PWA Cache Error] [${error.type}] ${error.message_ar}`);
  cacheErrorSubscribers.forEach((subscriber) => {
    try {
      subscriber(error);
    } catch (err) {
      console.error('[PWA Dispatch Error]', err);
    }
  });
}

/**
 * Checks whether a request or URL points to a static image asset.
 */
export function isImageRequest(urlOrRequest: string | Request): boolean {
  const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.url;
  
  if (typeof urlOrRequest !== 'string' && urlOrRequest.destination === 'image') {
    return true;
  }

  const isImageExtension = /\.(png|jpe?g|svg|webp|gif|ico|avif|bmp)(\?.*)?$/i.test(url);
  const isImageHostOrPath = 
    url.includes('images.unsplash.com') ||
    url.includes('/pwa-') ||
    url.includes('/icon.svg') ||
    url.includes('/apple-touch-icon') ||
    url.includes('/images/') ||
    url.includes('photo-');

  return isImageExtension || isImageHostOrPath;
}

/**
 * Checks whether a request points to dynamic places, itineraries, or API data endpoints.
 */
export function isDynamicPlacesDataRequest(urlOrRequest: string | Request): boolean {
  const url = typeof urlOrRequest === 'string' ? urlOrRequest : urlOrRequest.url;
  return (
    url.includes('/api/places') ||
    url.includes('/api/governorates') ||
    url.includes('/api/trips') ||
    url.includes('/api/reviews') ||
    url.includes('/api/events') ||
    url.includes('/api/articles') ||
    url.includes('/api/') ||
    url.includes('iraq_guide_places') ||
    url.includes('/data/places')
  );
}

/**
 * =========================================================================
 * 1. CACHE-FIRST STRATEGY FOR STATIC IMAGES (مع معالجة الأخطاء)
 * =========================================================================
 */
export async function fetchWithCacheFirst(
  input: RequestInfo | URL,
  init?: RequestInit,
  cacheName: string = IMAGE_CACHE_NAME
): Promise<Response> {
  const request = new Request(input, init);

  if ('caches' in window) {
    try {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(request);

      if (cachedResponse) {
        const headers = new Headers(cachedResponse.headers);
        headers.set('X-Cache-Strategy', 'Cache-First (Hit)');
        return new Response(cachedResponse.body, {
          status: cachedResponse.status,
          statusText: cachedResponse.statusText,
          headers,
        });
      }
    } catch (cacheReadError) {
      console.warn('[PWA Cache-First] Cache read error:', cacheReadError);
    }
  }

  // Cache Miss: Fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
      if ('caches' in window) {
        const responseClone = networkResponse.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseClone).catch((err: any) => {
            console.warn('[PWA Cache-First] Image cache write failed:', err);
            dispatchCacheError({
              id: `err-img-${Date.now()}`,
              type: err?.name === 'QuotaExceededError' ? 'QUOTA_EXCEEDED' : 'CACHE_WRITE_ERROR',
              target: 'images',
              url: request.url,
              message_ar: 'تعذر حفظ بعض الصور في الذاكرة المؤقتة. يتم الاستمرار باستخدام الصور المحلية.',
              message_en: 'Could not store image in cache storage. Continuing with local assets.',
              timestamp: Date.now(),
              retry: async () => {
                await warmAllPwaCaches();
                return true;
              },
            });
          });
        });
      }
    }

    return networkResponse;
  } catch (networkError) {
    console.warn('[PWA Cache-First] Image network failed, loading offline fallback:', request.url);

    // Fallback: Default brand SVG icon
    if ('caches' in window) {
      try {
        const fallback = await caches.match('/icon.svg');
        if (fallback) return fallback;
      } catch (fallbackError) {
        console.warn('[PWA Cache-First] Fallback fetch error:', fallbackError);
      }
    }

    throw networkError;
  }
}

/**
 * =========================================================================
 * 2. NETWORK-FIRST STRATEGY FOR DYNAMIC PLACES DATA (مع معالجة الأخطاء والتنبيه)
 * =========================================================================
 */
export async function fetchWithNetworkFirst(
  input: RequestInfo | URL,
  init?: RequestInit,
  cacheName: string = PLACES_DATA_CACHE_NAME,
  timeoutMs: number = 3800
): Promise<Response> {
  const request = new Request(input, init);

  if (request.method !== 'GET') {
    return fetch(request);
  }

  const fetchWithTimeout = async (): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(request, {
        ...init,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  try {
    // 1. Try Network first for fresh data
    const networkResponse = await fetchWithTimeout();

    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      if ('caches' in window) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, responseClone).catch((err) => {
            console.warn('[PWA Network-First] Places data cache write error:', err);
            dispatchCacheError({
              id: `err-write-${Date.now()}`,
              type: 'CACHE_WRITE_ERROR',
              target: 'places-data',
              url: request.url,
              message_ar: 'تعذر تحديث الذاكرة المؤقتة بالمعالم الجديدة. التطبيق يواصل العمل بالبيانات المتوفرة.',
              message_en: 'Failed to write updated places to cache. App continues with current data.',
              timestamp: Date.now(),
              retry: async () => {
                await warmAllPwaCaches();
                return true;
              },
            });
          });
        });
      }
    }

    return networkResponse;
  } catch (networkError) {
    console.warn('[PWA Network-First] Network unreachable or timed out; falling back to cache:', request.url);

    // Notify user that server update failed and local cache was engaged
    dispatchCacheError({
      id: `err-sync-${Date.now()}`,
      type: 'NETWORK_SYNC_FAILED',
      target: 'places-data',
      url: request.url,
      message_ar: 'تعذر الاتصال بالخادم لتحديث بيانات المعالم. يتم الآن استخدام النسخة المحفوظة محلياً لضمان استمرارية التصفح.',
      message_en: 'Could not sync fresh places data from server. Running on saved offline records.',
      timestamp: Date.now(),
      retry: async () => {
        try {
          await warmAllPwaCaches();
          return true;
        } catch {
          return false;
        }
      },
    });

    // 2. Fallback to CacheStorage
    if ('caches' in window) {
      try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          const headers = new Headers(cachedResponse.headers);
          headers.set('X-Offline-Fallback', 'true');
          headers.set('X-Cache-Strategy', 'Network-First (Offline Fallback)');

          return new Response(cachedResponse.body, {
            status: cachedResponse.status,
            statusText: cachedResponse.statusText,
            headers,
          });
        }
      } catch (cacheMatchError) {
        console.warn('[PWA Network-First] Cache lookup error:', cacheMatchError);
      }
    }

    // 3. Synthetic Fallback if completely offline & uncached
    return new Response(
      JSON.stringify({
        offline: true,
        message: 'أنت تتصفح حالياً في وضع عدم الاتصال. يتم عرض البيانات المتاحة محلياً.',
        data: [],
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Offline-Synthetic': 'true',
        },
      }
    );
  }
}

/**
 * Universal smart fetch router
 */
export async function smartFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const request = new Request(input, init);

  if (isImageRequest(request)) {
    return fetchWithCacheFirst(request);
  }

  if (isDynamicPlacesDataRequest(request)) {
    return fetchWithNetworkFirst(request);
  }

  return fetchWithNetworkFirst(request, init, STATIC_CACHE_NAME);
}

/**
 * Seeds and pre-warms the Places Data Cache with error monitoring
 */
export async function seedPlacesDataCache(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;

  try {
    const cache = await caches.open(PLACES_DATA_CACHE_NAME);

    // 1. Seed all places list
    const placesResponse = new Response(JSON.stringify(PLACES), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Pre-Seeded': 'true',
        'X-Cache-Strategy': 'Network-First (Seeded)',
      },
    });
    await cache.put(new Request('/api/places'), placesResponse);

    // 2. Seed governorates list
    const governoratesResponse = new Response(JSON.stringify(GOVERNORATES), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Pre-Seeded': 'true',
        'X-Cache-Strategy': 'Network-First (Seeded)',
      },
    });
    await cache.put(new Request('/api/governorates'), governoratesResponse);

    // 3. Seed trips list
    const tripsResponse = new Response(JSON.stringify(INITIAL_TRIPS), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Pre-Seeded': 'true',
        'X-Cache-Strategy': 'Network-First (Seeded)',
      },
    });
    await cache.put(new Request('/api/trips'), tripsResponse);

    // 4. Seed top individual places
    for (const place of PLACES.slice(0, 15)) {
      const singlePlaceResponse = new Response(JSON.stringify(place), {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'X-Pre-Seeded': 'true',
        },
      });
      await cache.put(new Request(`/api/places/${place.id}`), singlePlaceResponse);
    }

    console.log('[PWA Seeder] Places data cache pre-warmed successfully.');
    return true;
  } catch (err) {
    console.warn('[PWA Seeder] Failed to pre-seed places cache:', err);
    dispatchCacheError({
      id: `err-seed-places-${Date.now()}`,
      type: 'PRECACHE_FAILED',
      target: 'places-data',
      message_ar: 'تعذر التهيئة المسبقة لبيانات المعالم. اضغط إعادة المحاولة لإعادة المزامنة.',
      message_en: 'Could not pre-seed places cache. Tap retry to resynchronize.',
      timestamp: Date.now(),
      retry: async () => seedPlacesDataCache(),
    });
    return false;
  }
}

/**
 * Pre-warms the Image Cache with high-priority heritage monuments
 */
export async function seedImageCache(): Promise<boolean> {
  if (typeof window === 'undefined' || !('caches' in window)) return false;

  const priorityImageUrls = [
    '/icon.svg',
    '/pwa-192x192.png',
    '/pwa-512x512.png',
    '/apple-touch-icon.png',
    ...PLACES.slice(0, 10).map((p) => p.cover_image).filter(Boolean),
  ];

  try {
    const cache = await caches.open(IMAGE_CACHE_NAME);

    await Promise.allSettled(
      priorityImageUrls.map(async (imageUrl) => {
        try {
          const matched = await cache.match(imageUrl);
          if (matched) return;

          const response = await fetch(imageUrl, { mode: 'cors' });
          if (response && (response.status === 200 || response.type === 'opaque')) {
            await cache.put(imageUrl, response);
          }
        } catch {
          // Ignore individual image download failure in background
        }
      })
    );

    console.log('[PWA Seeder] Priority images pre-warmed in cache.');
    return true;
  } catch (err) {
    console.warn('[PWA Seeder] Image cache pre-warming warning:', err);
    return false;
  }
}

/**
 * Pre-warms all PWA caches (places data + images).
 */
export async function warmAllPwaCaches(): Promise<boolean> {
  const results = await Promise.allSettled([
    seedPlacesDataCache(),
    seedImageCache(),
  ]);
  return results.every((r) => r.status === 'fulfilled' && r.value === true);
}

/**
 * Retries failed cache synchronization with user feedback
 */
export async function retryFailedCacheSync(): Promise<boolean> {
  try {
    return await warmAllPwaCaches();
  } catch (err) {
    console.warn('[PWA] Retry sync failed:', err);
    return false;
  }
}

/**
 * Registers the Service Worker and initializes caching strategies with error listeners.
 */
export function registerServiceWorker(config?: RegistrationConfig): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Listen for error messages broadcasted by the Service Worker
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_UPDATE_ERROR') {
      const { reason, target, url, message } = event.data;
      dispatchCacheError({
        id: `sw-msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: (reason as CacheErrorType) || 'NETWORK_SYNC_FAILED',
        target: target || 'places-data',
        url,
        message_ar: message || 'تعذر تحديث الكاش التلقائي للبيانات السياحية. يتم عرض النسخة المحفوظة لضمان استمرار التصفح.',
        message_en: 'Could not auto-update tourism cache. Showing cached version to ensure continuity.',
        timestamp: Date.now(),
        retry: async () => warmAllPwaCaches(),
      });
    }
  });

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('[PWA] Service Worker registered with Error-Handling & Resilience.');

        // Pre-warm caches after registration
        setTimeout(() => {
          warmAllPwaCaches().catch((err) => {
            console.warn('[PWA] Background cache warming error:', err);
          });
        }, 1500);

        // Notify active worker of hybrid strategies
        if (registration.active) {
          registration.active.postMessage({
            type: 'SET_HYBRID_STRATEGY',
            imageStrategy: 'cache-first',
            placesStrategy: 'network-first',
          });
        }

        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (installingWorker == null) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('[PWA] New version detected; ready to reload.');
                config?.onUpdate?.(registration);
              } else {
                console.log('[PWA] Content is cached for offline use.');
                config?.onSuccess?.(registration);
              }
            }
          };
        };
      })
      .catch((error) => {
        console.warn('[PWA] Service Worker registration failed:', error);
        config?.onError?.(error);
        dispatchCacheError({
          id: `reg-fail-${Date.now()}`,
          type: 'REGISTRATION_FAILED',
          target: 'general',
          message_ar: 'تعذر تشغيل خدمة التصفح دون اتصال (Service Worker) على هذا المتصفح.',
          message_en: 'Could not initialize offline Service Worker on this browser.',
          timestamp: Date.now(),
        });
      });
  });
}

/**
 * Unregisters the service worker.
 */
export function unregisterServiceWorker(): void {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => registration.unregister())
      .catch((error) => console.error(error.message));
  }
}

/**
 * Retrieves cache statistics
 */
export async function getCacheStorageStats(): Promise<CacheStats> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return {
      imagesCount: 0,
      placesDataCount: 0,
      staticCount: 0,
      isServiceWorkerActive: false,
    };
  }

  try {
    const [imagesCache, placesCache, staticCache] = await Promise.all([
      caches.open(IMAGE_CACHE_NAME),
      caches.open(PLACES_DATA_CACHE_NAME),
      caches.open(STATIC_CACHE_NAME),
    ]);

    const [imgKeys, placesKeys, staticKeys] = await Promise.all([
      imagesCache.keys(),
      placesCache.keys(),
      staticCache.keys(),
    ]);

    return {
      imagesCount: imgKeys.length,
      placesDataCount: placesKeys.length,
      staticCount: staticKeys.length,
      isServiceWorkerActive: Boolean(navigator.serviceWorker?.controller),
    };
  } catch {
    return {
      imagesCount: 0,
      placesDataCount: 0,
      staticCount: 0,
      isServiceWorkerActive: Boolean(navigator.serviceWorker?.controller),
    };
  }
}

/**
 * Clears obsolete caches
 */
export async function clearOfflineCaches(): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((k) => caches.delete(k)));
  console.log('[PWA] All offline caches cleared.');
}

/**
 * Returns current online state
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

/**
 * Fetches places data using the Network-First strategy with automatic offline fallback.
 * Prioritizes network data to fetch newest updates, ratings, and reviews.
 * If offline or network fails, retrieves saved places from CacheStorage.
 */
export async function fetchPlacesDataNetworkFirst(): Promise<typeof PLACES> {
  try {
    const response = await fetchWithNetworkFirst('/api/places');
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Fallback to local PLACES if empty array returned
    return PLACES;
  } catch (err) {
    console.warn('[PWA] Network-first places fetch fell back to local dataset:', err);
    return getCachedPlacesOffline();
  }
}

/**
 * Retrieves all cached places directly from CacheStorage for offline browsing.
 */
export async function getCachedPlacesOffline(): Promise<typeof PLACES> {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return PLACES;
  }

  try {
    const cache = await caches.open(PLACES_DATA_CACHE_NAME);
    const cachedResponse = await cache.match('/api/places');
    if (cachedResponse) {
      const data = await cachedResponse.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[PWA] Error reading places from CacheStorage:', err);
  }

  // Graceful fallback to static data
  return PLACES;
}

/**
 * Saves or updates a place record directly in CacheStorage for immediate offline persistence.
 */
export async function savePlaceToOfflineCache(place: (typeof PLACES)[0]): Promise<void> {
  if (typeof window === 'undefined' || !('caches' in window)) return;

  try {
    const cache = await caches.open(PLACES_DATA_CACHE_NAME);
    
    // 1. Update individual place cache entry
    const singleResponse = new Response(JSON.stringify(place), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-User-Updated': 'true',
      },
    });
    await cache.put(new Request(`/api/places/${place.id}`), singleResponse);

    // 2. Update list cache entry
    const listResponse = await cache.match('/api/places');
    if (listResponse) {
      const listData = await listResponse.json();
      if (Array.isArray(listData)) {
        const index = listData.findIndex((p: any) => p.id === place.id);
        const updatedList = index >= 0
          ? [...listData.slice(0, index), place, ...listData.slice(index + 1)]
          : [place, ...listData];

        await cache.put(
          new Request('/api/places'),
          new Response(JSON.stringify(updatedList), {
            headers: { 'Content-Type': 'application/json; charset=utf-8' },
          })
        );
      }
    }
  } catch (err) {
    console.warn('[PWA] Failed to save place into offline cache:', err);
  }
}

/**
 * Retrieves an image using Cache-First strategy.
 */
export async function fetchImageCacheFirst(imageUrl: string): Promise<string> {
  try {
    const response = await fetchWithCacheFirst(imageUrl);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch {
    return imageUrl;
  }
}

/**
 * Subscribes to online / offline network connectivity events
 */
export function subscribeToConnectivity(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}
