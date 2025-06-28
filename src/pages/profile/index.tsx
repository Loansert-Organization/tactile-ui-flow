
import React, { useState } from 'react';
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
  mobileMoneyNumber: string;
}

const Profile = () => {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    // Logout functionality would be implemented here
    console.log('Logout clicked');
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
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
          userUniqueCode={user.id}
          isEditing={isEditing}
          onEditToggle={handleEditToggle}
          onSubmit={handleSubmit}
        />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
          <WalletSummary />
          <QuickActions />
          <PreferencesCard 
            notifications={true}
            onNotificationsChange={(notifications) => console.log('Notifications updated:', notifications)}
            isDarkMode={false}
            onDarkModeChange={(isDark) => console.log('Dark mode:', isDark)}
          />
        </div>
        
        <div className="mt-8 space-y-6">
          <LegalSupport />
          <DangerZone onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
