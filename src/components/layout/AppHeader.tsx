
import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { QRScannerOverlay } from '@/components/QRScannerOverlay';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const AppHeader = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  const handleQRCodeScanned = (url: string) => {
    setShowScanner(false);
    
    // Extract basket ID from URL
    const basketIdMatch = url.match(/\/basket\/([^/?]+)/);
    if (basketIdMatch) {
      const basketId = basketIdMatch[1];
      
      // Simulate joining the basket
      toast({
        title: "Basket Found!",
        description: "You've successfully joined this basket",
      });
      
      navigate(`/basket/${basketId}`);
    } else {
      toast({
        title: "Invalid QR Code",
        description: "This QR code doesn't contain a valid basket link",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <motion.header 
        className="sticky top-0 z-50 w-full pt-safe"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => navigate('/')}
              className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
              aria-label="Go to home"
            >
              IKANISA
            </motion.button>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <button
                onClick={() => setShowScanner(true)}
                className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors shadow-sm"
                aria-label="Scan QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
      </motion.header>

      <QRScannerOverlay
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onQRCodeScanned={handleQRCodeScanned}
      />
    </>
  );
};
