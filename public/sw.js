
// IKANISA PWA Service Worker - Phase 3: Offline-First
// Version 3.0 - Complete offline support

const CACHE_NAME = 'ikanisa-v3';
const RUNTIME_CACHE = 'ikanisa-runtime-v3';
const IMAGE_CACHE = 'ikanisa-images-v2';
const API_CACHE = 'ikanisa-api-v1';

// Critical assets for immediate caching (Cache First)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json',
  '/offline.html' // Add offline fallback page
];

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - Phase 3 Offline Support');
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching critical assets including offline page');
        return cache.addAll(CRITICAL_ASSETS);
      }),
      
      // Prepare other caches
      caches.open(RUNTIME_CACHE),
      caches.open(IMAGE_CACHE),
      caches.open(API_CACHE)
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - Phase 3');
  
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE, API_CACHE];
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Enhanced cache strategy determination
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Images - Cache First with 7-day expiration
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    return 'cache-first-images';
  }
  
  // API calls - Cache with Network Fallback for offline support
  if (url.pathname.startsWith('/api/') || url.search.includes('api') || url.pathname.includes('basket')) {
    return 'cache-first-api';
  }
  
  // JS/CSS bundles - Cache First
  if (url.pathname.match(/\.(js|css)$/) || CRITICAL_ASSETS.some(asset => url.pathname.includes(asset))) {
    return 'cache-first-assets';
  }
  
  // HTML pages - Cache First with offline fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    return 'cache-first-html';
  }
  
  // Default - Cache First for offline support
  return 'cache-first-default';
}

// Cache First strategy for images with 7-day expiration
async function cacheFirstImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is older than 7 days
    const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
    const now = new Date();
    const daysDiff = (now - cacheDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 7) {
      // Refresh in background if older than 1 day
      if (daysDiff > 1) {
        fetch(request).then(response => {
          if (response && response.status === 200) {
            const headers = new Headers(response.headers);
            headers.set('sw-cache-date', new Date().toISOString());
            const modifiedResponse = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: headers
            });
            cache.put(request, modifiedResponse);
          }
        }).catch(() => {});
      }
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      const headers = new Headers(responseClone.headers);
      headers.set('sw-cache-date', new Date().toISOString());
      
      const modifiedResponse = new Response(responseClone.body, {
        status: responseClone.status,
        statusText: responseClone.statusText,
        headers: headers
      });
      
      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Image not available offline', { status: 404 });
  }
}

// Cache First strategy for API calls with offline support
async function cacheFirstApi(request) {
  const cache = await caches.open(API_CACHE);
  const cachedResponse = await cache.match(request);
  
  // Always try cache first for offline support
  if (cachedResponse) {
    // Refresh in background if online
    fetch(request).then(response => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
    }).catch(() => {
      // Network failed, cached version is all we have
    });
    
    return cachedResponse;
  }
  
  // No cache, try network
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return empty but valid JSON for API calls when offline
    return new Response('{"error": "Offline", "data": [], "message": "Using cached data"}', { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache First strategy for static assets
async function cacheFirstAssets(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Asset not available offline', { status: 404 });
  }
}

// Cache First strategy for HTML pages with offline fallback
async function cacheFirstHtml(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page when navigation fails
    const offlineCache = await caches.open(CACHE_NAME);
    const offlinePage = await offlineCache.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

// Cache First default strategy
async function cacheFirstDefault(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Not available offline', { status: 404 });
  }
}

// Main fetch event handler
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  const strategy = getCacheStrategy(request);
  
  switch (strategy) {
    case 'cache-first-images':
      event.respondWith(cacheFirstImages(request));
      break;
    case 'cache-first-api':
      event.respondWith(cacheFirstApi(request));
      break;
    case 'cache-first-assets':
      event.respondWith(cacheFirstAssets(request));
      break;
    case 'cache-first-html':
      event.respondWith(cacheFirstHtml(request));
      break;
    default:
      event.respondWith(cacheFirstDefault(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync offline contributions when back online
      syncOfflineData()
    );
  }
});

// Sync offline data when connectivity returns
async function syncOfflineData() {
  try {
    // This would sync any offline contributions stored in IndexedDB
    console.log('[SW] Syncing offline data...');
    
    // Send message to main thread to trigger sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({ type: 'SYNC_OFFLINE_DATA' });
    });
  } catch (error) {
    console.error('[SW] Failed to sync offline data:', error);
  }
}

// Enhanced push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New update available in your baskets',
    icon: '/icon-192.png',
    badge: '/favicon.ico',
    tag: 'ikanisa-notification',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
      dateOfArrival: Date.now(),
      primaryKey: data.id || 1
    },
    actions: [
      {
        action: 'open',
        title: 'View',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Dismiss',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'IKANISA', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.openWindow(url)
    );
  }
});
