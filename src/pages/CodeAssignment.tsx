
import React, { useState } from 'react';
import { Copy, QrCode, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const CodeAssignment = () => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const userCode = '4B8N2X'; // Mock user code

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Your code has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold gradient-text mb-2">Welcome!</h1>
          <p className="text-gray-300">Here's your unique identification code</p>
        </div>

        <GlassCard className="p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
              <span className="text-2xl">🏀</span>
            </div>
            <h2 className="text-xl font-semibold mb-2">Your ID Code</h2>
          </div>

          <div className="relative">
            <div className="text-4xl font-mono font-bold tracking-wider p-6 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white mb-6 border-2 border-white/20 shadow-lg">
              {userCode}
            </div>
            
            <button
              onClick={handleCopy}
              className="absolute top-2 right-2 p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-white" />
              )}
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-6">
            This code identifies you within baskets. Use it when joining or for identification purposes.
          </p>

          <div className="flex gap-3">
            <GradientButton
              variant="secondary"
              className="flex-1"
              onClick={handleCopy}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </GradientButton>
            <GradientButton
              variant="accent"
              className="flex-1"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </GradientButton>
          </div>
        </GlassCard>

        <GradientButton
          variant="primary"
          className="w-full"
          onClick={() => navigate('/')}
        >
          Continue to App
        </GradientButton>
      </div>
    </div>
  );
};
