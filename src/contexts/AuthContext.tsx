
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '@/services/auth';
import { fetchAnonymousToken } from '@/services/auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (user: AuthUser, tokens: { accessToken: string; refreshToken: string }) => void;
  logout: () => void;
  updateUser: (user: Partial<AuthUser>) => void;
  upgradeToWhatsapp: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for stored WhatsApp auth data first
        const storedUser = localStorage.getItem('auth_user');
        const storedToken = localStorage.getItem('auth_token');
        
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setIsGuest(false);
        } else {
          // Check for anonymous token
          const anonToken = localStorage.getItem('anon_token');
          if (!anonToken) {
            // Create anonymous session
            const tokenData = await fetchAnonymousToken();
            localStorage.setItem('anon_token', tokenData.accessToken);
            localStorage.setItem('anon_expires', String(Date.now() + tokenData.expiresIn * 1000));
          }
          setIsGuest(true);
        }
      } catch (error) {
        console.error('[Auth] Initialization failed:', error);
        setIsGuest(true);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: AuthUser, tokens: { accessToken: string; refreshToken: string }) => {
    setUser(userData);
    setIsGuest(false);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', tokens.accessToken);
    localStorage.setItem('auth_refresh_token', tokens.refreshToken);
    // Clear anonymous token
    localStorage.removeItem('anon_token');
    localStorage.removeItem('anon_expires');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(true);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_refresh_token');
    // Create new anonymous session
    fetchAnonymousToken().then(tokenData => {
      localStorage.setItem('anon_token', tokenData.accessToken);
      localStorage.setItem('anon_expires', String(Date.now() + tokenData.expiresIn * 1000));
    });
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    }
  };

  const upgradeToWhatsapp = () => {
    window.location.href = '/auth/phone';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isGuest,
      isLoggedIn: !!user && !isGuest,
      isLoading,
      login,
      logout,
      updateUser,
      upgradeToWhatsapp
    }}>
      {children}
    </AuthContext.Provider>
  );
};
