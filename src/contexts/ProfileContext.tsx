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
    setLoading(true);
    try {
      const userId = (await supabase.auth.getSession()).data.session?.user?.id;
      if (!userId) return;
      const { data: userData, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (error) throw error;
      setProfile(userData as Profile);

      const { data: walletData } = await supabase.from('wallets').select('*').eq('user_id', userId).single();
      setWallet(walletData as Wallet);
    } catch (err:any) {
      console.error(err);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCountries = useCallback(async () => {
    const { data } = await supabase.from('countries').select('code,name');
    setCountries(data as Country[] || []);
  }, []);

  useEffect(()=>{fetchProfile();fetchCountries();},[fetchProfile,fetchCountries]);

  const updateProfile = useCallback(async (patch: Partial<Profile>)=>{
    if (!profile) return;
    const { error } = await supabase.from('users').update({
      display_name: patch.display_name ?? profile.display_name,
      avatar_url: patch.avatar_url ?? profile.avatar_url,
      country: patch.country ?? profile.country,
      mobile_money_number: patch.mobile_money_number ?? profile.mobile_money_number,
    }).eq('id', profile.id);
    if (error){toast.error(error.message);return;}
    toast.success('Profile updated');
    fetchProfile();
  },[profile,fetchProfile]);

  const value: ProfileContextValue = {profile,wallet,countries,loading,refreshProfile:fetchProfile,updateProfile};

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfileContext = ()=>{
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('ProfileContext missing');
  return ctx;
}; 