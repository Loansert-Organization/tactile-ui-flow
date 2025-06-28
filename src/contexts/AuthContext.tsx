
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Simplified AuthUser type for anonymous auth only
export interface AuthUser extends User {
  displayName: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  // Make Supabase properties required for compatibility
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean;
  isLoggedIn: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
  ensureAnonymousAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a fallback anonymous user when Supabase auth is unavailable
const createFallbackAnonymousUser = (): AuthUser => {
  const userId = localStorage.getItem('fallback_user_id') || `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem('fallback_user_id', userId);
  
  return {
    id: userId,
    displayName: 'Anonymous User',
    country: 'RW',
    language: 'en' as 'en' | 'rw',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    app_metadata: { provider: 'anonymous' },
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email: undefined,
    phone: undefined,
    email_confirmed_at: undefined,
    phone_confirmed_at: undefined,
    confirmation_sent_at: undefined,
    confirmed_at: undefined,
    last_sign_in_at: new Date().toISOString(),
    role: 'authenticated',
    updated_at: new Date().toISOString(),
    identities: [],
    factors: [],
    is_anonymous: true
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase User to AuthUser
  const convertToAuthUser = (supabaseUser: User): AuthUser => {
    return {
      ...supabaseUser,
      displayName: 'Anonymous User',
      country: 'RW',
      language: 'en' as 'en' | 'rw',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
      app_metadata: supabaseUser.app_metadata || { provider: 'anonymous' },
      user_metadata: supabaseUser.user_metadata || {},
      aud: supabaseUser.aud || 'authenticated',
      created_at: supabaseUser.created_at
    };
  };

  // Ensure anonymous authentication - with fallback if Supabase fails
  const ensureAnonymousAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error('Failed to create anonymous session:', error);
          // Use fallback authentication
          const fallbackUser = createFallbackAnonymousUser();
          setUser(fallbackUser);
          console.log('Using fallback anonymous authentication:', fallbackUser.id);
        } else {
          console.log('Anonymous session created:', data.session?.user?.id);
        }
      }
    } catch (error) {
      console.error('Anonymous auth error:', error);
      // Use fallback authentication
      const fallbackUser = createFallbackAnonymousUser();
      setUser(fallbackUser);
      console.log('Using fallback anonymous authentication after error:', fallbackUser.id);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        if (session?.user) {
          setUser(convertToAuthUser(session.user));
        } else {
          setUser(null);
          // If no session, try to create anonymous one or use fallback
          await ensureAnonymousAuth();
        }
        setLoading(false);
      }
    );

    // Get initial session or create anonymous one
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSession(session);
          setUser(convertToAuthUser(session.user));
        } else {
          await ensureAnonymousAuth();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Use fallback authentication
        const fallbackUser = createFallbackAnonymousUser();
        setUser(fallbackUser);
        console.log('Using fallback anonymous authentication on init:', fallbackUser.id);
      }
      setLoading(false);
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
    // Clear fallback user data
    localStorage.removeItem('fallback_user_id');
    // After sign out, create new anonymous session or use fallback
    await ensureAnonymousAuth();
  };

  const logout = async () => {
    await signOut();
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  // All users are considered logged in (either authenticated anonymous or fallback)
  const isLoggedIn = !!session || !!user;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading,
        isLoading: loading,
        isLoggedIn,
        signOut,
        logout,
        updateUser,
        ensureAnonymousAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Add backward compatibility alias
export const useAuth = useAuthContext;
