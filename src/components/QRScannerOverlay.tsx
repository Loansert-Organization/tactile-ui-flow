import React, { useRef, useEffect, useState } from 'react';
import { X, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';
import jsQR from 'jsqr';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const animationFrameRef = useRef<number>();

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasPermission(true);
        setIsScanning(true);
        scanQRCode();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      setError('Camera permission denied. Please allow camera access to scan QR codes.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    setIsScanning(false);
  };

  const scanQRCode = () => {
    if (!isScanning || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      // Check if it's a valid basket URL
      const basketUrlPattern = /\/basket\/[\w-]+$/;
      if (basketUrlPattern.test(code.data) || code.data.includes('basket')) {
        setIsScanning(false);
        onQRCodeScanned(code.data);
        toast({
          title: "QR Code Detected",
          description: "Redirecting to basket...",
        });
        return;
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanQRCode);
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

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
            <h2 id="scanner-title" className="text-white font-bold text-lg">
              Scan QR Code
            </h2>
            <p id="scanner-description" className="text-gray-300 text-sm">
              Align QR code within the scanning area
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
          <div className="text-center p-6 max-w-sm mx-auto">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Camera Access Needed</h3>
            <p className="text-gray-300 text-sm mb-6">
              {error || 'Please allow camera access to scan QR codes'}
            </p>
            <GradientButton onClick={startCamera} className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </GradientButton>
          </div>
        ) : hasPermission === null ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Requesting camera access...</p>
          </div>
        ) : (
          <>
            {/* Video Feed */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Darkened background */}
              <div className="absolute inset-0 bg-black/40" />
              
              {/* Scan Window */}
              <div className="relative">
                {/* Transparent window */}
                <div 
                  className="w-64 h-64 border-4 border-transparent relative"
                  style={{
                    background: 'transparent',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {/* Animated corners */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white animate-pulse" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white animate-pulse" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white animate-pulse" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white animate-pulse" />
                  
                  {/* Gradient corners for color */}
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-purple-400" />
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-pink-400" />
                  
                  {/* Scanning line */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
                </div>
                
                <p className="text-white text-center mt-6 text-sm">
                  {isScanning ? 'Scanning for QR codes...' : 'Position QR code in the frame'}
                </p>
              </div>
            </div>
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
