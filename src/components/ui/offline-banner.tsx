
import React from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export const OfflineBanner = () => {
  const { isOnline, wasOffline } = useOfflineStatus();

  if (isOnline && !wasOffline) {
    return null; // Don't show anything when online normally
  }

  return (
    <div className={`
      fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-sm font-medium transition-all duration-300
      ${isOnline 
        ? 'bg-green-600 text-white' 
        : 'bg-orange-600 text-white'
      }
    `}>
      <div className="flex items-center justify-center gap-2">
        {isOnline ? (
          <>
            <Wifi className="w-4 h-4" />
            <span>You're back online!</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4" />
            <span>You're offline - Some features may be limited</span>
          </>
        )}
      </div>
    </div>
  );
};
