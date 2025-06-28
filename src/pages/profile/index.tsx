
import React, { useState } from 'react';
import { ArrowLeft, Edit3, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { WalletSummary } from '@/components/profile/WalletSummary';
import { QuickActions } from '@/components/profile/QuickActions';
import { PreferencesCard } from '@/components/profile/PreferencesCard';
import { LegalSupport } from '@/components/profile/LegalSupport';
import { DangerZone } from '@/components/profile/DangerZone';

interface ProfileFormData {
  displayName: string;
  email: string;
  momoNumber: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { t } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Generate unique code based on user ID
  const generateUniqueCode = (userId: string) => {
    const prefix = 'USR';
    const hash = userId.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const code = Math.abs(hash).toString().padStart(6, '0').slice(-6);
    return `${prefix}${code}`;
  };

  if (!user) {
    navigate('/auth/phone');
    return null;
  }

  const userUniqueCode = generateUniqueCode(user.id);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('profile.logoutSuccess'),
        description: t('profile.logoutSuccess')
      });
      navigate('/auth/phone');
    } catch (error) {
      toast({
        title: t('profile.logoutFailed'),
        description: t('profile.logoutFailed'),
        variant: "destructive"
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      updateUser({
        displayName: data.displayName,
        email: data.email,
        phone: data.momoNumber
      });
      toast({
        title: t('common.success'),
        description: t('profile.settingsUpdated')
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('profile.logoutFailed'),
        variant: "destructive"
      });
    }
  };

  // Convert the context AuthUser to the format expected by ProfileHeader
  const profileUser = {
    ...user,
    phone: user.phone || '', // Ensure phone is always a string
    avatar: user.avatar,
    displayName: user.displayName,
    id: user.id,
    email: user.email,
    country: user.country,
    language: user.language,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t('profile.title')}</h1>
          <Button variant="ghost" size="sm" onClick={handleEditToggle} className="p-2">
            {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="space-y-6">
          <ProfileHeader 
            user={profileUser}
            userUniqueCode={userUniqueCode}
            isEditing={isEditing}
            onEditToggle={handleEditToggle}
            onSubmit={onSubmit}
          />

          <WalletSummary />

          <QuickActions />

          <PreferencesCard 
            notifications={notifications}
            onNotificationsChange={setNotifications}
            isDarkMode={isDarkMode}
            onDarkModeChange={setIsDarkMode}
          />

          <LegalSupport />

          <DangerZone onLogout={handleLogout} />
        </div>
      </div>
    </div>
  );
};
