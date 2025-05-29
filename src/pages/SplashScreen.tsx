
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-magenta-orange flex items-center justify-center">
          <span className="text-4xl font-bold text-white">B</span>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-4">Community Baskets</h1>
        <div className="w-12 h-1 bg-gradient-teal-blue rounded-full mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};
