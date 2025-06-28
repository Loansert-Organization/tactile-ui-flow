import React from 'react';
import { Moon, Sun, QrCode } from 'lucide-react';
import { useTheme } from './ThemeProvider';
interface ThemeToggleProps {
  className?: string;
  onQRScanClick?: () => void;
}
export function ThemeToggle({
  className,
  onQRScanClick
}: ThemeToggleProps) {
  const {
    theme,
    setTheme
  } = useTheme();
  return <div className={`flex items-center gap-2 ${className}`}>
      {/* QR Code Scanner Button */}
      <button onClick={onQRScanClick} className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm" aria-label="Open QR Scanner">
        <QrCode className="h-5 w-5 text-purple-400" />
        <span className="sr-only">Scan QR Code</span>
      </button>

      {/* Theme Toggle Button */}
      
    </div>;
}