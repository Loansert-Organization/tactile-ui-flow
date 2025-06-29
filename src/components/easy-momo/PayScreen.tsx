import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Flashlight, Upload, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import easyMomoService from '@/services/easyMomoService';

const PayScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsScanning(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera access to scan QR codes.');
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const toggleFlashlight = async () => {
    if (stream) {
      const track = stream.getVideoTracks()[0];
      const capabilities = track.getCapabilities();
      
      if (capabilities.torch) {
        try {
          await track.applyConstraints({
            advanced: [{ torch: !flashlightOn }]
          });
          setFlashlightOn(!flashlightOn);
        } catch (err) {
          console.error('Flashlight error:', err);
          toast({
            title: "Flashlight Error",
            description: "Unable to control flashlight",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Not Supported",
          description: "Flashlight not available on this device",
          variant: "destructive"
        });
      }
    }
  };

  const captureAndProcess = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Mock QR code detection (in production, use a real QR library like jsQR)
    await processQRData('*182*1*1*0781234567*5000#'); // Mock USSD for demo
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      // Mock QR processing from uploaded image
      await processQRData('*182*1*1*0782345678*3000#'); // Mock USSD
    };
    reader.readAsDataURL(file);
  };

  const processQRData = async (qrData: string) => {
    try {
      const result = await easyMomoService.processScannedQR(qrData);
      
      if (result.success) {
        setScanResult(result);
        setShowResultModal(true);
        stopCamera();
        
        toast({
          title: "QR Code Scanned",
          description: "Payment information detected!"
        });
      } else {
        toast({
          title: "Scan Error",
          description: result.error || "Invalid QR code",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process QR code",
        variant: "destructive"
      });
    }
  };

  const dialUSSD = () => {
    if (scanResult?.ussdString) {
      easyMomoService.dialUSSD(scanResult.ussdString);
      setShowResultModal(false);
    }
  };

  const handleManualUSSD = () => {
    const ussd = prompt('Enter USSD code manually:');
    if (ussd && ussd.includes('*') && ussd.includes('#')) {
      processQRData(ussd);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between text-white">
          <Button
            onClick={() => {
              stopCamera();
              navigate('/easy-momo');
            }}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">Scan QR Code</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 border-2 border-white rounded-2xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
                <p className="text-white text-center mt-4 bg-black/50 px-4 py-2 rounded-lg">
                  Position QR code within the frame
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-900">
            {error ? (
              <Card className="mx-4 max-w-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Camera Access Required</h3>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <Button onClick={startCamera} className="w-full">
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="mx-4 max-w-sm">
                <CardContent className="p-6 text-center space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Ready to Scan</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Start camera to scan QR codes for payments
                    </p>
                    <Button onClick={startCamera} className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex justify-center space-x-4">
          {isScanning && (
            <>
              <Button
                onClick={toggleFlashlight}
                variant="ghost"
                size="icon"
                className={`text-white hover:bg-white/20 w-12 h-12 rounded-full ${flashlightOn ? 'bg-yellow-500/30' : ''}`}
              >
                <Flashlight className="w-6 h-6" />
              </Button>
              
              <Button
                onClick={captureAndProcess}
                className="bg-blue-500 hover:bg-blue-600 text-white w-16 h-16 rounded-full"
              >
                <Camera className="w-8 h-8" />
              </Button>
            </>
          )}
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 w-12 h-12 rounded-full"
          >
            <Upload className="w-6 h-6" />
          </Button>
          
          <Button
            onClick={handleManualUSSD}
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/20 w-12 h-12 rounded-full"
          >
            <Phone className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Result Modal */}
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Payment Detected</DialogTitle>
          </DialogHeader>
          {scanResult && (
            <div className="flex flex-col items-center space-y-4 p-4">
              <div className="text-center space-y-2">
                <p className="text-lg font-semibold text-green-600">
                  ✓ QR Code Scanned Successfully
                </p>
                {scanResult.transactionId && (
                  <p className="text-sm text-gray-600">
                    Transaction ID: {scanResult.transactionId}
                  </p>
                )}
                {scanResult.ussdString && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">USSD Code:</p>
                    <p className="font-mono text-sm">{scanResult.ussdString}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 w-full">
                <Button
                  onClick={dialUSSD}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Dial Now
                </Button>
                <Button
                  onClick={() => setShowResultModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayScreen;
