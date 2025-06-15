
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { signInAnonymously, onAuthStateChanged, User } from "firebase/auth";

/**
 * useAnonymousSession: Log in anonymously and provide UID/session management.
 */
export function useAnonymousSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // If no user, trigger anonymous sign-in
    if (!auth.currentUser) {
      signInAnonymously(auth).catch((e) => {
        console.error("Anonymous auth error:", e);
        setLoading(false);
      });
    }

    return () => unsubscribe();
  }, []);

  return { user, loading, sessionId: user?.uid ?? null };
}
