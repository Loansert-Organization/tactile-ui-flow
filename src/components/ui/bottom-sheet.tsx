
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
  showHandle?: boolean;
  showCloseButton?: boolean;
  disableOverlayClose?: boolean;
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  children,
  height = 'auto',
  showHandle = true,
  showCloseButton = true,
  disableOverlayClose = false,
  className,
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number>(0);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  
  const sheetRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
      setCurrentY(0);
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  useEffect(() => {
    if (sheetRef.current) {
      setSheetHeight(sheetRef.current.clientHeight);
    }
  }, [isOpen]);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };
  
  const heightClass = height === 'full' 
    ? 'min-h-[90vh] max-h-[90vh]' 
    : height === 'half' 
    ? 'min-h-[50vh] max-h-[50vh]' 
    : 'max-h-[85vh]';
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === null) return;
    
    const currentTouch = e.touches[0].clientY;
    const diff = currentTouch - startY;
    
    if (diff < 0) return; // Prevent pulling down
    
    setCurrentY(diff);
  };
  
  const handleTouchEnd = () => {
    if (currentY > 100) {
      handleClose();
    } else {
      setCurrentY(0);
    }
    setStartY(null);
  };
  
  if (!isOpen && !isClosing) return null;
  
  const transform = currentY ? `translateY(${currentY}px)` : 'translateY(0)';
  const opacity = currentY ? Math.max(0, 1 - currentY / 400) : 1;
  
  return (
    <>
      {/* Overlay */}
      <div
        className={`bottom-sheet-overlay ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        onClick={disableOverlayClose ? undefined : handleClose}
      />
      
      {/* Sheet */}
      <div
        ref={sheetRef}
        style={{ transform, opacity }}
        className={cn(
          'bottom-sheet overflow-hidden',
          heightClass,
          isClosing ? 'translate-y-full' : 'translate-y-0',
          className
        )}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle */}
        {showHandle && (
          <div className="flex justify-center p-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
          </div>
        )}
        
        {/* Close button */}
        {showCloseButton && (
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 text-muted-foreground"
            onClick={handleClose}
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Content */}
        <div className="overflow-y-auto h-full pb-safe">
          {children}
        </div>
      </div>
    </>
  );
};
