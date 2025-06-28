
import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NotificationSetting, defaultNotifications } from './notifications/NotificationData';
import { NotificationCategorySection } from './notifications/NotificationCategorySection';

interface NotificationsWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsWizard: React.FC<NotificationsWizardProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationSetting[]>(defaultNotifications);

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
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
        </ScrollArea>
        
        <div className="p-6 pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
