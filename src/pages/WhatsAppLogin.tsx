
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

export const WhatsAppLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send OTP via WhatsApp
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "OTP Sent!",
        description: "Check your WhatsApp for the verification code",
      });
      navigate('/whatsapp-otp', { state: { phoneNumber } });
    }, 2000);
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
          <h1 className="text-xl font-semibold text-gray-800">WhatsApp Login</h1>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Welcome to IKANISA</CardTitle>
            <p className="text-muted-foreground mt-2">
              We'll send a verification code to your WhatsApp number
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 py-2 border border-input rounded-md bg-muted text-sm">
                  +250
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="780 123 456"
                  className="flex-1 text-lg"
                  maxLength={9}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter your Rwanda phone number (without country code)
              </p>
            </div>

            {/* Send OTP Button */}
            <Button
              onClick={handleSendOTP}
              disabled={!phoneNumber || phoneNumber.length < 9 || isLoading}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </div>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send WhatsApp OTP
                </>
              )}
            </Button>

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
