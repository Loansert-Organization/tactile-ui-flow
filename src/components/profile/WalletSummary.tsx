
import React from 'react';
import { Wallet, Upload, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrencyLocale } from '@/lib/i18n-formatters';

export const WalletSummary: React.FC = () => {
  const { t, i18n } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          {t('profile.walletBalance')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('currency.rwf')} {t('currency.balance')}</p>
                  <p className="text-xl font-semibold">{formatCurrencyLocale(25000, i18n.language)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex-1 gap-2">
            <Upload className="w-4 h-4" />
            Top Up
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Send className="w-4 h-4" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
