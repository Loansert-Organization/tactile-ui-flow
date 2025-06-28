
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

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  userUniqueCode,
  isEditing,
  onEditToggle,
  onSubmit
}) => {
  const { t } = useTranslation();
  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      mobileMoneyNumber: user?.mobileMoneyNumber || user?.whatsappNumber || user?.phone || ''
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset({
        displayName: user.displayName,
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
        title: "Mobile Money Change",
        description: "You will receive a WhatsApp OTP to verify your new mobile money number"
      });

      console.log('Mobile money number change requires OTP verification:', newMomoNumber);
    }

    await onSubmit(data);
  };

  const isGoogleUser = user.app_metadata?.provider === 'google';
  const isWhatsAppUser = user.app_metadata?.provider === 'phone' || user.whatsappNumber;

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
                    {getInitials(user.displayName)}
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
                            <Input {...field} className="text-lg font-semibold" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{user.displayName}</h2>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {isGoogleUser && (
                        <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          <Mail className="w-3 h-3" />
                          Google
                        </span>
                      )}
                      {isWhatsAppUser && (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded">
                          <MessageCircle className="w-3 h-3" />
                          WhatsApp
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* User information with improved contrast */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="space-y-2">
                <p className="text-xs font-bold text-foreground">User ID</p>
                <p className="text-sm text-muted-foreground font-mono bg-muted/50 px-3 py-2 rounded">{userUniqueCode}</p>
              </div>
              
              {/* Show email for Google users */}
              {isGoogleUser && user.email && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground">Email Address</p>
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              
              {/* Show WhatsApp for WhatsApp users */}
              {isWhatsAppUser && (user.whatsappNumber || user.phone) && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-foreground">WhatsApp Number</p>
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded">
                    <MessageCircle className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-muted-foreground">{user.whatsappNumber || user.phone}</p>
                  </div>
                </div>
              )}
              
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
                            <Input {...field} type="tel" placeholder="+250780123456" className="border-0 p-0 h-auto text-sm bg-transparent" />
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                          Changing this number will require WhatsApp verification
                        </p>
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-muted-foreground">
                      {user.mobileMoneyNumber || user.whatsappNumber || user.phone || 'Not set'}
                    </p>
                    {user.mobileMoneyNumber === user.whatsappNumber && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Default</span>
                    )}
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
