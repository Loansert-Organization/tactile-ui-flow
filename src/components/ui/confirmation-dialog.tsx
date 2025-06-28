
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning';
  loading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <X className="w-8 h-8 text-red-500" />;
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getGradientClass = () => {
    switch (variant) {
      case 'destructive':
        return 'gradient-text-destructive';
      case 'success':
        return 'gradient-text-success';
      case 'warning':
        return 'gradient-text-warning';
      default:
        return 'gradient-text-primary';
    }
  };

  const getConfirmButtonClass = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      case 'success':
        return 'btn-gradient-primary';
      case 'warning':
        return 'btn-gradient-primary';
      default:
        return 'btn-gradient-primary';
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass-modal border-0 shadow-2xl max-w-md mx-4 sm:mx-auto">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          <AlertDialogTitle className={cn("text-xl sm:text-2xl font-bold", getGradientClass())}>
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed px-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="flex-col sm:flex-row gap-3 mt-6">
          <AlertDialogCancel 
            onClick={onClose}
            className="glass-button w-full sm:w-auto order-2 sm:order-1"
            disabled={loading}
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "w-full sm:w-auto order-1 sm:order-2",
              getConfirmButtonClass(),
              loading && 'pointer-events-none opacity-75'
            )}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
