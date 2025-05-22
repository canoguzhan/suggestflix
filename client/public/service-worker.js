const CACHE_NAME = 'suggestflix-cache-v1';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const API_CACHE = 'api-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';

// Cache expiration times (in milliseconds)
const CACHE_EXPIRATION = {
  STATIC: 7 * 24 * 60 * 60 * 1000, // 7 days
  DYNAMIC: 24 * 60 * 60 * 1000,    // 24 hours
  API: 5 * 60 * 1000,              // 5 minutes
  IMAGE: 30 * 24 * 60 * 60 * 1000  // 30 days
};

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html',
  '/styles/index.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// Cache cleanup function
const cleanupCache = async (cacheName, maxAge) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const now = Date.now();

  const cleanupPromises = keys.map(async (request) => {
    const cachedResponse = await cache.match(request);
    const cachedDate = cachedResponse.headers.get('sw-cache-date');
    
    if (cachedDate && (now - new Date(cachedDate).getTime() > maxAge)) {
      return cache.delete(request);
    }
  });

  await Promise.all(cleanupPromises);
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE),
      caches.open(API_CACHE),
      caches.open(IMAGE_CACHE)
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => !Object.values({
              STATIC_CACHE,
              DYNAMIC_CACHE,
              API_CACHE,
              IMAGE_CACHE
            }).includes(name))
            .map((name) => caches.delete(name))
        );
      }),
      // Clean up expired cache entries
      cleanupCache(STATIC_CACHE, CACHE_EXPIRATION.STATIC),
      cleanupCache(DYNAMIC_CACHE, CACHE_EXPIRATION.DYNAMIC),
      cleanupCache(API_CACHE, CACHE_EXPIRATION.API),
      cleanupCache(IMAGE_CACHE, CACHE_EXPIRATION.IMAGE)
    ])
  );
  self.clients.claim();
});

// Helper function to add cache date header
const addCacheDateHeader = (response) => {
  const headers = new Headers(response.headers);
  headers.append('sw-cache-date', new Date().toISOString());
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

// Helper function to check if request is cacheable
const isCacheable = (request) => {
  const url = new URL(request.url);
  return (
    request.method === 'GET' &&
    !url.pathname.includes('/api/auth/') &&
    !url.pathname.includes('/api/user/') &&
    !url.searchParams.has('nocache')
  );
};

// Fetch event - handle requests with enhanced caching strategies
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and non-cacheable requests
  if (!isCacheable(request)) {
    return;
  }

  // Handle API requests with stale-while-revalidate strategy
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          // Try to get from cache first
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            // Check if cache is still valid
            const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date'));
            if (Date.now() - cacheDate.getTime() < CACHE_EXPIRATION.API) {
              return cachedResponse;
            }
          }

          // If not in cache or expired, fetch from network
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(API_CACHE);
            const responseToCache = addCacheDateHeader(networkResponse.clone());
            cache.put(request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          // If network fails, try to serve from cache
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response(
            JSON.stringify({ error: 'You are offline' }),
            { headers: { 'Content-Type': 'application/json' }, status: 503 }
          );
        }
      })()
    );
    return;
  }

  // Handle image requests with cache-first strategy
  if (request.destination === 'image') {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE);
            const responseToCache = addCacheDateHeader(networkResponse.clone());
            cache.put(request, responseToCache);
          }
          return networkResponse;
        } catch (error) {
          return new Response('Offline', { status: 503 });
        }
      })()
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const responseToCache = addCacheDateHeader(response.clone());
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
          const cache = await caches.open(DYNAMIC_CACHE);
          const responseToCache = addCacheDateHeader(networkResponse.clone());
          cache.put(request, responseToCache);
        }
        return networkResponse;
      } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return new Response('Offline', { status: 503 });
      }
    })()
  );
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

// Push notification handling with enhanced options
self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    body: data.body || 'New update available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    image: data.image,
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-72x72.png'
      }
    ],
    requireInteraction: true,
    tag: 'suggestflix-notification',
    renotify: true,
    silent: false,
    timestamp: Date.now()
  };

  event.waitUntil(
    self.registration.showNotification('SuggestFlix', options)
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    (async () => {
      const windowClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true
      });

      // Check if there is already a window/tab open with the target URL
      for (const client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }

      // If no window/tab is already open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })()
  );
});

// Handle periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-cache') {
    event.waitUntil(updateCache());
  }
});

// Periodic cache update function
async function updateCache() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const requests = await cache.keys();
  
  for (const request of requests) {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const responseToCache = addCacheDateHeader(response.clone());
        await cache.put(request, responseToCache);
      }
    } catch (error) {
      console.error('Cache update failed:', error);
    }
  }
}

// Handle fetch errors
self.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
}); 