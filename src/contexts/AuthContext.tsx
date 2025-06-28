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
  mobileMoneyNumber?: string;
  whatsappNumber?: string;
  role: 'user' | 'admin';
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
  refreshUserData: () => Promise<void>;
  // New authentication methods
  signInAnonymous: () => Promise<void>;
  signInEmail: (email: string, password?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInWhatsApp: (phoneNumber: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch additional user data from users table
  const fetchUserData = async (supabaseUser: User): Promise<AuthUser> => {
    try {
      console.log('[AUTH_FETCH] Fetching user data for:', supabaseUser.id);
      
      const { data: userData, error } = await supabase
        .from('users')
        .select('display_name, mobile_money_number, whatsapp_number, country, role')
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.log('[AUTH_FETCH] User data fetch failed:', error);
        
        if (error.code === '42501') {
          console.log('[AUTH_FETCH] RLS permission denied - using defaults');
        } else if (error.code === 'PGRST116') {
          console.log('[AUTH_FETCH] No user profile found - using defaults');
        } else {
          console.warn('[AUTH_FETCH] Unexpected error:', error);
        }
        
        // Return user with defaults if fetch fails
        return convertToAuthUser(supabaseUser);
      }

      console.log('[AUTH_FETCH] User data loaded successfully');
      
      return {
        ...supabaseUser,
        displayName: userData?.display_name || supabaseUser.email || 'Anonymous User',
        country: userData?.country || 'RW',
        language: 'en' as 'en' | 'rw',
        createdAt: supabaseUser.created_at,
        lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
        mobileMoneyNumber: userData?.mobile_money_number,
        whatsappNumber: userData?.whatsapp_number,
        role: userData?.role || 'user',
        app_metadata: supabaseUser.app_metadata || { provider: 'anonymous' },
        user_metadata: supabaseUser.user_metadata || {},
        aud: supabaseUser.aud || 'authenticated',
        created_at: supabaseUser.created_at
      };
    } catch (error) {
      console.error('[AUTH_FETCH] Exception fetching user data:', error);
      return convertToAuthUser(supabaseUser);
    }
  };

  // Convert Supabase User to AuthUser
  const convertToAuthUser = (supabaseUser: User): AuthUser => {
    return {
      ...supabaseUser,
      displayName: supabaseUser.email || 'Anonymous User',
      country: 'RW',
      language: 'en' as 'en' | 'rw',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
      role: 'user',
      app_metadata: supabaseUser.app_metadata || { provider: 'anonymous' },
      user_metadata: supabaseUser.user_metadata || {},
      aud: supabaseUser.aud || 'authenticated',
      created_at: supabaseUser.created_at
    };
  };

  // Refresh user data from database
  const refreshUserData = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        const updatedUser = await fetchUserData(currentSession.user);
        setUser(updatedUser);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Error refreshing user data:', error);
    }
  };

  // Ensure anonymous authentication - only when explicitly called
  const ensureAnonymousAuth = async () => {
    try {
      // Check if we already have a valid session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (currentSession?.user) {
        if (import.meta.env.DEV) console.log('Using existing session:', currentSession.user.id);
        return;
      }

      // Only create new anonymous session if we don't have one
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        if (import.meta.env.DEV) console.error('Failed to create anonymous session:', error);
      } else {
        if (import.meta.env.DEV) console.log('New anonymous session created:', data.session?.user?.id);
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Anonymous auth error:', error);
    }
  };

  // New authentication methods
  const signInAnonymous = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        if (import.meta.env.DEV) console.error('Anonymous sign in error:', error);
        throw error;
      }
      if (import.meta.env.DEV) console.log('Anonymous sign in successful:', data.session?.user?.id);
    } catch (error) {
      if (import.meta.env.DEV) console.error('Anonymous sign in exception:', error);
      throw error;
    }
  };

  const signInEmail = async (email: string, password?: string) => {
    try {
      if (password) {
        // Sign in with password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
      } else {
        // Send magic link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Email sign in error:', error);
      throw error;
    }
  };

  const signInGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error) {
      if (import.meta.env.DEV) console.error('Google sign in error:', error);
      throw error;
    }
  };

  const signInWhatsApp = async (phoneNumber: string) => {
    try {
      // Format phone number (ensure it starts with +)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone.replace(/^\+/, '');
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'whatsapp'
        }
      });
      
      if (error) throw error;
    } catch (error) {
      if (import.meta.env.DEV) console.error('WhatsApp sign in error:', error);
      throw error;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (import.meta.env.DEV) console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          // Defer user data fetching to prevent auth state change deadlocks
          setTimeout(async () => {
            try {
              const authUser = await fetchUserData(session.user);
              setUser(authUser);
            } catch (error) {
              if (import.meta.env.DEV) console.error('Error setting user data:', error);
              setUser(convertToAuthUser(session.user));
            }
          }, 0);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Get initial session - don't auto-create anonymous session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setSession(session);
          const authUser = await fetchUserData(session.user);
          setUser(authUser);
        }
      } catch (error) {
        if (import.meta.env.DEV) console.error('Auth initialization error:', error);
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
      if (import.meta.env.DEV) console.error('Sign out error:', error);
    }
  };

  const logout = async () => {
    await signOut();
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isLoggedIn = !!session && !!user;

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
        ensureAnonymousAuth,
        refreshUserData,
        signInAnonymous,
        signInEmail,
        signInGoogle,
        signInWhatsApp
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
