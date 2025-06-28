
import { DollarSign, MessageSquare, Users, Target, Calendar, Zap, Heart, Gift, Bell } from 'lucide-react';

export interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'contributions' | 'social' | 'financial' | 'reminders';
  enabled: boolean;
}

export const defaultNotifications: NotificationSetting[] = [
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
];

export const categoryTitles = {
  contributions: 'Contributions & Goals',
  social: 'Social Activity',
  financial: 'Financial Updates',
  reminders: 'Reminders & Summaries'
};
