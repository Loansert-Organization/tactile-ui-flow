
import React from 'react';
import { Moon, Sun, QrCode, Heart, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface ThemeToggleProps {
  className?: string;
  onQRScanClick?: () => void;
}

export function ThemeToggle({
  className,
  onQRScanClick
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleMyBasketsClick = () => {
    navigate('/baskets/mine');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* QR Code Scanner Button */}
      <EnhancedButton 
        onClick={onQRScanClick}
        variant="glass"
        size="icon"
        className="shadow-glass-sm"
        aria-label="Open QR Scanner"
      >
        <QrCode className="h-5 w-5 text-purple-400" />
      </EnhancedButton>

      {/* My Baskets Button */}
      <EnhancedButton 
        onClick={handleMyBasketsClick}
        variant="glass"
        size="icon"
        className="shadow-glass-sm"
        aria-label="My Baskets"
      >
        <Heart className="h-5 w-5 text-red-400" />
      </EnhancedButton>

      {/* Profile Button */}
      <EnhancedButton 
        onClick={handleProfileClick}
        variant="glass"
        size="icon"
        className="shadow-glass-sm"
        aria-label="Profile"
      >
        <User className="h-5 w-5 text-blue-400" />
      </EnhancedButton>

      {/* Theme Toggle Button */}
      <EnhancedButton 
        onClick={toggleTheme}
        variant="glass"
        size="icon"
        className="shadow-glass-sm"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-accent" />
        ) : (
          <Moon className="h-5 w-5 text-accent" />
        )}
      </EnhancedButton>
    </div>
  );
}
