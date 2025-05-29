
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        {/* Animated Logo */}
        <div className="relative">
          <h1 className="text-6xl font-bold gradient-text animate-pulse mb-4">
            IKANISA
          </h1>
          <div className="absolute inset-0 bg-gradient-magenta-orange rounded-full opacity-20 animate-ping" />
        </div>
        
        {/* Animated tagline */}
        <p className="text-xl text-gray-300 animate-fade-in">
          Community Savings Made Simple
        </p>
        
        {/* Loading skeleton */}
        <div className="space-y-3 mt-12">
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Splash;
