
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { NotificationSetting, categoryTitles } from './NotificationData';
import { NotificationItem } from './NotificationItem';

interface NotificationCategorySectionProps {
  category: string;
  notifications: NotificationSetting[];
  onToggleNotification: (id: string) => void;
  onToggleCategory: (category: string, enabled: boolean) => void;
  isLastCategory?: boolean;
}

export const NotificationCategorySection: React.FC<NotificationCategorySectionProps> = ({
  category,
  notifications,
  onToggleNotification,
  onToggleCategory,
  isLastCategory = false
}) => {
  const enabledCount = notifications.filter(n => n.enabled).length;
  const totalCount = notifications.length;
  const allEnabled = enabledCount === totalCount;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
          {categoryTitles[category as keyof typeof categoryTitles]}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {enabledCount}/{totalCount}
          </span>
          <Switch
            checked={allEnabled}
            onCheckedChange={(checked) => onToggleCategory(category, checked)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggle={onToggleNotification}
          />
        ))}
      </div>
      
      {!isLastCategory && <Separator />}
    </div>
  );
};
