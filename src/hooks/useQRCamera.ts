
import { useRef, useEffect, useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import jsQR from 'jsqr';

type QRCallback = (url: string) => void;

export const useQRCamera = (isOpen: boolean, onQRCodeScanned: QRCallback) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Torch support
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isTorchAvailable, setIsTorchAvailable] = useState(false);
  const animationFrameRef = useRef<number>();

  // Advanced: torch control (if device supports)
  const setTorchOn = useCallback(async (wantTorch: boolean) => {
    const stream = videoRef.current?.srcObject as MediaStream | null;
    if (stream) {
      for (const track of stream.getVideoTracks()) {
        const capabilities = track.getCapabilities?.() || {};
        // Patch: safely access .torch, cast to any to bypass TS error
        if ((capabilities as any).torch !== undefined) {
          try {
            // @ts-ignore
            await track.applyConstraints({ advanced: [{ torch: wantTorch }] });
            setIsTorchOn(wantTorch);
          } catch (e) { setIsTorchOn(false); }
        }
      }
    }
  }, []);

  // Recognize torch support when camera available (on start)
  const checkTorchSupport = (stream: MediaStream) => {
    const track = stream.getVideoTracks()[0];
    // Patch: safely access .torch, cast to any to bypass TS error
    const supported = !!(track && track.getCapabilities && (track.getCapabilities() as any).torch);
    setIsTorchAvailable(supported);
    setIsTorchOn(false);
  };

  const startCamera = async () => {
    try {
      setError(null);
      setIsTorchOn(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      checkTorchSupport(stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setHasPermission(true);
        setIsScanning(true);
        setTimeout(scanQRCode, 500);
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
    setIsTorchOn(false);
    setIsScanning(false);
  };

  // Main scanning loop
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
      const basketUrlPattern = /\/basket\/[\w-]+$/;
      if (basketUrlPattern.test(code.data) || code.data.includes('basket')) {
        setIsScanning(false);
        if ('vibrate' in window.navigator) window.navigator.vibrate?.(100); // Smart success vibration
        onQRCodeScanned(code.data);
        toast({
          title: "QR Code Detected",
          description: "Redirecting to basket...",
        });
        return;
      }
    }
    // 500 ms delay for next scan
    setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }, 500);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => { stopCamera(); };
    // eslint-disable-next-line
  }, [isOpen]);

  return {
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
  };
};
