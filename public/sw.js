
// IKANISA PWA Service Worker - Phase 2: Performance Optimized
// Version 2.0 - Enhanced caching strategies and performance

const CACHE_NAME = 'ikanisa-v2';
const RUNTIME_CACHE = 'ikanisa-runtime-v2';
const IMAGE_CACHE = 'ikanisa-images-v1';

// Critical assets for immediate caching (Cache First)
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/manifest.json'
];

// Assets to cache with Network First strategy
const DYNAMIC_ASSETS = [
  '/src/App.tsx',
  '/src/components/',
  '/src/pages/',
  '/src/contexts/'
];

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - Phase 2');
  
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching critical assets');
        return cache.addAll(CRITICAL_ASSETS);
      }),
      
      // Prepare runtime cache
      caches.open(RUNTIME_CACHE).then((cache) => {
        console.log('[SW] Runtime cache ready');
      }),
      
      // Prepare image cache
      caches.open(IMAGE_CACHE).then((cache) => {
        console.log('[SW] Image cache ready');
      })
    ]).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event - Phase 2');
  
  const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  
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

// Helper function to determine cache strategy
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Images - Cache First with long expiration
  if (request.destination === 'image' || url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)) {
    return 'cache-first-images';
  }
  
  // API calls - Network First with cache fallback
  if (url.pathname.startsWith('/api/') || url.search.includes('api')) {
    return 'network-first-api';
  }
  
  // JS/CSS bundles - Cache First
  if (url.pathname.match(/\.(js|css)$/) || CRITICAL_ASSETS.some(asset => url.pathname.includes(asset))) {
    return 'cache-first-assets';
  }
  
  // HTML pages - Network First with cache fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    return 'network-first-html';
  }
  
  // Default - Stale While Revalidate
  return 'stale-while-revalidate';
}

// Cache First strategy for images with long expiration
async function cacheFirstImages(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is older than 7 days
    const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || 0);
    const now = new Date();
    const daysDiff = (now - cacheDate) / (1000 * 60 * 60 * 24);
    
    if (daysDiff < 7) {
      return cachedResponse;
    }
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      const responseClone = networkResponse.clone();
      // Add cache date header
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

// Network First strategy for API calls
async function networkFirstApi(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || new Response('{"error": "Offline"}', { 
      status: 503, 
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

// Network First strategy for HTML pages
async function networkFirstHtml(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    return cachedResponse || cache.match('/');
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
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
    case 'network-first-api':
      event.respondWith(networkFirstApi(request));
      break;
    case 'cache-first-assets':
      event.respondWith(cacheFirstAssets(request));
      break;
    case 'network-first-html':
      event.respondWith(networkFirstHtml(request));
      break;
    default:
      event.respondWith(staleWhileRevalidate(request));
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle any queued offline actions here
      Promise.resolve()
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('[SW] Push message received');
  
  const options = {
    body: event.data ? event.data.text() : 'New update available',
    icon: '/icon-192.png',
    badge: '/favicon.ico',
    tag: 'ikanisa-notification',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('IKANISA', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click received');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
