
// IKANISA PWA Service Worker - Refactored for maintainability
// Version 3.1 - Modular architecture

import { 
  getCacheStrategy, 
  cacheFirstImages, 
  cacheFirstApi, 
  cacheFirstAssets, 
  cacheFirstHtml, 
  cacheFirstDefault 
} from './sw-cache-strategies.js';
import { handleSync } from './sw-sync.js';
import { handlePush, handleNotificationClick } from './sw-notifications.js';

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
  '/offline.html'
];

// Install event - cache critical assets immediately
self.addEventListener('install', (event) => {
  console.log('[SW] Install event - Phase 3 Offline Support (Modular)');
  
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
  console.log('[SW] Activate event - Phase 3 (Modular)');
  
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
      event.respondWith(
        caches.open(IMAGE_CACHE).then(cache => cacheFirstImages(request, cache))
      );
      break;
    case 'cache-first-api':
      event.respondWith(
        caches.open(API_CACHE).then(cache => cacheFirstApi(request, cache))
      );
      break;
    case 'cache-first-assets':
      event.respondWith(
        caches.open(CACHE_NAME).then(cache => cacheFirstAssets(request, cache))
      );
      break;
    case 'cache-first-html':
      event.respondWith(
        Promise.all([
          caches.open(RUNTIME_CACHE),
          caches.open(CACHE_NAME)
        ]).then(([runtimeCache, staticCache]) => 
          cacheFirstHtml(request, runtimeCache, staticCache)
        )
      );
      break;
    default:
      event.respondWith(
        caches.open(RUNTIME_CACHE).then(cache => cacheFirstDefault(request, cache))
      );
  }
});

// Background sync for offline actions
self.addEventListener('sync', handleSync);

// Push notification handling
self.addEventListener('push', handlePush);

// Handle notification clicks
self.addEventListener('notificationclick', handleNotificationClick);
