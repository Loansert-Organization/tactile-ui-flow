
import React, { useState } from 'react';
import { ArrowLeft, Camera, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QRScannerOverlay } from '@/components/QRScannerOverlay';

export const ScanScreen = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  const handleQRCodeScanned = (data: string) => {
    try {
      const paymentData = JSON.parse(data);
      navigate('/payment-confirm', { state: paymentData });
    } catch (error) {
      console.error('Invalid QR code data:', error);
      // Handle invalid QR code
    }
    setShowScanner(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Handle QR code image upload
      console.log('Processing QR code from image:', file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Scan QR Code</h1>
        </div>

        {/* Scan Options */}
        <div className="space-y-4">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Scan with Camera</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Use your device camera to scan QR codes
                  </p>
                  <Button
                    onClick={() => setShowScanner(true)}
                    className="w-full"
                    size="lg"
                  >
                    Open Camera
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Upload Image</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Select a QR code image from your gallery
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button variant="outline" className="w-full" size="lg">
                      Choose Image
                    </Button>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Overlay */}
      <QRScannerOverlay
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onQRCodeScanned={handleQRCodeScanned}
      />
    </div>
  );
};
