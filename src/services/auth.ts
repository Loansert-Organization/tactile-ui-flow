
// Simplified auth service for anonymous auth only
const mockPromise = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export interface AuthUser {
  id: string;
  displayName: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  app_metadata: any;
  user_metadata: any;
  aud: string;
  created_at: string;
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

export const updateProfile = async (payload: Partial<AuthUser>): Promise<{ ok: boolean }> => {
  console.log('[Auth] Updating profile:', payload);
  return mockPromise({ ok: true });
};

export const logout = async (): Promise<void> => {
  console.log('[Auth] Logging out');
  return mockPromise(undefined);
};
