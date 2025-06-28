
import React from 'react';
import { Moon, Sun, QrCode, Heart, User } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useNavigate } from 'react-router-dom';

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
      <button 
        onClick={onQRScanClick} 
        className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm touch-target" 
        aria-label="Open QR Scanner"
      >
        <QrCode className="h-5 w-5 text-purple-400" />
      </button>

      {/* My Baskets Button */}
      <button 
        onClick={handleMyBasketsClick} 
        className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm touch-target" 
        aria-label="My Baskets"
      >
        <Heart className="h-5 w-5 text-red-400" />
      </button>

      {/* Profile Button */}
      <button 
        onClick={handleProfileClick} 
        className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm touch-target" 
        aria-label="Profile"
      >
        <User className="h-5 w-5 text-blue-400" />
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="p-3 rounded-full bg-card hover:bg-muted/50 transition-colors duration-200 shadow-sm touch-target"
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-blue-400" />
        )}
      </button>
    </div>
  );
}
