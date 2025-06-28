
import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface PreferencesCardProps {
  notifications: boolean;
  onNotificationsChange: (value: boolean) => void;
  isDarkMode: boolean;
  onDarkModeChange: (value: boolean) => void;
}

export const PreferencesCard: React.FC<PreferencesCardProps> = ({
  notifications,
  onNotificationsChange,
  isDarkMode,
  onDarkModeChange
}) => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('profile.preferences')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('profile.notifications')}</p>
            <p className="text-sm text-muted-foreground">
              {t('profile.notificationsDesc')}
            </p>
          </div>
          <Switch checked={notifications} onCheckedChange={onNotificationsChange} />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('profile.darkMode')}</p>
            <p className="text-sm text-muted-foreground">
              {t('profile.darkModeDesc')}
            </p>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={onDarkModeChange} />
        </div>
      </CardContent>
    </Card>
  );
};
