
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MessageCircle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketName: string;
  onProceedAsGuest: () => void;
}

export const AuthPromptModal: React.FC<AuthPromptModalProps> = ({
  isOpen,
  onClose,
  basketName,
  onProceedAsGuest
}) => {
  const navigate = useNavigate();

  const handleWhatsAppAuth = () => {
    navigate('/auth/phone');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Ready to create "{basketName}"?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            Sign in to create your basket and start collecting contributions
          </p>
          
          <div className="space-y-3">
            <GoogleSignInButton 
              variant="default" 
              size="lg" 
              className="w-full"
            />
            
            <Button
              onClick={handleWhatsAppAuth}
              variant="outline"
              size="lg"
              className="w-full"
            >
              <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
              Continue with WhatsApp
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                or
              </span>
            </div>
          </div>
          
          <Button
            onClick={onProceedAsGuest}
            variant="ghost"
            size="lg"
            className="w-full"
          >
            <User className="w-5 h-5 mr-2" />
            Continue as Guest
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
