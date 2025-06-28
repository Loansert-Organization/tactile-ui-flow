import React from 'react';
import { useProfileContext, ProfileProvider } from '@/contexts/ProfileContext';
import { EditableField } from '@/components/profile/EditableField';
import { AvatarUploader } from '@/components/profile/AvatarUploader';
import { WalletCard } from '@/components/profile/WalletCard';
import { SecuritySection } from '@/components/profile/SecuritySection';
import { ActivityTabs } from '@/components/profile/ActivityTabs';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileInner:React.FC = ()=>{
  const { profile, wallet, countries, loading, updateProfile } = useProfileContext();
  if (loading || !profile) return <div className="p-6"><Skeleton className="h-32 w-full"/></div>;
  const countryOptions = countries.map(c=>c.code);
  return (
    <div className="space-y-6 p-6 max-w-lg mx-auto">
      {/* Avatar & name */}
      <div className="flex gap-4 items-center">
        <AvatarUploader avatarUrl={profile.avatar_url}/>
        <div className="flex-1">
          <EditableField label="Display Name" value={profile.display_name} placeholder="Anonymous User" onSave={(v)=>updateProfile({display_name:v})}/>
          <div className="text-sm text-gray-400 mt-1">{profile.email || profile.phone_number || '—'}</div>
        </div>
      </div>

      {/* Country */}
      <EditableField label="Country Code" value={profile.country} placeholder="Select country" onSave={(v)=>updateProfile({country:v})}/>

      {/* Mobile Money Number */}
      <EditableField label="Mobile Money Number" value={profile.mobile_money_number} placeholder="Add number" onSave={(v)=>updateProfile({mobile_money_number:v})}/>

      {/* Wallet */}
      <WalletCard balance={wallet?.balance_usd || 0}/>

      {/* Security */}
      <SecuritySection/>

      {/* Activity */}
      <ActivityTabs/>
    </div>
  );
};

const ProfilePage:React.FC = ()=> (
  <ProfileProvider>
    <ProfileInner/>
  </ProfileProvider>
);

export default ProfilePage;
