
import { supabase } from '@/integrations/supabase/client';

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
  mobileMoneyNumber?: string;
  whatsappNumber?: string;
  phone?: string;
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

export const updateProfile = async (payload: { displayName?: string; mobileMoneyNumber?: string }): Promise<{ ok: boolean }> => {
  console.log('[Auth] Updating profile:', payload);
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('[Auth] No authenticated user found');
      return { ok: false };
    }

    // Update the users table in Supabase
    const updateData: any = {};
    
    if (payload.displayName) {
      updateData.display_name = payload.displayName;
    }
    
    if (payload.mobileMoneyNumber) {
      updateData.mobile_money_number = payload.mobileMoneyNumber;
      updateData.whatsapp_number = payload.mobileMoneyNumber; // Keep them in sync
    }

    const { error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id);

    if (error) {
      console.error('[Auth] Error updating profile:', error);
      return { ok: false };
    }

    console.log('[Auth] Profile updated successfully');
    return { ok: true };
  } catch (error) {
    console.error('[Auth] Exception updating profile:', error);
    return { ok: false };
  }
};

export const logout = async (): Promise<void> => {
  console.log('[Auth] Logging out');
  return mockPromise(undefined);
};
