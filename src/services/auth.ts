
// Mock service layer for authentication
const mockPromise = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export interface AuthUser {
  id: string;
  phone: string;
  displayName: string;
  email?: string;
  avatar?: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
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
  
  // Mock successful verification for demo code
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
        lastLogin: new Date().toISOString()
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
