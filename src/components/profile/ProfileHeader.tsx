
import React from 'react';
import { Camera, MessageCircle, Wallet, Check, X, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

interface ProfileFormData {
  displayName: string;
  mobileMoneyNumber: string;
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
  onSubmit: (data: ProfileFormData) => Promise<void>;
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

  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: displayName,
      mobileMoneyNumber: user?.mobileMoneyNumber || user?.whatsappNumber || user?.phone || ''
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset({
        displayName: displayName,
        mobileMoneyNumber: user.mobileMoneyNumber || user.whatsappNumber || user.phone || ''
      });
    }
    onEditToggle();
  };

  const handleFormSubmit = async (data: ProfileFormData) => {
    const currentMomoNumber = user.mobileMoneyNumber || user.whatsappNumber || user.phone || '';
    const newMomoNumber = data.mobileMoneyNumber;

    if (currentMomoNumber !== newMomoNumber) {
      toast({
        title: "Mobile Money Updated",
        description: "Your mobile money number has been successfully updated"
      });

      console.log('Mobile money number updated:', newMomoNumber);
    }

    if (data.displayName !== displayName) {
      toast({
        title: "Username Updated",
        description: "Your username has been successfully updated"
      });

      console.log('Username updated:', data.displayName);
    }

    await onSubmit(data);
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
                          <FormLabel className="text-sm font-semibold text-foreground">Username</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="text-lg font-semibold" 
                              placeholder={simpleUserId}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{displayName}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {isAnonymousUser && (
                        <span className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Anonymous User
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
                  <FormField
                    control={form.control}
                    name="mobileMoneyNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="flex items-center gap-2 bg-background border border-input rounded px-3 py-2">
                            <Wallet className="w-4 h-4 text-blue-600" />
                            <Input 
                              {...field} 
                              type="tel" 
                              placeholder="+250780123456" 
                              className="border-0 p-0 h-auto text-sm bg-transparent" 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">
                      {user.mobileMoneyNumber || user.whatsappNumber || user.phone || 'Not set'}
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
