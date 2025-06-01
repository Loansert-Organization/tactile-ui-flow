
// Advanced caching strategies for optimal performance
interface CacheConfig {
  name: string;
  maxAge: number;
  maxEntries: number;
  strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate';
}

class AdvancedCacheManager {
  private caches: Map<string, CacheConfig> = new Map();
  private memoryCache: Map<string, { data: any; timestamp: number; expires: number }> = new Map();
  private compressionEnabled = 'CompressionStream' in window;

  constructor() {
    this.initializeCacheConfigs();
    this.startCleanupInterval();
  }

  private initializeCacheConfigs() {
    // Define cache strategies for different content types
    this.caches.set('api-data', {
      name: 'ikanisa-api-v1',
      maxAge: 5 * 60 * 1000, // 5 minutes
      maxEntries: 100,
      strategy: 'stale-while-revalidate'
    });

    this.caches.set('images', {
      name: 'ikanisa-images-v1',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      maxEntries: 200,
      strategy: 'cache-first'
    });

    this.caches.set('static-assets', {
      name: 'ikanisa-static-v1',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      maxEntries: 50,
      strategy: 'cache-first'
    });

    this.caches.set('user-data', {
      name: 'ikanisa-user-v1',
      maxAge: 60 * 60 * 1000, // 1 hour
      maxEntries: 50,
      strategy: 'network-first'
    });
  }

  // Advanced cache with compression
  async setCache(cacheType: string, key: string, data: any, options?: { compress?: boolean }) {
    const config = this.caches.get(cacheType);
    if (!config) throw new Error(`Unknown cache type: ${cacheType}`);

    try {
      // Memory cache for frequently accessed data
      const expires = Date.now() + config.maxAge;
      this.memoryCache.set(`${cacheType}:${key}`, {
        data,
        timestamp: Date.now(),
        expires
      });

      // Browser cache for persistence
      const cache = await caches.open(config.name);
      
      let responseData = data;
      const headers: HeadersInit = {
        'Cache-Timestamp': Date.now().toString(),
        'Cache-Expires': expires.toString()
      };

      // Compress large data if supported and requested
      if (options?.compress && this.compressionEnabled && this.shouldCompress(data)) {
        responseData = await this.compressData(data);
        headers['Content-Encoding'] = 'gzip';
      }

      const response = new Response(JSON.stringify(responseData), {
        headers
      });

      await cache.put(key, response);
      
      // Enforce cache size limits
      await this.enforceMaxEntries(cache, config.maxEntries);
      
    } catch (error) {
      console.warn(`[Cache] Failed to cache ${cacheType}:${key}:`, error);
    }
  }

  async getCache(cacheType: string, key: string): Promise<any | null> {
    const config = this.caches.get(cacheType);
    if (!config) return null;

    try {
      // Check memory cache first
      const memoryEntry = this.memoryCache.get(`${cacheType}:${key}`);
      if (memoryEntry && memoryEntry.expires > Date.now()) {
        return memoryEntry.data;
      }

      // Check browser cache
      const cache = await caches.open(config.name);
      const response = await cache.match(key);
      
      if (!response) return null;

      // Check if cache entry is expired
      const expires = parseInt(response.headers.get('Cache-Expires') || '0');
      if (expires < Date.now()) {
        await cache.delete(key);
        return null;
      }

      let data = await response.text();
      
      // Decompress if needed
      if (response.headers.get('Content-Encoding') === 'gzip') {
        data = await this.decompressData(data);
      }

      const parsedData = JSON.parse(data);
      
      // Update memory cache
      this.memoryCache.set(`${cacheType}:${key}`, {
        data: parsedData,
        timestamp: Date.now(),
        expires
      });

      return parsedData;
      
    } catch (error) {
      console.warn(`[Cache] Failed to retrieve ${cacheType}:${key}:`, error);
      return null;
    }
  }

  // Smart cache strategy implementation
  async smartFetch(cacheType: string, key: string, fetchFn: () => Promise<any>): Promise<any> {
    const config = this.caches.get(cacheType);
    if (!config) return fetchFn();

    switch (config.strategy) {
      case 'cache-first':
        return this.cacheFirst(cacheType, key, fetchFn);
      case 'network-first':
        return this.networkFirst(cacheType, key, fetchFn);
      case 'stale-while-revalidate':
        return this.staleWhileRevalidate(cacheType, key, fetchFn);
      default:
        return fetchFn();
    }
  }

  private async cacheFirst(cacheType: string, key: string, fetchFn: () => Promise<any>): Promise<any> {
    const cached = await this.getCache(cacheType, key);
    if (cached) return cached;

    try {
      const data = await fetchFn();
      await this.setCache(cacheType, key, data, { compress: true });
      return data;
    } catch (error) {
      console.warn(`[Cache] Network failed for ${cacheType}:${key}`, error);
      throw error;
    }
  }

  private async networkFirst(cacheType: string, key: string, fetchFn: () => Promise<any>): Promise<any> {
    try {
      const data = await fetchFn();
      await this.setCache(cacheType, key, data);
      return data;
    } catch (error) {
      const cached = await this.getCache(cacheType, key);
      if (cached) {
        console.log(`[Cache] Using stale cache for ${cacheType}:${key}`);
        return cached;
      }
      throw error;
    }
  }

  private async staleWhileRevalidate(cacheType: string, key: string, fetchFn: () => Promise<any>): Promise<any> {
    const cached = await this.getCache(cacheType, key);
    
    // Return cached data immediately if available
    if (cached) {
      // Revalidate in background
      fetchFn()
        .then(data => this.setCache(cacheType, key, data))
        .catch(error => console.warn(`[Cache] Background revalidation failed:`, error));
      
      return cached;
    }

    // No cache, fetch normally
    const data = await fetchFn();
    await this.setCache(cacheType, key, data);
    return data;
  }

  private shouldCompress(data: any): boolean {
    const size = JSON.stringify(data).length;
    return size > 1024; // Compress data larger than 1KB
  }

  private async compressData(data: any): Promise<string> {
    if (!this.compressionEnabled) return data;
    
    try {
      const stream = new CompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      writer.write(new TextEncoder().encode(JSON.stringify(data)));
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return btoa(String.fromCharCode(...compressed));
    } catch (error) {
      console.warn('[Cache] Compression failed:', error);
      return data;
    }
  }

  private async decompressData(compressedData: string): Promise<any> {
    if (!this.compressionEnabled) return compressedData;
    
    try {
      const compressed = Uint8Array.from(atob(compressedData), c => c.charCodeAt(0));
      const stream = new DecompressionStream('gzip');
      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      writer.write(compressed);
      writer.close();
      
      const chunks: Uint8Array[] = [];
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) chunks.push(value);
      }
      
      const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0));
      let offset = 0;
      for (const chunk of chunks) {
        decompressed.set(chunk, offset);
        offset += chunk.length;
      }
      
      return new TextDecoder().decode(decompressed);
    } catch (error) {
      console.warn('[Cache] Decompression failed:', error);
      return compressedData;
    }
  }

  private async enforceMaxEntries(cache: Cache, maxEntries: number) {
    const keys = await cache.keys();
    if (keys.length > maxEntries) {
      const toDelete = keys.slice(0, keys.length - maxEntries);
      await Promise.all(toDelete.map(key => cache.delete(key)));
    }
  }

  private startCleanupInterval() {
    // Clean memory cache every 5 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.expires < now) {
          this.memoryCache.delete(key);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Cache analytics and optimization
  getCacheStats(): Record<string, any> {
    const stats: Record<string, any> = {};
    
    for (const [type, config] of this.caches.entries()) {
      stats[type] = {
        memoryEntries: Array.from(this.memoryCache.keys()).filter(k => k.startsWith(`${type}:`)).length,
        strategy: config.strategy,
        maxAge: config.maxAge,
        maxEntries: config.maxEntries
      };
    }
    
    return stats;
  }

  async clearCache(cacheType?: string) {
    if (cacheType) {
      const config = this.caches.get(cacheType);
      if (config) {
        const cache = await caches.open(config.name);
        const keys = await cache.keys();
        await Promise.all(keys.map(key => cache.delete(key)));
        
        // Clear memory cache for this type
        for (const key of this.memoryCache.keys()) {
          if (key.startsWith(`${cacheType}:`)) {
            this.memoryCache.delete(key);
          }
        }
      }
    } else {
      // Clear all caches
      this.memoryCache.clear();
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
  }
}

export const advancedCacheManager = new AdvancedCacheManager();
