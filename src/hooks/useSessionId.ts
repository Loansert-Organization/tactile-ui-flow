
import { useState, useEffect } from "react";

// Generates/Persists a UUID session for anonymous use
export function useSessionId(): string {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    let cached = localStorage.getItem('lifuti-session-id');
    if (!cached) {
      cached = crypto.randomUUID();
      localStorage.setItem('lifuti-session-id', cached);
    }
    setSessionId(cached);
  }, []);

  return sessionId;
}
