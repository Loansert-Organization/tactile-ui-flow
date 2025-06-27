
import React from 'react';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentData {
  amount: number;
  recipient: string;
  message?: string;
  timestamp: string;
}

export const QRPreviewScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentData = location.state as PaymentData;

  if (!paymentData) {
    navigate('/pay');
    return null;
  }

  const qrValue = JSON.stringify(paymentData);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment QR Code',
          text: `Payment request for ${paymentData.amount} RWF to ${paymentData.recipient}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleDownload = () => {
    const svg = document.querySelector('#qr-code');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.download = `payment-qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
      };
      
      img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
          <h1 className="text-xl font-semibold text-gray-800">Payment QR Code</h1>
        </div>

        {/* QR Code Display */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Scan to Pay</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg">
              <QRCodeSVG
                id="qr-code"
                value={qrValue}
                size={200}
                level="M"
                includeMargin={true}
              />
            </div>

            {/* Payment Details */}
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-semibold">{paymentData.amount.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between">
                <span>Recipient:</span>
                <span className="font-semibold">{paymentData.recipient}</span>
              </div>
              {paymentData.message && (
                <div className="flex justify-between">
                  <span>Message:</span>
                  <span className="font-semibold">{paymentData.message}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button onClick={handleShare} className="flex-1">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
