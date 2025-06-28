
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Skip Navigation Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-medium"
      >
        Skip to main content
      </a>
      
      <motion.header 
        className="sticky top-0 z-40 w-full pt-safe bg-background/80 backdrop-blur-md border-b border-border/50"
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
              className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent touch-target focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background rounded-lg"
              aria-label="Go to IKANISA home page"
            >
              IKANISA
            </motion.button>
            
            <nav role="navigation" aria-label="Main navigation">
              <ThemeToggle />
            </nav>
          </div>
        </div>
        
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-70" />
      </motion.header>
    </>
  );
};
