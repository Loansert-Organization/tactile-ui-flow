
import { useState, useEffect, useCallback } from 'react';

interface LoadingStateOptions {
  minimumDuration?: number;
  timeout?: number;
  retryCount?: number;
}

export const useLoadingState = (options: LoadingStateOptions = {}) => {
  const {
    minimumDuration = 500,
    timeout = 10000,
    retryCount = 3
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback(async () => {
    // Ensure minimum duration for better UX
    await new Promise(resolve => setTimeout(resolve, minimumDuration));
    setIsLoading(false);
  }, [minimumDuration]);

  const executeWithLoading = useCallback(async <T>(
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    startLoading();
    
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Operation timed out')), timeout);
      });

      const result = await Promise.race([
        asyncOperation(),
        timeoutPromise
      ]);

      await stopLoading();
      setRetries(0);
      return result;
    } catch (err) {
      await stopLoading();
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      throw error;
    }
  }, [startLoading, stopLoading, timeout]);

  const retry = useCallback(async <T>(
    asyncOperation: () => Promise<T>
  ): Promise<T> => {
    if (retries >= retryCount) {
      throw new Error(`Maximum retry attempts (${retryCount}) exceeded`);
    }

    setRetries(prev => prev + 1);
    setError(null);
    
    // Exponential backoff
    const delay = Math.pow(2, retries) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return executeWithLoading(asyncOperation);
  }, [retries, retryCount, executeWithLoading]);

  return {
    isLoading,
    error,
    retries,
    executeWithLoading,
    retry,
    startLoading,
    stopLoading
  };
};

// Hook for page-level loading states
export const usePageLoading = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  return { isPageLoading, setIsPageLoading };
};
