import React, { useEffect, useRef, useState } from 'react';
import { X, Flashlight } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { useQRCamera } from '@/hooks/useQRCamera';
import { QRErrorState } from './qr-scanner/QRErrorState';
import { SmartScannerFrame } from './qr-scanner/SmartScannerFrame';
import { ScanSuccessCheck } from './qr-scanner/ScanSuccessCheck';

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
    setError,
    startCamera,
    stopCamera,
    setTorchOn,
    isTorchAvailable,
    isTorchOn
  } = useQRCamera(isOpen, onQRCodeScanned);

  // Scan area sizing (these must be synced to SmartScannerFrame logic)
  const SCAN_AREA_SIZE_PX = 330; // Should roughly match SmartScannerFrame's center
  const SCAN_AREA_RADIUS = 12;

  // Scan UI states
  const [scanState, setScanState] = useState<'scanning'|'success'|'failed'>('scanning');
  const scanTimeout = useRef<NodeJS.Timeout>();

  // Start timeout watcher on open/reset
  useEffect(() => {
    if (isOpen && hasPermission && isScanning) {
      setScanState('scanning');
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
      scanTimeout.current = setTimeout(() => {
        setScanState('failed');
        setError("Unable to detect QR. Try moving closer or using torchlight.");
      }, 15000);
    }
    return () => { if (scanTimeout.current) clearTimeout(scanTimeout.current); };
  }, [isOpen, isScanning, hasPermission, setError]);
  
  // Animate on scan success
  const handleScanSuccess = (url: string) => {
    setScanState('success');
    onQRCodeScanned(url);
    setTimeout(() => setScanState('scanning'), 2000);
  };

  // Focus & close logic
  useEffect(() => {
    const listener = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, [isOpen, onClose]);

  // Listen to QR code scanning event from camera/hook and trigger state
  useEffect(() => {
    if (!isOpen) setScanState('scanning');
    // Success trigger is already handled through onQRCodeScanned
  }, [isOpen]);

  // Torch toggle UI
  const handleTorchToggle = () => setTorchOn && setTorchOn(!isTorchOn);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#121212] text-white animate-fade-in"
      role="dialog"
      aria-labelledby="scanner-title"
      aria-describedby="scanner-desc"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-4 z-20">
        <div>
          <h2 id="scanner-title" className="font-bold text-lg sm:text-xl tracking-tight text-white">
            QR Code Scanner
          </h2>
          <div id="scanner-desc" className="text-xs sm:text-sm mt-1 opacity-70">
            <span>Align the QR inside the frame</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Torch toggle */}
          {isTorchAvailable && (
            <button
              aria-label="Toggle torch"
              className={`p-2 rounded-full transition duration-150 focus:outline-none hover:scale-110 ${isTorchOn ? "bg-green-400/20" : "bg-white/10"}`}
              style={{ minWidth: 48, minHeight: 48 }}
              onClick={handleTorchToggle}
              type="button"
            >
              <Flashlight className={`w-6 h-6 ${isTorchOn ? "text-green-400" : "text-white"}`} />
            </button>
          )}
          <button
            aria-label="Close QR scanner"
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition min-w-[48px] min-h-[48px]"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Camera view */}
      <div className="w-full h-full flex items-center justify-center overflow-hidden relative">
        {hasPermission === false || error || scanState === 'failed' ? (
          <QRErrorState 
            error={error}
            onRetry={() => { setError(null); startCamera(); setScanState('scanning'); }}
            retryText="Retry Scan"
            darkMode
          />
        ) : (
          <>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover z-0"
              playsInline
              muted
              autoFocus
              style={{
                filter: 'brightness(1) contrast(1.1)',
                objectFit: 'cover',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
            {/* Overlay mask: transparent cutout for scan area */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              aria-hidden="true"
              style={{
                // This uses two linear-gradient masks to make a central cutout (scan area) transparent
                // and keeps the rest dimmed
                WebkitMaskImage: `
                  radial-gradient(circle at 50% 50%, 
                    transparent ${SCAN_AREA_SIZE_PX/2 - 6}px, /* match inner of frame */
                    rgba(0,0,0,0.65) ${SCAN_AREA_SIZE_PX/2 + 22}px
                  )
                `,
                maskImage: `
                  radial-gradient(circle at 50% 50%, 
                    transparent ${SCAN_AREA_SIZE_PX/2 - 6}px,
                    rgba(0,0,0,0.65) ${SCAN_AREA_SIZE_PX/2 + 22}px
                  )
                `,
                background: 'rgba(20,20,28,0.66)'
              }}
            />
            {/* Minimal scanning frame / overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
              <SmartScannerFrame
                borderColor="#396afc"
                borderThickness={3}
                scannerState={scanState}
              />
            </div>
            {/* Scan tips */}
            <div className="absolute left-1/2 bottom-[18vh] z-30"
                 style={{ transform: 'translateX(-50%)' }}
            >
              <div className="text-sm font-medium text-white/90 bg-black/40 rounded-lg px-3 py-2 shadow-lg animate-pulse-glow"
                   style={{ marginTop: 16, boxShadow: '0 0 8px #396afc90' }}>
                Align the QR inside the frame
              </div>
            </div>
            {/* Animated success check */}
            {scanState === 'success' && (
              <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
                <ScanSuccessCheck />
              </div>
            )}
          </>
        )}

        {/* Hidden canvas for scanning */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom actions */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-7 z-10">
        <GradientButton 
          onClick={onClose}
          variant="secondary"
          className="w-full max-w-xs text-base font-medium min-h-[48px] rounded-2xl"
        >
          Cancel
        </GradientButton>
      </div>
    </div>
  );
};
