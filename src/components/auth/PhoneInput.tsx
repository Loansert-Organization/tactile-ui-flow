
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const COUNTRY_CODES = [
  { code: 'RW', prefix: '+250', flag: '🇷🇼', name: 'Rwanda' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  className
}) => {
  const { t } = useTranslation();
  const [selectedCountry] = useState(COUNTRY_CODES[0]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, '');
    onChange(phoneNumber);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
        {t('auth.phoneNumber')}
      </Label>
      
      <div className="flex gap-2">
        <div className="flex items-center px-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-sm min-w-[80px]">
          <span className="mr-1">{selectedCountry.flag}</span>
          <span className="font-medium">{selectedCountry.prefix}</span>
        </div>
        
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder="780 123 456"
          className={cn(
            "flex-1 h-12 border-gray-300 rounded-lg",
            error && "border-red-500 focus-visible:ring-red-500"
          )}
          maxLength={9}
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      <p className="text-xs text-gray-500">
        Enter your {selectedCountry.name} phone number (without country code)
      </p>
    </div>
  );
};
