import React, { Suspense } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';

export const AdminLayout: React.FC = () => {
  const nav = [
    { label: 'Dashboard', path: '/admin' },
    { label: 'Baskets', path: '/admin/baskets' },
    { label: 'Contributions', path: '/admin/contributions' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Wallets', path: '/admin/wallets' },
    { label: 'Countries', path: '/admin/countries' },
  ];
  return (
    <div className="min-h-screen flex">
      {/* simple sidebar */}
      <aside className="w-48 bg-background border-r p-4 space-y-2">
        {nav.map(n => (
          <Link key={n.path} to={n.path} className="block py-1 text-sm hover:underline">
            {n.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        <Suspense fallback={<GlassCard className="p-6">Loading...</GlassCard>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}; 