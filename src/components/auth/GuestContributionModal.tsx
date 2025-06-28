
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Crown } from 'lucide-react';
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
  const { upgradeToWhatsapp, user } = useAuth();
  const [amount, setAmount] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAnonymous = !user?.email && !user?.phone;

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
        description: t('contribution.success')
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

          {isAnonymous && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <Crown className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-amber-800 dark:text-amber-200 font-medium">
                    Anonymous Contribution
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Your contribution will be saved temporarily. Create an account to track your contributions across sessions.
                  </p>
                </div>
              </div>
            </div>
          )}

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

          {isAnonymous && (
            <div className="pt-2 border-t">
              <Button
                type="button"
                variant="link"
                onClick={upgradeToWhatsapp}
                className="w-full text-sm"
              >
                <Crown className="w-4 h-4 mr-1" />
                {t('auth.upgradeToTrackContributions')}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
