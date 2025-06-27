
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full pt-safe"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            onClick={() => navigate('/')}
            className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
            aria-label="Go to home"
          >
            IKANISA
          </motion.button>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
    </motion.header>
  );
};
