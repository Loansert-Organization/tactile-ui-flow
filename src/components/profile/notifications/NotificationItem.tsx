
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { NotificationSetting } from './NotificationData';

interface NotificationItemProps {
  notification: NotificationSetting;
  onToggle: (id: string) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onToggle
}) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg glass-strong">
      <div className="flex items-start gap-3 flex-1">
        <div className="mt-0.5">
          {notification.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{notification.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {notification.description}
          </p>
        </div>
      </div>
      <Switch
        checked={notification.enabled}
        onCheckedChange={() => onToggle(notification.id)}
      />
    </div>
  );
};
