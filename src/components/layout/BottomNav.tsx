
import React from 'react';
import { Home, QrCode, Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';
import { motion } from 'framer-motion';

const navItems = [
  {
    icon: Home,
    label: 'Home',
    path: '/'
  },
  {
    icon: Plus,
    label: 'Create',
    path: '/baskets/new'
  },
  {
    icon: QrCode,
    label: 'My Baskets',
    path: '/baskets/mine'
  },
  {
    icon: User,
    label: 'Profile',
    path: '/profile'
  }
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
          <div className="flex items-center justify-around py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={(e) => {
                    handlePress(e);
                    navigate(item.path);
                  }}
                  className={cn(
                    "flex flex-col items-center gap-1 p-3 rounded-xl transition-all duration-200",
                    "min-w-[60px] min-h-[60px]",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  aria-label={item.label}
                >
                  <Icon className={cn("w-5 h-5", isActive && "scale-110")} />
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
