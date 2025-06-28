import React from 'react';
import { Globe, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
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
  const {
    t
  } = useTranslation();
  const {
    theme,
    setTheme
  } = useTheme();
  const navigate = useNavigate();
  const handleDarkModeToggle = (checked: boolean) => {
    setTheme(checked ? 'dark' : 'light');
    onDarkModeChange(checked);
  };
  const currentThemeIsDark = theme === 'dark' || theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          {t('profile.preferences')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="ghost" className="w-full flex items-center justify-between p-4 h-auto" onClick={() => navigate('/notifications')}>
          <div className="text-left">
            <p className="font-medium">{t('profile.notifications')}</p>
            <p className="text-muted-foreground text-xs">
              {t('profile.notificationsDesc')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </Button>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{t('profile.darkMode')}</p>
            <p className="text-sm text-muted-foreground">
              {t('profile.darkModeDesc')}
            </p>
          </div>
          <Switch checked={currentThemeIsDark} onCheckedChange={handleDarkModeToggle} />
        </div>
      </CardContent>
    </Card>;
};