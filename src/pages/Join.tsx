
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from 'sonner';

const Join = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShaking, setIsShaking] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setIsShaking(true);
      toast.error('Please enter a 6-digit code');
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (code === '123456') {
        toast.success('Joined basket successfully!');
        navigate('/basket/1');
      } else {
        setIsShaking(true);
        toast.error('Invalid code. Please try again.');
        setCode('');
        setTimeout(() => setIsShaking(false), 500);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <GlassCard className="max-w-md mx-auto p-6 mt-20">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={(e) => { handlePress(e); handleBack(); }} 
            className="p-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Join Basket</h1>
          <div className="w-9" />
        </div>

        <div className="text-center space-y-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text mb-2">Enter Invitation Code</h2>
            <p className="text-gray-400">
              Enter the 6-digit code you received to join a basket
            </p>
          </div>

          <div className={`transition-transform duration-200 ${isShaking ? 'animate-pulse scale-105' : ''}`}>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              className="justify-center"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }, (_, i) => (
                  <InputOTPSlot 
                    key={i} 
                    index={i} 
                    className="bg-white/10 border-white/20 text-white text-lg font-bold w-12 h-12"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            onClick={(e) => { handlePress(e); handleSubmit(); }}
            className="w-full bg-gradient-magenta-orange text-white py-3"
            disabled={code.length !== 6 || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Joining...
              </div>
            ) : (
              'Submit Code'
            )}
          </Button>

          <p className="text-xs text-gray-500">
            Try entering "123456" to test the functionality
          </p>
        </div>
      </GlassCard>
    </div>
  );
};

export default Join;
