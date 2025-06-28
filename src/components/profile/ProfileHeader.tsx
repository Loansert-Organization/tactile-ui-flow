
import React from 'react';
import { Camera, MessageCircle, Wallet, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { AuthUser } from '@/services/auth';
import { toast } from '@/hooks/use-toast';

interface ProfileFormData {
  displayName: string;
  momoNumber: string;
}

interface ProfileHeaderProps {
  user: AuthUser;
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
      momoNumber: user?.phone || ''
    }
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      form.reset({
        displayName: user.displayName,
        momoNumber: user.phone || ''
      });
    }
    onEditToggle();
  };

  const handleFormSubmit = async (data: ProfileFormData) => {
    // Check if mobile money number has changed
    const currentMomoNumber = user.phone || '';
    const newMomoNumber = data.momoNumber;
    
    if (currentMomoNumber !== newMomoNumber) {
      toast({
        title: "Mobile Money Change",
        description: "You will receive a WhatsApp OTP to verify your new mobile money number",
      });
      
      // TODO: Trigger WhatsApp OTP verification flow
      console.log('Mobile money number change requires OTP verification:', newMomoNumber);
    }
    
    await onSubmit(data);
  };

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
                          <FormLabel className="text-sm text-foreground">Display Name</FormLabel>
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
                  </>
                )}
              </div>
            </div>

            {/* Always show user information */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">User ID</p>
                <p className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">{userUniqueCode}</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">WhatsApp Number</p>
                <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-foreground">{user.phone}</p>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-green-700 dark:text-green-300">Login</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Mobile Money Number</p>
                {isEditing ? (
                  <FormField 
                    control={form.control} 
                    name="momoNumber" 
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
                  <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <p className="text-sm text-foreground">{user.phone}</p>
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-700 dark:text-blue-300">Payments</span>
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
