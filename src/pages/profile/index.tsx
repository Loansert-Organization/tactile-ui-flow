
import React from 'react';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { WalletSummary } from '@/components/profile/WalletSummary';
import { QuickActions } from '@/components/profile/QuickActions';
import { PreferencesCard } from '@/components/profile/PreferencesCard';
import { DangerZone } from '@/components/profile/DangerZone';
import { LegalSupport } from '@/components/profile/LegalSupport';
import { useAuthContext } from '@/contexts/AuthContext';
import { updateProfile } from '@/services/auth';
import { toast } from 'sonner';

interface ProfileFormData {
  displayName: string;
  email: string;
  whatsappNumber: string;
  mobileMoneyNumber: string;
  country: string;
  language: string;
}

const Profile = () => {
  const { user } = useAuthContext();

  const handleUpdateProfile = async (data: ProfileFormData) => {
    try {
      await updateProfile({
        displayName: data.displayName,
        email: data.email,
        whatsappNumber: data.whatsappNumber,
        mobileMoneyNumber: data.mobileMoneyNumber,
        country: data.country,
        language: data.language as 'en' | 'rw'
      });
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <ProfileHeader 
          user={user}
          onUpdateProfile={handleUpdateProfile}
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <WalletSummary />
          <QuickActions />
          <PreferencesCard />
        </div>
        
        <div className="mt-8 space-y-6">
          <LegalSupport />
          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default Profile;
