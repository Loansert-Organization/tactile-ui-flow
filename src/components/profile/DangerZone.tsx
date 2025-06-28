
import React from 'react';
import { Trash2, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DangerZoneProps {
  onLogout: () => void;
}

export const DangerZone: React.FC<DangerZoneProps> = ({ onLogout }) => {
  const { t } = useTranslation();

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          {t('profile.dangerZone')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          variant="outline" 
          className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" 
          onClick={onLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {t('profile.logOut')}
        </Button>
        <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
          <Trash2 className="w-4 h-4 mr-2" />
          {t('profile.deleteAccount')}
        </Button>
      </CardContent>
    </Card>
  );
};
