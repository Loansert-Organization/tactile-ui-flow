
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Extended AuthUser type for backward compatibility
export interface AuthUser extends User {
  displayName: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  avatar?: string;
  whatsappNumber?: string;
  mobileMoneyNumber?: string;
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
  isGuest: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  login: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  updateUser: (userData: Partial<AuthUser>) => void;
  upgradeToWhatsapp: () => void;
  ensureAnonymousAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Supabase User to AuthUser
  const convertToAuthUser = (supabaseUser: User): AuthUser => {
    const provider = supabaseUser.app_metadata?.provider;
    
    return {
      ...supabaseUser,
      displayName: supabaseUser.user_metadata?.full_name || 
                   supabaseUser.user_metadata?.name || 
                   supabaseUser.user_metadata?.display_name || 
                   supabaseUser.email?.split('@')[0] || 
                   'Anonymous User',
      country: supabaseUser.user_metadata?.country || 'RW',
      language: (supabaseUser.user_metadata?.language as 'en' | 'rw') || 'en',
      createdAt: supabaseUser.created_at,
      lastLogin: supabaseUser.last_sign_in_at || supabaseUser.created_at,
      avatar: supabaseUser.user_metadata?.avatar_url,
      whatsappNumber: supabaseUser.user_metadata?.whatsapp_number || supabaseUser.phone,
      mobileMoneyNumber: supabaseUser.user_metadata?.mobile_money_number || supabaseUser.phone,
      app_metadata: supabaseUser.app_metadata || {},
      user_metadata: supabaseUser.user_metadata || {},
      aud: supabaseUser.aud || 'authenticated',
      created_at: supabaseUser.created_at
    };
  };

  // Ensure anonymous authentication for all users
  const ensureAnonymousAuth = async () => {
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Failed to create anonymous session:', error);
      } else {
        console.log('Anonymous session created:', data.session?.user?.id);
      }
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
          // If no session, create anonymous one
          await ensureAnonymousAuth();
        }
        setLoading(false);
      }
    );

    // Get initial session or create anonymous one
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setSession(session);
        setUser(convertToAuthUser(session.user));
      } else {
        await ensureAnonymousAuth();
      }
      setLoading(false);
    };

    initializeAuth();

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    // After sign out, create new anonymous session
    await ensureAnonymousAuth();
  };

  const logout = async () => {
    await signOut();
  };

  const login = (authUser: AuthUser, tokens: { accessToken: string; refreshToken: string }) => {
    setUser(authUser);
    console.log('User logged in:', authUser.id);
  };

  const updateUser = (userData: Partial<AuthUser>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const upgradeToWhatsapp = () => {
    // Navigate to WhatsApp auth flow
    window.location.href = '/auth/phone';
  };

  // All users are considered logged in (either authenticated or anonymous)
  const isLoggedIn = !!session;
  // No one is considered a guest anymore - all have anonymous auth
  const isGuest = false;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        loading,
        isLoading: loading,
        isLoggedIn,
        isGuest,
        signOut,
        logout,
        login,
        updateUser,
        upgradeToWhatsapp,
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
