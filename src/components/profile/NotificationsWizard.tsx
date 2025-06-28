
import React, { useState } from 'react';
import { X, Bell, MessageSquare, DollarSign, Users, Target, Calendar, Zap, Heart, Gift } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'contributions' | 'social' | 'financial' | 'reminders';
  enabled: boolean;
}

interface NotificationsWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsWizard: React.FC<NotificationsWizardProps> = ({
  isOpen,
  onClose
}) => {
  const { t } = useTranslation();
  
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    // Contributions Category
    {
      id: 'new_contribution',
      title: 'New Contributions',
      description: 'When someone contributes to your baskets',
      icon: <DollarSign className="w-4 h-4 text-green-500" />,
      category: 'contributions',
      enabled: true
    },
    {
      id: 'goal_reached',
      title: 'Goal Reached',
      description: 'When a basket reaches its funding goal',
      icon: <Target className="w-4 h-4 text-blue-500" />,
      category: 'contributions',
      enabled: true
    },
    {
      id: 'contribution_milestone',
      title: 'Contribution Milestones',
      description: 'When baskets hit 25%, 50%, 75% funded',
      icon: <Zap className="w-4 h-4 text-yellow-500" />,
      category: 'contributions',
      enabled: true
    },
    
    // Social Category
    {
      id: 'new_member',
      title: 'New Members',
      description: 'When someone joins your basket',
      icon: <Users className="w-4 h-4 text-purple-500" />,
      category: 'social',
      enabled: true
    },
    {
      id: 'basket_comments',
      title: 'Comments & Messages',
      description: 'When someone comments on your baskets',
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
      category: 'social',
      enabled: false
    },
    {
      id: 'basket_reactions',
      title: 'Reactions',
      description: 'When someone reacts to your contributions',
      icon: <Heart className="w-4 h-4 text-red-500" />,
      category: 'social',
      enabled: false
    },
    {
      id: 'friend_activity',
      title: 'Friend Activity',
      description: 'When friends create new baskets or make contributions',
      icon: <Gift className="w-4 h-4 text-pink-500" />,
      category: 'social',
      enabled: false
    },
    
    // Financial Category
    {
      id: 'payment_successful',
      title: 'Payment Confirmations',
      description: 'When your contributions are processed',
      icon: <DollarSign className="w-4 h-4 text-green-500" />,
      category: 'financial',
      enabled: true
    },
    {
      id: 'payment_failed',
      title: 'Payment Issues',
      description: 'When payments fail or need attention',
      icon: <Bell className="w-4 h-4 text-red-500" />,
      category: 'financial',
      enabled: true
    },
    {
      id: 'loan_updates',
      title: 'Loan Updates',
      description: 'Updates on loan applications and approvals',
      icon: <DollarSign className="w-4 h-4 text-blue-500" />,
      category: 'financial',
      enabled: true
    },
    
    // Reminders Category
    {
      id: 'contribution_reminders',
      title: 'Contribution Reminders',
      description: 'Gentle reminders for regular contributions',
      icon: <Calendar className="w-4 h-4 text-orange-500" />,
      category: 'reminders',
      enabled: true
    },
    {
      id: 'basket_deadlines',
      title: 'Basket Deadlines',
      description: 'When baskets are approaching their end date',
      icon: <Calendar className="w-4 h-4 text-red-500" />,
      category: 'reminders',
      enabled: true
    },
    {
      id: 'weekly_summary',
      title: 'Weekly Summary',
      description: 'Weekly roundup of your activity and achievements',
      icon: <Bell className="w-4 h-4 text-blue-500" />,
      category: 'reminders',
      enabled: false
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      )
    );
  };

  const toggleCategory = (category: string, enabled: boolean) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.category === category ? { ...notif, enabled } : notif
      )
    );
  };

  const groupedNotifications = notifications.reduce((acc, notif) => {
    if (!acc[notif.category]) {
      acc[notif.category] = [];
    }
    acc[notif.category].push(notif);
    return acc;
  }, {} as Record<string, NotificationSetting[]>);

  const categoryTitles = {
    contributions: 'Contributions & Goals',
    social: 'Social Activity',
    financial: 'Financial Updates',
    reminders: 'Reminders & Summaries'
  };

  const getCategoryEnabledCount = (category: string) => {
    const categoryNotifs = groupedNotifications[category] || [];
    return categoryNotifs.filter(n => n.enabled).length;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {Object.entries(groupedNotifications).map(([category, notifs]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                    {categoryTitles[category as keyof typeof categoryTitles]}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {getCategoryEnabledCount(category)}/{notifs.length}
                    </span>
                    <Switch
                      checked={getCategoryEnabledCount(category) === notifs.length}
                      onCheckedChange={(checked) => toggleCategory(category, checked)}
                      size="sm"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {notifs.map((notif) => (
                    <div
                      key={notif.id}
                      className="flex items-center justify-between p-3 rounded-lg glass-strong"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-0.5">
                          {notif.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{notif.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {notif.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={notif.enabled}
                        onCheckedChange={() => toggleNotification(notif.id)}
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
                
                {category !== 'reminders' && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="p-6 pt-4 border-t">
          <Button onClick={onClose} className="w-full">
            Save Preferences
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
