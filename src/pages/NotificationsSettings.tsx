import React, { useState } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationSetting, defaultNotifications } from '@/components/profile/notifications/NotificationData';
import { NotificationCategorySection } from '@/components/profile/notifications/NotificationCategorySection';
import { toast } from 'react-hot-toast';

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

  const handleSave = () => {
    if (import.meta.env.DEV) console.log('Saving notification preferences:', notifications);
    // TODO: Implement saving to backend
    toast.success('Notification preferences saved');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="hover:bg-accent touch-manipulation"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              <h1 className="text-xl font-semibold">Notification Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6 pb-20">
          {categories.map((category, index) => (
            <NotificationCategorySection
              key={category}
              category={category}
              notifications={groupedNotifications[category]}
              onToggleNotification={toggleNotification}
              onToggleCategory={toggleCategory}
              isLastCategory={index === categories.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t">
        <div className="max-w-md mx-auto">
          <EnhancedButton 
            onClick={handleSave}
            loading={isSaving}
            variant="primary"
            size="lg"
            fullWidth
            className="shadow-lg"
          >
            Save Preferences
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};
