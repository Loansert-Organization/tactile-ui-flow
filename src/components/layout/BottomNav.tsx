
import React from 'react';
import { Home, Heart, Plus } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Plus, label: 'Create', path: '/create/step/1' },
  { icon: Heart, label: 'My Baskets', path: '/baskets/mine' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="mx-4 mb-4">
        <div className="bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (item.path === '/baskets/mine' && location.pathname.startsWith('/basket/'));
              const Icon = item.icon;
              
              return (
                <button
                  key={item.path}
                  onClick={(e) => {
                    handlePress(e);
                    navigate(item.path);
                  }}
                  className="relative flex flex-col items-center p-3 min-h-[60px] min-w-[70px]"
                  aria-label={item.label}
                >
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-xl"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  
                  <Icon className={cn(
                    "h-6 w-6 transition-all duration-200",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  
                  <span className={cn(
                    "text-xs font-medium transition-all duration-200 mt-1",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
