
import React, { useState } from 'react';
import { ArrowLeft, Edit3, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden safe-area-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/4 right-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 container-fluid">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <EnhancedButton 
            variant="glass" 
            size="icon" 
            onClick={() => navigate(-1)} 
            className="rounded-full touch-target"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </EnhancedButton>

          <h1 className="text-xl font-bold gradient-text">{t('profile.title')}</h1>

          <EnhancedButton 
            variant="glass" 
            size="icon" 
            onClick={handleEditToggle} 
            className="rounded-full touch-target"
            aria-label={isEditing ? "Cancel editing" : "Edit profile"}
          >
            {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </EnhancedButton>
        </div>

        <div className="space-y-6 pb-24">
          <ProfileHeader 
            user={user}
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
