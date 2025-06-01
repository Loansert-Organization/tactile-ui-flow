
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="scanner-title" className="text-white font-bold text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
              Scan QR Code
            </h2>
            <p id="scanner-description" className="text-gray-300 text-sm">
              Align QR code within the flame-bordered scanning area
            </p>
          </div>
          <button 
            onClick={handleClose}
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors min-w-[44px] min-h-[44px]"
            aria-label="Close QR scanner"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Scanner Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        {hasPermission === false || error ? (
          <QRErrorState error={error} onRetry={startCamera} />
        ) : hasPermission === null ? (
          <QRLoadingState />
        ) : (
          <>
            {/* Video Feed */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanning Overlay with Flame Effects */}
            <ScanningOverlay isScanning={isScanning} />
          </>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
        <div className="flex justify-center">
          <GradientButton 
            variant="secondary" 
            onClick={handleClose}
            className="min-w-32 min-h-[44px]"
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
