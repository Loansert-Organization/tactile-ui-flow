
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Shield, X } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleWhatsAppLogin = () => {
    navigate('/auth/whatsapp', { 
      state: { 
        returnTo: '/baskets/new',
        basketData: { name: basketName }
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Secure Your Basket
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 mb-2">
              Ready to create "{basketName}"?
            </div>
            <p className="text-sm text-gray-600 mb-4">
              To create your basket and receive contributions, you'll need to verify your identity.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleWhatsAppLogin}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Continue with WhatsApp
            </Button>
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-2">
                Just testing? You can create a demo basket without login
              </div>
              <Button
                variant="outline"
                onClick={onProceedAsGuest}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Create Demo Basket
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500 text-center">
            We use WhatsApp to verify your identity and send you important updates about your basket.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
