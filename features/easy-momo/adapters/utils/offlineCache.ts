// Auto-generated shim for offline cache utility
interface OfflineQueueItem {
  id: string;
  action: string;
  data: any;
  timestamp: number;
}

const OFFLINE_QUEUE_KEY = 'easy_momo_offline_queue';

export const addToOfflineQueue = (action: string, data: any): string => {
  const item: OfflineQueueItem = {
    id: 'offline_' + Date.now(),
    action,
    data,
    timestamp: Date.now()
  };
  
  const queue = getOfflineQueue();
  queue.push(item);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  
  console.log('Offline Cache: Added to queue', item);
  return item.id;
};

export const getOfflineQueue = (): OfflineQueueItem[] => {
  try {
    const queueData = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return queueData ? JSON.parse(queueData) : [];
  } catch (error) {
    console.error('Offline Cache: Error reading queue', error);
    return [];
  }
};

export const clearOfflineQueue = (): void => {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
  console.log('Offline Cache: Queue cleared');
};

export const removeFromQueue = (id: string): void => {
  const queue = getOfflineQueue().filter(item => item.id !== id);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  console.log('Offline Cache: Removed from queue', id);
};

export default {
  addToOfflineQueue,
  getOfflineQueue,
  clearOfflineQueue,
  removeFromQueue
};
