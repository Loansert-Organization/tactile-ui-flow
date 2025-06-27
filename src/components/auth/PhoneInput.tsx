
import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const COUNTRY_CODES = [
  { code: 'RW', prefix: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'UG', prefix: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'KE', prefix: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'TZ', prefix: '+255', flag: '🇹🇿', name: 'Tanzania' },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  error,
  className
}) => {
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = e.target.value.replace(/\D/g, '');
    onChange(phoneNumber);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor="phone" className="flex items-center gap-2">
        <Phone className="w-4 h-4" />
        Phone Number
      </Label>
      
      <div className="flex gap-2">
        <div className="flex items-center px-3 py-2 border border-input rounded-md bg-muted text-sm min-w-[80px]">
          <span className="mr-1">{selectedCountry.flag}</span>
          <span>{selectedCountry.prefix}</span>
        </div>
        
        <Input
          id="phone"
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder="780 123 456"
          className={cn(
            "flex-1 text-lg",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          maxLength={9}
        />
      </div>
      
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      
      <p className="text-xs text-muted-foreground">
        Enter your {selectedCountry.name} phone number (without country code)
      </p>
    </div>
  );
};
