
// Enhanced IndexedDB wrapper with mobile optimizations
class EnhancedOfflineStorage {
  private dbName = 'ikanisa-mobile';
  private version = 2;
  private db: IDBDatabase | null = null;
  private cache = new Map<string, any>();
  private pendingSyncs: any[] = [];

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        this.loadCacheFromDB();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Enhanced stores for mobile
        if (!db.objectStoreNames.contains('baskets')) {
          const basketStore = db.createObjectStore('baskets', { keyPath: 'id' });
          basketStore.createIndex('lastModified', 'lastModified', { unique: false });
        }

        if (!db.objectStoreNames.contains('images')) {
          const imageStore = db.createObjectStore('images', { keyPath: 'url' });
          imageStore.createIndex('size', 'size', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingActions')) {
          db.createObjectStore('pendingActions', { keyPath: 'id', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
      };
    });
  }

  // In-memory cache for faster access
  private async loadCacheFromDB(): Promise<void> {
    if (!this.db) return;

    try {
      const transaction = this.db.transaction(['baskets', 'userPreferences'], 'readonly');
      
      // Load baskets into cache
      const basketStore = transaction.objectStore('baskets');
      const basketRequest = basketStore.getAll();
      
      basketRequest.onsuccess = () => {
        basketRequest.result.forEach(basket => {
          this.cache.set(`basket_${basket.id}`, basket);
        });
      };

      // Load preferences into cache
      const prefStore = transaction.objectStore('userPreferences');
      const prefRequest = prefStore.getAll();
      
      prefRequest.onsuccess = () => {
        prefRequest.result.forEach(pref => {
          this.cache.set(`pref_${pref.key}`, pref.value);
        });
      };
    } catch (error) {
      console.error('Failed to load cache:', error);
    }
  }

  // Optimized basket operations with caching
  async saveBasket(basket: any): Promise<void> {
    if (!this.db) await this.init();
    
    basket.lastModified = Date.now();
    this.cache.set(`basket_${basket.id}`, basket);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['baskets'], 'readwrite');
      const store = transaction.objectStore('baskets');
      
      const request = store.put(basket);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getBasket(id: string): Promise<any | null> {
    // Try cache first for better performance
    const cached = this.cache.get(`basket_${id}`);
    if (cached) {
      return cached;
    }

    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['baskets'], 'readonly');
      const store = transaction.objectStore('baskets');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result) {
          this.cache.set(`basket_${id}`, result);
        }
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Image caching for mobile performance
  async cacheImage(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    const imageData = {
      url,
      blob,
      size: blob.size,
      cachedAt: Date.now(),
      type: blob.type
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readwrite');
      const store = transaction.objectStore('images');
      
      const request = store.put(imageData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedImage(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['images'], 'readonly');
      const store = transaction.objectStore('images');
      const request = store.get(url);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.blob : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Queue offline actions for sync when online
  async queueAction(action: any): Promise<void> {
    if (!this.db) await this.init();

    action.queuedAt = Date.now();
    this.pendingSyncs.push(action);

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      
      const request = store.add(action);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingActions(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearPendingActions(): Promise<void> {
    if (!this.db) await this.init();

    this.pendingSyncs = [];

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Clean up old data to free space on mobile devices
  async cleanupOldData(maxAge = 7 * 24 * 60 * 60 * 1000): Promise<void> {
    if (!this.db) await this.init();

    const cutoff = Date.now() - maxAge;

    // Clean old images
    const transaction = this.db.transaction(['images', 'baskets'], 'readwrite');
    
    const imageStore = transaction.objectStore('images');
    const imageIndex = imageStore.index('size');
    
    // Remove large old images first
    imageIndex.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const data = cursor.value;
        if (data.cachedAt < cutoff && data.size > 1024 * 1024) { // 1MB+
          cursor.delete();
        }
        cursor.continue();
      }
    };

    // Clean old baskets
    const basketStore = transaction.objectStore('baskets');
    const basketIndex = basketStore.index('lastModified');
    
    basketIndex.openCursor().onsuccess = (event) => {
      const cursor = (event.target as IDBRequest).result;
      if (cursor) {
        const data = cursor.value;
        if (data.lastModified < cutoff) {
          this.cache.delete(`basket_${data.id}`);
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }
}

export const enhancedOfflineStorage = new EnhancedOfflineStorage();
