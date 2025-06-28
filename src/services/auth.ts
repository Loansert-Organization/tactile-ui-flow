// Step 2: Updated auth service for direct WhatsApp OTP
const mockPromise = <T>(data: T, delay = 1000): Promise<T> => 
  new Promise(resolve => setTimeout(() => resolve(data), delay));

export interface AuthUser {
  id: string;
  phone?: string;
  whatsappNumber?: string;
  mobileMoneyNumber?: string;
  displayName: string;
  email?: string;
  avatar?: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  app_metadata: any; // Made required to match AuthContext
  user_metadata: any; // Made required to match AuthContext
  aud: string; // Made required to match AuthContext
  created_at: string; // Made required to match AuthContext
}

export interface SessionData {
  sessionId: string;
  expiresIn: number;
  whatsappNumber: string;
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

// Step 1 & 2: Direct WhatsApp OTP request (simplified)
export const requestWhatsAppOtp = async (whatsappNumber: string): Promise<SessionData> => {
  console.log('[Auth] Requesting WhatsApp OTP for:', whatsappNumber);
  
  // Format the number properly
  const formattedNumber = whatsappNumber.startsWith('+') ? whatsappNumber : `+250${whatsappNumber}`;
  
  return mockPromise({
    sessionId: `session_${Date.now()}`,
    expiresIn: 300, // 5 minutes
    whatsappNumber: formattedNumber
  });
};

// Keep backward compatibility
export const requestOtp = requestWhatsAppOtp;

export const verifyOtp = async (sessionId: string, code: string): Promise<AuthResponse> => {
  console.log('[Auth] Verifying OTP:', { sessionId, code });
  
  if (code === '123456') {
    const whatsappNumber = '+250780123456'; // This would come from session data in real implementation
    
    return mockPromise({
      accessToken: `token_${Date.now()}`,
      refreshToken: `refresh_${Date.now()}`,
      user: {
        id: 'user_123',
        phone: whatsappNumber,
        whatsappNumber: whatsappNumber,
        mobileMoneyNumber: whatsappNumber, // Step 2: Default mobile money to WhatsApp number
        displayName: 'John Doe',
        email: 'john@example.com',
        country: 'RW',
        language: 'en' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {
          whatsapp_number: whatsappNumber,
          mobile_money_number: whatsappNumber
        },
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
