
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
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

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
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
          <GlassCard variant="subtle" className="m-2 px-4 py-3 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EnhancedButton 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => navigate(-1)}
                  className="hover:bg-white/10"
                >
                  <ArrowLeft className="w-5 h-5" />
                </EnhancedButton>
                <h1 className="text-xl font-semibold gradient-text">{t('profile.title')}</h1>
              </div>
              <EnhancedButton 
                variant="ghost" 
                size="icon" 
                onClick={handleEditToggle}
                className="hover:bg-white/10"
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </EnhancedButton>
            </div>
          </GlassCard>
        </div>

        <div className="p-4 space-y-6 pb-24">
          <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <ProfileHeader 
              user={user}
              userUniqueCode={userUniqueCode}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onSubmit={onSubmit}
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <WalletSummary />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
            <QuickActions />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
            <PreferencesCard 
              notifications={notifications}
              onNotificationsChange={setNotifications}
              isDarkMode={isDarkMode}
              onDarkModeChange={setIsDarkMode}
            />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '500ms' }}>
            <LegalSupport />
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '600ms' }}>
            <DangerZone onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </div>
  );
};
