
import { useCallback } from "react";

/**
 * useOfflineCache: Simple localStorage wrapper for caching last-generated QR/images/input.
 * Example: useOfflineCache("lastQR", initialValue)
 */
export function useOfflineCache<T = any>(key: string, initial: T) {
  // Read value once, fallback to initial/default
  function get() {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) return JSON.parse(raw);
    } catch { /* ignore */ }
    return initial;
  }

  const set = useCallback((val: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* storage may fail, ignore */ }
  }, [key]);

  return [get(), set] as const;
}
