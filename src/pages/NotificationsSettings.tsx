import React, { useState, useEffect } from 'react';
import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationSetting, defaultNotifications } from '@/components/profile/notifications/NotificationData';
import { NotificationCategorySection } from '@/components/profile/notifications/NotificationCategorySection';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const NotificationsSettings = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch existing preferences on mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;

        const userId = userData.user?.id;
        if (!userId) throw new Error('User not authenticated');

        const { data, error } = await supabase
          .from('notification_preferences')
          .select('setting_id, enabled')
          .eq('user_id', userId);

        if (error) throw error;

        if (data && data.length > 0) {
          setNotifications((prev) =>
            prev.map((notif) => {
              const pref = data.find((d) => d.setting_id === notif.id);
              return pref ? { ...notif, enabled: pref.enabled } : notif;
            })
          );
        }
      } catch (err) {
        console.error('[NOTIFICATIONS] Failed to load preferences', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, []);

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
    if (import.meta.env.DEV) console.log('Saving notification preferences:', notifications);

    try {
      setIsSaving(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const userId = userData.user?.id;
      if (!userId) throw new Error('User not authenticated');

      const payload = notifications.map((n) => ({
        user_id: userId,
        setting_id: n.id,
        enabled: n.enabled
      }));

      const { error } = await supabase.from('notification_preferences').upsert(payload, {
        onConflict: 'user_id,setting_id'
      });

      if (error) throw error;

      toast.success('Notification preferences saved');
    } catch (err: any) {
      console.error('[NOTIFICATIONS] Failed to save preferences', err);
      toast.error(err.message || 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
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
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : (
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
        )}
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
