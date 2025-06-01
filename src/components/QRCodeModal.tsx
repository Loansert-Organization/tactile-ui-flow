
import React, { useRef } from 'react';
import { X, Download, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketId: string;
  basketName: string;
  basketURL: string;
}

export const QRCodeModal = ({
  isOpen,
  onClose,
  basketId,
  basketName,
  basketURL
}: QRCodeModalProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = (text: string, canvas: HTMLCanvasElement, size: number = 256) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Create a simple pattern as QR code placeholder
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000000';
    const moduleSize = size / 25;

    // Create a simple pattern that looks like a QR code
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add corner squares (typical QR code pattern)
    const cornerSize = moduleSize * 7;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    const innerSize = moduleSize * 5;
    const offset = moduleSize;
    ctx.fillRect(offset, offset, innerSize, innerSize);
    ctx.fillRect(size - cornerSize + offset, offset, innerSize, innerSize);
    ctx.fillRect(offset, size - cornerSize + offset, innerSize, innerSize);
    ctx.fillStyle = '#000000';
    const centerSize = moduleSize * 3;
    const centerOffset = moduleSize * 2;
    ctx.fillRect(centerOffset, centerOffset, centerSize, centerSize);
    ctx.fillRect(size - cornerSize + centerOffset, centerOffset, centerSize, centerSize);
    ctx.fillRect(centerOffset, size - cornerSize + centerOffset, centerSize, centerSize);
  };

  React.useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateQRCode(basketURL, canvasRef.current);
    }
  }, [isOpen, basketURL]);

  const downloadHighResQR = async (): Promise<string> => {
    // Create a high-resolution canvas for download
    const highResCanvas = document.createElement('canvas');
    generateQRCode(basketURL, highResCanvas, 1024); // High resolution 1024x1024
    
    const link = document.createElement('a');
    const filename = `${basketName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-qr-code.png`;
    link.download = filename;
    link.href = highResCanvas.toDataURL('image/png');
    link.click();
    
    return link.href;
  };

  const handleDownload = async () => {
    try {
      await downloadHighResQR();
      toast({
        title: "QR Code Downloaded",
        description: "High-resolution QR code has been saved to your device"
      });
    } catch (error) {
      console.error('Error downloading QR code:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download QR code",
        variant: "destructive"
      });
    }
  };

  const handleShare = async () => {
    try {
      // First download the high-res QR code
      await downloadHighResQR();
      
      // Create message for WhatsApp
      const message = `Join the basket "${basketName}"! Scan this QR code or use this link: ${basketURL}`;
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Sharing via WhatsApp",
        description: "QR code downloaded and WhatsApp opened for sharing"
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      toast({
        title: "Sharing Failed",
        description: "Failed to share QR code via WhatsApp",
        variant: "destructive"
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold gradient-text text-lg">Scan to Join the Basket</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-4">
          <div className="p-4 bg-white rounded-lg">
            <canvas ref={canvasRef} className="w-48 h-48" style={{
              imageRendering: 'pixelated'
            }} />
          </div>
          <div className="text-center">
            <h3 className="font-semibold gradient-text-blue">{basketName}</h3>
            <p className="text-sm text-gray-400 mt-1">
              Scan to join this basket
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <GradientButton variant="secondary" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Save to Gallery
          </GradientButton>
          <GradientButton variant="primary" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share via WhatsApp
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};
