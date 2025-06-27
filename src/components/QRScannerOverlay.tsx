
import React, { useEffect } from 'react';
import { X, Flame } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { useQRCamera } from '@/hooks/useQRCamera';
import { QRErrorState } from './qr-scanner/QRErrorState';
import { QRLoadingState } from './qr-scanner/QRLoadingState';
import { ScanningOverlay } from './qr-scanner/ScanningOverlay';

interface QRScannerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onQRCodeScanned: (url: string) => void;
}

export const QRScannerOverlay = ({
  isOpen,
  onClose,
  onQRCodeScanned
}: QRScannerOverlayProps) => {
  const {
    videoRef,
    canvasRef,
    hasPermission,
    isScanning,
    error,
    startCamera,
    stopCamera
  } = useQRCamera(isOpen, onQRCodeScanned);

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black animate-fade-in"
      role="dialog"
      aria-labelledby="scanner-title"
      aria-describedby="scanner-description"
    >
      {/* Enhanced Header with better mobile spacing */}
      <div className="absolute top-0 left-0 right-0 z-10 p-3 sm:p-4 md:p-6 bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex-1 min-w-0">
            <h2 id="scanner-title" className="text-white font-bold text-lg sm:text-xl md:text-2xl flex items-center gap-2 truncate">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500 animate-pulse flex-shrink-0" />
              <span className="truncate">Scan QR Code</span>
            </h2>
            <p id="scanner-description" className="text-gray-300 text-xs sm:text-sm md:text-base mt-1">
              Align QR code within the flame-bordered scanning area
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="ml-3 p-2.5 sm:p-3 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation"
            aria-label="Close QR scanner"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>
      </div>

      {/* Enhanced Scanner Content Area */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {hasPermission === false || error ? (
          <div className="px-4 sm:px-6 max-w-md w-full">
            <QRErrorState error={error} onRetry={startCamera} />
          </div>
        ) : hasPermission === null ? (
          <div className="px-4 sm:px-6">
            <QRLoadingState />
          </div>
        ) : (
          <>
            {/* Enhanced Video Feed with better aspect ratio handling */}
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              playsInline
              muted
              style={{ 
                filter: 'brightness(0.9) contrast(1.1)',
                transform: 'scaleX(-1)' // Mirror for better UX
              }}
            />
            
            {/* Enhanced Scanning Overlay */}
            <ScanningOverlay isScanning={isScanning} />
          </>
        )}
      </div>

      {/* Enhanced Bottom Actions with better mobile layout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
        <div className="flex flex-col items-center gap-3 max-w-screen-xl mx-auto">
          {/* Status indicator */}
          <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
            <div className={`w-2 h-2 rounded-full ${isScanning ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
            <span>{isScanning ? 'Scanning active' : 'Camera ready'}</span>
          </div>
          
          {/* Cancel button with better touch target */}
          <GradientButton 
            variant="secondary" 
            onClick={handleClose}
            className="w-full max-w-xs sm:w-auto sm:min-w-32 min-h-[48px] text-base font-medium touch-manipulation"
          >
            Cancel
          </GradientButton>
        </div>
      </div>

      {/* Hidden canvas for QR processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
