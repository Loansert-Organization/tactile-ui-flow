
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const SERVICE_NUMBER = '+250780000000';

export const WhatsApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { sessionId, phone, expiresIn } = location.state || {};
  
  const [timeLeft, setTimeLeft] = useState(expiresIn || 300);

  useEffect(() => {
    if (!sessionId) {
      navigate('/auth/phone');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/auth/phone');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionId, navigate]);

  const whatsappUrl = `https://api.whatsapp.com/send?phone=${SERVICE_NUMBER.replace('+', '')}&text=LOGIN%20${sessionId}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank');
    
    setTimeout(() => {
      navigate('/auth/otp', { 
        state: { sessionId, phone, expiresIn } 
      });
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-sm mx-auto">
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

        {/* Content */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Open WhatsApp
              </h1>
              <p className="text-gray-600 mb-2">
                Tap the button below to send a verification message
              </p>
              <p className="text-sm font-medium text-green-600">
                {phone}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Session expires in:</p>
              <p className="text-xl font-bold text-green-600">{formatTime(timeLeft)}</p>
            </div>

            {/* WhatsApp Button */}
            <Button
              onClick={handleOpenWhatsApp}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Open WhatsApp
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>

            {/* Alternative Options */}
            <div className="text-center space-y-3">
              <button
                onClick={() => navigate('/auth/otp', { state: { sessionId, phone, expiresIn } })}
                className="text-sm text-green-600 hover:underline"
              >
                I've already sent the message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
