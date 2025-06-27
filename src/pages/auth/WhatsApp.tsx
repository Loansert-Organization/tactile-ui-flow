
import React, { useEffect, useState } from 'react';
import { ArrowLeft, MessageCircle, ExternalLink, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SERVICE_NUMBER = '+250780000000'; // Mock service number

export const WhatsApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, phone, expiresIn } = location.state || {};
  
  const [showFallback, setShowFallback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(expiresIn || 300);

  useEffect(() => {
    if (!sessionId) {
      navigate('/auth/phone');
      return;
    }

    // Countdown timer for session expiry
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
    
    // Auto-redirect to OTP page after a delay
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/phone')}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">WhatsApp Verification</h1>
        </div>

        {/* WhatsApp Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Open WhatsApp</CardTitle>
            <p className="text-muted-foreground mt-2">
              Tap the button below to send a verification message
            </p>
            <p className="text-sm font-medium text-green-600">
              {phone}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Instructions */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Instructions:</h3>
              <ol className="text-sm text-green-700 space-y-1">
                <li>1. Tap "Open WhatsApp" below</li>
                <li>2. Send the pre-filled message</li>
                <li>3. Return here to enter your code</li>
              </ol>
            </div>

            {/* Timer */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Session expires in:</p>
              <p className="text-2xl font-bold text-green-600">{formatTime(timeLeft)}</p>
            </div>

            {/* WhatsApp Button */}
            <Button
              onClick={handleOpenWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
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
              
              <button
                onClick={() => setShowFallback(true)}
                className="block w-full text-sm text-muted-foreground hover:underline"
              >
                Can't open WhatsApp?
              </button>
            </div>

            {/* Fallback Alert */}
            {showFallback && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No WhatsApp? We'll send an SMS instead. 
                  <Button 
                    variant="link" 
                    className="p-0 h-auto font-normal underline ml-1"
                    onClick={() => navigate('/auth/otp', { state: { sessionId, phone, expiresIn, fallback: true } })}
                  >
                    Continue with SMS
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
