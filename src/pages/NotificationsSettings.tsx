
import React, { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationSetting, defaultNotifications } from '@/components/profile/notifications/NotificationData';
import { NotificationCategorySection } from '@/components/profile/notifications/NotificationCategorySection';

export const NotificationsSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.category === category ? { ...notif, enabled } : notif
      )
    );
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    if (!acc[notif.category]) {
      acc[notif.category] = [];
    }
    acc[notif.category].push(notif);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  const categories = Object.keys(groupedNotifications);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving notification preferences:', notifications);
      navigate(-1);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
        <GlassCard variant="subtle" className="m-2 px-4 py-3 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <EnhancedButton 
                variant="ghost" 
                size="icon" 
                onClick={handleBack}
                className="hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </EnhancedButton>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accent" />
                <h1 className="text-xl font-semibold gradient-text">Notification Settings</h1>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6 pb-24">
          {categories.map((category, index) => (
            <GlassCard key={category} variant="default" className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <NotificationCategorySection
                category={category}
                notifications={groupedNotifications[category]}
                onToggleNotification={toggleNotification}
                onToggleCategory={toggleCategory}
                isLastCategory={index === categories.length - 1}
              />
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 backdrop-blur-lg border-t border-white/10">
        <GlassCard variant="subtle" className="max-w-md mx-auto p-4">
          <EnhancedButton 
            onClick={handleSave}
            loading={isSaving}
            variant="gradient"
            size="lg"
            fullWidth
            className="shadow-glass-lg"
          >
            Save Preferences
          </EnhancedButton>
        </GlassCard>
      </div>
    </div>
  );
};
