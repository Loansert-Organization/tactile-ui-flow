
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';

export const SkeletonCard = () => {
  return (
    <GlassCard className="p-6 space-y-4 animate-pulse">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-700/50" />
          <div>
            <div className="h-5 bg-gray-700/50 rounded w-32 mb-2" />
            <div className="h-4 bg-gray-700/30 rounded w-24" />
          </div>
        </div>
      </div>

      {/* My Contribution */}
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-700/30 rounded w-24" />
        <div className="h-4 bg-gray-700/50 rounded w-16" />
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-700/30 rounded w-16" />
          <div className="h-4 bg-gray-700/50 rounded w-12" />
        </div>
        
        <div className="h-2 bg-gray-700/30 rounded-full">
          <div className="h-2 bg-gray-600/50 rounded-full w-1/3" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-3 bg-gray-700/30 rounded w-20" />
          <div className="h-3 bg-gray-700/30 rounded w-20" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <div className="flex-1 h-11 bg-gray-700/50 rounded-lg" />
        <div className="flex-1 h-11 bg-gray-700/30 rounded-lg" />
      </div>
    </GlassCard>
  );
};
