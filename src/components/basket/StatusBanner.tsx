
import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface StatusBannerProps {
  status: 'pending' | 'approved' | 'private';
}

export const StatusBanner = ({ status }: StatusBannerProps) => {
  if (status === 'private') return null;

  return (
    <div className={`p-4 mx-4 mt-4 rounded-lg border ${
      status === 'pending' 
        ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300' 
        : 'bg-green-500/10 border-green-500/20 text-green-300'
    }`}>
      <div className="flex items-center gap-2 text-sm font-medium">
        {status === 'pending' ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>🔄 This basket is pending review.</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>✅ This basket is live!</span>
          </>
        )}
      </div>
    </div>
  );
};
