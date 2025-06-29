
import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './button';
import { toast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title?: string;
  text?: string;
  url?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title = "Check this out!",
  text = "Sharing something awesome",
  url = window.location.href,
  className = ""
}) => {
  const handleShare = async () => {
    // Check if device supports native sharing (mobile)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    try {
      if (navigator.share && isMobileDevice) {
        await navigator.share({
          title,
          text,
          url
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Link has been copied to clipboard"
        });
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
      // Fallback to clipboard if native sharing fails
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link Copied",
          description: "Link has been copied to clipboard"
        });
      } catch (clipboardError) {
        toast({
          title: "Share Failed",
          description: "Unable to share or copy link",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button onClick={handleShare} variant="outline" size="sm" className={className}>
      <Share2 className="w-4 h-4 mr-2" />
      Share
    </Button>
  );
};
