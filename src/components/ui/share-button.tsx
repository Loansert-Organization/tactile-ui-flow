
import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  basketName: string;
  basketURL: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  children?: React.ReactNode;
}

export const ShareButton = ({ 
  basketName, 
  basketURL, 
  className,
  size = 'md',
  variant = 'icon',
  children
}: ShareButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  const handleShare = async () => {
    console.log('Share button clicked');
    console.log('Basket name:', basketName);
    console.log('Basket URL:', basketURL);
    
    const message = `Hey! Join my Basket "${basketName}" and add your support via MOMO: ${basketURL}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp URL:', whatsappUrl);
    
    // Show opening toast
    toast({
      title: "Opening WhatsApp…",
      description: "Redirecting to WhatsApp to share your basket",
    });

    try {
      // Try multiple approaches to open WhatsApp
      console.log('Attempting to open WhatsApp...');
      
      // First try: direct window.open
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!opened || opened.closed || typeof opened.closed == 'undefined') {
        console.log('Window.open failed, trying location.href');
        // Fallback: try location.href
        window.location.href = whatsappUrl;
      } else {
        console.log('WhatsApp opened successfully');
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast({
        title: "Couldn't open WhatsApp",
        description: "Please try again or share the link manually",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleShare();
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  if (variant === 'button') {
    return (
      <button
        onClick={handleShare}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        aria-label="Share via WhatsApp"
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
          isPressed && "scale-95",
          className
        )}
      >
        <MessageCircle className={sizeClasses[size]} />
        {children || "Share on WhatsApp"}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      aria-label="Share via WhatsApp"
      className={cn(
        buttonSizeClasses[size],
        "rounded-lg hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
        isPressed && "scale-95",
        className
      )}
    >
      <MessageCircle className={cn(sizeClasses[size], "text-green-400")} />
    </button>
  );
};
