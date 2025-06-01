
import React from 'react';

export const QRLoadingState = () => {
  return (
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white">Requesting camera access...</p>
    </div>
  );
};
