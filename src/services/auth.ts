
// Mock service layer for authentication
const mockPromise = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

// Use the same AuthUser interface as the context to avoid type conflicts
export interface AuthUser {
  id: string;
  phone?: string;
  displayName: string;
  email?: string;
  avatar?: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  // Add Supabase User properties for compatibility
  app_metadata?: any;
  user_metadata?: any;
  aud?: string;
  created_at?: string;
}

export interface SessionData {
  sessionId: string;
  expiresIn: number;
  phone: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface AnonymousTokenResponse {
  accessToken: string;
  expiresIn: number;
}

export const fetchAnonymousToken = async (): Promise<AnonymousTokenResponse> => {
  console.log('[Auth] Fetching anonymous token');
  return mockPromise({
    accessToken: `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    expiresIn: 86400 // 24 hours
  });
};

export const requestOtp = async (phone: string): Promise<SessionData> => {
  console.log('[Auth] Requesting OTP for:', phone);
  return mockPromise({
    sessionId: `session_${Date.now()}`,
    expiresIn: 300,
    phone
  });
};

export const verifyOtp = async (sessionId: string, code: string): Promise<AuthResponse> => {
  console.log('[Auth] Verifying OTP:', { sessionId, code });
  
  if (code === '123456') {
    return mockPromise({
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      user: {
        id: 'user_123',
        phone: '+250780123456',
        displayName: 'John Doe',
        email: 'john@example.com',
        country: 'RW',
        language: 'en' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      }
    });
  }
  
  throw new Error('Invalid OTP code');
};

export const updateProfile = async (payload: Partial<AuthUser>): Promise<{ ok: boolean }> => {
  console.log('[Auth] Updating profile:', payload);
  return mockPromise({ ok: true });
};

export const logout = async (): Promise<void> => {
  console.log('[Auth] Logging out');
  return mockPromise(undefined);
};
