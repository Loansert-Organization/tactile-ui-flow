
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { contributeGuest } from '@/services/contribution';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface GuestContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketId: string;
  basketName: string;
  onSuccess: () => void;
}

export const GuestContributionModal: React.FC<GuestContributionModalProps> = ({
  isOpen,
  onClose,
  basketId,
  basketName,
  onSuccess
}) => {
  const { t } = useTranslation();
  const { upgradeToWhatsapp } = useAuth();
  const [amount, setAmount] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: t('common.error'),
        description: t('contribution.invalidAmount'),
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await contributeGuest({
        basketId,
        amount: parseFloat(amount),
        currency: 'RWF',
        contributorName: contributorName || undefined
      });

      toast({
        title: t('common.success'),
        description: t('contribution.guestSuccess')
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('contribution.failed'),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            {t('contribution.contributeToBasket')}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{basketName}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">{t('contribution.amount')} *</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-12"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                RWF
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t('contribution.contributorName')} ({t('common.optional')})</Label>
            <Input
              id="name"
              placeholder={t('contribution.nameOrAnonymous')}
              value={contributorName}
              onChange={(e) => setContributorName(e.target.value)}
            />
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
            <p className="text-xs text-amber-800 dark:text-amber-200">
              {t('contribution.guestDisclaimer')}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t('common.loading') : t('contribution.contribute')}
            </Button>
          </div>

          <div className="pt-2 border-t">
            <Button
              type="button"
              variant="link"
              onClick={upgradeToWhatsapp}
              className="w-full text-sm"
            >
              {t('auth.upgradeToTrackContributions')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
