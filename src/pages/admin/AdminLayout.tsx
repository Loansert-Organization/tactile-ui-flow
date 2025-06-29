import React, { Suspense } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const nav = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Baskets', path: '/admin/baskets' },
    { label: 'Contributions', path: '/admin/contributions' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Wallets', path: '/admin/wallets' },
    { label: 'Countries', path: '/admin/countries' },
    { label: 'Activity Log', path: '/admin/activity' },
  ];
  
  return (
    <div className="min-h-screen flex">
      {/* Enhanced sidebar */}
      <aside className="w-64 bg-background border-r border-border p-6 space-y-2">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">System Management</p>
        </div>
        
        {nav.map(n => (
          <Link 
            key={n.path} 
            to={n.path} 
            className={cn(
              "block px-3 py-2 rounded-lg text-sm transition-colors hover:bg-muted",
              location.pathname === n.path 
                ? "bg-primary/10 text-primary font-medium" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {n.label}
          </Link>
        ))}
      </aside>
      
      <main className="flex-1 p-6 overflow-auto bg-muted/30">
        <Suspense fallback={<GlassCard className="p-6">Loading...</GlassCard>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}; 