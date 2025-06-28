
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const SplashScreen = () => {
  const navigate = useNavigate();
  const { isLoading } = useAuth();
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Set timeout fallback
    const timeout = setTimeout(() => {
      setAnimationComplete(true);
    }, 2000);

    // Clean up timeout
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (animationComplete || !isLoading) {
      const onboarded = localStorage.getItem("ikanisaOnboarded") === "true";
      const route = onboarded ? "/" : "/welcome";
      
      setTimeout(() => {
        navigate(route);
      }, 500);
    }
  }, [animationComplete, isLoading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex flex-col items-center justify-center text-white">
      {/* Logo Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          type: "spring",
          stiffness: 100
        }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
          <span className="text-3xl font-bold text-blue-600">I</span>
        </div>
      </motion.div>

      {/* App Name */}
      <motion.h1
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl font-bold mb-2"
      >
        IKANISA
      </motion.h1>

      {/* Tagline */}
      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="text-lg opacity-90 mb-16"
      >
        Community • Faith • Growth
      </motion.p>

      {/* Loading Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex space-x-2"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 bg-white rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default SplashScreen;
