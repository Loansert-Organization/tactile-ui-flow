import React from 'react';
import { Home, QrCode, Plus, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';
import { motion } from 'framer-motion';
const navItems = [{
  icon: Home,
  label: 'Home',
  path: '/'
}, {
  icon: Plus,
  label: 'Create',
  path: '/baskets/mine'
},
// Navigate to My Baskets instead
{
  icon: QrCode,
  label: 'My Baskets',
  path: '/baskets/mine'
}, {
  icon: User,
  label: 'Profile',
  path: '/profile'
}];
export const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    handlePress
  } = usePressFeedback();
  return <motion.nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe" initial={{
    y: 100,
    opacity: 0
  }} animate={{
    y: 0,
    opacity: 1
  }} transition={{
    duration: 0.3,
    delay: 0.2
  }}>
      <div className="mx-4 mb-4">
        <div className="bg-card/80 backdrop-blur-lg border border-border shadow-xl rounded-2xl">
          
        </div>
      </div>
    </motion.nav>;
};