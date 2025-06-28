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

// Separate fetch functions with detailed instrumentation
const fetchCreatedBaskets = async (userId: string): Promise<Basket[]> => {
  console.log('[BASKET_FETCH] Starting fetchCreatedBaskets for user:', userId);
  
  try {
    const { data, error } = await supabase
      .from('baskets')
      .select(`
        *,
        contributions(amount_usd),
        basket_members(user_id)
      `)
      .eq('creator_id', userId);

    if (error) {
      console.error('[BASKET_FETCH_ERROR] Created baskets query failed:', error);
      throw error;
    }

    console.log('[BASKET_FETCH] Created baskets raw data:', data);
    return processBasketData(data || [], userId);
  } catch (e) {
    console.error('[BASKET_FETCH_ERROR] fetchCreatedBaskets failed:', e);
    throw e;
  }
};

const fetchJoinedBaskets = async (userId: string): Promise<Basket[]> => {
  console.log('[BASKET_FETCH] Starting fetchJoinedBaskets for user:', userId);
  
  try {
    // Strategy 1: Get baskets created by user
    console.log('[BASKET_FETCH] Step 1: Fetching created baskets...');
    const createdBasketsQuery = supabase
      .from('baskets')
      .select(`
        *,
        contributions(amount_usd),
        basket_members(user_id)
      `)
      .eq('creator_id', userId);

    // Strategy 2: Get baskets where user is a member (but not creator)
    console.log('[BASKET_FETCH] Step 2: Fetching joined baskets via basket_members...');
    const joinedBasketsQuery = supabase
      .from('basket_members')
      .select(`
        basket_id,
        baskets!inner(
          *,
          contributions(amount_usd),
          basket_members(user_id)
        )
      `)
      .eq('user_id', userId)
      .eq('is_creator', false); // Only non-creator memberships

    const [createdResult, joinedResult] = await Promise.all([
      createdBasketsQuery,
      joinedBasketsQuery
    ]);

    if (createdResult.error) {
      console.error('[BASKET_FETCH_ERROR] Created baskets query failed:', createdResult.error);
      throw createdResult.error;
    }

    if (joinedResult.error) {
      console.error('[BASKET_FETCH_ERROR] Joined baskets query failed:', joinedResult.error);
      throw joinedResult.error;
    }

    console.log('[BASKET_FETCH] Created baskets raw data:', createdResult.data);
    console.log('[BASKET_FETCH] Joined baskets raw data:', joinedResult.data);

    // Combine and process results
    const createdBaskets = createdResult.data || [];
    const joinedBaskets = (joinedResult.data || []).map((jb: any) => jb.baskets);

    console.log('[BASKET_FETCH] Processing combined data:', {
      created: createdBaskets.length,
      joined: joinedBaskets.length
    });

    // Combine all baskets and remove duplicates
    const allBaskets = [...createdBaskets, ...joinedBaskets];
    const uniqueBaskets = allBaskets.filter((basket, index, self) => 
      index === self.findIndex(b => b.id === basket.id)
    );

    console.log('[BASKET_FETCH] Unique baskets after deduplication:', uniqueBaskets.length);

    return processBasketData(uniqueBaskets, userId);
  } catch (e) {
    console.error('[BASKET_FETCH_ERROR] fetchJoinedBaskets failed:', e);
    throw e;
  }
};

const processBasketData = async (baskets: any[], userId: string): Promise<Basket[]> => {
  console.log('[BASKET_FETCH] Processing basket data for', baskets.length, 'baskets');
  
  if (!baskets || baskets.length === 0) {
    console.log('[BASKET_FETCH] No baskets to process');
    return [];
  }

  try {
    // Process basket data
    const processedBaskets = baskets.map((basket: any) => {
      const totalContributions = basket.contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;
      const participantsCount = basket.basket_members?.length || 0;
      const progress = basket.goal_amount > 0 ? Math.round((totalContributions / basket.goal_amount) * 100) : 0;
      
      // Calculate days left (assuming 30 days from creation)
      const createdDate = new Date(basket.created_at);
      const daysLeft = Math.max(0, 30 - Math.floor((Date.now() - createdDate.getTime()) / (1000 * 60 * 60 * 24)));

      // Check if user is member
      const isMember = basket.creator_id === userId || basket.basket_members?.some((m: any) => m.user_id === userId);

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

    console.log('[BASKET_FETCH] Fetching user contributions for', processedBaskets.length, 'baskets');

    // Fetch user contributions for each basket
    const basketsWithContributions = await Promise.all(
      processedBaskets.map(async (basket) => {
        try {
          const { data: contributions, error } = await supabase
            .from('contributions')
            .select('amount_usd')
            .eq('basket_id', basket.id)
            .eq('user_id', userId);

          if (error) {
            console.warn('[BASKET_FETCH_WARNING] Failed to fetch contributions for basket', basket.id, ':', error);
            return { ...basket, my_contribution: 0 };
          }

          const myContribution = contributions?.reduce((sum: number, c: any) => sum + c.amount_usd, 0) || 0;

          return {
            ...basket,
            my_contribution: myContribution
          };
        } catch (e) {
          console.warn('[BASKET_FETCH_WARNING] Error fetching contributions for basket', basket.id, ':', e);
          return { ...basket, my_contribution: 0 };
        }
      })
    );

    console.log('[BASKET_FETCH] Successfully processed', basketsWithContributions.length, 'baskets with contributions');
    return basketsWithContributions;
  } catch (e) {
    console.error('[BASKET_FETCH_ERROR] processBasketData failed:', e);
    throw e;
  }
};

export const MyBaskets = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'joined';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user, ensureAnonymousAuth } = useAuthContext();
  const { handlePress } = usePressFeedback();

  // Fetch baskets based on active tab
  useEffect(() => {
    const fetchBaskets = async () => {
      // Ensure anonymous authentication first
      if (!user?.id) {
        console.log('[BASKET_FETCH] No user ID available, attempting anonymous auth...');
        try {
          await ensureAnonymousAuth();
          // Wait a bit for auth state to update
          setTimeout(() => {
            console.log('[BASKET_FETCH] Anonymous auth attempted, will retry basket fetch');
          }, 1000);
          return;
        } catch (error) {
          console.error('[BASKET_FETCH_ERROR] Failed to ensure anonymous auth:', error);
          setError('Authentication required to load baskets');
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);

      console.log('[BASKET_FETCH] Starting fetch for user:', user.id, 'tab:', activeTab);

      try {
        let fetchedBaskets: Basket[];

        if (activeTab === 'created') {
          fetchedBaskets = await fetchCreatedBaskets(user.id);
        } else {
          fetchedBaskets = await fetchJoinedBaskets(user.id);
        }

        console.log('[BASKET_FETCH] Successfully fetched', fetchedBaskets.length, 'baskets for tab:', activeTab);
        setBaskets(fetchedBaskets);

      } catch (err: any) {
        console.error('[BASKET_FETCH_ERROR] Final catch block:', err);
        
        // Detailed error handling
        let errorMessage = 'Failed to load baskets. Please try again.';
        
        if (err.code === '42501') {
          errorMessage = 'Permission denied. Please check your authentication.';
          console.error('[BASKET_FETCH_ERROR] RLS Permission denied (42501)');
        } else if (err.code === '42P01') {
          errorMessage = 'Database table not found. Please contact support.';
          console.error('[BASKET_FETCH_ERROR] Table not found (42P01)');
        } else if (err.message?.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
          console.error('[BASKET_FETCH_ERROR] Network error detected');
        } else if (err.message?.includes('timeout')) {
          errorMessage = 'Request timeout. Please try again.';
          console.error('[BASKET_FETCH_ERROR] Timeout error detected');
        }
        
        setError(errorMessage);
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

  const handleRetry = () => {
    console.log('[BASKET_FETCH] Retry button clicked, clearing error and refetching');
    setError(null);
    setLoading(true);
    // Force re-render to trigger useEffect
    setActiveTab(prev => prev); 
  };

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
                onClick={handleRetry}
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