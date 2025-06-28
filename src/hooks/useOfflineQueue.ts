
import { useState, useEffect, useCallback } from 'react';

interface QueuedAction {
  id: string;
  type: 'contribution' | 'basket_creation' | 'profile_update';
  data: any;
  timestamp: Date;
  retryCount: number;
}

interface UseOfflineQueueReturn {
  queuedActions: QueuedAction[];
  addToQueue: (type: QueuedAction['type'], data: any) => void;
  processQueue: () => Promise<void>;
  clearQueue: () => void;
  isProcessing: boolean;
}

const QUEUE_STORAGE_KEY = 'ikanisa_offline_queue';
const MAX_RETRIES = 3;

export const useOfflineQueue = (): UseOfflineQueueReturn => {
  const [queuedActions, setQueuedActions] = useState<QueuedAction[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (savedQueue) {
      try {
        const parsed = JSON.parse(savedQueue);
        setQueuedActions(parsed.map((action: any) => ({
          ...action,
          timestamp: new Date(action.timestamp)
        })));
      } catch (error) {
        console.error('Failed to parse offline queue:', error);
        localStorage.removeItem(QUEUE_STORAGE_KEY);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queuedActions));
  }, [queuedActions]);

  // Auto-process queue when coming back online
  useEffect(() => {
    const handleOnline = () => {
      if (queuedActions.length > 0) {
        processQueue();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [queuedActions.length]);

  const addToQueue = useCallback((type: QueuedAction['type'], data: any) => {
    const newAction: QueuedAction = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date(),
      retryCount: 0
    };

    setQueuedActions(prev => [...prev, newAction]);
    
    // Show user feedback
    console.log(`Added ${type} to offline queue:`, newAction);
  }, []);

  const processQueue = useCallback(async () => {
    if (!navigator.onLine || isProcessing || queuedActions.length === 0) {
      return;
    }

    setIsProcessing(true);

    const actionsToProcess = [...queuedActions];
    const failedActions: QueuedAction[] = [];

    for (const action of actionsToProcess) {
      try {
        // Simulate API calls based on action type
        await processAction(action);
        
        // Remove successful action from queue
        setQueuedActions(prev => prev.filter(a => a.id !== action.id));
        
        console.log(`Successfully processed ${action.type}:`, action.id);
      } catch (error) {
        console.error(`Failed to process ${action.type}:`, error);
        
        if (action.retryCount < MAX_RETRIES) {
          failedActions.push({
            ...action,
            retryCount: action.retryCount + 1
          });
        } else {
          // Remove action that exceeded max retries
          setQueuedActions(prev => prev.filter(a => a.id !== action.id));
          console.error(`Action ${action.id} exceeded max retries and was removed`);
        }
      }
    }

    // Update retry counts for failed actions
    if (failedActions.length > 0) {
      setQueuedActions(prev => 
        prev.map(action => {
          const failedAction = failedActions.find(fa => fa.id === action.id);
          return failedAction || action;
        })
      );
    }

    setIsProcessing(false);
  }, [queuedActions, isProcessing]);

  const clearQueue = useCallback(() => {
    setQueuedActions([]);
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }, []);

  return {
    queuedActions,
    addToQueue,
    processQueue,
    clearQueue,
    isProcessing
  };
};

// Simulate processing different types of actions
const processAction = async (action: QueuedAction): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  switch (action.type) {
    case 'contribution':
      // Simulate contribution API call
      console.log('Processing contribution:', action.data);
      break;
    case 'basket_creation':
      // Simulate basket creation API call
      console.log('Processing basket creation:', action.data);
      break;
    case 'profile_update':
      // Simulate profile update API call
      console.log('Processing profile update:', action.data);
      break;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }

  // Randomly simulate failure for testing (remove in production)
  if (Math.random() < 0.1) {
    throw new Error('Simulated network error');
  }
};
