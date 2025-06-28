import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  display_name: string | null;
  mobile_money_number: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  email: string | null;
  country: string | null;
  auth_method: string | null;
  role: string | null;
}

interface Wallet {
  id: string;
  balance_usd: number | null;
}

interface Country {
  code: string;
  name: string;
}

interface ProfileContextValue {
  profile: Profile | null;
  wallet: Wallet | null;
  countries: Country[];
  loading: boolean;
  refreshProfile: () => void;
  updateProfile: (patch: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    console.log('[PROFILE_FETCH] Starting profile fetch...');
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.log('[PROFILE_FETCH] No user ID available');
        setLoading(false);
        return;
      }

      console.log('[PROFILE_FETCH] Fetching profile for user:', userId);

      // Use specific column selection to avoid RLS issues
      const { data: userData, error } = await supabase
        .from('users')
        .select('id, display_name, mobile_money_number, avatar_url, phone_number, email, country, auth_method, role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('[PROFILE_FETCH_ERROR] User data fetch failed:', error);
        
        // Handle specific error cases
        if (error.code === '42501') {
          console.error('[PROFILE_FETCH_ERROR] RLS Permission denied - user may not exist in users table');
          toast.error('Profile access denied. Please try signing in again.');
        } else if (error.code === 'PGRST116') {
          console.log('[PROFILE_FETCH] No user profile found, creating default profile');
          // User doesn't exist in users table, create a minimal profile
          const defaultProfile: Profile = {
            id: userId,
            display_name: 'Anonymous User',
            mobile_money_number: null,
            avatar_url: null,
            phone_number: null,
            email: session?.user?.email || null,
            country: 'RW',
            auth_method: 'anonymous',
            role: 'user'
          };
          setProfile(defaultProfile);
        } else {
          console.error('[PROFILE_FETCH_ERROR] Unexpected error:', error);
          toast.error('Failed to load profile');
        }
      } else {
        console.log('[PROFILE_FETCH] Profile data loaded successfully:', userData);
        setProfile(userData as Profile);
      }

      // Fetch wallet data
      console.log('[PROFILE_FETCH] Fetching wallet data...');
      const { data: walletData, error: walletError } = await supabase
        .from('wallets')
        .select('id, balance_usd')
        .eq('user_id', userId)
        .single();

      if (walletError) {
        console.warn('[PROFILE_FETCH_WARNING] Wallet fetch failed:', walletError);
        if (walletError.code === 'PGRST116') {
          console.log('[PROFILE_FETCH] No wallet found, using default');
          setWallet({ id: 'default', balance_usd: 0 });
        }
      } else {
        console.log('[PROFILE_FETCH] Wallet data loaded:', walletData);
        setWallet(walletData as Wallet);
      }

    } catch (err: any) {
      console.error('[PROFILE_FETCH_ERROR] Unexpected exception:', err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    try {
      const { data, error } = await supabase.from('countries').select('code,name');
      if (error) {
        console.warn('[PROFILE_FETCH_WARNING] Countries fetch failed:', error);
        // Use fallback countries if fetch fails
        setCountries([
          { code: 'RW', name: 'Rwanda' },
          { code: 'UG', name: 'Uganda' },
          { code: 'KE', name: 'Kenya' },
          { code: 'TZ', name: 'Tanzania' }
        ]);
      } else {
        setCountries(data as Country[] || []);
      }
    } catch (err) {
      console.warn('[PROFILE_FETCH_WARNING] Countries fetch exception:', err);
      setCountries([{ code: 'RW', name: 'Rwanda' }]);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    fetchCountries();
  }, [fetchProfile, fetchCountries]);

  const updateProfile = useCallback(async (patch: Partial<Profile>) => {
    if (!profile) {
      console.warn('[PROFILE_UPDATE] No profile available to update');
      return;
    }

    console.log('[PROFILE_UPDATE] Updating profile with:', patch);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: patch.display_name ?? profile.display_name,
          avatar_url: patch.avatar_url ?? profile.avatar_url,
          country: patch.country ?? profile.country,
          mobile_money_number: patch.mobile_money_number ?? profile.mobile_money_number,
        })
        .eq('id', profile.id);

      if (error) {
        console.error('[PROFILE_UPDATE_ERROR] Update failed:', error);
        
        if (error.code === '42501') {
          toast.error('Permission denied. Please try signing in again.');
        } else {
          toast.error('Failed to update profile: ' + error.message);
        }
        return;
      }

      console.log('[PROFILE_UPDATE] Profile updated successfully');
      toast.success('Profile updated');
      fetchProfile();
    } catch (err: any) {
      console.error('[PROFILE_UPDATE_ERROR] Unexpected exception:', err);
      toast.error('Failed to update profile');
    }
  }, [profile, fetchProfile]);

  const value: ProfileContextValue = {
    profile,
    wallet,
    countries,
    loading,
    refreshProfile: fetchProfile,
    updateProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfileContext = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('ProfileContext missing');
  return ctx;
}; 