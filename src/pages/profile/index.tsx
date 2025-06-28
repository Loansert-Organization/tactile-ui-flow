import React, { useState } from 'react';
import { ArrowLeft, Edit3, Settings, Shield, Globe, Trash2, LogOut, Upload, Camera, Check, X, MessageCircle, Wallet, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { LanguageSwitcher } from '@/components/language/LanguageSwitcher';
import { formatCurrencyLocale, formatDateTimeLocale, formatDateLocale } from '@/lib/i18n-formatters';

interface ProfileFormData {
  displayName: string;
  email: string;
  momoNumber: string;
}

export const Profile = () => {
  const navigate = useNavigate();
  const {
    user,
    logout,
    updateUser
  } = useAuth();
  const {
    t,
    i18n
  } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const form = useForm<ProfileFormData>({
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
      momoNumber: user?.phone || ''
    }
  });

  // Generate unique code based on user ID
  const generateUniqueCode = (userId: string) => {
    const prefix = 'USR';
    const hash = userId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const code = Math.abs(hash).toString().padStart(6, '0').slice(-6);
    return `${prefix}${code}`;
  };

  if (!user) {
    navigate('/auth/phone');
    return null;
  }

  const userUniqueCode = generateUniqueCode(user.id);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('profile.logoutSuccess'),
        description: t('profile.logoutSuccess')
      });
      navigate('/auth/phone');
    } catch (error) {
      toast({
        title: t('profile.logoutFailed'),
        description: t('profile.logoutFailed'),
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = () => {
    toast({
      title: t('profile.avatarUpload'),
      description: t('profile.photoUploadSoon')
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      form.reset({
        displayName: user.displayName,
        email: user.email || '',
        momoNumber: user.phone || ''
      });
    }
    setIsEditing(!isEditing);
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      updateUser({
        displayName: data.displayName,
        email: data.email,
        phone: data.momoNumber // Update phone with momo number
      });
      toast({
        title: t('common.success'),
        description: t('profile.settingsUpdated')
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('common.error'),
        description: t('profile.logoutFailed'),
        variant: "destructive"
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">{t('profile.title')}</h1>
          <Button variant="ghost" size="sm" onClick={handleEditToggle} className="p-2">
            {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-lg">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <button type="button" onClick={handleAvatarUpload} className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
                        <Camera className="w-4 h-4 text-primary-foreground" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      {isEditing ? <div className="space-y-3">
                          <FormField control={form.control} name="displayName" render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="text-sm">{t('profile.personalDetails')}</FormLabel>
                                <FormControl>
                                  <Input {...field} className="text-lg font-semibold" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="email" render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="text-sm">{t('profile.email')}</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                          <FormField control={form.control} name="momoNumber" render={({
                        field
                      }) => <FormItem>
                                <FormLabel className="text-sm">Mobile Money Number</FormLabel>
                                <FormControl>
                                  <Input {...field} type="tel" placeholder="+250780123456" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>} />
                        </div> : <>
                          <h2 className="text-xl font-semibold">{user.displayName}</h2>
                          <p className="text-sm text-muted-foreground font-mono">{userUniqueCode}</p>
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center gap-2">
                              <MessageCircle className="w-4 h-4 text-green-600" />
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Wallet className="w-4 h-4 text-blue-600" />
                              <p className="text-sm text-muted-foreground">{user.phone}</p>
                            </div>
                          </div>
                          
                        </>}
                    </div>
                  </div>

                  {isEditing && <div className="flex gap-2 pt-4">
                      <Button type="submit" size="sm" className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        {t('common.save')}
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={handleEditToggle}>
                        {t('common.cancel')}
                      </Button>
                    </div>}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Wallet Summary */}
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
                <Button variant="outline" className="flex-1" size="icon">
                  <Upload className="w-4 h-4" />
                </Button>
                <Button variant="outline" className="flex-1" size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {t('profile.personalDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.email')}</p>
                  <p className="font-medium">{user.email || t('profile.notProvided')}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.language')}</p>
                  <div className="mt-2">
                    <LanguageSwitcher />
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">{t('profile.memberSince')}</p>
                  <p className="font-medium">
                    {formatDateLocale(user.createdAt, i18n.language)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                {t('profile.security')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('profile.lastLogin')}</p>
                <p className="font-medium">
                  {formatDateTimeLocale(user.lastLogin, i18n.language)}
                </p>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                {t('profile.logOut')}
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                {t('profile.preferences')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('profile.notifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.notificationsDesc')}
                  </p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('profile.darkMode')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('profile.darkModeDesc')}
                  </p>
                </div>
                <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
            </CardContent>
          </Card>

          {/* Legal & Support */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Terms & Conditions
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Help & Support
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                {t('profile.dangerZone')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t('profile.logOut')}
              </Button>
              <Button variant="outline" className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash2 className="w-4 h-4 mr-2" />
                {t('profile.deleteAccount')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
