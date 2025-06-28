
import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OfflineIndicatorProps {
  pendingActions?: number;
  onRetry?: () => void;
  className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  pendingActions = 0,
  onRetry,
  className = ''
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showRetryButton, setShowRetryButton] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRetryButton(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setTimeout(() => setShowRetryButton(true), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && pendingActions === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${className}`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`px-4 py-2 rounded-lg glass-strong flex items-center gap-3 ${
          isOnline ? 'bg-blue-500/20 border-blue-500/50' : 'bg-red-500/20 border-red-500/50'
        }`}>
          {/* Connection Status Icon */}
          <motion.div
            animate={{ rotate: isOnline ? 0 : [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: isOnline ? 0 : Infinity }}
          >
            {isOnline ? (
              <Wifi className="w-4 h-4 text-blue-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
          </motion.div>

          {/* Status Message */}
          <div className="text-sm">
            {!isOnline && (
              <span className="text-red-400 font-semibold">Offline</span>
            )}
            {isOnline && pendingActions > 0 && (
              <span className="text-blue-400 font-semibold">
                Syncing {pendingActions} action{pendingActions !== 1 ? 's' : ''}...
              </span>
            )}
          </div>

          {/* Retry Button */}
          {showRetryButton && onRetry && (
            <motion.button
              onClick={onRetry}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <RefreshCw className="w-4 h-4 text-gray-400" />
            </motion.button>
          )}

          {/* Pending Actions Indicator */}
          {pendingActions > 0 && (
            <motion.div
              className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {pendingActions > 9 ? '9+' : pendingActions}
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
