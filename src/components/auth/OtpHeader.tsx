
import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface OtpHeaderProps {
  whatsappNumber: string;
}

export const OtpHeader: React.FC<OtpHeaderProps> = ({ whatsappNumber }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header */}
      <div className="flex items-center mb-12 pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/auth/phone')}
          className="p-2 -ml-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter Verification Code
          </h1>
          <p className="text-gray-600 mb-2">
            We sent a 6-digit code to your WhatsApp
          </p>
          <p className="text-sm font-medium text-green-600">
            {whatsappNumber}
          </p>
        </div>
      </div>
    </>
  );
};
