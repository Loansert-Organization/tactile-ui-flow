
import React from 'react';
import { Home, MessageCircle, Plus, User, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

const navItems = [
  { icon: Home, label: 'Feed', path: '/' },
  { icon: Heart, label: 'My Baskets', path: '/baskets/mine' },
  { icon: Plus, label: 'Create', path: '/create/step/1' },
  { icon: MessageCircle, label: 'Chat', path: '/chat' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl px-2 py-3 shadow-2xl">
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
                className={cn(
                  "relative flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 focus-gradient min-w-[60px]",
                  isActive 
                    ? "bg-gradient-magenta-orange shadow-lg scale-110" 
                    : "hover:bg-white/10"
                )}
                aria-label={item.label}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-all duration-300",
                  isActive ? "text-white scale-110" : "text-gray-300"
                )} />
                <span className={cn(
                  "text-xs font-medium transition-all duration-300",
                  isActive ? "text-white" : "text-gray-400"
                )}>
                  {item.label}
                </span>
                
                {/* Active indicator "spill" animation */}
                {isActive && (
                  <div className="absolute -inset-1 bg-gradient-magenta-orange rounded-2xl opacity-20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
