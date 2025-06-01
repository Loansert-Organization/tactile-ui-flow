
// IndexedDB wrapper for offline data storage
class OfflineStorage {
  private dbName = 'ikanisa-offline';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create stores for different data types
        if (!db.objectStoreNames.contains('baskets')) {
          db.createObjectStore('baskets', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('contributions')) {
          db.createObjectStore('contributions', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('participants')) {
          db.createObjectStore('participants', { keyPath: 'basketId' });
        }

        if (!db.objectStoreNames.contains('userPreferences')) {
          db.createObjectStore('userPreferences', { keyPath: 'key' });
        }
      };
    });
  }

  async saveBasket(basket: any): Promise<void> {
    if (!this.db) await this.init();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['baskets'], 'readwrite');
      const store = transaction.objectStore('baskets');
      
      // Add timestamp for cache freshness
      basket.cachedAt = Date.now();
      
      const request = store.put(basket);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getBasket(id: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['baskets'], 'readonly');
      const store = transaction.objectStore('baskets');
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        
        // Check if cached data is older than 24 hours
        if (result && result.cachedAt) {
          const hoursSinceCached = (Date.now() - result.cachedAt) / (1000 * 60 * 60);
          if (hoursSinceCached > 24) {
            // Data is stale, but still return it for offline use
            result.isStale = true;
          }
        }
        
        resolve(result || null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getAllBaskets(): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['baskets'], 'readonly');
      const store = transaction.objectStore('baskets');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveContribution(contribution: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contributions'], 'readwrite');
      const store = transaction.objectStore('contributions');
      
      contribution.cachedAt = Date.now();
      
      const request = store.put(contribution);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getContributions(basketId: string): Promise<any[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['contributions'], 'readonly');
      const store = transaction.objectStore('contributions');
      const request = store.getAll();

      request.onsuccess = () => {
        const contributions = request.result.filter(c => c.basketId === basketId);
        resolve(contributions || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async saveUserPreference(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userPreferences'], 'readwrite');
      const store = transaction.objectStore('userPreferences');
      
      const request = store.put({ key, value, updatedAt: Date.now() });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getUserPreference(key: string): Promise<any | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['userPreferences'], 'readonly');
      const store = transaction.objectStore('userPreferences');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearStaleData(): Promise<void> {
    if (!this.db) await this.init();

    const stores = ['baskets', 'contributions', 'participants'];
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);

    for (const storeName of stores) {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore('baskets');
      const request = store.getAll();

      request.onsuccess = () => {
        const items = request.result;
        items.forEach(item => {
          if (item.cachedAt && item.cachedAt < oneWeekAgo) {
            store.delete(item.id);
          }
        });
      };
    }
  }
}

export const offlineStorage = new OfflineStorage();
