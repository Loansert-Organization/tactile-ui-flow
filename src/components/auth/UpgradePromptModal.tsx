
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: string;
}

export const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  isOpen,
  onClose,
  feature
}) => {
  const { t } = useTranslation();
  const { upgradeToWhatsapp } = useAuth();

  const handleUpgrade = () => {
    upgradeToWhatsapp();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-500" />
            {t('auth.upgradeRequired')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              {t('auth.upgradeMessage', { feature })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleUpgrade}
              className="flex-1"
            >
              <span>{t('auth.continueWithWhatsApp')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
