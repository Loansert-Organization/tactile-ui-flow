
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supportedLocales } from '@/lib/i18n-formatters';

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  const currentLocale = supportedLocales[i18n.language] || supportedLocales.en;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>{currentLocale.flag}</span>
            <span>{currentLocale.nativeName}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {Object.values(supportedLocales).map((locale) => (
          <DropdownMenuItem
            key={locale.code}
            onClick={() => handleLanguageChange(locale.code)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>{locale.flag}</span>
              <span>{locale.nativeName}</span>
            </div>
            {i18n.language === locale.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
