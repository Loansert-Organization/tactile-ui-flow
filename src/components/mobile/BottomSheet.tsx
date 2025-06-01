
import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  maxHeight?: string;
}

export const BottomSheet = ({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  className,
  maxHeight = "80vh"
}: BottomSheetProps) => {
  const { handlePress } = usePressFeedback();
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-white/20 rounded-t-3xl animate-slide-in-bottom transition-transform duration-300",
          className
        )}
        style={{ maxHeight }}
      >
        {/* Handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-gray-600 rounded-full" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 pb-4">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={(e) => {
                handlePress(e);
                onClose();
              }}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 100px)` }}>
          {children}
        </div>
      </div>
    </div>
  );
};
