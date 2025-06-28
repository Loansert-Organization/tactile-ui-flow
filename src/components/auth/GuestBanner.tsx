
import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const GuestBanner = () => {
  const { t } = useTranslation();
  const { isGuest, upgradeToWhatsapp } = useAuth();

  if (!isGuest) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-100">
            <UserPlus className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('auth.guestBrowsing')}
            </span>
          </div>
          <button
            onClick={upgradeToWhatsapp}
            className="text-sm font-medium text-amber-800 dark:text-amber-100 hover:underline"
          >
            {t('auth.secureAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};
