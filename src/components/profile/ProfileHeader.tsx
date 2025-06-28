

import React from 'react';
import { Camera, MessageCircle, Wallet, Check, X, Mail, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

interface ProfileFormData {
  displayName: string;
  countryCode: string;
  phoneNumber: string;
}

interface ProfileUser {
  id: string;
  displayName: string;
  phone?: string;
  email?: string;
  avatar?: string;
  country: string;
  language: 'en' | 'rw';
  createdAt: string;
  lastLogin: string;
  whatsappNumber?: string;
  mobileMoneyNumber?: string;
  app_metadata?: any;
}

interface ProfileHeaderProps {
  user: ProfileUser;
  userUniqueCode: string;
  isEditing: boolean;
  onEditToggle: () => void;
  onSubmit: (data: { displayName: string; mobileMoneyNumber: string }) => Promise<void>;
}

// Generate a simple 6-character user ID from the full UUID
const generateSimpleUserId = (fullId: string): string => {
  // Create a consistent hash from the full ID
  let hash = 0;
  for (let i = 0; i < fullId.length; i++) {
    const char = fullId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to a 6-character alphanumeric code
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  let num = Math.abs(hash);
  
  for (let i = 0; i < 6; i++) {
    result += chars[num % chars.length];
    num = Math.floor(num / chars.length);
  }
  
  return result;
};

const countryCodes = [
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+243', country: 'DR Congo', flag: '🇨🇩' },
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
];

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  userUniqueCode,
  isEditing,
  onEditToggle,
  onSubmit
}) => {
  const { t } = useTranslation();
  const simpleUserId = generateSimpleUserId(user.id);
  
  // Use simple user ID as default display name if user hasn't set a custom one
  const getDisplayName = () => {
    if (user.displayName === 'Anonymous User' || !user.displayName) {
      return simpleUserId;
    }
    return user.displayName;
  };

  const displayName = getDisplayName();

  // Parse existing mobile money number to separate country code and phone number
  const parsePhoneNumber = (fullNumber: string) => {
    if (!fullNumber) return { countryCode: '+250', phoneNumber: '' };
    
    const countryCode = countryCodes.find(cc => fullNumber.startsWith(cc.code));
    if (countryCode) {
      return {
        countryCode: countryCode.code,
        phoneNumber: fullNumber.slice(countryCode.code.length)
      };
    }
    
    return { countryCode: '+250', phoneNumber: fullNumber };
  };

  const existingNumber = user?.mobileMoneyNumber || user?.whatsappNumber || user?.phone || '';
  const { countryCode, phoneNumber } = parsePhoneNumber(existingNumber);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: displayName,
      countryCode: countryCode,
      phoneNumber: phoneNumber
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      const { countryCode, phoneNumber } = parsePhoneNumber(existingNumber);
      form.reset({
        displayName: displayName,
        countryCode: countryCode,
        phoneNumber: phoneNumber
      });
    }
    onEditToggle();
  };

  const handleFormSubmit = async (data: ProfileFormData) => {
    const fullMobileNumber = data.countryCode + data.phoneNumber;
    const currentMomoNumber = user.mobileMoneyNumber || user.whatsappNumber || user.phone || '';

    if (currentMomoNumber !== fullMobileNumber) {
      toast({
        title: "Mobile Money Updated",
        description: "Your mobile money number has been successfully updated"
      });

      console.log('Mobile money number updated:', fullMobileNumber);
    }

    if (data.displayName !== displayName) {
      toast({
        title: "Username Updated",
        description: "Your username has been successfully updated"
      });

      console.log('Username updated:', data.displayName);
    }

    await onSubmit({
      displayName: data.displayName,
      mobileMoneyNumber: fullMobileNumber
    });
  };

  const isAnonymousUser = user.app_metadata?.provider === 'anonymous' || !user.app_metadata?.provider;

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="text-lg">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-foreground">Display Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="text-lg font-semibold" 
                              placeholder="Enter your friendly name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold">{displayName}</h2>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleEditToggle}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {isAnonymousUser && (
                        <span className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                          @{displayName}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User information */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground">User ID</p>
                <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded">{simpleUserId}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground">Mobile Money Number</p>
                {isEditing ? (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <FormField
                        control={form.control}
                        name="countryCode"
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormControl>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger className="bg-background border border-input">
                                  <SelectValue placeholder="Code" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countryCodes.map((country) => (
                                    <SelectItem key={country.code} value={country.code}>
                                      <span className="flex items-center gap-2">
                                        <span>{country.flag}</span>
                                        <span>{country.code}</span>
                                      </span>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <div className="flex items-center gap-2 bg-background border border-input rounded px-3 py-2">
                                <Wallet className="w-4 h-4 text-blue-600" />
                                <Input 
                                  {...field} 
                                  type="tel" 
                                  placeholder="780123456" 
                                  className="border-0 p-0 h-auto text-sm bg-transparent" 
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">
                      {existingNumber || 'Not set'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button type="submit" size="sm" className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  {t('common.save')}
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={handleEditToggle}>
                  {t('common.cancel')}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

