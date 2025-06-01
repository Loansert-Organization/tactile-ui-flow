
import React, { useRef, useEffect, useState } from 'react';
import { X, Download, Share2, Copy, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const generateColorfulQRCode = async (text: string, canvas: HTMLCanvasElement, size: number = 300) => {
    try {
      // First generate the basic QR code
      await QRCode.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#1a1a2e', // Dark navy for contrast
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H' // High error correction for better scanning
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Create a vibrant gradient background
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.15)'); // Purple
      gradient.addColorStop(0.25, 'rgba(59, 130, 246, 0.15)'); // Blue
      gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)'); // Emerald
      gradient.addColorStop(0.75, 'rgba(245, 101, 101, 0.15)'); // Pink
      gradient.addColorStop(1, 'rgba(251, 146, 60, 0.15)'); // Orange

      // Apply gradient overlay with blend mode
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);

      // Add a subtle glow effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.shadowColor = 'rgba(147, 51, 234, 0.3)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Reset shadow for clean finish
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "QR Code Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateColorfulQRCode(basketURL, canvasRef.current);
      
      // Focus trap for accessibility
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  }, [isOpen, basketURL]);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const downloadQRCode = async () => {
    try {
      if (!canvasRef.current) return;
      
      // Create high-res version for download
      const highResCanvas = document.createElement('canvas');
      await generateColorfulQRCode(basketURL, highResCanvas, 1024);
      
      const link = document.createElement('a');
      const filename = `${basketName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}-qr-code.png`;
      link.download = filename;
      link.href = highResCanvas.toDataURL('image/png', 1.0);
      link.click();
      
      toast({
        title: "QR Code Downloaded",
        description: "High-resolution QR code saved to your device"
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

  const shareQRCode = async () => {
    try {
      if (navigator.share && navigator.canShare) {
        // Create blob for sharing
        if (canvasRef.current) {
          canvasRef.current.toBlob(async (blob) => {
            if (blob) {
              const file = new File([blob], `${basketName}-qr-code.png`, { type: 'image/png' });
              
              await navigator.share({
                title: `Join ${basketName}`,
                text: `Join the basket "${basketName}" by scanning this QR code or using the link below`,
                url: basketURL,
                files: [file]
              });
            }
          }, 'image/png');
        }
      } else {
        // Fallback to copying URL
        await navigator.clipboard.writeText(basketURL);
        toast({
          title: "Link Copied",
          description: "Basket link copied to clipboard for sharing"
        });
      }
    } catch (error) {
      console.error('Error sharing QR code:', error);
      // Fallback to copy
      try {
        await navigator.clipboard.writeText(basketURL);
        toast({
          title: "Link Copied",
          description: "Basket link copied to clipboard"
        });
      } catch (copyError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy link",
          variant: "destructive"
        });
      }
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(basketURL);
      setCopied(true);
      toast({
        title: "Link Copied",
        description: "Basket URL copied to clipboard"
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link",
        variant: "destructive"
      });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-labelledby="qr-modal-title"
      aria-describedby="qr-modal-description"
    >
      <GlassCard 
        ref={modalRef}
        className="w-full max-w-md p-6 space-y-6 relative border-2 border-transparent bg-gradient-to-br from-white/20 to-white/5 animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          borderImage: 'linear-gradient(135deg, rgba(147,51,234,0.3), rgba(59,130,246,0.3), rgba(16,185,129,0.3)) 1'
        }}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 id="qr-modal-title" className="font-bold gradient-text text-xl">
            Share Basket
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-110"
            aria-label="Close QR code modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center space-y-4">
          <div className="p-6 bg-white rounded-2xl shadow-2xl relative overflow-hidden">
            {/* Animated gradient border */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500 rounded-2xl opacity-20 animate-pulse" />
            <div className="relative">
              <canvas 
                ref={canvasRef} 
                className="w-72 h-72 rounded-xl max-w-full h-auto" 
                style={{
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 4px 8px rgba(147, 51, 234, 0.2))'
                }}
                aria-label={`QR code for joining ${basketName}`}
              />
            </div>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold gradient-text-blue text-lg mb-2">{basketName}</h3>
            <p id="qr-modal-description" className="text-sm text-gray-400">
              Scan to join or use the link below
            </p>
          </div>
        </div>

        {/* URL Display */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-3 bg-white/10 rounded-lg border border-white/20">
            <span className="text-xs text-gray-300 flex-1 break-all font-mono">
              {basketURL}
            </span>
            <button 
              onClick={copyLink}
              className="p-2 rounded-lg hover:bg-white/20 transition-all duration-200 transform hover:scale-110 min-w-[40px] min-h-[40px]"
              aria-label="Copy basket URL"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <GradientButton 
            variant="secondary" 
            className="flex-1 min-h-[44px]" 
            onClick={downloadQRCode}
            aria-label="Download QR code as image"
          >
            <Download className="w-4 h-4 mr-2" />
            Save
          </GradientButton>
          <GradientButton 
            variant="primary" 
            className="flex-1 min-h-[44px]" 
            onClick={shareQRCode}
            aria-label="Share QR code"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};
