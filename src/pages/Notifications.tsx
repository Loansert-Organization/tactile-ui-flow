
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Trash2, AlertCircle, CheckCircle, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';
import { usePressFeedback, useSwipeGesture } from '@/hooks/useInteractions';
import { toast } from 'sonner';

interface Notification {
  id: string;
  type: 'contribution' | 'invite' | 'reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

const Notifications = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchNotifications = () => {
      setTimeout(() => {
        try {
          setNotifications([
            {
              id: '1',
              type: 'contribution',
              title: 'New Contribution',
              message: 'John added RWF 50,000 to Holiday Savings Group',
              timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
              isRead: false,
              actionUrl: '/basket/1'
            },
            {
              id: '2',
              type: 'reminder',
              title: 'Contribution Reminder',
              message: 'Your monthly contribution of RWF 25,000 is due tomorrow',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
              isRead: false
            },
            {
              id: '3',
              type: 'invite',
              title: 'New Basket Invitation',
              message: 'Sarah invited you to join "Wedding Savings"',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
              isRead: true,
              actionUrl: '/invite/XYZ789'
            },
            {
              id: '4',
              type: 'achievement',
              title: 'Goal Reached!',
              message: 'Holiday Savings Group has reached 50% of the target goal!',
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
              isRead: true,
              actionUrl: '/basket/1'
            }
          ]);
          setIsLoading(false);
        } catch (err) {
          setError(true);
          setIsLoading(false);
        }
      }, 1000);
    };

    fetchNotifications();
  }, []);

  const handleBack = () => {
    navigate('/');
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast.success('Notification dismissed');
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'invite': return <Users className="w-5 h-5 text-blue-400" />;
      case 'reminder': return <Bell className="w-5 h-5 text-orange-400" />;
      case 'achievement': return <CheckCircle className="w-5 h-5 text-purple-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <GlassCard className="max-w-md mx-auto p-6 mt-20">
          <div className="flex items-center justify-between mb-6">
            <button onClick={(e) => { handlePress(e); handleBack(); }} className="p-2 rounded-lg hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Notifications</h1>
            <div className="w-9" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-4 bg-white/5 rounded-lg">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <GlassCard className="max-w-md mx-auto p-6 mt-20">
          <div className="flex items-center justify-between mb-6">
            <button onClick={(e) => { handlePress(e); handleBack(); }} className="p-2 rounded-lg hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Notifications</h1>
            <div className="w-9" />
          </div>

          <EmptyState
            title="Failed to Load"
            description="There was an error loading your notifications. Please try again."
            actionLabel="Retry"
            onAction={() => window.location.reload()}
            icon={<AlertCircle className="w-8 h-8 text-red-400" />}
          />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <GlassCard className="max-w-md mx-auto p-6 mt-20">
        <div className="flex items-center justify-between mb-6">
          <button onClick={(e) => { handlePress(e); handleBack(); }} className="p-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <span className="inline-block bg-gradient-magenta-orange text-xs px-2 py-1 rounded-full mt-1">
                {unreadCount} unread
              </span>
            )}
          </div>
          <div className="w-9" />
        </div>

        {notifications.length === 0 ? (
          <EmptyState
            title="No Notifications"
            description="You're all caught up! New notifications will appear here."
            icon={<Bell className="w-8 h-8 text-gray-400" />}
          />
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDismiss={() => dismissNotification(notification.id)}
                getIcon={getNotificationIcon}
                formatTime={formatTimestamp}
                handlePress={handlePress}
              />
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

interface NotificationCardProps {
  notification: Notification;
  onClick: () => void;
  onDismiss: () => void;
  getIcon: (type: string) => React.ReactNode;
  formatTime: (timestamp: Date) => string;
  handlePress: (e: React.MouseEvent) => void;
}

const NotificationCard = ({ 
  notification, 
  onClick, 
  onDismiss, 
  getIcon, 
  formatTime, 
  handlePress 
}: NotificationCardProps) => {
  const [isDismissing, setIsDismissing] = useState(false);

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    () => {
      setIsDismissing(true);
      setTimeout(() => onDismiss(), 300);
    },
    undefined,
    100
  );

  return (
    <div
      className={`transition-all duration-300 ${
        isDismissing ? 'transform translate-x-full opacity-0' : ''
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div
        onClick={(e) => { handlePress(e); onClick(); }}
        className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:bg-white/10 ${
          notification.isRead 
            ? 'bg-white/5 border-white/10' 
            : 'bg-gradient-magenta-orange/10 border-orange-500/30'
        }`}
      >
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            {getIcon(notification.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h3 className="font-medium text-white text-sm">
                {notification.title}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePress(e);
                  onDismiss();
                }}
                className="p-1 hover:bg-white/10 rounded opacity-50 hover:opacity-100"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
            
            <p className="text-gray-300 text-xs mt-1 line-clamp-2">
              {notification.message}
            </p>
            
            <p className="text-gray-500 text-xs mt-2">
              {formatTime(notification.timestamp)}
            </p>
          </div>
        </div>

        {!notification.isRead && (
          <div className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full" />
        )}
      </div>
    </div>
  );
};

export default Notifications;
