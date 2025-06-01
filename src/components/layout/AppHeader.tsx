
import React, { useState } from 'react';
import { Plus, Heart, QrCode } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { usePressFeedback } from '@/hooks/useInteractions';
import { useNavigate } from 'react-router-dom';
import { QRScannerOverlay } from '@/components/QRScannerOverlay';
import { toast } from '@/hooks/use-toast';

export const AppHeader = () => {
  const { handlePress } = usePressFeedback();
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
      <header className="sticky top-0 z-50 w-full">
        <GlassCard className="m-2 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={(e) => {
                handlePress(e);
                navigate('/');
              }}
              className="text-xl font-bold gradient-text hover:opacity-80 transition-opacity focus-gradient rounded-lg px-2 py-1"
              aria-label="Go to home"
            >
              IKANISA
            </button>
            
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  handlePress(e);
                  setShowScanner(true);
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient transform hover:scale-110"
                aria-label="Scan QR Code"
              >
                <QrCode className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  handlePress(e);
                  navigate('/baskets/mine');
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
                aria-label="My Baskets"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              <button
                onClick={(e) => {
                  handlePress(e);
                  navigate('/create/step/1');
                }}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
                aria-label="Create Basket"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </GlassCard>
      </header>

      <QRScannerOverlay
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onQRCodeScanned={handleQRCodeScanned}
      />
    </>
  );
};
