
import React, { useState, useRef, useEffect } from 'react';
import { Camera, ArrowLeft, Flashlight, FlashlightOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import QrScanner from 'qr-scanner';

const PayScreen = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [torchSupported, setTorchSupported] = useState(false);

  useEffect(() => {
    initializeScanner();
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
      }
    };
  }, []);

  const initializeScanner = async () => {
    if (!videoRef.current) return;

    try {
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScanSuccess(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          preferredCamera: 'environment'
        }
      );

      qrScannerRef.current = qrScanner;
      
      // Check torch support
      const hasFlash = await QrScanner.hasCamera() && await qrScanner.hasFlash();
      setTorchSupported(hasFlash);
      
    } catch (error) {
      console.error('Failed to initialize QR scanner:', error);
      toast({
        title: "Camera Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const handleScanSuccess = (data: string) => {
    console.log('QR Code detected:', data);
    toast({
      title: "QR Code Scanned",
      description: `Scanned: ${data}`
    });
    
    // Process the QR code data here
    // Navigate to payment confirmation or process payment
  };

  const startScanning = async () => {
    if (!qrScannerRef.current) return;
    
    try {
      await qrScannerRef.current.start();
      setIsScanning(true);
      toast({
        title: "Scanner Started",
        description: "Point your camera at a QR code"
      });
    } catch (error) {
      console.error('Failed to start scanner:', error);
      toast({
        title: "Scanner Error",
        description: "Failed to start camera scanner",
        variant: "destructive"
      });
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      setIsScanning(false);
      setTorchEnabled(false);
    }
  };

  const toggleTorch = async () => {
    if (!qrScannerRef.current || !torchSupported) return;
    
    try {
      const newTorchState = !torchEnabled;
      await qrScannerRef.current.turnFlashlight(newTorchState);
      setTorchEnabled(newTorchState);
    } catch (error) {
      console.error('Failed to toggle torch:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            onClick={() => navigate('/easy-momo')}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Scan & Pay
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Scan a QR code to make a payment
          </p>
        </div>

        {/* Camera Container */}
        <Card className="glass-card backdrop-blur-md border-0 shadow-2xl mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <video 
                ref={videoRef}
                className="w-full h-64 object-cover rounded-lg bg-gray-900"
                style={{ display: isScanning ? 'block' : 'none' }}
              />
              
              {!isScanning && (
                <div className="w-full h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Camera ready to scan
                    </p>
                  </div>
                </div>
              )}

              {/* Torch Button */}
              {isScanning && torchSupported && (
                <Button
                  onClick={toggleTorch}
                  size="sm"
                  variant="secondary"
                  className="absolute top-4 right-4"
                >
                  {torchEnabled ? (
                    <FlashlightOff className="w-4 h-4" />
                  ) : (
                    <Flashlight className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>

            {/* Scanner Controls */}
            <div className="mt-4 flex justify-center">
              {!isScanning ? (
                <Button 
                  onClick={startScanning}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Start Scanning
                </Button>
              ) : (
                <Button 
                  onClick={stopScanning}
                  variant="destructive"
                >
                  Stop Scanning
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="glass-card backdrop-blur-md border-0 shadow-lg">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              How to Scan
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Point your camera at the QR code</li>
              <li>• Keep the code within the camera frame</li>
              <li>• Hold steady until the code is detected</li>
              <li>• Use the flashlight if needed in dark areas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayScreen;
