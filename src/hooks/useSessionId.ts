
import { useEffect, useState } from 'react';

// Generates a simple UUID (RFC4122 v4) for anonymous sessions
function generateSessionId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // fallback for ultra-old browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * useSessionId: Persist, expose and return a globally unique session_id for the device/browser.
 * - Always returns a non-empty string.
 * - If session_id is lost, regenerates on boot.
 */
export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const cached = window.localStorage.getItem('session_id');
      if (cached && /^[\w-]+$/.test(cached)) {
        return cached;
      }
      const newId = generateSessionId();
      window.localStorage.setItem('session_id', newId);
      return newId;
    }
    return '';
  });

  useEffect(() => {
    if (!sessionId && typeof window !== 'undefined') {
      const cached = window.localStorage.getItem('session_id');
      if (!cached) {
        const newId = generateSessionId();
        setSessionId(newId);
        window.localStorage.setItem('session_id', newId);
      }
    }
  }, [sessionId]);

  return sessionId;
}

