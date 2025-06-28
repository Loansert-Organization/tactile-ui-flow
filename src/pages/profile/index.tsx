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
  const { user, refreshUserData, signOut } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      if (import.meta.env.DEV) console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmit = async (data: ProfileFormData) => {
    try {
      const result = await updateProfile(data);
      if (result.ok) {
        // Refresh user data from database to get updated values
        await refreshUserData();
        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleNotificationsChange = (notifications: boolean) => {
    if (import.meta.env.DEV) console.log('Notifications updated:', notifications);
    // TODO: Implement notifications update
  };

  const handleDarkModeChange = (isDark: boolean) => {
    if (import.meta.env.DEV) console.log('Dark mode:', isDark);
    // TODO: Implement dark mode toggle
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load profile. Please try again.</p>
        </div>
      </div>
    );
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
            onNotificationsChange={handleNotificationsChange}
            isDarkMode={false}
            onDarkModeChange={handleDarkModeChange}
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
