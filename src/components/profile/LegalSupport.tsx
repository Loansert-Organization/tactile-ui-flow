
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const LegalSupport: React.FC = () => {
  const navigate = useNavigate();

  const handleHelpSupport = () => {
    const phoneNumber = '+250795467385';
    const message = 'Hello, I need help with IKANISA app.';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/terms')}>
          Terms & Conditions
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={() => navigate('/privacy')}>
          Privacy Policy
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleHelpSupport}>
          Help & Support
        </Button>
      </CardContent>
    </Card>
  );
};
