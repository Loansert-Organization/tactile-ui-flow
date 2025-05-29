
import React, { useState } from 'react';
import { ArrowLeft, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const JoinByCode = () => {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsLoading(true);
    setIsInvalid(false);

    // Simulate API call
    setTimeout(() => {
      if (code.toUpperCase() === 'BASKET') {
        toast({
          title: "Success!",
          description: "You've joined the basket",
        });
        navigate('/basket/1');
      } else {
        setIsInvalid(true);
        setTimeout(() => setIsInvalid(false), 600);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-4">Join by Code</h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <GlassCard className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-teal-blue flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold mb-2">Enter Access Code</h2>
          <p className="text-gray-400 mb-8">
            Enter the 6-digit code for special access or identification
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={6}
                className={`w-full text-center text-3xl font-mono font-bold tracking-widest p-4 rounded-xl bg-white/10 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                  isInvalid ? 'border-red-500 animate-pulse' : 'border-white/20'
                } ${isInvalid ? 'animate-shake' : ''}`}
                placeholder="ABC123"
              />
              {isInvalid && (
                <p className="text-red-400 text-sm mt-2">Invalid code. Please try again.</p>
              )}
            </div>

            <GradientButton
              type="submit"
              variant="primary"
              className="w-full"
              loading={isLoading}
              disabled={code.length !== 6}
            >
              Submit Code
            </GradientButton>
          </form>

          <p className="text-gray-500 text-sm mt-6">
            Note: To join baskets, ask friends to share the basket link directly
          </p>
        </GlassCard>
      </div>
    </div>
  );
};
