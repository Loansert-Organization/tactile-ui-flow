
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Continue with Basket
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <p className="text-center text-muted-foreground">
            Ready to start contributing to "{basketName}"?
          </p>
          
          <Button
            onClick={onProceedAsGuest}
            variant="default"
            size="lg"
            className="w-full"
          >
            <User className="w-5 h-5 mr-2" />
            Continue Anonymously
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Your contributions will be tracked anonymously
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
