import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Lock, Globe, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePressFeedback } from '@/hooks/useInteractions';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Basket {
  id: string;
  name: string;
  description: string;
  goal: number;
  current_amount: number;
  participants_count: number;
  progress: number;
  days_left: number;
  is_private: boolean;
  is_member: boolean;
  my_contribution: number;
  created_at: string;
  country: string;
}

export const MyBaskets = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'joined';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { handlePress } = usePressFeedback();

  // Fetch baskets based on active tab
  useEffect(() => {
    const fetchBaskets = async () => {
      // Ensure anonymous authentication first
      if (!user?.id) {
        if (import.meta.env.DEV) console.log('No user ID available, attempting anonymous auth...');
        try {
          await ensureAnonymousAuth();
          // Wait a bit for auth state to update
          setTimeout(() => {
            if (import.meta.env.DEV) console.log('Anonymous auth attempted, will retry basket fetch');
          }, 1000);
          return;
        } catch (error) {
          if (import.meta.env.DEV) console.error('Failed to ensure anonymous auth:', error);
          setError('Authentication required to load baskets');
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      if (import.meta.env.DEV) console.log('Fetching baskets for user:', user.id, 'tab:', activeTab);

      try {
        let query;

        if (activeTab === 'created') {
          // Fetch baskets created by user
          query = supabase
            .from('baskets')
            .select(`
              *,
              contributions(amount_usd),
              basket_members(user_id)
            `)
            .eq('creator_id', user.id);
        } else {
          // Fetch baskets joined by user (including created ones)
          // Use a simpler query approach to avoid complex OR operations that might fail
          const [createdBaskets, joinedBaskets] = await Promise.all([
            supabase
              .from('baskets')
              .select(`
                *,
                contributions(amount_usd),
                basket_members(user_id)
              `)
              .eq('creator_id', user.id),
            supabase
              .from('basket_members')
              .select(`
                basket_id,
                baskets!inner(
                  *,
                  contributions(amount_usd),
                  basket_members(user_id)
                )
              `)
              .eq('user_id', user.id)
              .neq('is_creator', true) // Exclude creator records to avoid duplicates
          ]);

          if (createdBaskets.error) throw createdBaskets.error;
          if (joinedBaskets.error) throw joinedBaskets.error;

          // Combine results and extract basket data
          const allBaskets = [
            ...(createdBaskets.data || []),
            ...(joinedBaskets.data?.map(jb => jb.baskets) || [])
          ];

          // Remove duplicates by id
          const uniqueBaskets = allBaskets.filter((basket, index, self) => 
            index === self.findIndex(b => b.id === basket.id)
          );

          if (import.meta.env.DEV) console.log('Combined baskets data received:', uniqueBaskets);

          // Process the combined data
          const processedBaskets = uniqueBaskets.map((basket: any) => {
            const totalContributions = basket.contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;
            const participantsCount = basket.basket_members?.length || 0;
            const progress = basket.goal_amount > 0 ? Math.round((totalContributions / basket.goal_amount) * 100) : 0;
            
            // Calculate days left (assuming 30 days from creation)
            const createdDate = new Date(basket.created_at);
            const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

            // Check if user is member
            const isMember = basket.creator_id === user.id || basket.basket_members?.some((m: any) => m.user_id === user.id);

            return {
              ...basket,
              name: basket.title,
              goal: basket.goal_amount,
              current_amount: totalContributions,
              participants_count: participantsCount,
              progress,
              days_left: daysLeft,
              is_member: isMember,
              my_contribution: 0 // Will be fetched separately
            };
          });

          // Fetch user contributions for each basket
          const basketsWithContributions = await Promise.all(
            processedBaskets.map(async (basket) => {
              const { data: contributions } = await supabase
                .from('contributions')
                .select('amount_usd')
                .eq('basket_id', basket.id)
                .eq('user_id', user.id);

              const myContribution = contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;

              return {
                ...basket,
                my_contribution: myContribution
              };
            })
          );

          if (import.meta.env.DEV) console.log('Processed baskets:', basketsWithContributions);
          setBaskets(basketsWithContributions);
          setLoading(false);
          return;
        }

        const { data, error } = await query;

        if (error) {
          if (import.meta.env.DEV) console.error('Error fetching baskets:', error);
          setError('Failed to load baskets. Please try again.');
          return;
        }

        if (import.meta.env.DEV) console.log('Baskets data received:', data);

        // Handle empty results gracefully
        if (!data || data.length === 0) {
          if (import.meta.env.DEV) console.log('No baskets found for user');
          setBaskets([]);
          return;
        }

        // Process basket data
        const processedBaskets = data.map((basket: any) => {
          const totalContributions = basket.contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;
          const participantsCount = basket.basket_members?.length || 0;
          const progress = basket.goal_amount > 0 ? Math.round((totalContributions / basket.goal_amount) * 100) : 0;
          
          // Calculate days left (assuming 30 days from creation)
          const createdDate = new Date(basket.created_at);
          const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

          // Check if user is member
          const isMember = basket.creator_id === user.id || basket.basket_members?.some((m: any) => m.user_id === user.id);

          return {
            ...basket,
            name: basket.title,
            goal: basket.goal_amount,
            current_amount: totalContributions,
            participants_count: participantsCount,
            progress,
            days_left: daysLeft,
            is_member: isMember,
            my_contribution: 0 // Will be fetched separately
          };
        });

        // Fetch user contributions for each basket
        const basketsWithContributions = await Promise.all(
          processedBaskets.map(async (basket) => {
            const { data: contributions } = await supabase
              .from('contributions')
              .select('amount_usd')
              .eq('basket_id', basket.id)
              .eq('user_id', user.id);

            const myContribution = contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;

            return {
              ...basket,
              my_contribution: myContribution
            };
          })
        );

        if (import.meta.env.DEV) console.log('Processed baskets:', basketsWithContributions);
        setBaskets(basketsWithContributions);

      } catch (err) {
        if (import.meta.env.DEV) console.error('Baskets fetch error:', err);
        setError('Failed to load baskets. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBaskets();
  }, [activeTab, user?.id, ensureAnonymousAuth]);

  // Update tab when URL changes
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && (tabFromUrl === 'joined' || tabFromUrl === 'created')) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const getStatusBadge = (basket: Basket) => {
    if (basket.is_private) {
      return (
        <Badge className="bg-blue-500 text-white border-0 p-2 rounded-full">
          <Lock className="w-4 h-4" />
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-green-500 text-white border-0 p-2 rounded-full">
          <Globe className="w-4 h-4" />
        </Badge>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
        <div className="px-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={(e) => {
                handlePress(e);
                navigate('/');
              }} 
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient" 
              style={{
                minWidth: '44px',
                minHeight: '44px'
              }} 
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold gradient-text">My Baskets</h1>
          </div>
          
          {/* Plus Icon Button */}
          <button 
            onClick={(e) => {
              handlePress(e);
              navigate('/baskets/new');
            }} 
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient" 
            style={{
              minWidth: '44px',
              minHeight: '44px'
            }} 
            aria-label="Create New Basket"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'joined'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Joined
          </button>
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'created'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Created
          </button>
        </div>
      </div>

      {/* ARIA live region for basket updates */}
      <div className="sr-only" aria-live="polite" id="basket-announcements" />

      {/* Baskets List */}
      <div className="px-6 space-y-4">
        {error ? (
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to Load Baskets</h3>
            <p className="text-red-500 mb-6 text-sm">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  // Force re-fetch by updating the dependency
                  window.location.reload();
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : baskets.length > 0 ? (
          baskets.map((basket, index) => (
            <div 
              key={basket.id} 
              className="relative animate-slide-up" 
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <BasketCard 
                id={basket.id} 
                name={basket.name} 
                description={basket.description} 
                privacy={basket.is_private ? 'private' : 'public'} 
                progress={basket.progress} 
                goal={basket.goal} 
                currentAmount={basket.current_amount} 
                participants={basket.participants_count} 
                isMember={basket.is_member} 
                myContribution={basket.my_contribution} 
                daysLeft={basket.days_left} 
                showOnHomeScreen={false} 
              />
              <div className="absolute top-2 right-2 z-10">
                {getStatusBadge(basket)}
              </div>
            </div>
          ))
        ) : (
          <EmptyState 
            title={activeTab === 'joined' ? "No Baskets Joined" : "No Baskets Created"} 
            description={activeTab === 'joined' ? "Join your first basket by browsing public baskets on the home screen" : "Create your first private basket to start collecting funds for your goal"} 
            actionLabel={activeTab === 'joined' ? "Browse Public Baskets" : "Create Private Basket"} 
            onAction={() => navigate(activeTab === 'joined' ? '/' : '/baskets/new')} 
            icon={<Plus className="w-8 h-8" />} 
          />
        )}
      </div>
    </div>
  );
};