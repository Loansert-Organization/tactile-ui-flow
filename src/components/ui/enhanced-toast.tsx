
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const EnhancedToast = ({ 
  id, 
  type, 
  title, 
  description, 
  duration = 3000, 
  onClose 
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer1 = setTimeout(() => setIsVisible(true), 50);
    
    // Auto dismiss
    const timer2 = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose(id);
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getGradient = () => {
    switch (type) {
      case 'success':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'error':
        return 'from-red-500/20 to-pink-500/20 border-red-500/30';
      default:
        return 'from-blue-500/20 to-purple-500/20 border-blue-500/30';
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-4 left-4 right-4 z-50 transform transition-all duration-300 ease-out',
        'bg-gradient-to-r backdrop-blur-md border rounded-xl p-4',
        'shadow-2xl max-w-sm mx-auto',
        getGradient(),
        isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100 scale-100' 
          : 'translate-y-full opacity-0 scale-95'
      )}
      style={{
        minHeight: '44px', // Ensure minimum touch target
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-sm leading-tight">
            {title}
          </h4>
          {description && (
            <p className="text-gray-300 text-xs mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/10 transition-colors"
          style={{ minWidth: '24px', minHeight: '24px' }}
          aria-label="Close notification"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 rounded-b-xl overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-white/30 to-white/50 origin-left"
          style={{
            animation: `toast-progress ${duration}ms linear forwards`,
          }}
        />
      </div>
      
      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .toast-enhanced {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Manager Hook
interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

let toastCounter = 0;

export const useEnhancedToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${++toastCounter}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const success = (title: string, description?: string, duration?: number) => {
    addToast({ type: 'success', title, description, duration });
  };

  const error = (title: string, description?: string, duration?: number) => {
    addToast({ type: 'error', title, description, duration });
  };

  const info = (title: string, description?: string, duration?: number) => {
    addToast({ type: 'info', title, description, duration });
  };

  return {
    toasts,
    removeToast,
    success,
    error,
    info,
  };
};

// Toast Container Component
export const ToastContainer = () => {
  const { toasts, removeToast } = useEnhancedToast();

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="pointer-events-auto"
          style={{
            bottom: `${20 + index * 80}px`, // Stack toasts vertically
          }}
        >
          <EnhancedToast
            {...toast}
            onClose={removeToast}
          />
        </div>
      ))}
    </div>
  );
};
