
import React, { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { GlassCard } from '@/components/ui/glass-card';

interface LazyPageProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const DefaultFallback = () => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <GlassCard className="p-8 text-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-400">Loading...</p>
    </GlassCard>
  </div>
);

export const LazyPage = ({ children, fallback }: LazyPageProps) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {children}
    </Suspense>
  );
};
