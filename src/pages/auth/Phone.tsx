
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { toast } from '@/hooks/use-toast';
import { requestOtp } from '@/services/auth';

export const Phone = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const sessionData = await requestOtp(`+250${phoneNumber}`);
      
      toast({
        title: "Next Step",
        description: "Redirecting to WhatsApp...",
      });
      
      navigate('/auth/whatsapp', { 
        state: { 
          sessionId: sessionData.sessionId,
          phone: `+250${phoneNumber}`,
          expiresIn: sessionData.expiresIn
        } 
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Phone Number</h1>
        </div>

        {/* Phone Entry Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to IKANISA</CardTitle>
            <p className="text-muted-foreground mt-2">
              Enter your phone number to continue with WhatsApp verification
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              error={error}
            />

            {/* MoMo Hint */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                💡 <strong>Mobile Money users:</strong> This number will be used for MoMo transactions
              </p>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!phoneNumber || phoneNumber.length < 9 || isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Continue with WhatsApp
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
