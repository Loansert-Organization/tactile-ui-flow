
import React, { useState } from 'react';
import { X, Copy, QrCode, Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

interface UserCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCode?: string;
}

export const UserCodeModal = ({ isOpen, onClose, userCode = '4B8N2X' }: UserCodeModalProps) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(userCode);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Your code has been copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold gradient-text mb-2">Your Code</h2>
          <p className="text-gray-400 mb-6">Share this code to invite friends</p>

          {!showQR ? (
            <>
              <div className="relative mb-6">
                <div className="text-6xl font-mono font-bold tracking-wider p-8 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white border-2 border-white/20 shadow-lg">
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

              <div className="grid grid-cols-2 gap-3">
                <GradientButton
                  variant="secondary"
                  onClick={handleCopy}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </GradientButton>
                <GradientButton
                  variant="accent"
                  onClick={() => setShowQR(true)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </GradientButton>
              </div>
            </>
          ) : (
            <>
              <div className="w-48 h-48 mx-auto mb-6 bg-white rounded-xl flex items-center justify-center">
                <div className="text-gray-800 text-sm font-mono">QR Code for {userCode}</div>
              </div>

              <GradientButton
                variant="secondary"
                onClick={() => setShowQR(false)}
              >
                Back to Code
              </GradientButton>
            </>
          )}
        </div>
      </GlassCard>
    </div>
  );
};
