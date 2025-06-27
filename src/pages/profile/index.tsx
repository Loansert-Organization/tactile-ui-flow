
import React, { useState } from 'react';
import { ArrowLeft, Edit3, Settings, Shield, Globe, Trash2, LogOut, Upload, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  if (!user) {
    navigate('/auth/phone');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged Out",
        description: "You have been logged out successfully",
      });
      navigate('/auth/phone');
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const handleAvatarUpload = () => {
    // Mock avatar upload
    toast({
      title: "Avatar Upload",
      description: "Photo upload functionality coming soon",
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile/edit')}
            className="p-2"
          >
            <Edit3 className="w-5 h-5" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-lg">
                      {getInitials(user.displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <button
                    onClick={handleAvatarUpload}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
                  >
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{user.displayName}</h2>
                  <p className="text-muted-foreground">{user.phone}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl">🇷🇼</span>
                    <Badge variant="secondary">Premium Member</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>💰</span>
                Wallet & Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">RWF Balance</p>
                  <p className="text-lg font-semibold">25,000</p>
                </div>
                <div className="bg-muted rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">USD Balance</p>
                  <p className="text-lg font-semibold">$18.50</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Top Up Wallet
              </Button>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email || 'Not provided'}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <p className="font-medium">
                    {user.language === 'rw' ? 'Kinyarwanda' : 'English'}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
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
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Last Login</p>
                <p className="font-medium">
                  {new Date(user.lastLogin).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" className="w-full justify-start">
                <LogOut className="w-4 h-4 mr-2" />
                Log out from all devices
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get updates about your baskets
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Switch to dark theme
                  </p>
                </div>
                <Switch
                  checked={isDarkMode}
                  onCheckedChange={setIsDarkMode}
                />
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
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
