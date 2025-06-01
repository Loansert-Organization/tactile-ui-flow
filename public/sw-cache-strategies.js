
// Cache strategy implementations for IKANISA PWA
// Separated for better maintainability

// Cache First strategy for images with 7-day expiration
export async function cacheFirstImages(request, cache) {
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
export async function cacheFirstApi(request, cache) {
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
export async function cacheFirstAssets(request, cache) {
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
export async function cacheFirstHtml(request, runtimeCache, staticCache) {
  const cachedResponse = await runtimeCache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      runtimeCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page when navigation fails
    const offlinePage = await staticCache.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 503 });
  }
}

// Cache First default strategy
export async function cacheFirstDefault(request, cache) {
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

// Determine cache strategy based on request
export function getCacheStrategy(request) {
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
  if (url.pathname.match(/\.(js|css)$/)) {
    return 'cache-first-assets';
  }
  
  // HTML pages - Cache First with offline fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    return 'cache-first-html';
  }
  
  // Default - Cache First for offline support
  return 'cache-first-default';
}
