
import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

export const PWAInstall = () => {
  const [showInstall, setShowInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed (running in standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                              (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setShowInstall(true);
    };

    // Listen for successful installation
    const handleAppInstalled = () => {
      setShowInstall(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if ((window as any).installPWA) {
      (window as any).installPWA();
    }
  };

  // Don't show install button if already installed or not supported
  if (isStandalone || !showInstall) {
    return null;
  }

  return (
    <GradientButton
      variant="secondary"
      size="sm"
      onClick={handleInstallClick}
      className="flex items-center gap-2"
      aria-label="Install IKANISA App"
    >
      <Download className="w-4 h-4" />
      <span className="hidden sm:inline">Install App</span>
    </GradientButton>
  );
};
